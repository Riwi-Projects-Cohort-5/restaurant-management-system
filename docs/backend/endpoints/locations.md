# Locations endpoints

Prefix `/locations`. Back to [README.md](README.md).

Physical dining zones to group tables (Terrace, Interior, VIP, Bar, …).

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/locations/` | public | List all. |
| GET | `/locations/{location_id}` | public | Get one. |
| POST | `/locations/` | 🔒 | Create. |
| PUT | `/locations/{location_id}` | 🔒 | Update. |
| DELETE | `/locations/{location_id}` | 🔒 | Delete (204). |

## Notes

- Deleting a location sets `tables.location_id` to `NULL` (`ON DELETE SET NULL`) — the tables remain.
- See [../database-guide.md#location--location](../database-guide.md) for the schema.
