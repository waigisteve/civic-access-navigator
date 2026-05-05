from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
    app_name: str = "Civic Access Navigator"
    partner_name: str = "Open Society Foundations"


settings = Settings()
