# Auth endpoints

Prefix `/auth`. Back to [README.md](README.md).

JWT authentication using the OAuth2 password flow with HS256. Tokens last 30 minutes (configurable via `ACCESS_TOKEN_EXPIRE_MINUTES`).

## Flow

1. Client registers a user via `POST /api/v1/auth/register` (currently public — used to bootstrap the first admin).
2. Client logs in via `POST /api/v1/auth/login` and receives `access_token`.
3. Subsequent requests include the header `Authorization: Bearer <access_token>`.

## Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/login` | public | Authenticate, get JWT (form-urlencoded). |
| POST | `/auth/register` | public | Register a user (JSON). |

### Login — `application/x-www-form-urlencoded`

FastAPI's `OAuth2PasswordRequestForm` consumes form data, NOT JSON.

```http
POST /api/v1/auth/login HTTP/1.1
Content-Type: application/x-www-form-urlencoded

username=admin&password=your-strong-password
```

Response:

```json
{ "access_token": "eyJhbGciOi...", "token_type": "bearer" }
```

### Register — JSON

```http
POST /api/v1/auth/register HTTP/1.1
Content-Type: application/json

{
  "username": "diego",
  "email": "diego@restaurant.com",
  "password": "a-strong-password",
  "full_name": "Diego Pérez",
  "role": "waiter"
}
```

Returns `UserOut` (HTTP 201), password never echoed back. The password is hashed with bcrypt before persistence.

> `register` is open today only so the first admin can be bootstrapped on a fresh database. Lock it down to authenticated admins before going to production.

See [../user-credentials.md](../user-credentials.md) for roles and the bootstrap path.
