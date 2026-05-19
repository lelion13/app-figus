# Design: add-faltan-listado

## Backend

### `GET /api/me/missing`

Query con `LEFT JOIN` stickers ↔ user_stickers (filtrado por `user_id`), conservando stickers donde `user_sticker.id IS NULL OR owned = false`, orden `sticker.id`.

Agrupación en Python con `OrderedDict` por `team`; códigos ordenados por `sticker.number`.

### Schemas

```python
class MissingTeamGroup(BaseModel):
    team: str
    codes: list[str]

class MissingStickersResponse(BaseModel):
    total_missing: int
    teams: list[MissingTeamGroup]
```

## Frontend

```
TeamsPage
  → tap Faltan
  → (missing=0) toast/banner álbum completo
  → MissingChoiceModal
       → navigate /faltan
       → shareMissingWhatsApp(data)

MissingPage
  → GET /api/me/missing
  → lista con TeamLabel + códigos

Layout
  → prop onFaltan?: () => void
```

### `utils/shareMissing.ts`

- `formatMissingMessage(teams)` → string
- `shareMissingList(teams)` → Web Share API (texto) → wa.me si corto → Web Share (archivo `.txt`) → portapapeles

Constante `WHATSAPP_URL_TEXT_LIMIT = 2000` (solo para enlaces `wa.me`).

## Sin cambios

- Modelos DB, migraciones, PWA, nginx, Traefik.
