# AGENTS.md

## Setup
- Prefer Python 3.11+ and use an existing `.venv` when present.
- For JavaScript or TypeScript work, use Node LTS.

## Style
- Require type hints for Python code.
- Prefer pure functions where reasonable, and keep diffs small.
- Follow the existing project conventions before introducing new ones.

## Testing
- Use `pytest` for Python projects, usually with `pytest -q`.
- Use `vitest` for JavaScript projects.
- Run targeted tests first, then widen only if needed.

## Review
- Show a diff before applying multi-file changes.
- Report tests run, failures seen, and any remaining risk.
- Keep useful existing guidance; refine it instead of deleting it.
