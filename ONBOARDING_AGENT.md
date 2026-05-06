# Codebase Onboarding Agent

This project also aligns with the workshop flow for the codebase onboarding agent.

## Purpose

Use the onboarding agent to learn a repository quickly and answer structural questions before implementation.

## Expected Setup

- permissions: full access in the workspace
- model + intelligence: `GPT-5.5 - Medium`
- plan mode: ON

## Subcommands

- `onboard me <repo-path>`: walks a repo and writes an `ONBOARDING.md` summary
- `ask <repo-path> "<question>"`: answers a natural-language question about the repository using the relevant files and the OpenAI API

## Suggested Use

This capstone benefits from onboarding because it combines:

- documentation-first capstone framing
- a FastAPI backend
- static UI work
- curated data
- AI provider routing

The agent helps keep the project narrative, repo structure, and implementation path aligned before making changes.
