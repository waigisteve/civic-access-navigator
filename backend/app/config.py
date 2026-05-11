from __future__ import annotations

import os
from dataclasses import dataclass

from dotenv import load_dotenv


load_dotenv()


def _normalize_database_url(value: str) -> str:
    url = value.strip()
    if url.startswith("postgresql://"):
        return "postgresql+psycopg://" + url[len("postgresql://") :]
    return url


@dataclass(frozen=True)
class Settings:
    app_name: str = "Civic Access Navigator"
    partner_name: str = "Open Society Foundations"
    host: str = os.getenv("APP_HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", os.getenv("APP_PORT", "8000")))
    reload: bool = os.getenv("APP_RELOAD", "1") == "1"
    database_url: str = _normalize_database_url(os.getenv("DATABASE_URL", ""))


settings = Settings()
