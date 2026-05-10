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
from backend.app.services.sms_service import (
    attach_africastalking_reply,
    handle_inbound_sms,
    list_sms_messages,
    parse_form_body,
    send_africastalking_sms_reply,
)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1)
    region: str | None = None


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


def register_routes(app) -> None:
    @app.post("/api/chat")
    def chat(payload: ChatRequest) -> dict[str, object]:
        return chat_answer(payload.message, region=payload.region)

    @app.get("/api/sms/inbox")
    def sms_inbox() -> dict[str, object]:
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
