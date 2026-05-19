# Guía de desarrollo — Figus 2026

Guía práctica para seguir desarrollando la app. La especificación de producto está en [FIGUS.md](FIGUS.md).

**Última actualización:** 2026-05-19

---

## Documentación del repo

| Archivo | Contenido |
|---------|-----------|
| [FIGUS.md](FIGUS.md) | Spec, decisiones, API, modelo de datos, plan |
| [changes/](changes/) | Cambios SDD (proposal, spec delta, design, tasks) |
| [DEVELOPMENT.md](DEVELOPMENT.md) | Este archivo: flujo dev, archivos clave |
| [RUNBOOK.md](RUNBOOK.md) | Deploy, PWA, nginx, problemas frecuentes |
| [../README.md](../README.md) | Quick start |

---

## Requisitos

- Docker + Docker Compose (recomendado), o
- Node 20+, Python 3.12+, PostgreSQL 16

---

## Arranque rápido

```bash
cp .env.example .env
# Editar JWT_SECRET

docker compose up --build
```

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| API | http://localhost:8000 |
| OpenAPI | http://localhost:8000/docs |

### Sin Docker

**Backend** (desde `backend/`):

```bash
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

**Frontend** (desde `frontend/`):

```bash
npm install
cp .env.example .env
npm run dev
```

`frontend/.env`: `VITE_API_URL=http://localhost:8000`

---

## Estructura y responsabilidades

### Backend (`backend/app/`)

| Ruta | Rol |
|------|-----|
| `main.py` | FastAPI, CORS, lifespan (seed), routers `/api` |
| `api/routers/auth.py` | Registro, login |
| `api/routers/stickers.py` | Catálogo, progreso, toggle |
| `core/config.py` | Variables de entorno (Pydantic Settings) |
| `core/security.py` | bcrypt, JWT |
| `core/deps.py` | `get_current_user` |
| `models/` | SQLAlchemy: User, Sticker, UserSticker |
| `schemas/` | Pydantic request/response |
| `services/` | Lógica de negocio |
| `seed/excel_parser.py` | Parseo del Excel (fuente de verdad) |
| `seed/seed_stickers.py` | Insert si `stickers` vacía al arrancar |

**Migraciones:** `backend/alembic/` — `alembic upgrade head` (Docker lo ejecuta al iniciar).

**Tests:** `backend/tests/` — `python -m pytest` desde `backend/`.

### Frontend (`frontend/src/`)

| Ruta | Rol |
|------|-----|
| `pages/LoginPage.tsx`, `RegisterPage.tsx` | Auth |
| `pages/TeamsPage.tsx` | Lista equipos + búsqueda + Faltan + banner PWA |
| `pages/MissingPage.tsx` | Listado agrupado `/faltan` |
| `pages/TeamGridPage.tsx` | Grid figuritas + toggle optimista |
| `components/Layout.tsx` | Header Salir/Faltan/Instalar o Volver |
| `components/MissingChoiceModal.tsx` | Modal pantalla vs WhatsApp |
| `components/TeamLabel.tsx` | Bandera + nombre equipo |
| `components/ProgressBar.tsx` | Total / obtenidas / faltan / % |
| `components/InstallPrompt.tsx` | Cartel opcional (7 días si “Ahora no”) |
| `components/InstallHelpModal.tsx` | Guía instalación por plataforma |
| `hooks/PwaInstallContext.tsx` | `beforeinstallprompt` compartido |
| `hooks/useAuth.tsx` | Token en `localStorage` |
| `services/api.ts` | Cliente HTTP |
| `utils/teamFlags.ts` | Códigos ISO → imágenes flagcdn |
| `utils/searchTeams.ts` | Filtro búsqueda en `/equipos` |
| `utils/pwaInstall.ts` | Detección plataforma, dismiss banner |
| `utils/shareMissing.ts` | Formato y envío WhatsApp / portapapeles |

**PWA:** `vite-plugin-pwa` en `vite.config.ts`; registro SW en `main.tsx` (solo `PROD`).

**Assets:** `frontend/public/icons/` — íconos PWA y SVG FWC/Coca Cola.

---

## Features implementadas (post-MVP)

### Búsqueda en `/equipos`

- Input sin botón; filtra al tipear.
- Coincide: nombre de equipo (sin tildes), código (`ARG1`), número (`10`).
- Archivo: `utils/searchTeams.ts`.

### Banderas

- **No usar emojis** de bandera (en Windows/Edge no se ven).
- Imágenes PNG vía [flagcdn.com](https://flagcdn.com): `utils/teamFlags.ts` + `TeamLabel.tsx`.
- FWC / Coca Cola: SVG locales en `public/icons/`.
- Requiere red la primera vez (CDN). Para offline total: hostear PNG en `public/flags/`.

### PWA (opcional para el usuario)

- La app **funciona siempre en el navegador**.
- Instalar es opcional; botón verde **Instalar** en header siempre visible (si no está ya instalada).
- Ver [RUNBOOK.md § PWA](RUNBOOK.md#pwa-instalación-por-plataforma).

### Listado Faltan

- Botón **Faltan** solo en `/equipos` (no en grid de país).
- Spec delta: [changes/add-faltan-listado/](changes/add-faltan-listado/).
- Backend: `GET /api/me/missing` — figurita falta si no hay fila `user_stickers` o `owned=false`.

---

## Variables de entorno

Ver `.env.example` (raíz) y `frontend/.env.example`.

| Variable | Dónde | Notas |
|----------|-------|-------|
| `DATABASE_URL` | backend | `postgresql+psycopg://...` |
| `JWT_SECRET` | backend | Obligatorio en prod |
| `JWT_EXPIRE_MINUTES` | backend | Default `10080` (7 días) |
| `CORS_ORIGINS` | backend | Orígenes separados por coma |
| `STICKERS_EXCEL_PATH` | backend | Ruta al xlsx en contenedor |
| `VITE_API_URL` | build frontend | Dev: `http://localhost:8000` · Prod: vacío |

---

## Comandos útiles

```bash
# Tests backend
cd backend && python -m pytest

# Build frontend
cd frontend && npm run build

# Build imágenes
docker build -f backend/Dockerfile -t ghcr.io/lelion13/figus-backend:latest .
docker build -f frontend/Dockerfile --build-arg VITE_API_URL= -t ghcr.io/lelion13/figus-frontend:latest .

# Nueva migración
cd backend && alembic revision --autogenerate -m "descripcion"
```

---

## Cómo agregar una feature

1. Crear carpeta en `docs/changes/<nombre-cambio>/` con `proposal.md`, `spec.md`, `design.md`, `tasks.md` (SDD).
2. Actualizar [FIGUS.md](FIGUS.md) (decisión + API si aplica).
3. Backend: schema → service → router → test.
4. Frontend: `api.ts` → página/componente.
5. Si afecta deploy: [RUNBOOK.md](RUNBOOK.md) y `docker-compose.prod.yml`.
6. Correr tests y `npm run build`.

---

## Catálogo de figuritas

- **No** hardcodear códigos en código.
- Cambiar Excel → reiniciar backend con DB vacía en `stickers` **o** script de re-seed (no hay UI admin).
- En producción: backup DB antes de reimportar.

---

## Enlaces

- Producción: https://figus.lionapp.cloud
- Imágenes: `ghcr.io/lelion13/figus-frontend`, `ghcr.io/lelion13/figus-backend`
- CI: `.github/workflows/docker-publish.yml` (push a `main`)
