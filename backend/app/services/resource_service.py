from __future__ import annotations

import json
from pathlib import Path
from typing import TypedDict

from backend.app.services.resource_admin_service import list_approved_resources


class ResourceItem(TypedDict):
    title: str
    theme: str
    audience: str
    summary: str


DATA_PATH = Path(__file__).resolve().parents[3] / "data" / "samples" / "resources.json"


def get_resource_items() -> list[ResourceItem]:
    with DATA_PATH.open("r", encoding="utf-8") as file_handle:
        items = json.load(file_handle)

    approved = [
        {
            "title": item["title"],
            "theme": item.get("source_type", "approved resource"),
            "audience": item.get("region", "africa"),
            "summary": item["summary"],
        }
        for item in list_approved_resources()
    ]

    return [ResourceItem(**item) for item in items + approved]
