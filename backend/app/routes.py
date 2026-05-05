from __future__ import annotations

from pydantic import BaseModel, Field

from backend.app.services.chat_service import chat_answer


class ChatRequest(BaseModel):
    message: str = Field(min_length=1)
    region: str | None = None


def register_routes(app) -> None:
    @app.post("/api/chat")
    def chat(payload: ChatRequest) -> dict[str, object]:
        return chat_answer(payload.message, region=payload.region)
