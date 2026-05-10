from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import selectinload

from backend.app.db import SessionLocal, database_configured, engine
from backend.app.models import (
    WorkflowActionPoint,
    WorkflowIncident,
    WorkflowScenario,
    WorkflowSourceLink,
)


CATALOG_PATH = Path(__file__).resolve().parents[3] / "data" / "curated" / "incident_workflow_catalog.json"


def workflow_database_ready() -> bool:
    return database_configured()


def _load_catalog() -> dict[str, Any]:
    return json.loads(CATALOG_PATH.read_text(encoding="utf-8"))


def initialize_workflow_database() -> bool:
    if not workflow_database_ready():
        return False
    from backend.app.db import Base  # local import to ensure model registration
    import backend.app.models  # noqa: F401

    Base.metadata.create_all(bind=engine)
    seed_workflow_catalog()
    return True


def seed_workflow_catalog() -> None:
    if not workflow_database_ready():
        return
    catalog = _load_catalog()
    with SessionLocal() as session:
        existing = session.execute(select(WorkflowScenario.id)).first()
        if existing:
            return

        for scenario_payload in catalog.get("scenarios", []):
            scenario = WorkflowScenario(
                code=scenario_payload["code"],
                title=scenario_payload["title"],
                summary=scenario_payload["summary"],
            )
            for incident_payload in scenario_payload.get("incidents", []):
                incident = WorkflowIncident(
                    code=incident_payload["code"],
                    title=incident_payload["title"],
                    summary=incident_payload["summary"],
                    risk_level=incident_payload["risk_level"],
                    region=incident_payload["region"],
                )
                for source_payload in incident_payload.get("sources", []):
                    incident.source_links.append(
                        WorkflowSourceLink(
                            source_id=source_payload["source_id"],
                            title=source_payload["title"],
                            url=source_payload["url"],
                            rationale=source_payload["rationale"],
                        )
                    )
                for action_payload in incident_payload.get("actions", []):
                    incident.action_points.append(
                        WorkflowActionPoint(
                            code=action_payload["code"],
                            title=action_payload["title"],
                            description=action_payload["description"],
                            channel=action_payload["channel"],
                            priority=action_payload["priority"],
                        )
                    )
                scenario.incidents.append(incident)
            session.add(scenario)
        session.commit()


def _serialize_incident(incident: WorkflowIncident) -> dict[str, Any]:
    return {
        "code": incident.code,
        "title": incident.title,
        "summary": incident.summary,
        "risk_level": incident.risk_level,
        "region": incident.region,
        "sources": [
            {
                "source_id": link.source_id,
                "title": link.title,
                "url": link.url,
                "rationale": link.rationale,
            }
            for link in incident.source_links
        ],
        "action_points": [
            {
                "code": action.code,
                "title": action.title,
                "description": action.description,
                "channel": action.channel,
                "priority": action.priority,
            }
            for action in incident.action_points
        ],
    }


def list_workflow_scenarios() -> list[dict[str, Any]]:
    if not workflow_database_ready():
        return []
    with SessionLocal() as session:
        rows = session.execute(
            select(WorkflowScenario).options(selectinload(WorkflowScenario.incidents))
        ).scalars().all()
        return [
            {
                "code": row.code,
                "title": row.title,
                "summary": row.summary,
                "incidents": [
                    {
                        "code": incident.code,
                        "title": incident.title,
                        "summary": incident.summary,
                        "risk_level": incident.risk_level,
                        "region": incident.region,
                    }
                    for incident in row.incidents
                ],
            }
            for row in rows
        ]


def get_workflow_incident(scenario_code: str, incident_code: str) -> dict[str, Any] | None:
    if not workflow_database_ready():
        return None
    with SessionLocal() as session:
        scenario = session.execute(
            select(WorkflowScenario)
            .where(WorkflowScenario.code == scenario_code)
            .options(
                selectinload(WorkflowScenario.incidents).selectinload(WorkflowIncident.source_links),
                selectinload(WorkflowScenario.incidents).selectinload(WorkflowIncident.action_points),
            )
        ).scalar_one_or_none()
        if not scenario:
            return None
        incident = next((item for item in scenario.incidents if item.code == incident_code), None)
        if not incident:
            return None
        return {
            "scenario": {
                "code": scenario.code,
                "title": scenario.title,
                "summary": scenario.summary,
            },
            "incident": _serialize_incident(incident),
        }
