from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from sqlalchemy import select, text
from sqlalchemy.orm import selectinload

from backend.app.db import SessionLocal, database_configured, engine
from backend.app.models import (
    WorkflowActionPoint,
    WorkflowIncident,
    WorkflowReport,
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
    ensure_workflow_report_columns()
    seed_workflow_catalog()
    return True


def ensure_workflow_report_columns() -> None:
    if not workflow_database_ready():
        return
    statements = [
        "ALTER TABLE workflow_reports ADD COLUMN IF NOT EXISTS location_text VARCHAR(255)",
        "ALTER TABLE workflow_reports ADD COLUMN IF NOT EXISTS event_time VARCHAR(64)",
        "ALTER TABLE workflow_reports ADD COLUMN IF NOT EXISTS denied_item VARCHAR(255)",
        "ALTER TABLE workflow_reports ADD COLUMN IF NOT EXISTS requested_action TEXT",
    ]
    with engine.begin() as connection:
        for statement in statements:
            connection.execute(text(statement))


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


def create_workflow_report(payload: dict[str, Any]) -> dict[str, Any]:
    if not workflow_database_ready():
        raise RuntimeError("Workflow database is not configured")
    report = WorkflowReport(
        scenario_code=str(payload.get("scenario_code") or "").strip(),
        incident_code=str(payload.get("incident_code") or "").strip(),
        action_code=str(payload.get("action_code") or "").strip(),
        action_title=str(payload.get("action_title") or "").strip(),
        report_text=str(payload.get("report_text") or "").strip(),
        location_text=(str(payload.get("location_text")).strip() if payload.get("location_text") else None),
        event_time=(str(payload.get("event_time")).strip() if payload.get("event_time") else None),
        denied_item=(str(payload.get("denied_item")).strip() if payload.get("denied_item") else None),
        requested_action=(str(payload.get("requested_action")).strip() if payload.get("requested_action") else None),
        contact_preference=str(payload.get("contact_preference") or "anonymous").strip(),
        submitter_alias=(str(payload.get("submitter_alias")).strip() if payload.get("submitter_alias") else None),
        region=(str(payload.get("region")).strip() if payload.get("region") else None),
        language=(str(payload.get("language")).strip() if payload.get("language") else None),
        safe_mode=bool(payload.get("safe_mode")),
        lite_mode=bool(payload.get("lite_mode")),
        status=str(payload.get("status") or "submitted").strip(),
    )
    with SessionLocal() as session:
        session.add(report)
        session.commit()
        session.refresh(report)
        return {
            "id": report.id,
            "scenario_code": report.scenario_code,
            "incident_code": report.incident_code,
            "action_code": report.action_code,
            "action_title": report.action_title,
            "report_text": report.report_text,
            "location_text": report.location_text,
            "event_time": report.event_time,
            "denied_item": report.denied_item,
            "requested_action": report.requested_action,
            "contact_preference": report.contact_preference,
            "submitter_alias": report.submitter_alias,
            "region": report.region,
            "language": report.language,
            "safe_mode": report.safe_mode,
            "lite_mode": report.lite_mode,
            "status": report.status,
            "created_at": report.created_at.isoformat(),
        }


def list_workflow_reports(
    scenario_code: str | None = None,
    incident_code: str | None = None,
    limit: int = 50,
) -> list[dict[str, Any]]:
    if not workflow_database_ready():
        return []
    stmt = select(WorkflowReport).order_by(WorkflowReport.created_at.desc()).limit(max(1, min(limit, 200)))
    if scenario_code:
        stmt = stmt.where(WorkflowReport.scenario_code == scenario_code)
    if incident_code:
        stmt = stmt.where(WorkflowReport.incident_code == incident_code)
    with SessionLocal() as session:
        rows = session.execute(stmt).scalars().all()
        return [
            {
                "id": row.id,
                "scenario_code": row.scenario_code,
                "incident_code": row.incident_code,
                "action_code": row.action_code,
                "action_title": row.action_title,
                "report_text": row.report_text,
                "location_text": row.location_text,
                "event_time": row.event_time,
                "denied_item": row.denied_item,
                "requested_action": row.requested_action,
                "contact_preference": row.contact_preference,
                "submitter_alias": row.submitter_alias,
                "region": row.region,
                "language": row.language,
                "safe_mode": row.safe_mode,
                "lite_mode": row.lite_mode,
                "status": row.status,
                "created_at": row.created_at.isoformat(),
            }
            for row in rows
        ]
