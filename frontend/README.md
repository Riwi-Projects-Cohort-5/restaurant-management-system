# Frontend — Restaurant Management System

> The full frontend documentation lives in the project docs. See:

- [`docs/frontend-overview.md`](../docs/frontend-overview.md) — architecture, routing, state, theming.
- [`docs/IMPLEMENTATION_GUIDE.md`](../docs/IMPLEMENTATION_GUIDE.md) — how to build a new view/module.
- [`docs/ui/design-system/README.md`](../docs/ui/design-system/README.md) — Tailwind v4 tokens, light/dark themes.
- [`docs/api-reference.md`](../docs/api-reference.md) — backend endpoints the SPA calls.
- [`docs/contributing.md`](../docs/contributing.md) — Git workflow, lint and test commands.

## Quick start

```bash
pnpm install        # package manager pinned to pnpm 11.3.0
pnpm dev            # http://localhost:3000  (proxies /api → http://localhost:8000)
pnpm build
pnpm preview
```

Make sure the backend is running on `:8000` (or set `VITE_API_URL`).

## Roles

Four staff roles — there is **no `client` role**:

| Code | Role |
|---|---|
| `admin` | Administrator — full access. |
| `waiter` | Waiter — tables and orders. |
| `chef` | Chef — kitchen display. |
| `cashier` | Cashier — payments. |

Authoritative map lives in `src/utils/routeGuard.js`.

## Scripts

| Script | Purpose |
|---|---|
| `dev` | Vite dev server with HMR + force-reload. |
| `build` | Production bundle in `dist/`. |
| `preview` | Serve the built bundle. |
| `lint`, `lint:fix` | ESLint on `src/`. |
| `format`, `format:check` | Prettier on `src/**/*.{js,css,json}`. |

## Legacy mocks

`src/services/mock*.js` files are leftovers from the mock-only prototype and are **not imported by any other module**. They remain for debugging only — do not build new features against them. New code must call the live backend through `src/services/api.js`.
