# Payments endpoints

Prefix `/payments`. Back to [README.md](README.md).

Order payments. All endpoints require 🔒.

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/payments/` | 🔒 | List. |
| GET | `/payments/order/{order_id}` | 🔒 | Find payment by order. |
| GET | `/payments/{payment_id}` | 🔒 | Get one. |
| POST | `/payments/` | 🔒 | Create. |
| PUT | `/payments/{payment_id}` | 🔒 | Update (e.g. complete, refund). |
| DELETE | `/payments/{payment_id}` | 🔒 | Delete (204). |

## Methods

`cash`, `card`, `transfer`.

## Statuses

`pending`, `completed`, `refunded`, `failed`.

## Notes

- `order_id` is **unique** — one payment per order. Use `/order/{order_id}` to find it.
- `amount` is `Numeric(10,2)`.

## Example — register payment

```http
POST /api/v1/payments/
Content-Type: application/json

{
  "order_id": "uuid-of-order",
  "amount": 45000,
  "method": "cash"
}
```
