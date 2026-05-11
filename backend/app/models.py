from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.db import Base


class WorkflowScenario(Base):
    __tablename__ = "workflow_scenarios"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    code: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(255))
    summary: Mapped[str] = mapped_column(Text)

    incidents: Mapped[list["WorkflowIncident"]] = relationship(
        back_populates="scenario",
        cascade="all, delete-orphan",
        order_by="WorkflowIncident.id",
    )


class WorkflowIncident(Base):
    __tablename__ = "workflow_incidents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    scenario_id: Mapped[int] = mapped_column(ForeignKey("workflow_scenarios.id", ondelete="CASCADE"))
    code: Mapped[str] = mapped_column(String(64), index=True)
    title: Mapped[str] = mapped_column(String(255))
    summary: Mapped[str] = mapped_column(Text)
    risk_level: Mapped[str] = mapped_column(String(32))
    region: Mapped[str] = mapped_column(String(64))

    scenario: Mapped["WorkflowScenario"] = relationship(back_populates="incidents")
    source_links: Mapped[list["WorkflowSourceLink"]] = relationship(
        back_populates="incident",
        cascade="all, delete-orphan",
        order_by="WorkflowSourceLink.id",
    )
    action_points: Mapped[list["WorkflowActionPoint"]] = relationship(
        back_populates="incident",
        cascade="all, delete-orphan",
        order_by="WorkflowActionPoint.priority",
    )


class WorkflowSourceLink(Base):
    __tablename__ = "workflow_source_links"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    incident_id: Mapped[int] = mapped_column(ForeignKey("workflow_incidents.id", ondelete="CASCADE"))
    source_id: Mapped[str] = mapped_column(String(128), index=True)
    title: Mapped[str] = mapped_column(String(255))
    url: Mapped[str] = mapped_column(String(1024))
    rationale: Mapped[str] = mapped_column(Text)

    incident: Mapped["WorkflowIncident"] = relationship(back_populates="source_links")


class WorkflowActionPoint(Base):
    __tablename__ = "workflow_action_points"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    incident_id: Mapped[int] = mapped_column(ForeignKey("workflow_incidents.id", ondelete="CASCADE"))
    code: Mapped[str] = mapped_column(String(64), index=True)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)
    channel: Mapped[str] = mapped_column(String(64))
    priority: Mapped[int] = mapped_column(Integer)

    incident: Mapped["WorkflowIncident"] = relationship(back_populates="action_points")


class WorkflowReport(Base):
    __tablename__ = "workflow_reports"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    scenario_code: Mapped[str] = mapped_column(String(64), index=True)
    incident_code: Mapped[str] = mapped_column(String(64), index=True)
    action_code: Mapped[str] = mapped_column(String(64), index=True)
    action_title: Mapped[str] = mapped_column(String(255))
    report_text: Mapped[str] = mapped_column(Text)
    location_text: Mapped[str] = mapped_column(String(255), nullable=True)
    event_time: Mapped[str] = mapped_column(String(64), nullable=True)
    denied_item: Mapped[str] = mapped_column(String(255), nullable=True)
    requested_action: Mapped[str] = mapped_column(Text, nullable=True)
    contact_preference: Mapped[str] = mapped_column(String(64), default="anonymous")
    submitter_alias: Mapped[str] = mapped_column(String(255), nullable=True)
    region: Mapped[str] = mapped_column(String(64), nullable=True)
    language: Mapped[str] = mapped_column(String(16), nullable=True)
    safe_mode: Mapped[bool] = mapped_column(Boolean, default=False)
    lite_mode: Mapped[bool] = mapped_column(Boolean, default=False)
    status: Mapped[str] = mapped_column(String(64), default="submitted")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class ChatRecord(Base):
    __tablename__ = "chat_records"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    session_id: Mapped[str] = mapped_column(String(128), index=True)
    user_message: Mapped[str] = mapped_column(Text)
    answer_text: Mapped[str] = mapped_column(Text)
    citations_json: Mapped[str] = mapped_column(Text, default="[]")
    provider: Mapped[str] = mapped_column(String(64), default="local")
    mode: Mapped[str] = mapped_column(String(64), default="fallback")
    region: Mapped[str] = mapped_column(String(64), nullable=True)
    scenario_code: Mapped[str] = mapped_column(String(64), nullable=True)
    incident_code: Mapped[str] = mapped_column(String(64), nullable=True)
    language: Mapped[str] = mapped_column(String(16), nullable=True)
    safe_mode: Mapped[bool] = mapped_column(Boolean, default=False)
    lite_mode: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class SosRequest(Base):
    __tablename__ = "sos_requests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    channel: Mapped[str] = mapped_column(String(64), index=True)
    note: Mapped[str] = mapped_column(Text, nullable=True)
    location_text: Mapped[str] = mapped_column(String(255), nullable=True)
    region: Mapped[str] = mapped_column(String(64), nullable=True)
    language: Mapped[str] = mapped_column(String(16), nullable=True)
    scenario_code: Mapped[str] = mapped_column(String(64), nullable=True)
    incident_code: Mapped[str] = mapped_column(String(64), nullable=True)
    safe_mode: Mapped[bool] = mapped_column(Boolean, default=False)
    lite_mode: Mapped[bool] = mapped_column(Boolean, default=False)
    status: Mapped[str] = mapped_column(String(64), default="opened")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
