# Frontend — Figus 2026

React + Vite + Tailwind + PWA.

**Documentación:** [../docs/DEVELOPMENT.md](../docs/DEVELOPMENT.md) · [../docs/RUNBOOK.md](../docs/RUNBOOK.md) (PWA)

## Arranque local

```bash
npm install
cp .env.example .env
npm run dev
```

`VITE_API_URL=http://localhost:8000`

## Build producción

```bash
npm run build
# VITE_API_URL vacío → API en /api del mismo dominio
```

## PWA

- Manifest y SW: `vite.config.ts`
- Registro SW: `src/main.tsx` (solo producción)
- Instalación UX: `PwaInstallContext`, `InstallHelpModal`, botón en `Layout`

**Importante:** `nginx.conf` debe incluir `mime.types` completos (ver RUNBOOK).

## Banderas

`utils/teamFlags.ts` + `TeamLabel.tsx` — PNG flagcdn, no emojis.

## Búsqueda

`utils/searchTeams.ts` — filtro en `TeamsPage.tsx`.
