# Restaurant Management System

A staff-centered web platform for small and medium restaurants: reservations, table management, ordering, kitchen workflow, payments, inventory, reporting and system settings — all in one monorepo.

Quick links: [docs/README.md](docs/README.md) · [architecture](docs/architecture.md) · [API reference](docs/backend/api-reference.md) · [frontend overview](docs/frontend/overview.md) · [contributing](docs/contributing.md)

## Tech stack

| Area | Choice |
|---|---|
| Backend | Python 3.13, FastAPI 0.139, SQLAlchemy 2.0, Alembic 1.18, Pydantic v2 |
| Auth | JWT (OAuth2 password flow, bcrypt hashing, 30-min tokens) |
| Database | PostgreSQL 16 (Docker) |
| Frontend | Vanilla JS + Vite 8 + Tailwind CSS v4 + lucide + chart.js |
| DevOps | Docker Compose (local), Render (`render.yaml`) |

## Roles

Four staff roles — there is **no `client` role**. Customers do not authenticate during the MVP.

| Code | Role |
|---|---|
| `admin` | Administrator — full access, can manage users |
| `waiter` | Waiter — tables and orders |
| `chef` | Chef — kitchen display |
| `cashier` | Cashier — payments |

## Project layout

See [structure-explanation.md](structure-explanation.md) for the full directory map. Top-level:

```
restaurant-management-system/
├── backend/              # FastAPI app (api/v1, core, db, services, repositories)
├── frontend/             # Vanilla JS + Vite SPA (src/main.js is the router)
├── database/             # init/ + seed/ SQL for the Docker entrypoint
├── docs/                 # all project documentation
├── scripts/              # dev.sh, build.sh, deploy.sh helpers
├── docker-compose.yml    # PostgreSQL + (optional) backend
├── render.yaml           # production deployment manifest
├── vercel.json           # frontend static hosting config
└── README.md, structure-explanation.md, LICENSE
```

## Quick start (local)

### 1. PostgreSQL

```bash
docker-compose up -d
```

### 2. Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # set SECRET_KEY
alembic upgrade head            # apply migrations
python -m app.db.seed           # optional: seed reference data + first admin
uvicorn app.main:app --reload   # http://localhost:8000
```

Swagger UI: <http://localhost:8000/docs>  
Health check: <http://localhost:8000/health>

### 3. Frontend

```bash
cd frontend
pnpm install                   # package manager pinned to pnpm 11.3.0
pnpm dev                        # http://localhost:3000 (proxies /api → :8000)
```

### 4. Create the first admin

The `POST /api/v1/auth/register` endpoint is currently public so you can bootstrap the first user. See [docs/backend/user-credentials.md](docs/backend/user-credentials.md).

```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","email":"admin@fogon.com","password":"a-strong-password","full_name":"Admin","role":"admin"}'
```

Then log in:

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'username=admin&password=a-strong-password'
```

## Modules

The backend currently exposes **14 routers** under `/api/v1`:

`auth`, `users`, `categories`, `locations`, `tables`, `reservations`, `menu`, `orders`, `kitchen`, `inventory`, `payments`, `reports`, `settings` — plus `/` and `/health` at root.

For the full endpoint table see [docs/backend/api-reference.md](docs/backend/api-reference.md). The live OpenAPI schema is at <http://localhost:8000/openapi.json>.

## Testing

```bash
cd backend
pytest                          # all tests under tests/
pytest tests/test_health.py     # single file
```

Frontend lint/format:

```bash
cd frontend
pnpm lint
pnpm format:check
```

## Configuration

The backend reads its settings from `backend/.env` via Pydantic Settings (`app/core/config.py`):

| Variable | Required | Default |
|---|---|---|
| `DATABASE_URL` | no | `postgresql://postgres:postgres@localhost:5432/restaurant_db` |
| `SECRET_KEY` | **yes** | — (app refuses to boot without it) |
| `ALGORITHM` | no | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | no | `30` |
| `API_V1_PREFIX` | no | `/api/v1` |
| `PROJECT_NAME` | no | `Restaurant Management System` |

## Source of truth for the schema

SQLAlchemy models in `backend/app/db/models/` are the source of truth. The database schema is migrated through Alembic (`backend/alembic/versions/`). Never hand-edit SQL that diverges from the models — see [docs/backend/database-guide.md](docs/backend/database-guide.md).

## Documentation

The full documentation index lives at [docs/README.md](docs/README.md) and covers backend, frontend, architecture, API, database, UI design system and contribution guidelines.

## License

See [LICENSE](LICENSE) for the project license terms.
