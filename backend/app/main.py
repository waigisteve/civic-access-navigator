from __future__ import annotations

from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from backend.app.config import settings
from backend.app.routes import register_routes
from backend.app.services.resource_service import ResourceItem, get_resource_items


BASE_DIR = Path(__file__).resolve().parents[1]
STATIC_DIR = BASE_DIR / "static"
PROJECT_ROOT = BASE_DIR.parent

app = FastAPI(title="Civic Access Navigator", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/project")
def project() -> dict[str, object]:
    return {
        "name": "Civic Access Navigator",
        "partner_alignment": "Open Society Foundations",
        "mission_focus": [
            "Rights and Dignity",
            "Democratic Practice",
            "Equity in Governance",
        ],
        "summary": (
            "An AI-assisted civic information platform that helps users discover, "
            "understand, and organize trusted public-interest resources."
        ),
    }


@app.get("/api/resources")
def list_resources() -> dict[str, list[ResourceItem]]:
    return {"items": get_resource_items()}


@app.get("/files/{file_path:path}")
def project_file(file_path: str) -> FileResponse:
    return FileResponse(PROJECT_ROOT / file_path)


@app.get("/")
def index() -> FileResponse:
    return FileResponse(STATIC_DIR / "index.html")


register_routes(app)
app.mount("/", StaticFiles(directory=STATIC_DIR), name="static")


def run() -> None:
    import uvicorn

    uvicorn.run(
        "backend.app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.reload,
    )


if __name__ == "__main__":
    run()
