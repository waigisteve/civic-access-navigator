from __future__ import annotations

import json
import os
import re
import time
import urllib.parse
import urllib.error
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import Any

try:
    from openai import OpenAI
except Exception:  # pragma: no cover - optional dependency at runtime
    OpenAI = None


CURATED_SOURCES_PATH = Path(__file__).resolve().parents[3] / "data" / "curated" / "osf_kenya_africa_sources.json"
KNOWLEDGE_BASE_PATH = Path(__file__).resolve().parents[3] / "data" / "curated" / "can_knowledge_base.json"
FAQ_PATH = Path(__file__).resolve().parents[3] / "data" / "curated" / "can_faq.json"
LIVE_CACHE_DIR = Path(__file__).resolve().parents[3] / ".cache" / "live_sources"
LIVE_CACHE_TTL_SECONDS = 60 * 30
ALLOWED_LIVE_DOMAINS = {
    "opensocietyfoundations.org",
    "www.opensocietyfoundations.org",
    "unhcr.org",
    "www.unhcr.org",
    "icrc.org",
    "www.icrc.org",
}


@dataclass(frozen=True)
class SourceHit:
    id: str
    title: str
    region: str
    source_type: str
    url: str
    summary: str
    body: str
    score: int


@dataclass(frozen=True)
class LiveSnippet:
    title: str
    url: str
    snippet: str


def _load_json(path: Path) -> list[dict[str, Any]]:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def _live_ingestion_enabled() -> bool:
    return os.getenv("LIVE_SOURCE_INGESTION", "0").strip() == "1"


def _strip_html(html: str) -> str:
    html = re.sub(r"(?is)<script.*?>.*?</script>", " ", html)
    html = re.sub(r"(?is)<style.*?>.*?</style>", " ", html)
    html = re.sub(r"(?s)<[^>]+>", " ", html)
    html = re.sub(r"\s+", " ", html)
    return html.strip()


def _cache_path_for_url(url: str) -> Path:
    slug = re.sub(r"[^a-zA-Z0-9]+", "_", url).strip("_").lower()
    LIVE_CACHE_DIR.mkdir(parents=True, exist_ok=True)
    return LIVE_CACHE_DIR / f"{slug}.json"


def _fetch_live_text(url: str) -> str:
    cache_path = _cache_path_for_url(url)
    if cache_path.exists():
        age = time.time() - cache_path.stat().st_mtime
        if age <= LIVE_CACHE_TTL_SECONDS:
            try:
                return json.loads(cache_path.read_text(encoding="utf-8")).get("text", "")
            except Exception:
                pass

    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "CivicAccessNavigator/0.1 (+https://github.com/waigisteve/codex)"
        },
    )
    with urllib.request.urlopen(request, timeout=12) as response:
        html = response.read().decode("utf-8", errors="ignore")
    text = _strip_html(html)
    try:
        cache_path.write_text(json.dumps({"text": text}), encoding="utf-8")
    except Exception:
        pass
    return text


def retrieve_live_snippets(hits: list[SourceHit], query: str) -> list[LiveSnippet]:
    if not _live_ingestion_enabled():
        return []

    snippets: list[LiveSnippet] = []
    query_tokens = set(_tokenize(query))
    for hit in hits:
        if not hit.url.startswith("http"):
            continue
        domain = hit.url.split("/")[2].lower() if "//" in hit.url else ""
        if domain not in ALLOWED_LIVE_DOMAINS:
            continue
        try:
            text = _fetch_live_text(hit.url)
        except (urllib.error.URLError, TimeoutError, ValueError):
            continue
        if not text:
            continue
        sentences = re.split(r"(?<=[.!?])\s+", text)
        selected = []
        for sentence in sentences:
            lowered = sentence.lower()
            if any(token in lowered for token in query_tokens):
                selected.append(sentence.strip())
            if len(" ".join(selected)) > 500:
                break
        snippet = " ".join(selected).strip() or text[:500]
        snippets.append(LiveSnippet(title=hit.title, url=hit.url, snippet=snippet[:700]))
    return snippets[:3]


def load_curated_sources() -> list[dict[str, Any]]:
    return _load_json(CURATED_SOURCES_PATH)


def load_knowledge_base() -> list[dict[str, Any]]:
    return _load_json(KNOWLEDGE_BASE_PATH)


def load_faq() -> list[dict[str, Any]]:
    return _load_json(FAQ_PATH)


def _tokenize(text: str) -> list[str]:
    return [token.strip(".,:;!?()[]{}\"'").lower() for token in text.split() if token.strip()]


def _score_text(query: str, text: str) -> int:
    q_tokens = _tokenize(query)
    haystack = text.lower()
    score = 0
    for token in q_tokens:
        if token and token in haystack:
            score += 1
    return score


def _score_source(query: str, source: dict[str, Any], region: str | None = None) -> int:
    score = _score_text(
        query,
        " ".join(
            [
                source.get("title", ""),
                source.get("summary", ""),
                source.get("body", ""),
                " ".join(source.get("keywords", [])),
            ]
        ),
    )
    q = query.lower()
    if region and source.get("region") in {region, "africa"}:
        score += 2
    if source.get("region", "") in q:
        score += 2
    if source.get("source_type") == "internal-doc":
        score += 1
    return score


def _score_faq(query: str, item: dict[str, Any], region: str | None = None) -> int:
    score = _score_text(
        query,
        " ".join(
            [
                item.get("question", ""),
                item.get("answer", ""),
                " ".join(item.get("keywords", [])),
            ]
        ),
    )
    if region and item.get("region") in {region, "africa"}:
        score += 2
    return score


def retrieve_sources(query: str, region: str | None = None) -> list[SourceHit]:
    combined = load_curated_sources() + load_knowledge_base()
    hits: list[SourceHit] = []
    for source in combined:
        score = _score_source(query, source, region=region)
        if score <= 0:
            continue
        hits.append(
            SourceHit(
                id=source["id"],
                title=source["title"],
                region=source.get("region", "africa"),
                source_type=source.get("source_type", "curated-note"),
                url=source["url"],
                summary=source.get("summary", ""),
                body=source.get("body", source.get("summary", "")),
                score=score,
            )
        )
    hits.sort(key=lambda item: item.score, reverse=True)
    return hits[:5]


def retrieve_faq(query: str, region: str | None = None) -> dict[str, Any] | None:
    ranked = []
    for item in load_faq():
        score = _score_faq(query, item, region=region)
        if score > 0:
            ranked.append((score, item))
    ranked.sort(key=lambda item: item[0], reverse=True)
    return ranked[0][1] if ranked else None


def _format_response(answer: str, citations: list[str], mode: str, provider: str) -> dict[str, Any]:
    return {
        "answer": answer,
        "citations": citations,
        "mode": mode,
        "provider": provider,
    }


def _citations_from_hits(hits: list[SourceHit]) -> list[str]:
    return [f"{hit.title} ({hit.url})" for hit in hits]


def _faq_citations(item: dict[str, Any], hits: list[SourceHit]) -> list[str]:
    ids = set(item.get("source_ids", []))
    if not ids:
      return _citations_from_hits(hits)
    return [f"{hit.title} ({hit.url})" for hit in hits if hit.id in ids] or _citations_from_hits(hits)


def local_answer(query: str, region: str | None = None) -> dict[str, Any]:
    faq = retrieve_faq(query, region=region)
    hits = retrieve_sources(query, region=region)
    live_snippets = retrieve_live_snippets(hits, query)

    if faq:
        citations = _faq_citations(faq, hits)
        if live_snippets:
            citations = citations + [f"{item.title} ({item.url})" for item in live_snippets]
        return _format_response(faq["answer"], citations, "faq", "local")

    if not hits:
        return _format_response(
            "I could not find a grounded match in the internal OSF and peace-support documents yet. Try asking about rights, accountability, displacement, aid denial, or a specific incident.",
            [],
            "fallback",
            "local",
        )

    answer = (
        "Based on the internal documentation and curated source set, the strongest answer is:\n"
        + "\n".join([f"- {hit.summary}" for hit in hits[:3]])
        + (
            "\n"
            + "\n".join([f"- Live website note: {item.snippet}" for item in live_snippets])
            if live_snippets
            else ""
        )
        + "\n\nThis answer is grounded in the current OSF-aligned and peace-support documents available inside the prototype."
    )
    citations = _citations_from_hits(hits) + [f"{item.title} ({item.url})" for item in live_snippets]
    return _format_response(answer, citations, "knowledge+live" if live_snippets else "knowledge", "local")


def _openai_answer(query: str, region: str | None = None) -> dict[str, Any]:
    api_key = os.getenv("OPENAI_API_KEY", "").strip()
    if not api_key or OpenAI is None:
        return local_answer(query, region=region)

    faq = retrieve_faq(query, region=region)
    hits = retrieve_sources(query, region=region)
    live_snippets = retrieve_live_snippets(hits, query)
    if not faq and not hits:
        return local_answer(query, region=region)

    source_block = "\n\n".join(
        [f"{hit.title}\nSummary: {hit.summary}\nDetail: {hit.body}\nURL: {hit.url}" for hit in hits]
    )
    faq_block = ""
    citations = _citations_from_hits(hits)
    if faq:
        faq_block = f"FAQ match\nQuestion: {faq['question']}\nAnswer: {faq['answer']}\n"
        citations = _faq_citations(faq, hits)
    if live_snippets:
        citations = citations + [f"{item.title} ({item.url})" for item in live_snippets]

    live_block = ""
    if live_snippets:
        live_block = "Live website snippets:\n" + "\n\n".join(
            [f"{item.title}\nURL: {item.url}\nSnippet: {item.snippet}" for item in live_snippets]
        )

    prompt = [
        {
            "role": "system",
            "content": (
                "You are Civic Access Navigator. "
                "Answer only from the provided internal documentation, FAQ entries, and curated source notes. "
                "Do not invent facts. If the sources are weak or partial, say so plainly. "
                "Keep the answer concise and useful."
            ),
        },
        {
            "role": "user",
            "content": (
                f"Question: {query}\n"
                f"Region: {region or 'kenya'}\n\n"
                f"{faq_block}\n"
                f"Internal documentation:\n{source_block}\n\n"
                f"{live_block}"
            ),
        },
    ]

    client = OpenAI(api_key=api_key)
    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini").strip()
    try:
        response = client.chat.completions.create(model=model, messages=prompt)
        answer = (response.choices[0].message.content or "").strip()
        if answer:
            return _format_response(answer, citations, "grounded-docs+live" if live_snippets else "grounded-docs", "openai")
    except Exception as exc:
        return _format_response(
            f"OpenAI was configured, but the grounded answer could not be generated just now: {exc}. The app fell back to internal documentation.",
            citations,
            "openai-error",
            "openai",
        )

    return local_answer(query, region=region)


def _gemini_extract_text(payload: dict[str, Any]) -> str:
    candidates = payload.get("candidates") or []
    parts: list[str] = []
    for candidate in candidates:
        content = candidate.get("content") or {}
        for part in content.get("parts") or []:
            text = part.get("text")
            if text:
                parts.append(text.strip())
    return "\n".join([item for item in parts if item]).strip()


def _gemini_answer(query: str, region: str | None = None) -> dict[str, Any]:
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        return local_answer(query, region=region)

    faq = retrieve_faq(query, region=region)
    hits = retrieve_sources(query, region=region)
    live_snippets = retrieve_live_snippets(hits, query)
    if not faq and not hits:
        return local_answer(query, region=region)

    source_block = "\n\n".join(
        [f"{hit.title}\nSummary: {hit.summary}\nDetail: {hit.body}\nURL: {hit.url}" for hit in hits]
    )
    faq_block = ""
    citations = _citations_from_hits(hits)
    if faq:
        faq_block = f"FAQ match\nQuestion: {faq['question']}\nAnswer: {faq['answer']}\n"
        citations = _faq_citations(faq, hits)
    if live_snippets:
        citations = citations + [f"{item.title} ({item.url})" for item in live_snippets]

    live_block = ""
    if live_snippets:
        live_block = "Live website snippets:\n" + "\n\n".join(
            [f"{item.title}\nURL: {item.url}\nSnippet: {item.snippet}" for item in live_snippets]
        )

    model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash").strip()
    endpoint = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        f"{urllib.parse.quote(model, safe='')}:generateContent"
    )
    payload = {
        "system_instruction": {
            "parts": [
                {
                    "text": (
                        "You are Civic Access Navigator. "
                        "Answer only from the provided internal documentation, FAQ entries, and curated source notes. "
                        "Do not invent facts. If the sources are weak or partial, say so plainly. "
                        "Keep the answer concise and useful."
                    )
                }
            ]
        },
        "contents": [
            {
                "parts": [
                    {
                        "text": (
                            f"Question: {query}\n"
                            f"Region: {region or 'kenya'}\n\n"
                            f"{faq_block}\n"
                            f"Internal documentation:\n{source_block}\n\n"
                            f"{live_block}"
                        )
                    }
                ]
            }
        ],
    }

    request = urllib.request.Request(
        endpoint,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "x-goog-api-key": api_key,
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            raw = response.read().decode("utf-8")
        answer = _gemini_extract_text(json.loads(raw))
        if answer:
            return _format_response(
                answer,
                citations,
                "grounded-docs+live" if live_snippets else "grounded-docs",
                "gemini",
            )
    except Exception as exc:
        return _format_response(
            f"Gemini was configured, but the grounded answer could not be generated just now: {exc}. The app fell back to internal documentation.",
            citations,
            "gemini-error",
            "gemini",
        )

    return local_answer(query, region=region)


def chat_answer(query: str, region: str | None = None) -> dict[str, Any]:
    provider = os.getenv("CHAT_PROVIDER", "auto").strip().lower()
    if provider == "auto":
        if os.getenv("OPENAI_API_KEY"):
            provider = "openai"
        elif os.getenv("GEMINI_API_KEY"):
            provider = "gemini"
        else:
            provider = "local"
    if provider == "openai":
        return _openai_answer(query, region=region)
    if provider == "gemini":
        return _gemini_answer(query, region=region)
    return local_answer(query, region=region)
