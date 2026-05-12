from datetime import datetime

from fastapi.testclient import TestClient

from backend.app.main import app


client = TestClient(app)


def test_health_endpoint() -> None:
    response = client.get("/api/health")
    payload = response.json()

    assert response.status_code == 200
    assert payload["status"] == "ok"
    assert payload["module"] == "civic-access-navigator"
    assert "version" in payload
    assert "timestamp" in payload
    assert datetime.fromisoformat(payload["timestamp"])


def test_resources_endpoint_uses_sample_data() -> None:
    response = client.get("/api/resources")
    payload = response.json()

    assert response.status_code == 200
    assert len(payload["items"]) >= 1
    assert payload["items"][0]["title"] == "Know Your Civic Rights"
