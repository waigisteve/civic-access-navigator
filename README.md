# Civic Access Navigator

Civic Access Navigator is a capstone project aligned with the Open Society Foundations mission of advancing rights, dignity, democratic participation, and accountable governance.

The project helps users find and understand trusted civic information through a simple AI-assisted interface. The initial scope is intentionally practical: a lightweight web application that can organize approved resources, surface key themes, and support plain-language explanations.

## Working Guidance

This repository follows the local instructions in [AGENTS.md](/mnt/c/Users/Hp/codex-demo/capstone/AGENTS.md).

Key expectations from that file:

- prefer Python 3.11+ and use an existing `.venv` when present
- keep diffs small and follow project conventions
- use type hints for Python code
- use `pytest` for Python tests
- preserve and refine existing guidance instead of removing it

## Problem

Public-interest information is often fragmented, technical, and difficult to navigate. Students, journalists, community groups, and ordinary citizens may struggle to find relevant civic resources quickly or understand what action to take next.

## Proposed Solution

Build an AI-assisted civic information navigator that:

- organizes trusted civic resources
- explains information in plain language
- highlights themes connected to rights, governance, and participation
- provides a simple foundation for later document retrieval and question answering

## Why It Fits OSF

This project supports:

- democratic practice through easier access to civic information
- rights and dignity through clearer explanations of public-interest resources
- equity in governance by lowering information barriers
- future-facing civic participation through responsible use of AI tools

## Repository Layout

- `docs/` project framing, architecture notes, milestones, and submission materials
- `backend/` FastAPI starter application
- `backend/app/` API code and future service modules
- `backend/static/` minimal front-end prototype served by the backend
- `data/` placeholder space for curated civic resources
- `tests/` backend test coverage
- `notes/` working notes, prompts, and research placeholders

## Local Run

1. Create or activate a Python 3.11+ virtual environment.
2. Install dependencies:

```bash
pip install -r backend/requirements.txt
```

3. Start the app:

```bash
uvicorn backend.app.main:app --reload
```

4. Open `http://127.0.0.1:8000`

## Sharing On Your Network

If you want another device on the same Wi-Fi or LAN to open the app, start it on all interfaces:

```bash
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
```

Then open it from the other device using your computer's local network IP, for example:

```text
http://192.168.1.42:8000
```

`127.0.0.1` only works on the same machine that is running the app.

## Sharing As A Link

To make the app reachable from anywhere on the internet, it must be deployed to a hosting platform or tunnel service. A GitHub repo link is useful for sharing the code, but it does not by itself host the running app.

## Next Build Steps

- add a curated document set relevant to the chosen civic theme
- introduce retrieval and source-grounded question answering
- add an admin workflow for uploading approved resources
- evaluate answers for clarity, citation quality, and safety
