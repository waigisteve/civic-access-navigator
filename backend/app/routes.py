from __future__ import annotations

import os

from pydantic import BaseModel, Field

from backend.app.services.chat_service import chat_answer


class ChatRequest(BaseModel):
    message: str = Field(min_length=1)
    region: str | None = None


def register_routes(app) -> None:
    @app.post("/api/chat")
    def chat(payload: ChatRequest) -> dict[str, object]:
        return chat_answer(payload.message, region=payload.region)

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
        }
