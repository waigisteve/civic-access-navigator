# Architecture Notes

## Purpose

This document describes the intended structure of Civic Access Navigator as it grows from a capstone prototype into a more grounded AI-assisted civic information tool.

## Current Shape

- FastAPI backend for API endpoints and static file serving
- static frontend for the first usable interface
- in-memory sample resource data for early development

## Planned Growth

- curated civic documents stored under `data/curated/`
- retrieval layer for source-grounded question answering
- admin workflow for trusted resource ingestion
- evaluation notes for answer quality and safety

## Guiding Constraint

The application should remain focused on trusted, curated public-interest information rather than real-time open web claims or direct legal advice.
