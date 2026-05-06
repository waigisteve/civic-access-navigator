from __future__ import annotations

import os
from dataclasses import dataclass

from dotenv import load_dotenv


load_dotenv()


@dataclass(frozen=True)
class Settings:
    app_name: str = "Civic Access Navigator"
    partner_name: str = "Open Society Foundations"
    host: str = os.getenv("APP_HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", os.getenv("APP_PORT", "8000")))
    reload: bool = os.getenv("APP_RELOAD", "1") == "1"


settings = Settings()
