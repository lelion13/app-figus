# Proposal: Listado «Faltan» (pantalla + WhatsApp)

**Change ID:** `add-faltan-listado`  
**Estado:** Aprobado para implementación  
**Fecha:** 2026-05-16

## Intent

Permitir al usuario ver y compartir todas las figuritas que le faltan, agrupadas por país, desde `/equipos`.

## Alcance

- Botón **Faltan** en header de `/equipos` (Salir · Faltan · Instalar).
- Modal: Ver en pantalla / Compartir por WhatsApp / Cancelar.
- Pantalla `/faltan` con listado completo.
- Endpoint `GET /api/me/missing`.
- WhatsApp con fallback a portapapeles si mensaje largo o falla apertura.

## Fuera de alcance

- Faltan en grid de país.
- Editar mensaje antes de enviar.
- Otros canales (Telegram, email).

## Enlaces

- [spec.md](spec.md)
- [design.md](design.md)
- [tasks.md](tasks.md)
