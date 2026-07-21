# Reports endpoints

Prefix `/reports`. Back to [README.md](README.md).

Operational and financial reports. All endpoints require 🔒.

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/reports/sales` | 🔒 | Sales by date range. |
| GET | `/reports/products` | 🔒 | Best-selling products. |
| GET | `/reports/daily-sales` | 🔒 | Daily sales series. |
| GET | `/reports/today-stats` | 🔒 | Today's aggregate stats. |

## Example

```http
GET /api/v1/reports/sales?start_date=2026-07-01T00:00:00&end_date=2026-07-15T23:59:59
```

## Notes

- Reuses `Order`, `OrderItem`, `Payment` (no dedicated report tables).
- Pagination is not yet standardized — see `app/utils/pagination.py` for helpers.
