# Spec delta: add-faltan-listado

## ADDED Requirements

### Requirement: Botón Faltan en equipos

El sistema SHALL mostrar un botón **Faltan** en el header de `/equipos`, entre **Salir** e **Instalar**, solo en esa pantalla.

#### Scenario: Usuario en lista de equipos

- **WHEN** el usuario autenticado está en `/equipos`
- **THEN** ve los botones Salir, Faltan e Instalar (si aplica) en ese orden

#### Scenario: Usuario en grid de país

- **WHEN** el usuario está en `/equipos/:team`
- **THEN** no ve el botón Faltan (solo Volver)

---

### Requirement: Álbum completo

Si el usuario no le falta ninguna figurita, el sistema SHALL mostrar «¡Completaste el álbum!» y SHALL NOT abrir el modal de opciones.

#### Scenario: Cero faltantes

- **WHEN** el usuario toca Faltan y `missing === 0`
- **THEN** se muestra el mensaje de álbum completo

---

### Requirement: Elección pantalla o WhatsApp

Si hay faltantes, el sistema SHALL mostrar un modal con: **Ver en pantalla**, **Compartir por WhatsApp**, **Cancelar**.

#### Scenario: Modal de opciones

- **WHEN** el usuario toca Faltan y `missing > 0`
- **THEN** aparece el modal con las tres acciones

---

### Requirement: Listado en pantalla

Al elegir «Ver en pantalla», el sistema SHALL navegar a `/faltan` y mostrar una línea por país con faltantes: bandera + `PAÍS: COD1, COD2, …` (códigos ordenados por `number` dentro del equipo). Orden de países: catálogo Excel. Al final: botón para volver a `/equipos`.

#### Scenario: Pantalla faltantes

- **WHEN** el usuario elige Ver en pantalla
- **THEN** ve `/faltan` con el listado agrupado y puede volver a equipos

---

### Requirement: Compartir por WhatsApp

Al elegir WhatsApp, el mensaje SHALL comenzar con:

`*Me faltan estas figuritas (Figus 2026):*`

seguido de líneas `PAÍS: COD1, COD2, …`. Si el mensaje tiene menos de ~3000 caracteres, SHALL intentar abrir WhatsApp (`wa.me`). Si no, o si falla la apertura, SHALL copiar al portapapeles y avisar al usuario.

#### Scenario: Mensaje corto

- **WHEN** el texto formateado tiene menos de 3000 caracteres
- **THEN** se intenta abrir WhatsApp con el texto precargado

#### Scenario: Mensaje largo o fallo

- **WHEN** el texto supera el límite o WhatsApp no abre
- **THEN** se copia el texto al portapapeles y se informa al usuario

---

### Requirement: API me/missing

El backend SHALL exponer `GET /api/me/missing` (JWT) que devuelve equipos con códigos faltantes. Una figurita falta si no existe `user_stickers` o `owned === false`.

#### Scenario: Respuesta agrupada

- **WHEN** el cliente llama `GET /api/me/missing`
- **THEN** recibe `{ total_missing, teams: [{ team, codes: string[] }] }` sin equipos vacíos

---

## MODIFIED Requirements

Ninguno que invalide comportamiento existente de toggle, progreso o catálogo.
