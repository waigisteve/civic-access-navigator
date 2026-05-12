from __future__ import annotations

from datetime import datetime, timezone
from importlib.metadata import PackageNotFoundError, version


PACKAGE_NAME = "civic-access-navigator"


def health_status() -> dict[str, str]:
    try:
        package_version = version(PACKAGE_NAME)
    except PackageNotFoundError:
        package_version = "unknown"

    return {
        "module": PACKAGE_NAME,
        "version": package_version,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
