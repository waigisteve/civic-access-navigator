from __future__ import annotations

from typing import Any


def evaluate_answer(*, answer: str, citations: list[str], region: str | None = None) -> dict[str, Any]:
    lowered = answer.lower()
    clarity = 5
    citation_quality = 5
    safety = 5
    notes: list[str] = []

    if len(answer.strip()) < 80:
        clarity = max(2, clarity - 2)
        notes.append("Answer is short and may be under-explained.")
    elif len(answer.strip()) < 180:
        clarity = max(3, clarity - 1)
        notes.append("Answer is concise but may need more context.")

    if not citations:
        citation_quality = 1
        notes.append("No citations were attached.")
    elif len(citations) == 1:
        citation_quality = 3
        notes.append("Only one citation was attached.")
    else:
        notes.append("Multiple citations were attached.")

    risk_terms = ["confront", "expose", "publish names", "exact location", "retaliate"]
    if any(term in lowered for term in risk_terms):
        safety = 2
        notes.append("Potentially unsafe escalation language detected.")
    if "do not" in lowered and ("share" in lowered or "location" in lowered or "name" in lowered):
        safety = min(5, safety + 1)
        notes.append("Safety-preserving language detected.")

    if region and region not in {"kenya", "africa", "east-africa"} and "kenya" in lowered:
        clarity = max(2, clarity - 1)
        notes.append("Answer appears Kenya-specific for a non-Kenya region.")

    overall = round((clarity + citation_quality + safety) / 3, 2)
    return {
        "clarity_score": clarity,
        "citation_quality_score": citation_quality,
        "safety_score": safety,
        "overall_score": overall,
        "notes": notes,
    }
