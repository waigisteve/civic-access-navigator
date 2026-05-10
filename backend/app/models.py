from __future__ import annotations

from sqlalchemy import ForeignKey, Integer, String, Text
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
