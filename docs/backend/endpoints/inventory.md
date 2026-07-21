# Inventory endpoints

Prefix `/inventory`. Back to [README.md](README.md).

Insumos / ingredients and their stock movements. All endpoints require 🔒.

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/inventory/` | 🔒 | List items. |
| GET | `/inventory/low-stock` | 🔒 | Items below `min_stock`. |
| GET | `/inventory/{item_id}` | 🔒 | Get one. |
| POST | `/inventory/` | 🔒 | Create item. |
| PUT | `/inventory/{item_id}` | 🔒 | Update item. |
| POST | `/inventory/{item_id}/movements` | 🔒 | Register a stock movement. |
| DELETE | `/inventory/{item_id}` | 🔒 | Delete item (204). |

## Movement types

`in` (restock), `out` (consumption).

## Notes

- `quantity` is `Numeric(10,2)` — supports fractional units (`kg`, `L`).
- `min_stock` is the threshold for `/low-stock`.
- Movements are append-only ledger rows on `inventory_movements`; they are never updated, only inserted.

## Example — register movement

```http
POST /api/v1/inventory/{item_id}/movements
Content-Type: application/json

{
  "type": "in",
  "quantity": 5.0,
  "reason": "Weekly restock from supplier"
}
```
