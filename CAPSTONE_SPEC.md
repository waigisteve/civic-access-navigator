# Capstone spec — Civic Access Navigator

## Problem statement

Civic Access Navigator is a Kenya-first PeaceTech prototype for citizens, displaced users, and other people navigating fragile public systems in low-connectivity environments. The product addresses a practical problem: many users do not just lack information, they lack a safe, low-friction way to turn a live incident into an accountable next action. The system matters because in contexts shaped by administrative fog, weak connectivity, and personal risk, people need a way to identify what is happening, understand what right or protection issue applies, record only the minimum necessary details, and route the case through the safest available path.

## What success looks like (acceptance criteria)

- [ ] Given a selected language, the workflow UI renders incident titles, action titles, form strings, and source titles in that locale instead of defaulting to English.
- [ ] Given a selected workflow incident, a user can complete a structured report form and save it to the Postgres-backed workflow report store.
- [ ] Given a low-connectivity user, the app supports both SMS intake and Africa's Talking USSD callback flows for reporting and follow-up.
- [ ] Given an admin with `CAN_ADMIN_TOKEN`, the admin pages expose workflow reports, chat records, SOS requests, SMS inbox items, and USSD sessions without exposing those records to normal users.
- [ ] Given an unavailable public LLM provider, the chat system still returns a grounded answer from internal FAQ and curated source material.

## Architecture sketch

- A FastAPI backend that serves the web app, admin pages, JSON APIs, and Africa's Talking / Twilio webhook endpoints.
- A Postgres-backed workflow layer that stores workflow scenarios, incidents, action points, reports, chat records, SOS requests, and USSD sessions.
- A frontend interaction layer in static HTML/CSS/JS that drives language switching, workflow reporting, grounded chat, SOS actions, and nearby-help behavior.
- A grounded answer path that combines internal FAQ, curated resource files, optional approved resources, and optional public-model synthesis.

## Tech stack

- Language: Python 3.14 backend, vanilla JavaScript frontend
- Key libraries: `fastapi`, `pydantic`, `sqlalchemy`, `openai`, `python-dotenv`, `uvicorn`
- External services:
  - Render web service
  - Render Postgres
  - OpenAI and/or Gemini for optional model synthesis
  - Africa's Talking for SMS and USSD
  - optional Twilio inbound SMS support

## Task list (in order)

1. [ ] Keep the core workflow model aligned with the current capstone scope: scenario -> incident -> action -> report.
2. [ ] Ensure workflow reports, chat records, SOS requests, and USSD sessions persist correctly in Postgres.
3. [ ] Complete locale parity across workflow content, saved display fields, and admin review output.
4. [ ] Keep the chat path grounded first in internal FAQ and curated source material, with model use as an optional synthesis layer.
5. [ ] Maintain safe-mode and lite-mode behavior for fragile and low-bandwidth operating contexts.
6. [ ] Keep the SMS intake path operational and admin-visible without exposing it in the public UI.
7. [ ] Keep the USSD callback path operational for start-report, follow-up, rights-help, and emergency menu flows.
8. [ ] Maintain admin-only review pages for workflow reports, chat records, SOS requests, SMS inbox items, USSD sessions, and approved resources.
9. [ ] Keep documentation aligned with the deployed product so prompts can reference this file as the current build brief.

## Out of scope (MVP)

- Production-grade telco rollout of a live toll-free shortcode or dedicated USSD code
- Full offline native mobile app behavior
- Country-wide operational content beyond the Kenya-first pilot
- Fully automated institutional delivery and case management beyond current queue / proof-of-concept routing
- Public exposure of admin data or records

## Open questions

- Which Africa's Talking production setup will be used after sandbox: shared shortcode, dedicated shortcode, or premium/toll-free arrangement?
- Should provider failover prefer Gemini automatically when OpenAI quota is unavailable, or remain explicit through environment configuration?
- How much of the source base should be localized at the content level versus localized only at the UI and workflow-label layer?
- Should workflow follow-up expand beyond reference-ID status checks into a richer case-tracking flow?
- Which parts of the current admin experience need to remain proof-of-concept only, and which should be hardened for demonstration readiness?
