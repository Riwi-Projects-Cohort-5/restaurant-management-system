# Backend Overview

Back to [docs/README.md](README.md).

## 1. Purpose

The backend is a FastAPI REST API that powers the Restaurant Management System. It exposes endpoints for authentication, users, tables, reservations, menu, orders, kitchen workflow, inventory, payments, reports, settings and the supporting lookup tables (categories, locations).

## 2. Tech stack

| Technology | Version | Role |
|---|---|---|
| Python | 3.13 | Language |
| FastAPI | 0.139.0 | Web framework |
| SQLAlchemy | 2.0.48 | ORM |
| Alembic | 1.18.4 | Schema migrations |
| Pydantic | 2.13.3 (v2) | Input/output validation |
| python-jose | 3.5.0 | JWT |
| Passlib + bcrypt | 1.7.4 / 4.0.1 | Password hashing |
| PostgreSQL | — | Primary database |
| Uvicorn | 0.51.0 | ASGI server |
| Docker + Compose | — | Local + production containerisation |

## 3. Layered architecture

See [architecture.md](architecture.md) for the diagram and request flow. Four decoupled layers:

1. **Endpoints** — `app/api/v1/*.py` — receive HTTP, validate via Pydantic, return JSON.
2. **Services** — `app/services/*.py` — business rules (uniqueness, status transitions, totals, stock moves).
3. **Repositories** — `app/repositories/*.py` — the only place SQLAlchemy queries live.
4. **Models + DB** — `app/db/models/*.py`, `app/db/database.py` — declarative ORM, session factory.

Shared dependencies live in `app/core/`:

- `config.py` — Settings via Pydantic Settings, reads `.env`. `SECRET_KEY` is mandatory.
- `security.py` — JWT encode/decode, bcrypt verify/hash.
- `dependencies.py` — `get_current_user` FastAPI dependency (OAuth2 Bearer).

## 4. Routers mounted at `/api/v1`

The main router (`app/api/router.py`) includes **14 routers**:

| # | Module | Prefix | Public endpoints | Protected |
|---|---|---|---|---|
| 1 | auth | `/auth` | `POST /login`, `POST /register` | — |
| 2 | users | `/users` | — | all |
| 3 | categories | `/categories` | `GET /` , `GET /{id}` | create/update/delete |
| 4 | locations | `/locations` | all | all |
| 5 | tables | `/tables` | `GET /` , `/available` , `/{id}` , `/status` | create/update/delete |
| 6 | reservations | `/reservations` | — | all |
| 7 | menu | `/menu` | all `GET` | create/update/delete |
| 8 | orders | `/orders` | — | all |
| 9 | kitchen | `/kitchen` | — | all |
| 10 | inventory | `/inventory` | — | all |
| 11 | payments | `/payments` | — | all |
| 12 | reports | `/reports` | — | all |
| 13 | settings | `/settings` | `GET /` | `PUT /` |
| 14 | (root) | — | `GET /` , `GET /health` | — |

For the full route table with request/response shapes, see [api-reference.md](api-reference.md). For narrative explanations + examples per module, see [endpoints/](endpoints/).

> Public/Protected column reflects the actual `Depends(get_current_user)` usage in `v1/*.py` as of this writing. Some "public" reads may be locked down in a future release.

## 5. Models currently exposed

These tables exist in the database (driven by SQLAlchemy models in `app/db/models/`):

`User`, `Customer`, `Location`, `Table`, `Reservation`, `Category`, `MenuItem`, `Order`, `OrderItem`, `Payment`, `InventoryItem`, `InventoryMovement`, `KitchenOrder`, `Setting`, `Supplier`, `Purchase`, `PurchaseDetail`, `Recipe`.

The full schema and relationships are documented in [database-guide.md](database-guide.md).

## 6. Models without routers yet

`Supplier`, `Purchase`, `PurchaseDetail`, `Recipe` and `Customer` have models + repositories + services, but **no router** exposes them yet. They are tracked in `app/db/models/__init__.py` and ready to be surfaced when purchase-orders and customer-facing features land.

## 7. Configuration

| Variable | Source | Required | Notes |
|---|---|---|---|
| `DATABASE_URL` | `.env` | No | Defaults to `postgresql://postgres:postgres@localhost:5432/restaurant_db`. |
| `SECRET_KEY` | `.env` | **Yes** | Used for JWT HS256. App refuses to boot without it. |
| `ALGORITHM` | `.env` | No | Default `HS256`. |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `.env` | No | Default 30. |
| `API_V1_PREFIX` | `.env` | No | Default `/api/v1`. |
| `PROJECT_NAME` | `.env` | No | Default "Restaurant Management System". |

Copy `backend/.env.example` to `backend/.env` and set `SECRET_KEY` before running.

## 8. Running locally

```bash
# 1. Start PostgreSQL
docker-compose up -d

# 2. Backend
cd backend
pip install -r requirements.txt
cp .env.example .env        # set SECRET_KEY
alembic upgrade head         # apply migrations
uvicorn app.main:app --reload

# 3. Browse the Swagger UI
open http://localhost:8000/docs
```

## 9. Tests

```bash
cd backend
pytest       # all tests under tests/
pytest tests/test_health.py    # single file
```

Existing tests: `test_health.py`, `test_models.py`, `test_locations.py`, `test_tables_location.py`, plus `conftest.py` fixtures.

## 10. Good practices

- Keep endpoints thin — no business logic in `api/v1/*.py`.
- Always validate inputs through Pydantic schemas in `db/schemas/`.
- Use the repository for any SQL access; services must not run raw queries.
- When you add or rename a model, write an Alembic migration under `alembic/versions/` and update `database-guide.md`.
- Hash passwords with `security.hash_password` — never store plaintext.
- Return errors via `HTTPException(status_code=..., detail=...)` so `frontend/src/services/api.js` can surface them.
