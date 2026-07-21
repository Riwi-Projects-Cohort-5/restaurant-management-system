# Menu endpoints

Prefix `/menu`. Back to [README.md](README.md).

Menu items (dishes) the restaurant sells. Public reads — locked writes.

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/menu/` | public | List all items. |
| GET | `/menu/available` | public | Available items only. |
| GET | `/menu/category/{category_id}` | public | Filter by category. |
| GET | `/menu/{item_id}` | public | Get one. |
| POST | `/menu/` | 🔒 | Create. |
| PUT | `/menu/{item_id}` | 🔒 | Update. |
| DELETE | `/menu/{item_id}` | 🔒 | Delete (204). |

## Notes

- Each item references a `category_id` (non-null FK to `categories`).
- `is_available` boolean drives `/available` and the public menu display.
- `price` is `Numeric(10,2)` — do not store currency symbols in the column; currency is in `settings`.
