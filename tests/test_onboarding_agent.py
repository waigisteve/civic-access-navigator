from __future__ import annotations

from onboarding_agent.cli import main
from onboarding_agent.mapper import build_repo_map
from onboarding_agent.asker import answer_question


def test_repo_map_contains_backend() -> None:
    repo_map = build_repo_map()

    assert "backend" in repo_map
    assert "AGENTS.md" in repo_map
    assert "pyproject.toml" in repo_map


def test_answer_question_returns_placeholder_text() -> None:
    text = answer_question("what is this repo?")

    assert "PeaceTech capstone" in text
    assert "Question:" in text


def test_cli_runs_without_error() -> None:
    main()
