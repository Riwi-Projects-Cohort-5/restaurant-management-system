# Repository structure

The **Restaurant Management System** is a monorepo: every piece of the solution — backend, frontend, database, docs, infra, automation — lives in a single Git repository. This keeps source, documentation, infrastructure and tooling in sync and makes collaborative development easier.

The layout follows **separation of concerns**: each top-level directory has one purpose.

Back to [README.md](README.md) · [docs/README.md](docs/README.md).

---

## `.github/`

GitHub Actions workflows (the project's CI/CD).

- `workflows/backend.yml` — install deps, lint, pytest, build check.
- `workflows/frontend.yml` — install pnpm deps, `vite build`, lint, artifact check.
- `workflows/deploy.yml` — production deploy (Render / docker push / post-deploy hooks).

---

## `backend/`

The FastAPI server. Source under `backend/app/`.

### `app/api/`

Presentation layer. Receives HTTP, validates with Pydantic, delegates to services. No business logic.

- `router.py` — main `APIRouter` that mounts every module router.
- `v1/` — modular routers, one file per resource:
  - `auth.py`, `users.py`, `categories.py`, `locations.py`, `tables.py`,
  - `reservations.py`, `menu.py`, `orders.py`, `kitchen.py`, `inventory.py`,
  - `payments.py`, `reports.py`, `settings.py`.

### `app/core/`

Cross-cutting configuration.

- `config.py` — `Settings` (Pydantic Settings) + `get_settings()` cached helper.
- `security.py` — JWT encode/decode, bcrypt password helpers.
- `dependencies.py` — shared FastAPI deps: `get_db`, `get_current_user` (OAuth2 Bearer → `User`).

### `app/db/`

Persistence layer.

- `database.py` — SQLAlchemy engine, `SessionLocal` factory, declarative `Base`.
- `models/` — one model per file (User, Customer, Location, Table, Reservation, Category, MenuItem, Order, OrderItem, Payment, InventoryItem, InventoryMovement, KitchenOrder, Setting, Supplier, Purchase, PurchaseDetail, Recipe). `__init__.py` re-exports them all.
- `schemas/` — Pydantic v2 input/output DTOs, mirroring the models.
- `seed.py` — script that inserts reference data + a default admin.

### `app/services/`

Business logic. One service per module (`auth_service`, `user_service`, `table_service`, `reservation_service`, `menu_item_service`, `order_service`, `kitchen_service`, `inventory_service`, `payment_service`, `report_service`, `category_service`, `location_service`, `setting_service`, `supplier_service`, `purchase_service`, `recipe_service`). Services never run raw SQL; they call repositories.

### `app/repositories/`

Single home for SQLAlchemy queries. `*_repository.py` per module. Services depend on these, never on the ORM directly.

### `app/utils/`

Shared helpers.

- `date_utils.py` — date/time formatting and parsing.
- `pagination.py` — generic pagination helper (not yet enforced across endpoints).
- `validators.py` — common input validators.

### `app/main.py`

Application entry. Creates the FastAPI app, adds CORS middleware, mounts the main router under `settings.API_V1_PREFIX` (`/api/v1`) and defines the root `/` and `/health` endpoints. Swagger UI at `/docs`.

### `alembic.ini`, `alembic/`

Alembic config + migration scripts. Revisions live in `alembic/versions/` (currently `001_initial` → `006_fix_reservation_fk_on_delete`). Apply with `alembic upgrade head`.

### `tests/`

- `conftest.py` — shared fixtures.
- `test_health.py` — root + `/health`.
- `test_models.py` — basic model sanity tests.
- `test_locations.py`, `test_tables_location.py` — `Location` + `Table.location_id` relationship tests.

### Root files

- `.env.example`, `.env` (gitignored) — environment configuration.
- `entrypoint.sh` — Docker entry script (Alembic + uvicorn).
- `Dockerfile` — backend image.
- `requirements.txt` — pinned Python deps.
- `ruff.toml` — ruff formatter/linter config.
- `README.md` — backend-specific quick start (optional; authoritative README is the root one).
- `.pytest_cache/`, `.ruff_cache/` — tool caches (gitignored).

---

## `frontend/`

The SPA. Vanilla JS + Tailwind v4 + Vite. No React/Vue.

### `vite.config.js`

Dev server on port **3000**, HMR + a force-reload plugin, and a dev proxy `/api → http://localhost:8000` so the SPA talks to the local backend with the same-origin URL.

### `public/`

Static assets served directly (favicon, manifest, etc.).

### `src/main.js`

Entry point and router. Holds a `routes` map keyed by hash path (`#/orders` → `PosView`, etc.), listens to `hashchange`, renders the AppShell first when `shell: true`, then mounts the view into `#main-content`. Bootstraps `initTheme()` and `initRoleSwitcher()`.

### `src/services/`

HTTP layer. `api.js` wraps `fetch` with JWT Bearer header, JSON serialization, `URLSearchParams` for login, and auto-redirect to `#/login` on 401. Per-module services: `authService`, `menuService`, `reservationService`, `paymentService`, `inventoryService`, `locationService`, `reportService`.

Legacy files (`mockUsers.js`, `mockReservations.js`, `mockProducts.js`, `mockPayments.js`, `mockInventory.js`, `mockReports.js`, `mockCategories.js`) are leftovers from the mock-only prototype and are **not imported by any other module** — kept for debugging, slated for removal.

### `src/store/`

Reactive state. `index.js` exposes a 29-line `createStore()` factory (`getState`, `setState`, `subscribe`). One module store per feature: `auth`, `posData`, `reservations`, `payments`, `reports`, `inventory`, `menu`, `settings`.

### `src/utils/`

Helpers.

- `routeGuard.js` — `ROLES`, `ROLE_HOME`, `ROLE_ACCESS`, `getHomeRoute`, `isRouteAllowed`, `guard`, `guardRole`. Four roles (no `client`).
- `theme.js` — light/dark toggle; persists `fogon-theme` in localStorage; applies `data-theme="dark"` on `<html>`.
- `withLoading.js` — skeleton wrappers + `Skeletons.*` builders.
- `roleContext.js` — small role helpers used by `RoleSwitcher`.
- `csvExport.js` — exports tables to CSV (used by Reports).

### `src/components/`

Reusable UI building blocks.

- `layout/` — `AppShell`, `Sidebar`, `Topbar`. AppShell renders the chrome, exposes `render`, `updateTopbarTitle`, and a logout handler.
- `ui/` — `Toast`, `ToastManager`, `Spinner`, `Skeleton`, plus modal primitives (`ConfirmModal`, `FormModal`, `ReservationModal`, `ProductModal`, `PaymentModal`, `InventoryItemModal`, `StatusStepper`, `StatCard`, `WelcomeBanner`).
- `forms/` — `InputField`, `PasswordToggle`, `CheckboxField`, `SubmitButton` (with spinner wire-up).
- `dashboard/` — `SalesChart` (chart.js), `TableStatusCard`.
- `pos/` — `CartPanel` used by `PosView`.
- `dev/` — `RoleSwitcher` for testing roles without logging out (dev-only).

### `src/views/`

One folder per screen. Each view exports `render(container)` (often async — fetches data first), an optional `init()` and `destroy()`.

- `auth/Login.js`
- `dashboard/Dashboard.js`
- `orders/PosView.js` — POS used by `/pos` and `/orders`
- `kitchen/Kitchen.js`
- `tables/Tables.js`
- `reservations/list.js`
- `menu/list.js`
- `inventory/Inventory.js`
- `payments/list.js`
- `reports/Reports.js`
- `settings/Settings.js`

### `src/styles/app.css`

Source of truth for design tokens. Tailwind v4 CSS-first: `@theme` block defines color, spacing, radius, typography, layout and animation custom properties for both light and `[data-theme="dark"]` themes.

### `src/router/`

Placeholder directory (only `.gitkeep`) reserved for a future router abstraction.

### Root files

- `package.json` — pinned to `pnpm@11.3.0`. Scripts: `dev`, `build`, `preview`, `lint`, `lint:fix`, `format`, `format:check`.
- `eslint.config.js`, `.prettierrc`, etc. — lint/format config.

---

## `database/`

PostgreSQL bootstrap materials complimenting Alembic.

- `init/01_schema.sql` — raw schema (used by the Docker entrypoint on first container start).
- `seed/` — seed data SQL.
- `Dockerfile` — PostgreSQL image override (PostgreSQL 16-alpine).

These scripts are convenience for non-Alembic environments; Alembic migrations under `backend/alembic/versions/` are the authoritative source of truth.

---

## `docs/`

Project documentation. Entry point: [docs/README.md](docs/README.md).

- `README.md` — index.
- `vision.md`, `architecture.md` — product context + architecture (C4 diagrams).
- `backend/overview.md`, `backend/api-reference.md`, `backend/database-guide.md` — backend docs.
- `backend/endpoints/` — per-module endpoint docs (`README.md` + one file per router module).
- `frontend/overview.md`, `frontend/implementation-guide.md` — frontend docs.
- `backend/user-credentials.md` — user creation + roles + bootstrap.
- `contributing.md` — Git workflow, lint, testing.
- `CHANGELOG.md` — documentation change log.
- `ui/design-system/` — design tokens (light + dark), primitives, theme architecture.
- `ui/feedback-system/` — Toast / Skeleton / Spinner primitives.

---

## `scripts/`

Shell helpers for common tasks.

- `dev.sh` — starts backend + frontend together.
- `build.sh` — builds backend + frontend.
- `deploy.sh` — wraps the production deploy.

---

## `.github/`, `docker-compose.yml`, `render.yaml`, `vercel.json`

- `docker-compose.yml` — PostgreSQL service (and an optional backend service).
- `render.yaml` — production deployment manifest (backend web service + managed Postgres + frontend static site).
- `vercel.json` — Vercel static hosting config for the frontend alternative deploy.

---

## Architectural summary

- **Backend** (`backend/app/`) is layered: `api → services → repositories → models + db`. Centralised config and security in `core/`. Migrations via Alembic. Pydantic v2 schemas validate IO.
- **Frontend** (`frontend/src/`) is a Vanilla JS SPA: it uses hash routing from `main.js`, reactive stores from `store/index.js`, an HTTP layer in `services/api.js`, role-guarded views and a Tailwind v4 design system with light/dark themes. It talks to the FastAPI backend exclusively.
- **Database** (`database/`) provides init + seed SQL; the live schema is migrated by Alembic.
- **Documentation** (`docs/`) keeps everything in sync and is the entry point for new contributors.
- **Automation** (`scripts/`, `.github/workflows/`) orchestrates dev, build, deploy and CI.

This separation improves maintainability, test isolation and parallel work between teams without creating cross-layer dependencies.
