# Civic Access Navigator

Civic Access Navigator is a PeaceTech capstone aligned with the Open Society Foundations mission and the Transformative Peace in Africa initiative.

The project helps users explore trusted, locally grounded peace and civic information through a simple AI-assisted interface. The initial scope is intentionally practical: a lightweight web application that can organize approved resources, surface key themes, and support plain-language explanations for conflict-affected communities.

## Working Guidance

This repository follows the local instructions in [AGENTS.md](/mnt/c/Users/Hp/codex-demo/capstone/AGENTS.md).

Key expectations from that file:

- prefer Python 3.11+ and use an existing `.venv` when present
- keep diffs small and follow project conventions
- use type hints for Python code
- use `pytest` for Python tests
- preserve and refine existing guidance instead of removing it

## Problem

Peacebuilding information is often fragmented, technical, and disconnected from local realities. Communities affected by conflict, along with advocates and field partners, may struggle to find relevant resources quickly or understand what action to take next.

## Proposed Solution

Build an AI-assisted peace and civic information navigator that:

- organizes trusted peace, civic, and accountability resources
- explains information in plain language
- highlights themes connected to voice and accountability, dignity and opportunity, and peace and community
- provides a simple foundation for later document retrieval, grounded question answering, and regional expansion

## Why It Fits OSF

This project supports:

- transformative peace through easier access to trusted local information
- rights and dignity through clearer explanations of public-interest resources
- equitable opportunity by lowering information barriers for affected communities
- community-led peacebuilding through responsible use of AI tools

## Repository Layout

- `docs/` project framing, architecture notes, milestones, and submission materials
- `backend/` FastAPI starter application
- `backend/app/` API code and future service modules
- `backend/static/` minimal front-end prototype served by the backend
- `data/` placeholder space for curated peace and civic resources
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

You can also run the app through the built-in launcher, which reads `APP_HOST`, `APP_PORT`, and `APP_RELOAD` from the environment:

```bash
python -m backend.app.main
```

## Sharing As A Link

To make the app reachable from anywhere on the internet, it must be deployed to a hosting platform or tunnel service. A GitHub repo link is useful for sharing the code, but it does not by itself host the running app.

## Render Deployment

This repository includes a `render.yaml` blueprint for Render's free web service tier. Render will provide the public URL after deploy, and the app will bind to the platform's `PORT` value automatically.

Suggested flow:

1. Create a new Web Service on Render from this GitHub repo.
2. Use the included `render.yaml` blueprint or the dashboard settings.
3. Let Render run the build command:

```bash
pip install -r backend/requirements.txt
```

4. Let Render run the start command:

```bash
python -m backend.app.main
```

5. Use the Render-generated `https://<service-name>.onrender.com` URL as the public link.

If your existing Render service is already configured to install `requirements.txt` from the repository root, this repo now includes a root-level shim that forwards to `backend/requirements.txt`, so the same dashboard setup will work too.

## Chat Providers

The bot can route through one of three providers:

- `CHAT_PROVIDER=openai`
- `CHAT_PROVIDER=gemini`
- `CHAT_PROVIDER=ollama`
- `CHAT_PROVIDER=auto` to pick the first available provider

Provider-specific settings:

- OpenAI: `OPENAI_API_KEY`, optional `OPENAI_MODEL`
- Gemini: `GEMINI_API_KEY`
- Ollama: `OLLAMA_BASE_URL`, optional `OLLAMA_MODEL`

## PeaceTech Tracks

The product is being realigned toward OSF's PeaceTech invitation tracks:

- Voice and accountability
- Dignity and opportunity
- Peace and community

The first prototype zone remains Kenya, with expansion planned across Africa and OSF's conflict-affected regions.

## Business Case

The winning case for this project is that it is not a one-country chatbot. It is a reusable peace-navigation platform that can localize by region, language, and local meaning while keeping a shared trust layer for citations, curated sources, and accountable answers.

The core value proposition is:

- one interface
- many countries
- many languages
- many doctrines and community definitions of peace
- one grounded information backbone

That makes it easier to scale from Kenya into the Sahel, DRC, Sudan, Mozambique, and other OSF contexts without rebuilding the product from scratch.

## Next Build Steps

- add a curated document set relevant to the chosen civic theme
- introduce retrieval and source-grounded question answering
- add an admin workflow for uploading approved resources
- evaluate answers for clarity, citation quality, and safety
