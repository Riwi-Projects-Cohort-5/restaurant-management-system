# Frontend Overview

Back to [docs/README.md](README.md).

The frontend is the Single Page Application that staff use to operate the restaurant. It is a **module-less Vanilla JS + Tailwind v4 + Vite** app — no React, no Vue, no runtime framework. The router is a tiny hand-rolled hash router; state is handled by a tiny observable store factory.

## 1. Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Language | JavaScript (no TypeScript) | modern ES2020+, ESM via Vite |
| Bundler / dev server | Vite 8 | dev port 3000 |
| Styling | Tailwind CSS v4 | CSS-first configuration; `@theme` block in `src/styles/app.css` is the source of truth |
| Icons | lucide | `createIcons` runs after every render |
| Charts | chart.js 4 | used by `views/reports/Reports.js` |
| HTTP | native `fetch` | wrapped in `src/services/api.js` |
| Auth | JWT (Bearer) | stored in `localStorage` under `rms_token` |
| Backend | FastAPI on `:8000` | dev proxy `/api → http://localhost:8000` (see `vite.config.js`) |

## 2. Directory layout

```
frontend/
├── vite.config.js          # dev server, /api proxy, force-reload plugin
├── package.json            # pnpm, scripts: dev / build / lint / format
└── src/
    ├── main.js             # entry — hash router, view map
    ├── styles/app.css      # @theme tokens (light + dark), animations
    ├── services/
    │   ├── api.js          # fetch wrapper (JWT, JSON, form-urlencoded login)
    │   ├── authService.js  # login / register / list users / refresh me
    │   ├── menuService.js, reservationService.js, paymentService.js,
    │   ├── inventoryService.js, locationService.js, reportService.js
    │   └── mock*.js        # legacy mocks, kept as fallback
    ├── store/
    │   ├── index.js        # createStore(state) — observable store factory
    │   ├── auth.js, posData.js, reservations.js, payments.js,
    │   ├── reports.js, inventory.js, menu.js, settings.js
    ├── utils/
    │   ├── routeGuard.js   # ROLE_ACCESS map, getHomeRoute, isRouteAllowed
    │   ├── theme.js        # light/dark toggle, persists "fogon-theme"
    │   ├── roleContext.js, withLoading.js, csvExport.js
    ├── components/
    │   ├── layout/        # AppShell, Sidebar, Topbar
    │   ├── ui/            # Toast, ToastManager, Skeleton, Spinner, modals
    │   ├── forms/         # InputField, PasswordToggle, CheckboxField, SubmitButton
    │   ├── dashboard/      # SalesChart, TableStatusCard
    │   ├── pos/           # CartPanel
    │   └── dev/           # RoleSwitcher (dev only)
    └── views/
        ├── auth/Login.js
        ├── dashboard/Dashboard.js
        ├── tables/Tables.js
        ├── orders/PosView.js
        ├── kitchen/Kitchen.js
        ├── reservations/list.js
        ├── menu/list.js
        ├── inventory/Inventory.js
        ├── payments/list.js
        ├── reports/Reports.js
        └── settings/Settings.js
```

## 3. Roles

The SPA exposes four staff roles — there is **no `client` role** (removed in the `responsive-design` merge). Defined in `utils/routeGuard.js`:

```js
const ROLES = { ADMIN: "admin", WAITER: "waiter", CHEF: "chef", CASHIER: "cashier" };
```

| Role | Home route | Reachable routes |
|---|---|---|
| `admin` | `/admin` (`/pos` view) | everything |
| `waiter` | `/orders` | `/orders`, `/pos`, `/tables`, `/menu` |
| `chef` | `/kitchen` | `/kitchen`, `/orders`, `/pos`, `/menu` |
| `cashier` | `/payments` | `/payments`, `/menu` |

Route access is enforced by `isRouteAllowed(path, role)` against `ROLE_ACCESS` in `routeGuard.js`. If a role has no permission, the SPA redirects to that role's home.

## 4. Routing

`main.js` defines a `routes` map (no switch statement) and listens to `hashchange`:

```js
const routes = {
  "/login":     { view: Login,        shell: false, auth: false },
  "/dashboard": { view: Dashboard,    shell: true,  auth: true },
  "/pos":       { view: PosView,      shell: true,  auth: true },
  "/kitchen":   { view: Kitchen,      shell: true,  auth: true },
  "/tables":    { view: TablesView,   shell: true,  auth: true },
  "/reservations": { view: Reservations, shell: true, auth: true },
  "/payments":  { view: Payments,     shell: true,  auth: true },
  "/menu":      { view: Menu,         shell: true,  auth: true },
  "/inventory": { view: Inventory,    shell: true,  auth: true },
  "/reports":   { view: Reports,      shell: true,  auth: true },
  "/settings":  { view: Settings,     shell: true,  auth: true },
  "/admin":     { view: PosView,      shell: true,  auth: true },
  "/orders":    { view: PosView,      shell: true,  auth: true },
};
```

- Hash routing only (`#/orders`). `window.navigate(path)` is a convenience helper.
- `shell: true` renders `AppShell` first; the view mounts into `#main-content` inside it.
- `shell: false` renders straight into `#app` (only `Login`).
- Unknown route with a logged-in user redirects to role home; without a user, to `/login`.
- Each view exposes `render(el)` returning a Promise (most async-fetch first) and an optional `init()` plus `destroy()` for cleanup.

### AppShell

`components/layout/AppShell.js` is a single rendering helper with:

- Topbar (role pill, user initials, logout, theme toggle).
- Sidebar built from `NAV_SECTIONS` filtered by the current role.
- `updateTopbarTitle(path)` to set the title of the current view.
- `RoleSwitcher` (dev-only, `components/dev/`) for testing roles without logging out.

## 5. State management

A 29-line reactive store factory at `store/index.js`:

```js
const store = createStore({ items: [], loading: false });
store.getState();
store.setState({ loading: true });
store.subscribe((newState, oldState) => { /* ... */ });
```

Module stores:

| Store | Holds | Used by |
|---|---|---|
| `auth` | current user, isAuthenticated, error | Login, AppShell, every guarded view |
| `posData` | POS cart, selected table, items | PosView, CartPanel |
| `reservations` | list, today's reservations | Reservations view |
| `payments` | list, filters | Payments view |
| `reports` | series, today's stats | Reports view |
| `inventory` | items, low-stock | Inventory view |
| `menu` | items, categories, filters | Menu view |
| `settings` | restaurant settings | Settings view |

## 6. Backend integration

All HTTP goes through `services/api.js`:

```js
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
// Bearer token from localStorage["rms_token"]; auto-attached in buildHeaders()
// 401 → removes token, redirects to #/login
```

- `apiGet`, `apiPost`, `apiPut`, `apiDelete` — JSON helpers.
- `apiLogin(username, password)` — uses `URLSearchParams` (`application/x-www-form-urlencoded`) matching FastAPI's `OAuth2PasswordRequestForm`.

`authService.js` ties login to `/auth/login` + `GET /users/me` (it then stores the mapped user under `rms_session`). User-shape mapping (`mapBackendUser`) normalises snake_case backend fields (`full_name`, `created_at`) to camelCase frontend fields.

Service modules (`menuService.js`, `reservationService.js`, `paymentService.js`, `inventoryService.js`, `locationService.js`, `reportService.js`) wrap specific backend endpoints — see each file for usage.

### Legacy mocks

`services/mock*.js` (`mockUsers`, `mockReservations`, `mockReports`, `mockProducts`, `mockPayments`, `mockInventory`, `mockCategories`) are leftovers from the mock-only prototype. **Do not rely on them.** They remain in the tree as fallback / debugging tools but new features should call the real backend through `api.js`. They will be removed once every view is verified against the live backend.

## 7. Theming

Two themes are defined via CSS custom property overrides (`docs/ui/design-system/README.md`):

| Theme | Trigger | localStorage key |
|---|---|---|
| Light | default | `fogon-theme = "light"` (or unset) |
| Dark | `<html data-theme="dark">` | `fogon-theme = "dark"` |

`utils/theme.js` exposes `initTheme()`, `toggleTheme()`, `isDark()`, `getLogoPath()`. The toggle in `AppShell` Topbar flips the attribute and persists the choice.

## 8. Loading states & feedback

Three primitives (`docs/ui/feedback-system/README.md`):

- **Skeleton** — via `utils/withLoading.js` (`withLoading()`, `renderWithSkeleton()`, `Skeletons.*` builders).
- **Spinner** — inline spinner on submit buttons (`components/forms/SubmitButton.js`).
- **Toast** — notification popups (`components/ui/Toast.js`, `ToastManager.js`).

Pattern: page initial load uses skeleton; sub-view navigation uses `renderWithSkeleton`; form submission shows spinner; CRUD results show toast.

## 9. Running locally

```bash
cd frontend
pnpm install          # package manager pinned to pnpm 11.3.0
pnpm dev              # serves on :3000 with HMR + force-reload plugin
pnpm build            # static bundle in dist/
pnpm preview          # serve the built bundle
pnpm lint             # eslint src/
pnpm format           # prettier --write on src/**/*.{js,css,json}
```

Make sure the backend is running on `:8000` (or set `VITE_API_URL`).

## 10. Scripts & lint

Declared in `package.json`:

| Script | Purpose |
|---|---|
| `dev` | `vite` |
| `build` | `vite build` |
| `preview` | `vite preview` |
| `lint` | `eslint src/` |
| `lint:fix` | `eslint src/ --fix` |
| `format` | `prettier --write "src/**/*.{js,css,json}"` |
| `format:check` | prettier --check |

## 11. Conventions

- No build framework — write idiomatic ES modules, do not introduce React/Vue.
- Keep service modules thin; map backend snake_case to camelCase before reaching the store.
- Always `initTheme()` at boot.
- After async render runs, call `window.createIcons()` so Lucide renders SVGs.
- Provide `destroy()` on every view that attaches listeners so the next view cleans them up.
- New roles or routes need updates in `utils/routeGuard.js` and `components/layout/AppShell.js` (`NAV_SECTIONS`).
