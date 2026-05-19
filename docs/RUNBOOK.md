# Runbook — Figus 2026

Operación, deploy y resolución de problemas en producción.

**Última actualización:** 2026-05-16

---

## VPS Hostinger

| Dato | Valor |
|------|--------|
| IP | `177.7.37.78` |
| Dominio | `figus.lionapp.cloud` |
| Ruta deploy | `/docker/app-figus/` |
| Traefik | Proyecto `traefik-wpez`, `network_mode: host` |
| **Sin** red Docker `traefik` externa | Solo labels en compose |

---

## Deploy / actualizar

```bash
cd /docker/app-figus
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

Variables en `.env` (ver `.env.example`). **No** reutilizar secretos de otras apps.

### Build y push manual (GHCR)

```bash
# Desde la raíz del repo
docker build -f backend/Dockerfile -t ghcr.io/lelion13/figus-backend:latest .
docker build -f frontend/Dockerfile --build-arg VITE_API_URL= -t ghcr.io/lelion13/figus-frontend:latest .
docker push ghcr.io/lelion13/figus-backend:latest
docker push ghcr.io/lelion13/figus-frontend:latest
```

GitHub Actions (`.github/workflows/docker-publish.yml`) pushea en push a `main`.

---

## Nginx frontend — CRÍTICO

Archivo: `frontend/nginx.conf`

**Debe incluir** `include /etc/nginx/mime.types;`

Un bloque `types { ... }` **parcial** reemplaza todos los MIME por defecto. Sin ellos, `.js` se sirve como `application/octet-stream` y **Android descarga archivos** en lugar de ejecutar la app.

Solo usar `default_type` puntual para `manifest.webmanifest`:

```nginx
location = /manifest.webmanifest {
    default_type application/manifest+json;
    ...
}
```

---

## PWA: instalación por plataforma

La app funciona **siempre en el navegador**. Instalar es **opcional**.

### Windows / Edge / Chrome (escritorio)

- Ícono “Instalar” en la barra de direcciones, o
- Menú → Aplicaciones → Instalar Figus 2026
- En la app: botón verde **Instalar** en el header

### Android

1. Abrir **Chrome** (no Instagram/WhatsApp in-app browser).
2. Ir a `https://figus.lionapp.cloud`
3. Tocar **Instalar** en el header de la app, o
4. Menú **⋮** → **Instalar aplicación** / **Agregar a pantalla de inicio**

Si no aparece “Instalar aplicación”: borrar datos del sitio en Chrome y reintentar.

### iPhone / iPad

1. Abrir en **Safari** (no Chrome en iOS para agregar a inicio).
2. Tocar **Instalar** en el header → seguir pasos, o
3. **Compartir** (□↑) → **Agregar a pantalla de inicio** → **Agregar**

No hay popup automático permanente en iOS; es comportamiento del sistema.

### Cartel “Ahora no”

- Oculta el cartel **7 días** (`figus-install-banner-until` en localStorage).
- El botón **Instalar** del header **sigue disponible**.

### Limpiar caché / SW roto

Si la app “descarga archivos” o no carga:

1. Chrome → Configuración del sitio → **Borrar datos**
2. Redeploy frontend con `nginx.conf` correcto
3. Recargar con HTTPS

---

## Traefik (labels)

Frontend: `Host(figus.lionapp.cloud)` → puerto 80  
Backend: `Host(...) && PathPrefix(/api)` → puerto 8000, priority 100

Cert resolver: `letsencrypt`  
Entrypoint: `websecure`

---

## Health checks

| Servicio | Endpoint |
|----------|----------|
| Backend | `GET /health` (interno) |
| Frontend | `GET /` (nginx) |

---

## Logs

```bash
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f frontend
docker compose -f docker-compose.prod.yml logs -f db
```

---

## Base de datos

- Volumen: `db_data`
- Backup antes de cambios destructivos en `stickers`
- Seed automático solo si `stickers` está **vacía** al arrancar backend

---

## Checklist post-deploy

- [ ] https://figus.lionapp.cloud carga la SPA (no descarga .js)
- [ ] Registro / login OK
- [ ] Lista equipos + búsqueda + banderas visibles en Edge y móvil
- [ ] Toggle figurita actualiza progreso
- [ ] `/api/health` vía Traefik (opcional: curl con Host header)
- [ ] Botón Instalar muestra guía en móvil

---

## Contacto con la spec

Cambios de producto → [FIGUS.md](FIGUS.md)  
Cambios de código → [DEVELOPMENT.md](DEVELOPMENT.md)
