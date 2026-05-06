# Capstone Spec

This repository contains the Civic Access Navigator PeaceTech capstone, aligned with OSF's Transformative Peace in Africa initiative.

The project is structured as a Kenya-first prototype that can adapt to region, language, and local peace definitions while expanding to additional countries and contexts.

## Commands

- `onboarding map`: inspect a project and prepare an onboarding map.
- `onboarding ask`: ask follow-up questions using mapped context.

## Acceptance Criteria

- `onboarding map` accepts a project path argument.
- `onboarding map` produces a concise summary of detected files, tools, and likely entry points.
- `onboarding ask` accepts a question for the user.
- `onboarding ask` uses mapped project context when available.
- `onboarding ask` calls the OpenAI API when credentials are configured.
- `onboarding ask` displays answers with rich formatting and citations.
- The repo summary should mention the actual PeaceTech capstone, not a watered-down generic placeholder.
- The repo should preserve the capstone as the main product and keep Codex as supporting infrastructure.

## Guardrails

- the bot should not invent legal or rights claims
- the bot should prefer official or approved sources for peace and human-rights guidance
- the bot should surface uncertainty instead of forcing a confident answer
- the product should respect local context, language differences, and community definitions of peace
- Codex should be shown as the delivery accelerator and repo assistant, not the end product
