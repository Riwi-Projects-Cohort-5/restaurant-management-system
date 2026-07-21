# User Credentials — Restaurant Management System

Back to [docs/README.md](README.md).

## 1. Roles

The system has **four staff roles**. There is no `client` role — customers do not authenticate during the MVP.

| Code | Role | Capabilities |
|---|---|---|
| `admin` | Administrator | Full access. Can list, create, edit and delete users; reaches every module. |
| `waiter` | Waiter | Manages assigned tables; creates and updates orders. |
| `chef` | Chef | Kitchen display; updates kitchen line status. |
| `cashier` | Cashier | Processes payments and views payment history. |

The enum is defined at `backend/app/db/models/user.py:13` (`UserRole`) and enforced at the database level.

## 2. How a user is created

The backend exposes two ways:

### 2.1 `POST /api/v1/auth/register`

Currently public so the **first administrator** can be bootstrapped on a fresh database. It accepts JSON:

```http
POST /api/v1/auth/register HTTP/1.1
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@fogon.com",
  "password": "a-strong-password",
  "full_name": "Restaurant Admin",
  "role": "admin"
}
```

Response: the created `UserOut` (201), password never echoed back. The password is hashed with bcrypt before persistence.

> In production this endpoint should require an authenticated admin. Track that in a future task.

### 2.2 Authenticated admin actions

Once the first admin exists, additional users can be created by an authenticated admin through the same `POST /auth/register` endpoint (or through the Users panel reachable at `/admin` in the SPA).

For updates (e.g. role change) and deletes, use `PUT /api/v1/users/{id}` and `DELETE /api/v1/users/{id}` — both require a Bearer token. See [api-reference.md](api-reference.md).

### 2.3 Seed data

`backend/app/db/seed.py` is a Python script that inserts reference data (locations, categories, a few menu items, a default admin). Run it directly:

```bash
cd backend
python -m app.db.seed
```

Inspect that file to see exactly which seeded users it inserts, since the set may change between versions.

## 3. Stopping legacy demo users

Older documentation listed hardcoded users (`admin / admin123`, `waiter / waiter123`, etc.) from when the frontend was mock-only. **Those credentials do not work against the live backend.** They were leftovers of `frontend/src/services/mockUsers.js` (kept as a legacy fallback, not the source of truth).

## 4. Validating a user

| Endpoint | Auth | Returns |
|---|---|---|
| `POST /api/v1/auth/login` | public (form-urlencoded) | `{ access_token, token_type }` |
| `GET /api/v1/users/me` | 🔒 Bearer | Current user object |
| `GET /api/v1/users/` | 🔒 Bearer | List of all users (no passwords) |
| `GET /api/v1/users/{id}` | 🔒 Bearer | One user |

## 5. Field shape

`UserOut` (returned by `/me`, `/users`, `/users/{id}`):

```
{
  id, username, email, full_name, role, is_active, created_at, updated_at
}
```

`role` is one of `"admin" | "waiter" | "chef" | "cashier"`. The password hash is **never** included.

## 6. Integrity rules

These are enforced or recommended:

- `username` — unique, 1-50 chars.
- `email` — unique, max 255 chars.
- `password` — must be at least 6 characters (frontend enforced; backend schema mirror tracks the same rule).
- `role` — must be a valid enum value; defaults to `waiter` if omitted.
- `is_active = false` blocks `/users/me` (returns `403 Inactive user`).

## 7. Production recommendations

- Lock down `POST /auth/register` to authenticated admins after bootstrap.
- Enforce strong passwords (min length upper bound — recommended ≥ 8) and rotate `SECRET_KEY`.
- Add rate-limiting on `/auth/login` (e.g. slowapi or nginx).
- Track failed login attempts.
- Consider `HttpOnly` cookies for JWT storage instead of `localStorage` (frontend currently uses `localStorage["rms_token"]`).
- Periodically review `is_active = false` users and purge them.
