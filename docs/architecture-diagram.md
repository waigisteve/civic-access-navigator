# Civic Access Navigator for Open Society Foundations — Architecture Diagram

This file is the submission-ready architecture diagram for the current capstone implementation.

## System Diagram

```mermaid
flowchart TB
    subgraph Users["Users"]
        U1["Web user<br/>citizen / displaced user / refugee"]
        U2["Feature phone user<br/>SMS / USSD"]
        U3["Admin reviewer"]
    end

    subgraph Channels["Interaction Channels"]
        W["Web UI<br/>HTML / CSS / JavaScript"]
        SMS["Inbound SMS channel<br/>Africa's Talking / Twilio"]
        USSD["USSD menu channel<br/>Africa's Talking"]
        ADM["Admin UI<br/>protected review surfaces"]
    end

    subgraph App["Render Web Service"]
        API["FastAPI application"]

        subgraph Features["Application Features"]
            WF["Incident workflow engine"]
            CHAT["Grounded chat service"]
            SOS["SOS / nearby-help actions"]
            RES["Approved resource administration"]
            EVAL["Answer evaluation"]
        end
    end

    subgraph Data["Data Layer"]
        PG["Render Postgres<br/>workflow scenarios<br/>workflow incidents<br/>action points<br/>workflow reports<br/>chat records<br/>SOS requests<br/>USSD session records"]
        CURATED["Curated local sources<br/>FAQ / knowledge base / OSF-aligned notes / workflow catalog"]
        RUNTIME["Runtime file storage<br/>SMS inbox JSONL<br/>local queue fallback"]
    end

    subgraph External["External Services"]
        OAI["OpenAI API"]
        GEM["Gemini API"]
        AT["Africa's Talking"]
        TW["Twilio"]
        MAPS["GIS map search / device location"]
    end

    U1 --> W
    U2 --> SMS
    U2 --> USSD
    U3 --> ADM

    W --> API
    ADM --> API
    SMS --> API
    USSD --> API

    API --> WF
    API --> CHAT
    API --> SOS
    API --> RES
    API --> EVAL

    WF --> PG
    CHAT --> PG
    SOS --> PG
    RES --> PG
    API --> CURATED
    API --> RUNTIME

    CHAT --> OAI
    CHAT --> GEM
    SMS --> AT
    SMS --> TW
    USSD --> AT
    SOS --> MAPS
    W --> MAPS
```

## Component Notes

- **Web UI** is the primary rich interface for multilingual workflow selection, structured reporting, chat, SOS, and nearby-help actions.
- **SMS** provides low-connectivity free-text intake for urgent peace and accountability questions.
- **USSD** provides a guided feature-phone flow for start-report, follow-up, rights-help, and emergency handling.
- **FastAPI** is the central application layer that serves the frontend, admin pages, JSON APIs, and telco callback routes.
- **Postgres** is the main system of record for workflow, reporting, chat, SOS, and USSD session data.
- **Curated local sources** ground the bot and workflow logic in approved internal material before optional public-model synthesis.
- **OpenAI / Gemini** are optional synthesis layers, not the authoritative source base.
- **Africa's Talking / Twilio** act as delivery gateways for low-connectivity channels.

## Submission Summary

The architecture is intentionally multi-channel:

1. **Web** for richer interaction and review
2. **SMS** for low-bandwidth free-text outreach
3. **USSD** for structured guided interaction on basic phones
4. **Admin** for protected oversight and verification

This supports the capstone goal of lowering the cost and risk of civic participation in fragile environments while preserving grounded accountability workflows.
