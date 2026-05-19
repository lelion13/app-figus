# Figus 2026 — Guía para agentes / IA

Antes de implementar cambios, leer:

1. [docs/FIGUS.md](docs/FIGUS.md) — spec y decisiones de producto
2. [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) — estructura del código y flujo dev
3. [docs/RUNBOOK.md](docs/RUNBOOK.md) — deploy, PWA, nginx (no romper MIME types)
4. Cambios en curso: `docs/changes/<id>/` (proposal, spec, design, tasks — SDD)

## Reglas del proyecto

- Stack: React + Tailwind · FastAPI + Pydantic · PostgreSQL · JWT · bcrypt
- Catálogo solo desde Excel en `data/` — no hardcodear figuritas
- Mobile-first; español AR/LATAM
- PWA opcional; navegador siempre debe funcionar
- Banderas: imágenes (flagcdn), no emojis
- `frontend/nginx.conf`: incluir `mime.types` completo
- No agregar features fuera de spec sin actualizar FIGUS.md

## Comandos

```bash
docker compose up --build
cd backend && python -m pytest
cd frontend && npm run build
```
