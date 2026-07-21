# Tables endpoints

Prefix `/tables`. Back to [README.md](README.md).

Restaurant tables. Reads are public; writes require 🔒.

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/tables/` | public | List all tables. |
| GET | `/tables/available` | public | Available tables only. |
| GET | `/tables/status` | public | Aggregated status summary. |
| GET | `/tables/{table_id}` | public | Get one. |
| POST | `/tables/` | 🔒 | Create. |
| PUT | `/tables/{table_id}` | 🔒 | Update data or status. |
| DELETE | `/tables/{table_id}` | 🔒 | Delete (204). |

## Statuses

`available`, `occupied`, `reserved`, `maintenance`.

## Notes

- `location_id` is optional and nullable (`ON DELETE SET NULL` against `locations.id`).
- `available` returns only tables whose status is `available`.
- `/status` is an aggregate read used by the dashboard.
