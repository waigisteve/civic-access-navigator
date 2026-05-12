from datetime import datetime

from backend.app.health import health_status


def test_health_status_contains_module_version_and_timestamp() -> None:
    payload = health_status()

    assert payload["module"] == "civic-access-navigator"
    assert "version" in payload
    assert isinstance(payload["version"], str)
    assert payload["version"]
    assert "timestamp" in payload
    assert datetime.fromisoformat(payload["timestamp"])
