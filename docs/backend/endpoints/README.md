# Backend Endpoints

Per-module narrative documentation with request/response examples. For the compact canonical endpoint table see [../api-reference.md](../api-reference.md). For backend architecture, layers and tech stack see [../overview.md](../overview.md) and [../../architecture.md](../../architecture.md).

Back to [../../README.md](../../README.md).

## Contents

| Module | File | Prefix |
|---|---|---|
| Auth | [auth.md](auth.md) | `/auth` |
| Users | [users.md](users.md) | `/users` |
| Categories | [categories.md](categories.md) | `/categories` |
| Locations | [locations.md](locations.md) | `/locations` |
| Tables | [tables.md](tables.md) | `/tables` |
| Reservations | [reservations.md](reservations.md) | `/reservations` |
| Menu | [menu.md](menu.md) | `/menu` |
| Orders | [orders.md](orders.md) | `/orders` |
| Kitchen | [kitchen.md](kitchen.md) | `/kitchen` |
| Inventory | [inventory.md](inventory.md) | `/inventory` |
| Payments | [payments.md](payments.md) | `/payments` |
| Reports | [reports.md](reports.md) | `/reports` |
| Settings | [settings.md](settings.md) | `/settings` |

## Auth convention

- 🔒 = requires `Authorization: Bearer <jwt>` header.
- "Public" = no token required.
- JWT is obtained from `POST /api/v1/auth/login` (form-urlencoded, OAuth2 password flow).
- Bearer user is resolved by `get_current_user` (`app/core/dependencies.py`). Inactive users get `403`.

## Server base endpoints (root, not prefixed)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | public | Server banner. |
| GET | `/health` | public | `{"status":"ok"}` — used by Docker / monitoring. |
| GET | `/docs` | public | Swagger UI. |
| GET | `/redoc` | public | ReDoc UI. |
| GET | `/openapi.json` | public | Raw OpenAPI 3 schema JSON. |

## HTTP status codes

| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 204 | No Content (successful delete) |
| 401 | Unauthorized — invalid or missing token |
| 403 | Forbidden — inactive user or insufficient role |
| 404 | Not Found |
| 422 | Unprocessable Entity (Pydantic validation) |
| 500 | Internal Server Error |

Errors return `{"detail": "message"}` — the frontend extracts `response.detail` in `frontend/src/services/api.js`.

## Operational flow

```
Customer reserves a table → Table.status = RESERVED
        ↓
Customer arrives → Table.status = OCCUPIED
        ↓
Waiter creates order → Order.status = PENDING, kitchen lines created
        ↓
Kitchen cooks → KitchenOrder.status: PENDING → PREPARING → READY
        ↓
Waiter delivers → KitchenOrder.status = DELIVERED
        ↓
Cashier registers payment → Payment.status = COMPLETED, Order.status = COMPLETED
        ↓
Table returns to AVAILABLE; data feeds /reports/*
```

## Roles

Four staff roles enforced by SQLAlchemy enum on the `users` table:

| Code | Role |
|---|---|
| `admin` | Administrator — full access, can create users. |
| `waiter` | Takes orders, manages assigned tables. |
| `chef` | Kitchen visibility and status updates. |
| `cashier` | Processes payments. |

> There is **no `client` or `kitchen` role** in the backend. Customers do not authenticate during the MVP.

See [../../user-credentials.md](../user-credentials.md) for how the first admin is bootstrappped.

## Not exposed yet

These models exist in the database and have services/repositories but **no router** so far:

- `suppliers`, `purchases`, `purchase_details` — supplier purchase orders.
- `recipes` — bill-of-materials mapping menu items to inventory items.
- `customers` — referenced by reservations but not directly CRUD'd yet.

When routes are added, create a new `*.md` here and update [../api-reference.md](../api-reference.md).
