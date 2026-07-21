# API Reference — Restaurant Management System

Canonical endpoint table. All routes are prefixed with `/api/v1`. Method + path are verified against `backend/app/api/v1/*.py`.

For the narrative version per module with request/response examples and architecture context, see [endpoints/](endpoints/).

Back to [docs/README.md](README.md).

## Auth convention

- 🔒 = requires `Authorization: Bearer <jwt>` header.
- "Public" = no token required.
- JWT is obtained from `POST /api/v1/auth/login` (form-urlencoded, OAuth2 password flow).
- Bearer user is resolved by `get_current_user` (`app/core/dependencies.py`). Inactive users get `403`.

## Base endpoints (root, not prefixed)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | public | Server banner. |
| GET | `/health` | public | `{"status":"ok"}` — used by Docker / monitoring. |
| GET | `/docs` | public | Swagger UI. |
| GET | `/openapi.json` | public | OpenAPI 3 schema JSON. |

## Auth — `/auth`

| Method | Path | Auth | Body | Returns |
|---|---|---|---|---|
| POST | `/auth/login` | public | `application/x-www-form-urlencoded`: `username`, `password` | `{ access_token, token_type: "bearer" }` |
| POST | `/auth/register` | public | JSON `UserCreate` → `username, email, password, full_name, role` | `UserOut` (201) |

> `register` is currently open so the first administrator can be created. In production it should be locked down to authenticated admins. See [user-credentials.md](user-credentials.md).

## Users — `/users`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/users/` | 🔒 | List all users (no passwords). |
| GET | `/users/me` | 🔒 | Current authenticated user. |
| GET | `/users/{user_id}` | 🔒 | Get one user. |
| PUT | `/users/{user_id}` | 🔒 | Update user (role/username/etc). |
| DELETE | `/users/{user_id}` | 🔒 | Delete user. |

## Categories — `/categories`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/categories/` | public | List all categories. |
| GET | `/categories/{category_id}` | public | Get one. |
| POST | `/categories/` | 🔒 | Create. |
| PUT | `/categories/{category_id}` | 🔒 | Update. |
| DELETE | `/categories/{category_id}` | 🔒 | Delete (204). |

## Locations — `/locations`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/locations/` | public | List all. |
| GET | `/locations/{location_id}` | public | Get one. |
| POST | `/locations/` | 🔒 | Create. |
| PUT | `/locations/{location_id}` | 🔒 | Update. |
| DELETE | `/locations/{location_id}` | 🔒 | Delete (204). |

## Tables — `/tables`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/tables/` | public | List all tables. |
| GET | `/tables/available` | public | Available tables only. |
| GET | `/tables/status` | public | Aggregated status summary. |
| GET | `/tables/{table_id}` | public | Get one table. |
| POST | `/tables/` | 🔒 | Create. |
| PUT | `/tables/{table_id}` | 🔒 | Update (incl. status). |
| DELETE | `/tables/{table_id}` | 🔒 | Delete (204). |

## Reservations — `/reservations`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/reservations/` | 🔒 | List all. |
| GET | `/reservations/{reservation_id}` | 🔒 | Get one. |
| POST | `/reservations/` | 🔒 | Create a reservation. |
| PUT | `/reservations/{reservation_id}` | 🔒 | Update reservation fields. |
| PUT | `/reservations/confirm/{reservation_id}` | 🔒 | Confirm a pending reservation. |
| DELETE | `/reservations/{reservation_id}` | 🔒 | Cancel (204). |

## Menu — `/menu`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/menu/` | public | List all menu items. |
| GET | `/menu/available` | public | Available items only. |
| GET | `/menu/category/{category_id}` | public | Filter by category. |
| GET | `/menu/{item_id}` | public | Get one. |
| POST | `/menu/` | 🔒 | Create. |
| PUT | `/menu/{item_id}` | 🔒 | Update. |
| DELETE | `/menu/{item_id}` | 🔒 | Delete (204). |

## Orders — `/orders`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/orders/` | 🔒 | List all orders. |
| GET | `/orders/active` | 🔒 | Active orders only. |
| GET | `/orders/{order_id}` | 🔒 | Get one. |
| POST | `/orders/` | 🔒 | Create an order for a table. |
| POST | `/orders/{order_id}/items` | 🔒 | Add an item to an order. |
| PUT | `/orders/{order_id}/status` | 🔒 | Change order status. |
| DELETE | `/orders/{order_id}` | 🔒 | Cancel/delete (204). |

## Kitchen — `/kitchen`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/kitchen/` | 🔒 | All pending + in-progress kitchen orders. |
| GET | `/kitchen/pending` | 🔒 | Pending only. |
| GET | `/kitchen/in-progress` | 🔒 | In-progress only. |
| GET | `/kitchen/order/{order_id}` | 🔒 | All kitchen lines for an order. |
| GET | `/kitchen/{kitchen_order_id}` | 🔒 | One kitchen order. |
| PUT | `/kitchen/{kitchen_order_id}/status` | 🔒 | Update kitchen line status. |

## Inventory — `/inventory`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/inventory/` | 🔒 | List all items. |
| GET | `/inventory/low-stock` | 🔒 | Items below `min_stock`. |
| GET | `/inventory/{item_id}` | 🔒 | Get one. |
| POST | `/inventory/` | 🔒 | Create item. |
| PUT | `/inventory/{item_id}` | 🔒 | Update item. |
| POST | `/inventory/{item_id}/movements` | 🔒 | Register a stock movement (`in`/`out`). |
| DELETE | `/inventory/{item_id}` | 🔒 | Delete item (204). |

## Payments — `/payments`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/payments/` | 🔒 | List all payments. |
| GET | `/payments/order/{order_id}` | 🔒 | Find payment by order. |
| GET | `/payments/{payment_id}` | 🔒 | Get one. |
| POST | `/payments/` | 🔒 | Register a payment. |
| PUT | `/payments/{payment_id}` | 🔒 | Update (e.g. mark completed / refunded). |
| DELETE | `/payments/{payment_id}` | 🔒 | Delete (204). |

## Reports — `/reports`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/reports/sales` | 🔒 | Sales report by date range. |
| GET | `/reports/products` | 🔒 | Best-selling products. |
| GET | `/reports/daily-sales` | 🔒 | Daily sales series. |
| GET | `/reports/today-stats` | 🔒 | Today's operational stats. |

## Settings — `/settings`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/settings/` | public | Read restaurant settings. |
| PUT | `/settings/` | 🔒 | Update restaurant settings. |

## Standards

### HTTP status codes

| Code | Meaning |
|---|---|
| 200 OK | Successful read or update. |
| 201 Created | Successful creation. |
| 204 No Content | Successful delete. |
| 401 Unauthorized | Invalid / missing token. |
| 403 Forbidden | Inactive user or insufficient privileges. |
| 404 Not Found | Resource does not exist. |
| 422 Unprocessable Entity | Pydantic validation failure. |
| 500 Internal Server Error | Unhandled error. |

### Error shape

```json
{ "detail": "string message" }
```

The frontend extracts `response.detail` (`frontend/src/services/api.js`).

### Pagination

Not yet standardised across endpoints. Helpers exist in `app/utils/pagination.py` but endpoints do not currently enforce page size. Future work.

## OpenAPI/Swagger

The live OpenAPI schema is generated at runtime by FastAPI:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- Raw schema: `http://localhost:8000/openapi.json`
