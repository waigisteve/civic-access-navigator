# Civic Access Navigator

Civic Access Navigator is a PeaceTech capstone aligned with the Open Society Foundations mission and the Transformative Peace in Africa initiative.

Business case in one line: Civic Access Navigator lowers the cost and risk of civic participation by turning rights information into safe, incident-specific accountability actions.

The project helps users move from a crisis incident to a safer next step through a simple AI-assisted interface. The initial scope is intentionally practical: a lightweight web application that turns approved civic data into incident-specific workflows, optional accountability actions, and low-friction help for conflict-affected communities.

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

Build an AI-assisted peace and civic action navigator that:

- guides users through incident-specific workflows such as checkpoint delays, denied aid, or abuse reporting
- turns rights information into plain-language next actions
- focuses first on the `Voice & accountability` track
- includes a `Lite Mode`, `Safe Mode`, and displaced-user scenario selector for hackathon constraint handling
- includes a lightweight asynchronous queue for `send-when-connected` accountability actions
- provides a simple foundation for later document retrieval, grounded question answering, and regional expansion

## Why It Fits OSF

This project supports:

- **Democratic Practice** by helping citizens ask better questions, document incidents, and approach institutions with clearer accountability signals
- **Rights and Dignity** by turning rights information into plain-language next steps that protect individual well-being under pressure
- **Equity in Governance** by reducing information asymmetry for people who are most exposed to exclusion, displacement, and institutional opacity
- **Justice** by creating a low-friction path toward traceable accountability actions, escalation, and future remedy-seeking

The current prototype is strongest in `Democratic Practice` and `Rights and Dignity`, while also contributing to `Equity in Governance` through access and to `Justice` through a lightweight accountability trail.

## Guardrails

The project is designed to stay within a clear set of principles:

- keep the core product grounded in curated, trusted sources
- prefer local context over generic summaries
- support multiple countries, languages, and community definitions of peace
- support low-bandwidth use through a lighter UI mode and cached resource fallback
- support anonymous participation through a safe mode that suppresses location-first actions
- cite sources when the bot answers
- avoid legal advice, political prediction, or unverified claims
- keep Codex as a workflow and onboarding aid, not as the product itself
- preserve the main PeaceTech capstone as the center of the repo
- use Codex to speed up delivery, structure the repo, and keep the project readable
- keep the user-facing product distinct from the scaffolding used to build and review it
- make every answer traceable, especially when the bot touches rights, peace, or public-interest guidance

## Mode Behavior

The prototype uses two distinct operating modes with different goals:

- `Lite Mode`
  - intended for low bandwidth, weak devices, or unstable browsing conditions
  - reduces visual weight, removes most decorative effects, and leans on cached content
  - keeps the interface readable and functional when network conditions are constrained

- `Safe Mode`
  - intended for physical-risk or privacy-sensitive situations
  - suppresses location-first actions, resets visible chat history, and highlights quick-exit behavior
  - shifts the UI into a darker, lower-profile presentation to signal privacy-first use

These modes are intentionally different both in function and appearance. `Lite Mode` is about resilience and performance. `Safe Mode` is about privacy, exposure reduction, and risk-aware interaction.

## How Codex Helps

Codex supports the project by:

- mapping the repo before making changes
- keeping the capstone docs, code, and deployment notes aligned
- helping with repeatable onboarding so the project is easier to hand off
- reducing setup friction without replacing the project vision or domain judgment

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
- Gemini: `GEMINI_API_KEY`, optional `GEMINI_MODEL` (default: `gemini-2.5-flash`)
- Ollama: `OLLAMA_BASE_URL`, optional `OLLAMA_MODEL`

## Chat Knowledge Path

The `Lets Chat` assistant is designed to answer from internal project knowledge before it falls back to any public model.

Current answer order:

1. internal FAQ entries in [docs/chat-faq.md](/mnt/c/Users/Hp/codex-demo/capstone/docs/chat-faq.md)
2. curated OSF and peace-support knowledge notes in `data/curated/`
3. optional live ingestion from an allowlist of public source websites already represented in the knowledge base
4. optional public LLM synthesis over those retrieved internal sources and live snippets

This keeps the chatbot grounded in project-controlled material rather than relying on open-ended generation first.

Additional curated retrieval set:

- `data/curated/voice_accountability_documents.json`

This adds a focused document set for the chosen civic theme, including:

- administrative fog
- checkpoint guidance
- aid-denial escalation
- displacement-safe reporting
- citation quality standards
- safety standards for peace queries

## Admin Resource Workflow

Admin-only resource workflow:

- `GET /admin/resources`
- `GET /api/admin/resources`
- `POST /api/admin/resources`
- `POST /api/admin/resources/import`

This flow is protected by:

- `CAN_ADMIN_TOKEN`

Approved resources are stored in:

- `data/runtime/approved_resources.json`

Approved resources immediately enter:

- the starter resource library
- the retrieval corpus used by `Lets Chat`

## Answer Evaluation

Admin-only answer evaluation endpoint:

- `POST /api/admin/evaluate-chat`

It returns:

- grounded answer
- citations
- provider/mode
- evaluation block for:
  - clarity
  - citation quality
  - safety

To enable live website ingestion at runtime:

- set `LIVE_SOURCE_INGESTION=1`

The current allowlist is intentionally narrow:

- `opensocietyfoundations.org`
- `unhcr.org`
- `icrc.org`

## SMS Intake

The prototype now supports inbound SMS webhook intake for low-connectivity use cases.

What this does:

- accepts inbound SMS messages from a gateway provider
- classifies urgent peace and protection queries
- stores them in a lightweight local inbox at `data/runtime/sms_inbox.jsonl`
- generates a grounded reply candidate from the same internal FAQ and curated OSF-aligned source path used by `Lets Chat`

Current adapters:

- `POST /api/sms/inbound/africastalking`
- `POST /api/sms/inbound/twilio`
- `GET /api/admin/sms/inbox` for the admin-only proof-of-concept inbox
- `GET /admin/sms` for a simple admin inbox page

Configuration:

- `CAN_ADMIN_TOKEN` for viewing the admin inbox
- `AFRICASTALKING_USERNAME`
- `AFRICASTALKING_API_KEY`
- optional `AFRICASTALKING_FROM`
- optional `AFRICASTALKING_REPLY_ENABLED=1` to send reply candidates back out through Africa's Talking
- optional `AFRICASTALKING_INBOUND_TOKEN=<shared-secret>` if you want to protect the inbound callback URL with a query token
- `TWILIO_AUTH_TOKEN` for validating Twilio webhook signatures

Important constraint:

- users do not need internet on their phone to send the SMS
- the app server still needs internet so the SMS gateway can deliver the webhook

Recommended provider for the Kenya-first prototype:

- Africa's Talking, using a two-way shortcode or shared shortcode keyword
- for a true toll-free experience in Kenya, use a toll-free shortcode/keyword rather than a normal sender ID

Relevant provider docs:

- Africa's Talking shortcode guidance: https://help.africastalking.com/en/articles/4095180-how-do-i-setup-a-shortcode
- Africa's Talking incoming message callbacks: https://help.africastalking.com/en/articles/742510-where-are-my-incoming-messages
- Twilio incoming SMS webhooks: https://www.twilio.com/docs/usage/webhooks/messaging-webhooks

Notes:

- the SMS inbox is no longer shown in the public UI
- inbound SMS messages should only be reviewed from the admin page or the protected admin API
- the Africa's Talking route currently returns a simple 200 acknowledgement for the proof-of-concept
- the Twilio route returns a TwiML SMS reply using the grounded response candidate
- the Africa's Talking route can also send an outbound SMS reply through the Messaging API when `AFRICASTALKING_REPLY_ENABLED=1`
- this inbox is file-backed for the capstone; it is not durable production storage

## PeaceTech Track

The product is now intentionally centered on `Voice & accountability`.

Why this is the best fit:

- it helps citizens understand rights and civic options in plain language
- it reduces the gap between people and the institutions meant to serve them
- it gives communities a faster path to trusted, accountable public-interest guidance
- it supports escalation, reporting, and safer next-step decision making

This makes the product a direct fit for OSF's democratic practice work, while also reinforcing rights and dignity, improving equity in governance for excluded users, and supporting justice-oriented accountability flows.

The first prototype zone remains Kenya, with expansion planned across Africa and OSF's conflict-affected regions.

## Business Case

The winning case for this project is that it gives citizens and field partners one reusable accountability workflow that can localize by country and language while keeping a trusted source backbone.

That makes it easier to scale from Kenya into the Sahel, DRC, Sudan, Mozambique, and other OSF contexts without rebuilding the product from scratch.

## Next Build Steps

- add a curated document set relevant to the chosen civic theme
- introduce retrieval and source-grounded question answering
- add an admin workflow for uploading approved resources
- evaluate answers for clarity, citation quality, and safety
