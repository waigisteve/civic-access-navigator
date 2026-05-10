from __future__ import annotations

import json
import os
import re
import time
import uuid
from pathlib import Path
from typing import Any
from urllib.parse import parse_qs
import urllib.parse
import urllib.request

from backend.app.services.chat_service import chat_answer


PROJECT_ROOT = Path(__file__).resolve().parents[3]
SMS_RUNTIME_DIR = PROJECT_ROOT / "data" / "runtime"
SMS_INBOX_PATH = SMS_RUNTIME_DIR / "sms_inbox.jsonl"

URGENT_KEYWORDS = {
    "help",
    "danger",
    "violence",
    "abuse",
    "arrest",
    "checkpoint",
    "denied",
    "aid",
    "missing",
    "refugee",
    "displaced",
    "urgent",
    "threat",
}


def _ensure_runtime_dir() -> None:
    SMS_RUNTIME_DIR.mkdir(parents=True, exist_ok=True)


def parse_form_body(body: bytes) -> dict[str, str]:
    raw = parse_qs(body.decode("utf-8", errors="ignore"), keep_blank_values=True)
    return {key: values[0] for key, values in raw.items() if values}


def _normalize_text(value: str) -> str:
    return re.sub(r"\s+", " ", value or "").strip()


def _is_urgent(message: str) -> bool:
    lowered = message.lower()
    return any(keyword in lowered for keyword in URGENT_KEYWORDS)


def _compact_reply(answer: str, limit: int = 320) -> str:
    text = _normalize_text(answer)
    if len(text) <= limit:
        return text
    trimmed = text[: limit - 1].rsplit(" ", 1)[0].strip()
    return f"{trimmed}…"


def _record_message(entry: dict[str, Any]) -> None:
    _ensure_runtime_dir()
    with SMS_INBOX_PATH.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(entry, ensure_ascii=False) + "\n")


def write_sms_messages(items: list[dict[str, Any]]) -> None:
    _ensure_runtime_dir()
    with SMS_INBOX_PATH.open("w", encoding="utf-8") as handle:
        for item in items:
            handle.write(json.dumps(item, ensure_ascii=False) + "\n")


def list_sms_messages(limit: int = 50) -> list[dict[str, Any]]:
    if not SMS_INBOX_PATH.exists():
        return []
    lines = SMS_INBOX_PATH.read_text(encoding="utf-8").splitlines()
    messages = [json.loads(line) for line in lines if line.strip()]
    return list(reversed(messages[-limit:]))


def _load_all_sms_messages() -> list[dict[str, Any]]:
    if not SMS_INBOX_PATH.exists():
        return []
    lines = SMS_INBOX_PATH.read_text(encoding="utf-8").splitlines()
    return [json.loads(line) for line in lines if line.strip()]


def _africastalking_payload(payload: dict[str, str]) -> tuple[str, str, dict[str, Any]]:
    sender = payload.get("from", "")
    message = payload.get("text", "")
    meta = {
        "provider_message_id": payload.get("id"),
        "link_id": payload.get("linkId"),
        "to": payload.get("to"),
        "date": payload.get("date"),
        "keyword": payload.get("keyword"),
    }
    return sender, message, meta


def _twilio_payload(payload: dict[str, str]) -> tuple[str, str, dict[str, Any]]:
    sender = payload.get("From", "")
    message = payload.get("Body", "")
    meta = {
        "provider_message_id": payload.get("MessageSid"),
        "to": payload.get("To"),
        "account_sid": payload.get("AccountSid"),
    }
    return sender, message, meta


def handle_inbound_sms(provider: str, payload: dict[str, str], region: str = "kenya") -> dict[str, Any]:
    if provider == "africastalking":
        sender, message, meta = _africastalking_payload(payload)
    elif provider == "twilio":
        sender, message, meta = _twilio_payload(payload)
    else:
        raise ValueError(f"Unsupported SMS provider: {provider}")

    message = _normalize_text(message)
    reply = ""
    answer_mode = "unprocessed"
    answer_provider = "local"
    citations: list[str] = []
    if message:
        result = chat_answer(message, region=region)
        reply = _compact_reply(result.get("answer", ""))
        answer_mode = str(result.get("mode", "fallback"))
        answer_provider = str(result.get("provider", "local"))
        citations = list(result.get("citations", []))

    entry = {
        "id": str(uuid.uuid4()),
        "received_at": int(time.time()),
        "provider": provider,
        "sender": sender,
        "message": message,
        "urgent": _is_urgent(message),
        "region": region,
        "reply": reply,
        "answer_mode": answer_mode,
        "answer_provider": answer_provider,
        "citations": citations,
        "meta": meta,
    }
    _record_message(entry)
    return entry


def send_africastalking_sms_reply(*, to: str, message: str, link_id: str | None = None) -> dict[str, Any]:
    username = os.getenv("AFRICASTALKING_USERNAME", "").strip()
    api_key = os.getenv("AFRICASTALKING_API_KEY", "").strip()
    sender = os.getenv("AFRICASTALKING_FROM", "").strip()
    if not username or not api_key:
        raise RuntimeError("Africa's Talking outbound reply is not configured.")

    payload = {
        "username": username,
        "to": to,
        "message": message,
    }
    if sender:
        payload["from"] = sender
    if link_id:
        payload["linkId"] = link_id

    data = urllib.parse.urlencode(payload).encode("utf-8")
    request = urllib.request.Request(
        "https://api.africastalking.com/version1/messaging",
        data=data,
        headers={
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            "apiKey": api_key,
        },
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=20) as response:
        raw = response.read().decode("utf-8")
    return json.loads(raw)


def attach_africastalking_reply(record_id: str, result: dict[str, Any]) -> None:
    messages = _load_all_sms_messages()
    updated = False
    for item in messages:
        if item.get("id") == record_id:
            item.setdefault("meta", {})
            item["meta"]["outbound_reply"] = result
            updated = True
            break
    if updated:
        write_sms_messages(messages)
