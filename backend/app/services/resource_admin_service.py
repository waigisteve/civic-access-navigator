from __future__ import annotations

import json
import time
import uuid
from pathlib import Path
from typing import Any


PROJECT_ROOT = Path(__file__).resolve().parents[3]
RUNTIME_DIR = PROJECT_ROOT / "data" / "runtime"
APPROVED_RESOURCES_PATH = RUNTIME_DIR / "approved_resources.json"


def _ensure_runtime_dir() -> None:
    RUNTIME_DIR.mkdir(parents=True, exist_ok=True)


def list_approved_resources() -> list[dict[str, Any]]:
    if not APPROVED_RESOURCES_PATH.exists():
      return []
    return json.loads(APPROVED_RESOURCES_PATH.read_text(encoding="utf-8"))


def write_approved_resources(items: list[dict[str, Any]]) -> None:
    _ensure_runtime_dir()
    APPROVED_RESOURCES_PATH.write_text(json.dumps(items, ensure_ascii=False, indent=2), encoding="utf-8")


def create_approved_resource(payload: dict[str, Any]) -> dict[str, Any]:
    item = {
        "id": payload.get("id") or f"approved-{uuid.uuid4()}",
        "title": payload["title"].strip(),
        "region": payload.get("region", "africa").strip() or "africa",
        "source_type": payload.get("source_type", "approved-admin-upload").strip() or "approved-admin-upload",
        "url": payload.get("url", "internal://approved-resource").strip() or "internal://approved-resource",
        "summary": payload["summary"].strip(),
        "body": payload.get("body", payload["summary"]).strip(),
        "keywords": [keyword.strip() for keyword in payload.get("keywords", []) if keyword.strip()],
        "approved_at": int(time.time()),
        "approved_by": payload.get("approved_by", "admin").strip() or "admin",
    }
    items = list_approved_resources()
    items.append(item)
    write_approved_resources(items)
    return item


def import_approved_resources(items: list[dict[str, Any]], approved_by: str = "admin") -> list[dict[str, Any]]:
    existing = list_approved_resources()
    created: list[dict[str, Any]] = []
    for payload in items:
        payload = {**payload, "approved_by": payload.get("approved_by", approved_by)}
        created.append(
            {
                "id": payload.get("id") or f"approved-{uuid.uuid4()}",
                "title": payload["title"].strip(),
                "region": payload.get("region", "africa").strip() or "africa",
                "source_type": payload.get("source_type", "approved-admin-upload").strip() or "approved-admin-upload",
                "url": payload.get("url", "internal://approved-resource").strip() or "internal://approved-resource",
                "summary": payload["summary"].strip(),
                "body": payload.get("body", payload["summary"]).strip(),
                "keywords": [keyword.strip() for keyword in payload.get("keywords", []) if keyword.strip()],
                "approved_at": int(time.time()),
                "approved_by": payload.get("approved_by", "admin").strip() or "admin",
            }
        )
    existing.extend(created)
    write_approved_resources(existing)
    return created
