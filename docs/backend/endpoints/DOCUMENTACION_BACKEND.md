# Backend Technical Documentation — Restaurant Management System

Back to [docs/README.md](../README.md).

**Module owner:** Diego  
**Updated:** July 2026  
**Version:** 1.2.0

---

## 1. Overview

The backend of the **Restaurant Management System** is a REST API built with FastAPI that manages the full restaurant operation: tables and reservations, ordering, kitchen workflow, payments, inventory, reports, and system settings.

The API follows a four-layer architecture separating presentation (endpoints), business logic (services), data access (repositories) and persistence (models + database).

> For the canonical, compact endpoint table see [api-reference.md](../api-reference.md). For architecture diagrams see [architecture.md](../architecture.md). This document focuses on narrative + examples.

---

## 2. Tech stack

| Technology | Version | Purpose |
|---|---|---|
| Python | 3.13 | Main language |
| FastAPI | 0.139.0 | REST framework |
| SQLAlchemy | 2.0.48 | ORM |
| PostgreSQL | 16 | Relational database |
| Pydantic | 2.13.3 (v2) | Validation |
| Alembic | 1.18.4 | Migrations |
| python-jose | 3.5.0 | JWT |
| Passlib + bcrypt | 1.7.4 / 4.0.1 | Password hashing |
| Docker + Compose | — | Containerization |
| Uvicorn | 0.51.0 | ASGI server |

### Why FastAPI

1. Performance — among the fastest Python frameworks.
2. Automatic OpenAPI documentation at `/docs`.
3. Integrated Pydantic validation.

### Why PostgreSQL

The system models complex relations (tables → reservations → orders → payments → reporting) and benefits from PostgreSQL's strong foreign keys, transactions and Date/Time types.

---

## 3. Project architecture

```
Client (HTTP request)
        ↓
┌─────────────────────┐
│   API / Endpoints   │  ← validates input via Pydantic schemas
│   (app/api/v1/)     │
└─────────────────────┘
        ↓
┌─────────────────────┐
│      Services       │  ← business rules
│   (app/services/)   │
└─────────────────────┘
        ↓
┌─────────────────────┐
│    Repositories     │  ← SQLAlchemy queries
│  (app/repositories/)│
└─────────────────────┘
        ↓
┌─────────────────────┐
│   Models / DB       │  ← PostgreSQL tables
│   (app/db/)         │
└─────────────────────┘
```

Each layer can evolve without leaking into the others.

---

## 4. Installation

### Requirements

- Python 3.13+
- Docker Desktop running
- Git

### Steps

```bash
# 1. Clone
git clone <repo-url>
cd restaurant-management-system

# 2. Start PostgreSQL
docker-compose up -d

# 3. Backend
cd backend
pip install -r requirements.txt
cp .env.example .env       # set SECRET_KEY
alembic upgrade head        # apply migrations

# 4. Run
python -m uvicorn app.main:app --reload

# 5. Swagger UI
open http://127.0.0.1:8000/docs
```

---

## 5. Authentication

JWT (JSON Web Tokens) using the OAuth2 password flow with HS256. Tokens last 30 minutes (configurable via `ACCESS_TOKEN_EXPIRE_MINUTES`).

### Flow

1. Client registers a user via `POST /api/v1/auth/register` (currently public — used to bootstrap the first admin).
2. Client logs in via `POST /api/v1/auth/login` and receives `access_token`.
3. Subsequent requests include the header `Authorization: Bearer <access_token>`.

Endpoints marked 🔒 need this header. Public endpoints ignore it.

### Login request — **form-urlencoded**

The login endpoint uses FastAPI's `OAuth2PasswordRequestForm`, NOT a JSON body. Send the credentials as `application/x-www-form-urlencoded`:

```http
POST /api/v1/auth/login HTTP/1.1
Content-Type: application/x-www-form-urlencoded

username=admin&password=your-strong-password
```

Response:

```json
{ "access_token": "eyJhbGciOi...", "token_type": "bearer" }
```

### Register request — JSON

```http
POST /api/v1/auth/register HTTP/1.1
Content-Type: application/json

{
  "username": "diego",
  "email": "diego@restaurante.com",
  "password": "password123",
  "full_name": "Diego Pérez",
  "role": "waiter"
}
```

### Roles

Four roles, enforced by SQLAlchemy enum on the `users` table:

| Code | Role |
|---|---|
| `admin` | Administrator — full access, can create users. |
| `waiter` | Takes orders, manages assigned tables. |
| `chef` | Kitchen visibility and status updates. |
| `cashier` | Processes payments. |

> There is **no `client` or `kitchen` role** in the backend. Customers do not authenticate during the MVP.

---

## 6. Endpoints

All endpoints are under `/api/v1/`. The complete table is in [api-reference.md](../api-reference.md). Below are the highlights with examples.

### Auth

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/login` | public | Authenticate, get JWT (form-urlencoded). |
| POST | `/auth/register` | public | Register a user (JSON). |

### Users

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/users/` | 🔒 | List all users. |
| GET | `/users/me` | 🔒 | Current authenticated user. |
| GET | `/users/{user_id}` | 🔒 | Get one. |
| PUT | `/users/{user_id}` | 🔒 | Update a user. |
| DELETE | `/users/{user_id}` | 🔒 | Delete a user. |

### Categories

Full CRUD. `GET /` and `GET /{id}` are public; writes require 🔒.

Example — create:

```json
POST /api/v1/categories/
{
  "name": "Platos principales",
  "description": "Platos fuertes del restaurante"
}
```

### Locations

Full CRUD. Provides physical zones to group tables (Terraza, Interior, VIP, …).

### Tables

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/tables/` | public | List. |
| GET | `/tables/available` | public | Available only. |
| GET | `/tables/status` | public | Aggregated status summary. |
| GET | `/tables/{table_id}` | public | Get one. |
| POST | `/tables/` | 🔒 | Create. |
| PUT | `/tables/{table_id}` | 🔒 | Update data or status. |
| DELETE | `/tables/{table_id}` | 🔒 | Delete. |

Table statuses: `available`, `occupied`, `reserved`, `maintenance`.

### Reservations

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/reservations/` | 🔒 | List. |
| GET | `/reservations/{id}` | 🔒 | Get one. |
| POST | `/reservations/` | 🔒 | Create. |
| PUT | `/reservations/{id}` | 🔒 | Update. |
| PUT | `/reservations/confirm/{id}` | 🔒 | Confirm a pending reservation. |
| DELETE | `/reservations/{id}` | 🔒 | Cancel. |

Reservation statuses: `pending`, `confirmed`, `cancelled`, `completed`. Reservations support walk-in guests via `guest_name` / `guest_phone` (no `customer_id` needed).

Example — create:

```json
POST /api/v1/reservations/
{
  "table_id": "uuid-of-table",
  "reservation_date": "2026-07-20T19:00:00",
  "guest_count": 4,
  "guest_name": "Carlos Ramírez",
  "guest_phone": "+57 310 555 1234",
  "notes": "Mesa cerca de la ventana"
}
```

### Menu

Public reads, locked writes. `GET /available` and `GET /category/{category_id}` are filters.

### Orders

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/orders/` | 🔒 | List. |
| GET | `/orders/active` | 🔒 | Active orders. |
| GET | `/orders/{order_id}` | 🔒 | Get one. |
| POST | `/orders/` | 🔒 | Create. |
| POST | `/orders/{order_id}/items` | 🔒 | Add an item line. |
| PUT | `/orders/{order_id}/status` | 🔒 | Update order status. |
| DELETE | `/orders/{order_id}` | 🔒 | Cancel / delete. |

Order statuses: `pending`, `in_progress`, `completed`, `cancelled`.

Example — create order:

```json
POST /api/v1/orders/
{ "table_id": "uuid-of-table" }
```

Example — add item:

```json
POST /api/v1/orders/{order_id}/items
{
  "menu_item_id": "uuid-of-item",
  "quantity": 2
}
```

### Kitchen

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/kitchen/` | 🔒 | All pending + in-progress kitchen lines. |
| GET | `/kitchen/pending` | 🔒 | Pending only. |
| GET | `/kitchen/in-progress` | 🔒 | In-progress only. |
| GET | `/kitchen/order/{order_id}` | 🔒 | Lines for an order. |
| GET | `/kitchen/{kitchen_order_id}` | 🔒 | One kitchen order. |
| PUT | `/kitchen/{kitchen_order_id}/status` | 🔒 | Update status. |

Kitchen line statuses: `pending`, `preparing`, `ready`, `delivered`.

### Inventory

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/inventory/` | 🔒 | List items. |
| GET | `/inventory/low-stock` | 🔒 | Items below `min_stock`. |
| GET | `/inventory/{item_id}` | 🔒 | Get one. |
| POST | `/inventory/` | 🔒 | Create. |
| PUT | `/inventory/{item_id}` | 🔒 | Update. |
| POST | `/inventory/{item_id}/movements` | 🔒 | Register a movement. |
| DELETE | `/inventory/{item_id}` | 🔒 | Delete. |

Movement types: `in` (restock) and `out` (consumption).

### Payments

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/payments/` | 🔒 | List. |
| GET | `/payments/order/{order_id}` | 🔒 | Find by order. |
| GET | `/payments/{payment_id}` | 🔒 | Get one. |
| POST | `/payments/` | 🔒 | Create. |
| PUT | `/payments/{payment_id}` | 🔒 | Update (e.g. complete, refund). |
| DELETE | `/payments/{payment_id}` | 🔒 | Delete. |

Payment methods: `cash`, `card`, `transfer`. Payment statuses: `pending`, `completed`, `refunded`, `failed`.

Example — register payment:

```json
POST /api/v1/payments/
{
  "order_id": "uuid-of-order",
  "amount": 45000,
  "method": "cash"
}
```

### Reports

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/reports/sales` | 🔒 | Sales by date range. |
| GET | `/reports/products` | 🔒 | Best-selling products. |
| GET | `/reports/daily-sales` | 🔒 | Daily sales series. |
| GET | `/reports/today-stats` | 🔒 | Today's aggregate stats. |

Example:

```http
GET /api/v1/reports/sales?start_date=2026-07-01T00:00:00&end_date=2026-07-15T23:59:59
```

### Settings

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/settings/` | public | Read restaurant settings. |
| PUT | `/settings/` | 🔒 | Update restaurant settings. |

The single `Setting` row stores `restaurant_name`, `address`, `phone`, `email`, `tax_rate`, `currency` — see [database-guide.md](../database-guide.md#settings--setting).

---

## 7. HTTP status codes

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

Errors return `{"detail": "message"}`.

---

## 8. Operational flow

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

---

## 9. Server base endpoints

| Path | Auth | Description |
|---|---|---|
| `GET /` | public | Server banner. |
| `GET /health` | public | Health check (Docker / monitoring). |
| `GET /docs` | public | Swagger UI. |
| `GET /redoc` | public | ReDoc UI. |
| `GET /openapi.json` | public | Raw OpenAPI schema. |

---

## 10. Not exposed yet

These models exist in the database and have services/repositories but **no router** so far:

- `suppliers`, `purchases`, `purchase_details` — supplier purchase orders.
- `recipes` — bill-of-materials mapping menu items to inventory items.
- `customers` — referenced by reservations but not directly CRUD'd yet.

When routes are added, update [api-reference.md](../api-reference.md) and this document.
