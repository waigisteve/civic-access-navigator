from __future__ import annotations

import base64
import hashlib
import hmac
import os
from xml.sax.saxutils import escape

from pydantic import BaseModel, Field
from fastapi import HTTPException, Request
from fastapi.responses import PlainTextResponse, Response

from backend.app.services.chat_service import chat_answer
from backend.app.services.evaluation_service import evaluate_answer
from backend.app.services.resource_admin_service import (
    create_approved_resource,
    import_approved_resources,
    list_approved_resources,
)
from backend.app.services.sms_service import (
    attach_africastalking_reply,
    handle_inbound_sms,
    list_sms_messages,
    parse_form_body,
    send_africastalking_sms_reply,
)
from backend.app.services.workflow_db_service import (
    create_chat_record,
    create_sos_request,
    create_workflow_report,
    get_workflow_incident,
    list_chat_records,
    list_sos_requests,
    list_workflow_reports,
    list_workflow_scenarios,
    seed_workflow_catalog,
    workflow_database_ready,
)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1)
    region: str | None = None
    scenario: str | None = None
    incident_code: str | None = None
    language: str | None = None
    session_id: str | None = None
    safe_mode: bool = False
    lite_mode: bool = False


class ApprovedResourceRequest(BaseModel):
    title: str = Field(min_length=3)
    summary: str = Field(min_length=10)
    body: str | None = None
    region: str = "africa"
    source_type: str = "approved-admin-upload"
    url: str = "internal://approved-resource"
    keywords: list[str] = Field(default_factory=list)
    approved_by: str = "admin"


class ApprovedResourceImportRequest(BaseModel):
    items: list[ApprovedResourceRequest]
    approved_by: str = "admin"


class EvaluateChatRequest(BaseModel):
    message: str = Field(min_length=3)
    region: str | None = None


class WorkflowReportRequest(BaseModel):
    scenario_code: str = Field(min_length=2)
    scenario_title_display: str | None = None
    incident_code: str = Field(min_length=2)
    incident_title_display: str | None = None
    action_code: str = Field(min_length=2)
    action_title: str = Field(min_length=2)
    action_title_display: str | None = None
    report_text: str = Field(min_length=5)
    location_text: str | None = None
    event_time: str | None = None
    denied_item: str | None = None
    requested_action: str | None = None
    contact_preference: str = "anonymous"
    submitter_alias: str | None = None
    region: str | None = None
    language: str | None = None
    safe_mode: bool = False
    lite_mode: bool = False
    status: str = "submitted"


class SosRequestPayload(BaseModel):
    channel: str = Field(min_length=2)
    note: str | None = None
    location_text: str | None = None
    region: str | None = None
    language: str | None = None
    scenario_code: str | None = None
    incident_code: str | None = None
    safe_mode: bool = False
    lite_mode: bool = False
    status: str = "opened"


def _validate_twilio_signature(request: Request, payload: dict[str, str]) -> bool:
    auth_token = os.getenv("TWILIO_AUTH_TOKEN", "").strip()
    signature = request.headers.get("X-Twilio-Signature", "").strip()
    if not auth_token or not signature:
        return False
    url = str(request.url).split("#", 1)[0]
    pieces = [url]
    for key in sorted(payload.keys()):
        pieces.append(key)
        pieces.append(payload[key])
    expected = base64.b64encode(
        hmac.new(auth_token.encode("utf-8"), "".join(pieces).encode("utf-8"), hashlib.sha1).digest()
    ).decode("utf-8")
    return hmac.compare_digest(expected, signature)


def _validate_africastalking_request(payload: dict[str, str], request: Request) -> bool:
    expected_username = os.getenv("AFRICASTALKING_USERNAME", "").strip()
    expected_token = os.getenv("AFRICASTALKING_INBOUND_TOKEN", "").strip()
    if expected_username and payload.get("username", "").strip() != expected_username:
        return False
    if expected_token:
        supplied = (
            request.query_params.get("token")
            or request.headers.get("X-CAN-Webhook-Token")
            or payload.get("token")
            or ""
        ).strip()
        if supplied != expected_token:
            return False
    return True


def _require_admin_token(request: Request) -> None:
    expected = os.getenv("CAN_ADMIN_TOKEN", "").strip()
    if not expected:
        raise HTTPException(status_code=503, detail="Admin token not configured")
    supplied = (
        request.headers.get("X-CAN-ADMIN-TOKEN")
        or request.query_params.get("token")
        or ""
    ).strip()
    if not supplied or supplied != expected:
        raise HTTPException(status_code=403, detail="Invalid admin token")


def register_routes(app) -> None:
    @app.post("/api/chat")
    def chat(payload: ChatRequest) -> dict[str, object]:
        result = chat_answer(payload.message, region=payload.region)
        if workflow_database_ready():
            try:
                create_chat_record(
                    {
                        "session_id": payload.session_id or "anonymous",
                        "user_message": payload.message,
                        "answer_text": result.get("answer", ""),
                        "citations": list(result.get("citations", [])),
                        "provider": result.get("provider", "local"),
                        "mode": result.get("mode", "fallback"),
                        "region": payload.region,
                        "scenario_code": payload.scenario,
                        "incident_code": payload.incident_code,
                        "language": payload.language,
                        "safe_mode": payload.safe_mode,
                        "lite_mode": payload.lite_mode,
                    }
                )
            except Exception:
                pass
        return result

    @app.get("/api/workflows")
    def workflow_scenarios() -> dict[str, object]:
        return {
            "database_ready": workflow_database_ready(),
            "scenarios": list_workflow_scenarios(),
        }

    @app.get("/api/workflows/{scenario_code}/{incident_code}")
    def workflow_incident(scenario_code: str, incident_code: str) -> dict[str, object]:
        item = get_workflow_incident(scenario_code, incident_code)
        if not item:
            raise HTTPException(status_code=404, detail="Workflow incident not found")
        return item

    @app.post("/api/workflows/report")
    def workflow_report(payload: WorkflowReportRequest) -> dict[str, object]:
        if not workflow_database_ready():
            raise HTTPException(status_code=503, detail="Workflow database is not configured")
        item = create_workflow_report(payload.model_dump())
        return {"item": item}

    @app.post("/api/sos/request")
    def sos_request(payload: SosRequestPayload) -> dict[str, object]:
        if not workflow_database_ready():
            raise HTTPException(status_code=503, detail="Workflow database is not configured")
        item = create_sos_request(payload.model_dump())
        return {"item": item}

    @app.get("/api/admin/resources")
    def admin_resources(request: Request) -> dict[str, object]:
        _require_admin_token(request)
        return {"items": list_approved_resources()}

    @app.post("/api/admin/resources")
    def admin_resource_create(payload: ApprovedResourceRequest, request: Request) -> dict[str, object]:
        _require_admin_token(request)
        item = create_approved_resource(payload.model_dump())
        return {"item": item}

    @app.post("/api/admin/resources/import")
    def admin_resource_import(payload: ApprovedResourceImportRequest, request: Request) -> dict[str, object]:
        _require_admin_token(request)
        items = import_approved_resources(
            [item.model_dump() for item in payload.items],
            approved_by=payload.approved_by,
        )
        return {"items": items, "count": len(items)}

    @app.post("/api/admin/evaluate-chat")
    def admin_evaluate_chat(payload: EvaluateChatRequest, request: Request) -> dict[str, object]:
        _require_admin_token(request)
        result = chat_answer(payload.message, region=payload.region)
        result["evaluation"] = evaluate_answer(
            answer=str(result.get("answer", "")),
            citations=list(result.get("citations", [])),
            region=payload.region,
        )
        return result

    @app.post("/api/admin/workflows/bootstrap")
    def admin_bootstrap_workflows(request: Request) -> dict[str, object]:
        _require_admin_token(request)
        if not workflow_database_ready():
            raise HTTPException(status_code=503, detail="Workflow database is not configured")
        seed_workflow_catalog()
        return {"status": "ok"}

    @app.get("/api/admin/workflow-reports")
    def admin_workflow_reports(
        request: Request,
        scenario: str | None = None,
        incident: str | None = None,
        limit: int = 50,
    ) -> dict[str, object]:
        _require_admin_token(request)
        return {
            "items": list_workflow_reports(
                scenario_code=scenario,
                incident_code=incident,
                limit=limit,
            )
        }

    @app.get("/api/admin/chat-records")
    def admin_chat_records(request: Request, limit: int = 100) -> dict[str, object]:
        _require_admin_token(request)
        return {"items": list_chat_records(limit=limit)}

    @app.get("/api/admin/sos-requests")
    def admin_sos_requests(request: Request, limit: int = 100) -> dict[str, object]:
        _require_admin_token(request)
        return {"items": list_sos_requests(limit=limit)}

    @app.get("/api/admin/sms/inbox")
    def sms_inbox(request: Request) -> dict[str, object]:
        _require_admin_token(request)
        return {"items": list_sms_messages()}

    @app.post("/api/sms/inbound/africastalking")
    async def sms_inbound_africastalking(request: Request) -> PlainTextResponse:
        payload = parse_form_body(await request.body())
        if not _validate_africastalking_request(payload, request):
            raise HTTPException(status_code=403, detail="Invalid Africa's Talking webhook request")
        record = handle_inbound_sms("africastalking", payload, region="kenya")
        if os.getenv("AFRICASTALKING_REPLY_ENABLED", "0").strip() == "1" and record["reply"] and record["sender"]:
            try:
                result = send_africastalking_sms_reply(
                    to=record["sender"],
                    message=record["reply"],
                    link_id=(record.get("meta") or {}).get("link_id"),
                )
                attach_africastalking_reply(record["id"], result)
            except Exception as exc:
                attach_africastalking_reply(record["id"], {"error": str(exc)})
        # Africa's Talking callback integrations often just require a 200 OK.
        # Keep the response plain and short for the proof-of-concept.
        if record["urgent"]:
            return PlainTextResponse("URGENT RECEIVED", status_code=200)
        return PlainTextResponse("RECEIVED", status_code=200)

    @app.post("/api/sms/inbound/twilio")
    async def sms_inbound_twilio(request: Request) -> Response:
        payload = parse_form_body(await request.body())
        if not _validate_twilio_signature(request, payload):
            raise HTTPException(status_code=403, detail="Invalid Twilio webhook signature")
        record = handle_inbound_sms("twilio", payload, region="kenya")
        body = escape(record["reply"] or "Message received.")
        xml = f"<?xml version=\"1.0\" encoding=\"UTF-8\"?><Response><Message>{body}</Message></Response>"
        return Response(content=xml, media_type="application/xml")

    @app.get("/api/debug/config")
    def debug_config() -> dict[str, object]:
        provider = os.getenv("CHAT_PROVIDER", "auto").strip().lower()
        model = os.getenv("OPENAI_MODEL", "").strip()
        api_key = os.getenv("OPENAI_API_KEY", "").strip()
        gemini_key = os.getenv("GEMINI_API_KEY", "").strip()
        gemini_model = os.getenv("GEMINI_MODEL", "").strip()
        ollama_base = os.getenv("OLLAMA_BASE_URL", "").strip()
        return {
            "chat_provider": provider,
            "openai_configured": bool(api_key),
            "openai_model": model or None,
            "gemini_configured": bool(gemini_key),
            "gemini_model": gemini_model or None,
            "ollama_configured": bool(ollama_base),
            "fallback_mode": provider not in {"openai", "gemini"},
            "live_source_ingestion": os.getenv("LIVE_SOURCE_INGESTION", "0").strip() == "1",
            "sms_inbox_enabled": True,
            "africastalking_reply_enabled": os.getenv("AFRICASTALKING_REPLY_ENABLED", "0").strip() == "1",
        }
