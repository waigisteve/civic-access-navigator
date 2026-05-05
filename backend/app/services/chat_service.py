from __future__ import annotations

import json
import os
from dataclasses import dataclass
from pathlib import Path
from typing import Any


CURATED_PATH = Path(__file__).resolve().parents[3] / "data" / "curated" / "osf_kenya_africa_sources.json"


@dataclass(frozen=True)
class SourceHit:
    id: str
    title: str
    region: str
    source_type: str
    url: str
    summary: str


def load_sources() -> list[dict[str, Any]]:
    with CURATED_PATH.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def score_source(query: str, source: dict[str, Any]) -> int:
    score = 0
    q = query.lower()
    haystack = " ".join([source["title"], source["summary"], " ".join(source.get("keywords", []))]).lower()
    for token in q.split():
        if token in haystack:
            score += 1
    if source["region"] in q:
        score += 3
    return score


def retrieve_sources(query: str, region: str | None = None) -> list[SourceHit]:
    sources = load_sources()
    hits: list[SourceHit] = []
    for source in sources:
        if region and source["region"] not in {region, "africa"}:
            continue
        if score_source(query, source) > 0:
            hits.append(
                SourceHit(
                    id=source["id"],
                    title=source["title"],
                    region=source["region"],
                    source_type=source["source_type"],
                    url=source["url"],
                    summary=source["summary"],
                )
            )
    return hits[:3]


def _format_response(answer: str, hits: list[SourceHit], mode: str) -> dict[str, Any]:
    return {
        "answer": answer,
        "citations": [f"{hit.title} ({hit.url})" for hit in hits],
        "mode": mode,
    }


def local_answer(query: str, region: str | None = None) -> dict[str, Any]:
    hits = retrieve_sources(query, region=region)
    if not hits:
        return _format_response(
            "I could not find a grounded match in the curated Kenya/Africa sources yet. Try asking about rights, participation, governance, or a specific region.",
            [],
            "fallback",
        )

    answer = (
        "Based on the curated sources, the strongest match is:\n"
        + "\n".join([f"- {hit.summary}" for hit in hits])
        + "\n\nThese sources are the current ground truth for the Kenya-first prototype."
    )
    return _format_response(answer, hits, "retrieval")


def chat_answer(query: str, region: str | None = None) -> dict[str, Any]:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return local_answer(query, region=region)

    try:
        from openai import OpenAI
    except Exception:
        return local_answer(query, region=region)

    hits = retrieve_sources(query, region=region)
    source_block = "\n".join([f"- {hit.title}: {hit.summary} ({hit.url})" for hit in hits]) or "- No direct match found in curated sources."
    prompt = (
        "You are Civic Access Navigator, a Kenya-first civic information assistant.\n"
        "Answer only from the provided curated sources. If the sources do not support the answer, say so.\n"
        "Keep the answer plain-language, concise, and region-aware.\n\n"
        f"Question: {query}\n"
        f"Region: {region or 'kenya'}\n"
        f"Curated sources:\n{source_block}"
    )

    response = OpenAI(api_key=api_key).responses.create(
        model=os.getenv("OPENAI_MODEL", "gpt-4.1-mini"),
        input=prompt,
    )

    return _format_response(
        response.output_text or "I could not generate a grounded answer.",
        hits,
        "openai",
    )
