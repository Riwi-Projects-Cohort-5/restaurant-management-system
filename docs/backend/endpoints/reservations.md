# Reservations endpoints

Prefix `/reservations`. Back to [README.md](README.md).

All endpoints require 🔒.

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/reservations/` | 🔒 | List. |
| GET | `/reservations/{reservation_id}` | 🔒 | Get one. |
| POST | `/reservations/` | 🔒 | Create. |
| PUT | `/reservations/{reservation_id}` | 🔒 | Update. |
| PUT | `/reservations/confirm/{reservation_id}` | 🔒 | Confirm a pending reservation. |
| DELETE | `/reservations/{reservation_id}` | 🔒 | Cancel (204). |

## Statuses

`pending`, `confirmed`, `cancelled`, `completed`.

## Notes

- The `id` is a `String(30)` (legacy client-side ID kept for compatibility).
- Walk-in guests are supported via `guest_name` / `guest_phone` — no `customer_id` needed.
- `confirm/{id}` is a dedicated action that flips a `pending` reservation to `confirmed` without overwriting other fields.

## Example — create

```http
POST /api/v1/reservations/
Content-Type: application/json

{
  "table_id": "uuid-of-table",
  "reservation_date": "2026-07-20T19:00:00",
  "guest_count": 4,
  "guest_name": "Carlos Ramírez",
  "guest_phone": "+57 310 555 1234",
  "notes": "Table by the window"
}
```
