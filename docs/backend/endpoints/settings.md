# Settings endpoints

Prefix `/settings`. Back to [README.md](README.md).

Restaurant-level configuration: a single `Setting` row.

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/settings/` | public | Read restaurant settings. |
| PUT | `/settings/` | 🔒 | Update restaurant settings. |

## Fields

`restaurant_name`, `address`, `phone`, `email`, `tax_rate`, `currency`.

## Notes

- The `/settings` row is seeded by `backend/app/db/seed.py` (default restaurant `El Fogon Caribeno`, tax rate `11.5`, currency `USD`).
- The frontend /dashboard reads these values for branding and currency formatting.
- See [../database-guide.md#settings--setting](../database-guide.md) for the schema.
