# Orders endpoints

Prefix `/orders`. Back to [README.md](README.md).

All endpoints require 🔒.

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/orders/` | 🔒 | List. |
| GET | `/orders/active` | 🔒 | Active orders only. |
| GET | `/orders/{order_id}` | 🔒 | Get one. |
| POST | `/orders/` | 🔒 | Create. |
| POST | `/orders/{order_id}/items` | 🔒 | Add an item line. |
| PUT | `/orders/{order_id}/status` | 🔒 | Update order status. |
| DELETE | `/orders/{order_id}` | 🔒 | Cancel / delete (204). |

## Statuses

`pending`, `in_progress`, `completed`, `cancelled`.

## Notes

- An order belongs to one `waiter` and one `table` (both non-null FKs).
- May optionally link to a `reservation` via `reservation_id` (nullable, `ON DELETE SET NULL`).
- Adding a line via `/items` snapshots the menu item's price into `order_items.unit_price` so historical totals stay accurate.

## Examples

Create:

```http
POST /api/v1/orders/
Content-Type: application/json

{ "table_id": "uuid-of-table" }
```

Add an item:

```http
POST /api/v1/orders/{order_id}/items
Content-Type: application/json

{
  "menu_item_id": "uuid-of-item",
  "quantity": 2
}
```

Update status:

```http
PUT /api/v1/orders/{order_id}/status
Content-Type: application/json

{ "status": "in_progress" }
```
