from __future__ import annotations

import os
from xml.sax.saxutils import escape

from pydantic import BaseModel, Field
from fastapi import Request
from fastapi.responses import PlainTextResponse, Response

from backend.app.services.chat_service import chat_answer
from backend.app.services.sms_service import handle_inbound_sms, list_sms_messages, parse_form_body


class ChatRequest(BaseModel):
    message: str = Field(min_length=1)
    region: str | None = None


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
        record = handle_inbound_sms("africastalking", payload, region="kenya")
        # Africa's Talking callback integrations often just require a 200 OK.
        # Keep the response plain and short for the proof-of-concept.
        if record["urgent"]:
            return PlainTextResponse("URGENT RECEIVED", status_code=200)
        return PlainTextResponse("RECEIVED", status_code=200)

    @app.post("/api/sms/inbound/twilio")
    async def sms_inbound_twilio(request: Request) -> Response:
        payload = parse_form_body(await request.body())
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
        }
