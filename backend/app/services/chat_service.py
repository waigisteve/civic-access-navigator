from __future__ import annotations

import json
import os
import urllib.error
import urllib.parse
import urllib.request
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


def _format_response(answer: str, hits: list[SourceHit], mode: str, provider: str) -> dict[str, Any]:
    return {
        "answer": answer,
        "citations": [f"{hit.title} ({hit.url})" for hit in hits],
        "mode": mode,
        "provider": provider,
    }


def build_kenya_rights_answer() -> dict[str, Any]:
    hits = retrieve_sources("bill of rights kenya rights", region="kenya")
    answer = (
        "The basic human rights of a Kenyan are protected by the Bill of Rights in the Constitution of Kenya (2010). "
        "In plain language, the core rights include:\n"
        "- Right to life\n"
        "- Equality and freedom from discrimination\n"
        "- Human dignity\n"
        "- Freedom and security of the person\n"
        "- Privacy\n"
        "- Freedom of expression, information, and media\n"
        "- Freedom of religion, belief, and opinion\n"
        "- Freedom of association, assembly, and movement\n"
        "- Political rights and participation\n"
        "- Access to justice\n\n"
        "Those rights belong to every person in Kenya, and some apply to all persons rather than only citizens."
    )
    return _format_response(answer, hits, "rights-template", "local")


def local_answer(query: str, region: str | None = None) -> dict[str, Any]:
    normalized = query.lower()
    if region == "kenya" and any(
        phrase in normalized
        for phrase in [
            "human rights",
            "basic rights",
            "rights of a kenyan",
            "bill of rights",
            "constitution of kenya",
        ]
    ):
        return build_kenya_rights_answer()

    hits = retrieve_sources(query, region=region)
    if not hits:
        return _format_response(
            "I could not find a grounded match in the curated Kenya/Africa sources yet. Try asking about rights, participation, governance, or a specific region.",
            [],
            "fallback",
            "local",
        )

    answer = (
        "Based on the curated sources, the strongest match is:\n"
        + "\n".join([f"- {hit.summary}" for hit in hits])
        + "\n\nThese sources are the current ground truth for the Kenya-first prototype."
    )
    return _format_response(answer, hits, "retrieval", "local")


def _http_json(method: str, url: str, payload: dict[str, Any], headers: dict[str, str] | None = None) -> dict[str, Any]:
    request = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json", **(headers or {})},
        method=method,
    )
    with urllib.request.urlopen(request, timeout=90) as response:
        return json.loads(response.read().decode("utf-8"))


def _openai_answer(query: str, region: str | None, hits: list[SourceHit]) -> dict[str, Any]:
    api_key = os.getenv("OPENAI_API_KEY", "").strip()
    if not api_key:
        return local_answer(query, region=region)

    try:
        source_block = "\n".join([f"- {hit.title}: {hit.summary} ({hit.url})" for hit in hits]) or "- No direct match found in curated sources."
        payload = {
            "model": os.getenv("OPENAI_MODEL", "gpt-4o-mini-search-preview"),
            "web_search_options": {},
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "You are Civic Access Navigator, a Kenya-first civic information assistant. "
                        "Answer only with sourced facts from web results and the provided curated sources. "
                        "If the evidence is weak, say so. Prefer official and rights-focused sources. "
                        "Return concise plain-language answers with cited links."
                    ),
                },
                {
                    "role": "user",
                    "content": (
                        f"Question: {query}\n"
                        f"Region: {region or 'kenya'}\n"
                        f"Curated sources:\n{source_block}"
                    ),
                },
            ],
        }
        data = _http_json(
            "POST",
            "https://api.openai.com/v1/chat/completions",
            payload,
            headers={"Authorization": f"Bearer {api_key}"},
        )
        answer = data["choices"][0]["message"]["content"]
        return _format_response(answer, hits, "openai-web", "openai")
    except Exception:
        return local_answer(query, region=region)


def _gemini_answer(query: str, region: str | None, hits: list[SourceHit]) -> dict[str, Any]:
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        return local_answer(query, region=region)

    try:
        source_block = "\n".join([f"- {hit.title}: {hit.summary} ({hit.url})" for hit in hits]) or "- No direct match found in curated sources."
        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": (
                                "You are Civic Access Navigator, a Kenya-first civic information assistant. "
                                "Answer only from web-grounded evidence and the curated sources provided. "
                                "Prefer rights-oriented official sources. If the evidence is weak, say so.\n\n"
                                f"Question: {query}\n"
                                f"Region: {region or 'kenya'}\n"
                                f"Curated sources:\n{source_block}"
                            )
                        }
                    ]
                }
            ],
            "tools": [{"google_search": {}}],
        }
        data = _http_json(
            "POST",
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key="
            + urllib.parse.quote(api_key),
            payload,
        )
        candidate = data["candidates"][0]
        answer = candidate["content"]["parts"][0]["text"]
        return _format_response(answer, hits, "gemini-web", "gemini")
    except Exception:
        return local_answer(query, region=region)


def _ollama_answer(query: str, region: str | None, hits: list[SourceHit]) -> dict[str, Any]:
    base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434").rstrip("/")
    model = os.getenv("OLLAMA_MODEL", "llama3.1")
    source_block = "\n".join([f"- {hit.title}: {hit.summary} ({hit.url})" for hit in hits]) or "- No direct match found in curated sources."

    try:
        search_payload = {"query": query, "max_results": 5}
        search_data = _http_json("POST", f"{base_url}/api/web_search", search_payload)
        results = search_data.get("results", [])
        web_block = "\n".join([f"- {item.get('title', 'Source')} ({item.get('url', '')})" for item in results]) or "- No web results."
    except Exception:
        web_block = "- Web search unavailable."

    prompt = (
        "You are Civic Access Navigator, a Kenya-first civic information assistant.\n"
        "Answer only from the curated sources and the web search results provided.\n"
        "Prefer official or rights-focused sources. If the evidence is weak, say so.\n\n"
        f"Question: {query}\n"
        f"Region: {region or 'kenya'}\n"
        f"Curated sources:\n{source_block}\n\n"
        f"Web search results:\n{web_block}"
    )

    payload = {"model": model, "prompt": prompt, "stream": False}
    try:
        data = _http_json("POST", f"{base_url}/api/generate", payload)
        return _format_response(data.get("response", "I could not generate a grounded answer."), hits, "ollama-web", "ollama")
    except Exception:
        return local_answer(query, region=region)


def chat_answer(query: str, region: str | None = None) -> dict[str, Any]:
    provider = os.getenv("CHAT_PROVIDER", "auto").strip().lower()
    hits = retrieve_sources(query, region=region)

    if region == "kenya" and any(
        phrase in query.lower()
        for phrase in [
            "human rights",
            "basic rights",
            "rights of a kenyan",
            "bill of rights",
            "constitution of kenya",
        ]
    ):
        base = build_kenya_rights_answer()
        if provider == "auto":
            provider = "openai" if os.getenv("OPENAI_API_KEY") else "gemini" if os.getenv("GEMINI_API_KEY") else "ollama"
        if provider == "openai":
            return _openai_answer(query, region, hits) if os.getenv("OPENAI_API_KEY") else base
        if provider == "gemini":
            return _gemini_answer(query, region, hits) if os.getenv("GEMINI_API_KEY") else base
        if provider == "ollama":
            return _ollama_answer(query, region, hits)
        return base

    if provider == "auto":
        provider = (
            "openai"
            if os.getenv("OPENAI_API_KEY")
            else "gemini"
            if os.getenv("GEMINI_API_KEY")
            else "ollama"
            if os.getenv("OLLAMA_BASE_URL")
            else "local"
        )

    if provider == "openai":
        return _openai_answer(query, region, hits)
    if provider == "gemini":
        return _gemini_answer(query, region, hits)
    if provider == "ollama":
        return _ollama_answer(query, region, hits)
    return local_answer(query, region=region)
