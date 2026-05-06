from __future__ import annotations

from onboarding_agent.asker import answer_question
from onboarding_agent.mapper import build_repo_map


def main() -> None:
    """Entry point for the onboarding agent CLI."""
    repo_map = build_repo_map()
    print("onboarding map")
    for path, description in repo_map.items():
        print(f"- {path}: {description}")
    print("onboarding ask")
    print(answer_question("what is this repository?"))
