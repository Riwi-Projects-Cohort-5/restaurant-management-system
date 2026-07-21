# Kitchen endpoints

Prefix `/kitchen`. Back to [README.md](README.md).

Kitchen Display System — one `KitchenOrder` per order item that needs to be cooked. All endpoints require 🔒.

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/kitchen/` | 🔒 | All pending + in-progress lines. |
| GET | `/kitchen/pending` | 🔒 | Pending only. |
| GET | `/kitchen/in-progress` | 🔒 | In-progress only. |
| GET | `/kitchen/order/{order_id}` | 🔒 | All lines for an order. |
| GET | `/kitchen/{kitchen_order_id}` | 🔒 | One kitchen order line. |
| PUT | `/kitchen/{kitchen_order_id}/status` | 🔒 | Update line status. |

## Statuses

`pending`, `preparing`, `ready`, `delivered`.

## Notes

- `menu_item_name` is a snapshot of the dish name so the kitchen display stays stable if the menu item is later renamed or deleted.
- `priority` (integer, default 0) lets the kitchen boost certain lines (higher = sooner).
- Cascade-deleted with the `orders` row (`ON DELETE CASCADE`).
