# Backend — Figus API

FastAPI + SQLAlchemy + Alembic.

**Documentación:** [../docs/DEVELOPMENT.md](../docs/DEVELOPMENT.md) · [../docs/FIGUS.md](../docs/FIGUS.md)

## Arranque local

```bash
pip install -r requirements.txt
export DATABASE_URL=postgresql+psycopg://figus:figus@localhost:5432/figus
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

## Tests

```bash
python -m pytest
```

## Estructura

- `app/api/routers/` — endpoints HTTP
- `app/services/` — lógica de negocio
- `app/seed/` — parser Excel + seed al startup
- `alembic/versions/` — migraciones

## Seed de figuritas

Al arrancar, si `stickers` está vacía, importa desde `STICKERS_EXCEL_PATH` (default: `data/excel-control-album-panini-mundial-2026.xlsx` en Docker: `/app/data/...`).
