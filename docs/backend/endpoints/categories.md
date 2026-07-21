# Categories endpoints

Prefix `/categories`. Back to [README.md](README.md).

Group dishes into themed categories (Platos fuertes, Entradas, Bebidas, …).

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/categories/` | public | List all categories. |
| GET | `/categories/{category_id}` | public | Get one. |
| POST | `/categories/` | 🔒 | Create. |
| PUT | `/categories/{category_id}` | 🔒 | Update. |
| DELETE | `/categories/{category_id}` | 🔒 | Delete (204). |

## Example — create

```http
POST /api/v1/categories/
Content-Type: application/json

{
  "name": "Main dishes",
  "description": "House signature plates"
}
```
