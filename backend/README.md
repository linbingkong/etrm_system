# Backend

FastAPI backend workspace for the electricity trading decision support system.

## Stack

- FastAPI
- Pydantic v2
- PostgreSQL / TimescaleDB
- Redis
- pytest

## Commands

```bash
python -m venv .venv
.venv/Scripts/pip install -r requirements.txt
.venv/Scripts/uvicorn app.main:app --reload
pytest
python -m py_compile app/main.py
```

## Structure

- `app/api/`: HTTP route definitions.
- `app/core/`: configuration, security, and shared infrastructure.
- `app/models/`: persistence and domain models.
- `app/schemas/`: Pydantic request and response schemas.
- `app/services/`: business services grouped by domain.
- `tests/`: backend tests.

## Health Checks

- `GET /health`
- `GET /api/v1/health`

## Menu APIs

- `GET /api/v1/menus/tree`
- `GET /api/v1/menus/flat`
- `GET /api/v1/menus/button-permissions`

Menu data is currently static seed data in `app/services/menu_seed.py`. Keep codes and paths aligned with `docs/山东电力交易辅助决策系统-菜单规划.md`.
