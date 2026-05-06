from __future__ import annotations


def build_repo_map() -> dict[str, str]:
    """Return a lightweight repo map for the onboarding agent."""
    return {
        "AGENTS.md": "workspace guidance for Codex runs",
        "CAPSTONE_SPEC.md": "capstone submission and onboarding spec",
        "BUSINESS_CASE.md": "business case and adaptability framing",
        "CODEX_SETUP.md": "Codex workspace setup notes",
        "ONBOARDING.md": "onboarding summary and sample commands",
        "ONBOARDING_AGENT.md": "onboarding agent workshop notes",
        "pyproject.toml": "project metadata and package scaffold",
        "README.md": "project overview, run steps, and deployment notes",
        "src/onboarding_agent": "onboarding agent package",
        "tests": "test coverage for the scaffold",
        "backend": "FastAPI app, chat routing, and service layer",
        "backend/static": "visual prototype and interactive UI",
        "data": "curated peace and civic resources",
        "docs": "project framing and submission materials",
        "render.yaml": "Render deployment blueprint",
    }
