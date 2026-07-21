# Documentation change log

Most recent first. For source-code changes see the Git history.

Back to [docs/README.md](README.md).

## 2026-07-21 — `ItsJrDev/chore/review-docs`

### Added (new documents)

- `docs/README.md` — documentation index / entry point.
- `docs/architecture.md` — C4 level 1 + 2 diagrams (mermaid), request flow, deployment topology, cross-cutting concerns.
- `docs/backend/api-reference.md` — canonical endpoint table per module, verified against `backend/app/api/v1/*.py`.
- `docs/frontend/overview.md` — frontend architecture (Vite 8, Tailwind v4, hash routing, store factory, AppShell, roles, theme).
- `docs/contributing.md` — Git workflow, branch convention `Its-JrDev/<type>/<slug>`, commit style, lint/test commands, end-to-end module checklist.
- `docs/CHANGELOG.md` — this file.

### Updated

- `README.md` (root) — replace outdated "endpoints base and health check only" line with the real 14-router suite; add `docker-compose up + alembic + uvicorn + pnpm` quick start; document the four roles (no `client`); point to the docs index.
- `structure-explanation.md` — full rewrite to reflect the actual tree (14 routers, `app/services` + `app/repositories` per module, Alembic migrations, frontend with `AppShell`, `routes` map, dark mode, named stores, Vite port 3000 `/api` proxy).
- `docs/vision.md` — reviewed to confirm the **Customer** mentions are about restaurant customers (not a logged-in role); MVP scope still says "Customers are not required to authenticate". No edits to role list (the file never listed a `client` role as a staff persona).
- `docs/backend/overview.md` — enumerate all 14 modules, document Alembic + JWT + Pydantic v2, note models without routers (`Supplier`, `Purchase`, `Recipe`, `Customer`).
- `docs/backend/database-guide.md` — rewrite the table list against the actual SQLAlchemy models (`MenuItem`, `OrderItem`, `KitchenOrder`, `Setting`, `Supplier`, `Purchase`, `PurchaseDetail`, `Recipe`, `Customer`, `Location`); correct FKs and cascade rules; add Alembic migration chain 001–006.
- `docs/frontend/implementation-guide.md` — rewritten as a **frontend** implementation guide; reflect `routes` map router (no switch), 4 roles, JWT-backed login, `authService` flow, login form-urlencoded, `store/createStore()` factory, complete "add a module end-to-end" checklist.
- `docs/backend/user-credentials.md` — dropped hardcoded `{role}123` demo users; explain `POST /api/v1/auth/register` as the bootstrap path plus authenticated admin actions and the seed script.
- `docs/backend/endpoints/DOCUMENTACION_BACKEND.md` — fix login body (`OAuth2PasswordRequestForm`, `application/x-www-form-urlencoded`), fix roles to the four valid enum values (`admin`, `waiter`, `chef`, `cashier` — no `kitchen`, no `client`), add `/locations` and `/settings` sections, correct `/kitchen/*` and `/reports/*` and `/orders/{id}/items` route listings.
- `docs/ui/feedback-system/README.md` — drop `Branch Its-JrDev/feature/ui-feedback-system` mention (now merged into `develop`).
- `frontend/README.md` — replaced a 650-line obsolete copy of the old implementation guide (which listed the `client` role, mock users, switch router and outdated endpoints) with a thin pointer to the new docs plus the quick start, role list and scripts table.

### Reorganized

- Moved `docs/backend-overview.md` → `docs/backend/overview.md`.
- Moved `docs/api-reference.md` → `docs/backend/api-reference.md`.
- Moved `docs/database-guide.md` → `docs/backend/database-guide.md`.
- Moved `docs/USER_CREDENTIALS.md` → `docs/backend/user-credentials.md`.
- Moved `docs/frontend-overview.md` → `docs/frontend/overview.md`.
- Moved `docs/IMPLEMENTATION_GUIDE.md` → `docs/frontend/implementation-guide.md`.
- Replaced the single-file `docs/backend/endpoints/DOCUMENTACION_BACKEND.md` with the per-module folder `docs/backend/endpoints/` containing a `README.md` and one `*.md` per router module (`auth`, `users`, `categories`, `locations`, `tables`, `reservations`, `menu`, `orders`, `kitchen`, `inventory`, `payments`, `reports`, `settings`).
- Translated `docs/ui/design-system/theme.md` (and Spanish snippets in `primitives.md` and `design-system/README.md`) to English.

### Discrepancies vs code that were corrected

| # | Where | Wrongly claimed (old) | Reality (now documented) |
|---|---|---|---|
| 1 | vision, USER_CREDENTIALS, IMPLEMENTATION_GUIDE, frontend/README.md | Hardcoded `{role}123` demo users, five roles including `client`, router switch, mock-first admin | Four roles: `admin`, `waiter`, `chef`, `cashier`; login via `/auth/register` (`USER_CREDENTIALS`), docs rewritten (`IMPLEMENTATION_GUIDE`, `frontend/README`) |
| 2 | DOCUMENTACION_BACKEND | Login JSON body | Login `application/x-www-form-urlencoded` via `OAuth2PasswordRequestForm` |
| 3 | root README | Only `/`, `/health` endpoints | 14 routers mounted under `/api/v1` |
| 4 | USER_CREDENTIALS `/auth/users` list users | Real path is `/api/v1/users/` |
| 5 | database-guide `order_details`, `kitchen_status`, `products` | Actual models: `OrderItem`, `KitchenOrder`, `MenuItem` |
| 6 | database-guide omitted `Supplier`, `Purchase`, `Recipe`, `Setting` | Added sections for each |
| 7 | IMPLEMENTATION_GUIDE router switch | `main.js` uses a `routes` map |
| 8 | IMPLEMENTATION_GUIDE mock demo users | Removed; replaced with `/auth/register` and seed script |

### Files touched (17)

```
README.md
structure-explanation.md
docs/README.md            (new)
docs/architecture.md      (new)
docs/api-reference.md     (new)
docs/frontend-overview.md (new)
docs/contributing.md      (new)
docs/CHANGELOG.md         (new)
docs/vision.md
docs/backend-overview.md
docs/database-guide.md
docs/IMPLEMENTATION_GUIDE.md
docs/USER_CREDENTIALS.md
docs/ui/feedback-system/README.md
docs/backend/endpoints/DOCUMENTACION_BACKEND.md
frontend/README.md
```
