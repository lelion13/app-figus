# Figus 2026

Álbum de figuritas Mundial 2026 — app fullstack mobile-first con PWA.

**Especificación completa:** [docs/FIGUS.md](docs/FIGUS.md)

## Stack

- **Frontend:** React, Tailwind, Vite, PWA
- **Backend:** FastAPI, SQLAlchemy, Alembic, JWT, bcrypt
- **DB:** PostgreSQL
- **Deploy:** Docker + Traefik en VPS Hostinger

## Desarrollo local

### Con Docker (recomendado)

```bash
cp .env.example .env
# Editar JWT_SECRET en .env

docker compose up --build
```

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| API | http://localhost:8000 |
| API docs | http://localhost:8000/docs |

### Sin Docker

**Backend:**

```bash
cd backend
pip install -r requirements.txt
# Postgres corriendo + DATABASE_URL en .env
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

**Frontend:**

```bash
cd frontend
npm install
# Crear frontend/.env con VITE_API_URL=http://localhost:8000
npm run dev
```

## Tests

```bash
cd backend
pip install -r requirements.txt
pytest
```

## Build imágenes Docker

```bash
docker build -f backend/Dockerfile -t ghcr.io/lelion13/figus-backend:latest .
docker build -f frontend/Dockerfile --build-arg VITE_API_URL= -t ghcr.io/lelion13/figus-frontend:latest .
```

## Deploy en VPS (Hostinger)

1. Crear directorio `/docker/app-figus/` en el VPS.
2. Copiar `docker-compose.prod.yml` y `.env` (secretos nuevos).
3. DNS: `figus.lionapp.cloud` → IP del VPS (`177.7.37.78`).
4. Variables mínimas en `.env`:

```env
POSTGRES_DB=figus
POSTGRES_USER=figus
POSTGRES_PASSWORD=<secreto>
DATABASE_URL=postgresql+psycopg://figus:<secreto>@db:5432/figus
JWT_SECRET=<secreto-largo>
JWT_EXPIRE_MINUTES=10080
CORS_ORIGINS=https://figus.lionapp.cloud
IMAGE_TAG=latest
```

5. Publicar imágenes (push a `main` dispara GitHub Actions) o build manual en el VPS.
6. Desplegar:

```bash
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

Traefik en el VPS usa `network_mode: host` (proyecto `traefik-wpez`). **No** hace falta red Docker externa; los labels en `docker-compose.prod.yml` alcanzan.

## GHCR

- `ghcr.io/lelion13/figus-backend`
- `ghcr.io/lelion13/figus-frontend`

Workflow: `.github/workflows/docker-publish.yml` (push a `main`).

## Estado

| Fase | Estado |
|------|--------|
| Documentación | ✅ |
| Backend | ✅ |
| Frontend | ✅ |
| PWA | ✅ |
| Docker / GHCR | ✅ |
| Deploy VPS | Manual (ver arriba) |
