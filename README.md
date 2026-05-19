# Figus 2026

Álbum de figuritas Mundial 2026 — app fullstack mobile-first con PWA opcional.

**Producción:** https://figus.lionapp.cloud

---

## Documentación

| Documento | Para qué |
|-----------|----------|
| **[docs/FIGUS.md](docs/FIGUS.md)** | Especificación, decisiones, API, modelo de datos |
| **[docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)** | Desarrollo: estructura, comandos, cómo agregar features |
| **[docs/RUNBOOK.md](docs/RUNBOOK.md)** | Deploy VPS, PWA (Android/iOS/Windows), nginx, problemas frecuentes |

> Antes de cambiar código o producto, leé/actualizá el doc que corresponda.

---

## Stack

- **Frontend:** React, Tailwind, Vite, PWA (vite-plugin-pwa)
- **Backend:** FastAPI, SQLAlchemy, Alembic, JWT, bcrypt
- **DB:** PostgreSQL
- **Deploy:** Docker + Traefik (VPS Hostinger) · GHCR `lelion13`

---

## Quick start

```bash
cp .env.example .env
# Editar JWT_SECRET

docker compose up --build
```

| Servicio | URL |
|----------|-----|
| App | http://localhost:5173 |
| API | http://localhost:8000 |
| Docs API | http://localhost:8000/docs |

Sin Docker: ver [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

---

## Tests

```bash
cd backend
pip install -r requirements.txt
python -m pytest
```

---

## Deploy

Imágenes: `ghcr.io/lelion13/figus-frontend`, `ghcr.io/lelion13/figus-backend`  
CI: push a `main` → `.github/workflows/docker-publish.yml`

Pasos en VPS: [docs/RUNBOOK.md](docs/RUNBOOK.md)

---

## Estado del proyecto

| Área | Estado |
|------|--------|
| Auth, catálogo, progreso, toggle | ✅ |
| Búsqueda en equipos | ✅ |
| Banderas (flagcdn + SVG especiales) | ✅ |
| PWA opcional + guía instalación | ✅ |
| Docker / GHCR / Traefik | ✅ |
| Documentación | ✅ |

---

## Datos

Catálogo desde `data/excel-control-album-panini-mundial-2026.xlsx` — no hardcodear figuritas.
