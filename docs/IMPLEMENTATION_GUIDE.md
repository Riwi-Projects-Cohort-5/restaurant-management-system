# Frontend Implementation Guide

How to build and extend a view/module in the SPA. For the architecture overview see [frontend-overview.md](frontend-overview.md). For styling tokens see [ui/design-system/README.md](ui/design-system/README.md).

Back to [docs/README.md](README.md).

## 1. Project architecture

```
frontend/
├── src/
│   ├── main.js              # entry — hash router, view map
│   ├── services/
│   │   ├── api.js           # fetch wrapper, JWT, form-urlencoded login
│   │   ├── authService.js    # login / register / currentUser / users CRUD
│   │   └── ...Service.js     # one per backend module
│   ├── store/
│   │   ├── index.js          # createStore() factory
│   │   ├── auth.js           # auth state + actions
│   │   └── posData.js, reservations.js, payments.js, ...
│   ├── utils/
│   │   ├── routeGuard.js     # ROLE_ACCESS map, isRouteAllowed
│   │   ├── theme.js          # fogon-theme toggle
│   │   └── withLoading.js    # skeleton wrapper
│   ├── components/
│   │   ├── layout/           # AppShell, Sidebar, Topbar
│   │   ├── ui/               # Toast, Spinner, Skeleton, modals
│   │   └── forms/            # InputField, SubmitButton, ...
│   ├── views/
│   │   ├── auth/             # Login
│   │   ├── dashboard/        # Dashboard
│   │   ├── orders/           # PosView  ← /pos and /orders
│   │   ├── kitchen/          # Kitchen
│   │   ├── tables/           # Tables
│   │   ├── reservations/     # list
│   │   ├── menu/             # list
│   │   ├── inventory/        # Inventory
│   │   ├── payments/         # list
│   │   ├── reports/          # Reports
│   │   └── settings/         # Settings
│   └── styles/app.css        # @theme tokens (light + dark)
├── package.json              # pnpm, scripts: dev / build / lint / format
└── vite.config.js            # :3000, /api proxy to :8000
```

## 2. Run the project

```bash
cd frontend
pnpm install                 # package manager pinned to pnpm 11.3.0
pnpm dev                     # http://localhost:3000
pnpm build
pnpm preview
```

### Dependencies

- **Vite** 8 — bundler.
- **Tailwind CSS** 4 — via `@tailwindcss/vite`, CSS-first config.
- **lucide** 1 — icon set.
- **chart.js** 4 — used by Reports.
- No UI framework — Vanilla JS + ES modules.

## 3. Roles & permissions

The backend and the SPA agree on **four roles**:

| Role | Code | Default route | Routes reachable |
|---|---|---|---|
| Administrator | `admin` | `/admin` | all |
| Waiter | `waiter` | `/orders` | `/orders`, `/pos`, `/tables`, `/menu` |
| Chef | `chef` | `/kitchen` | `/kitchen`, `/orders`, `/pos`, `/menu` |
| Cashier | `cashier` | `/payments` | `/payments`, `/menu` |

There is **no `client` role**. Authoritative map lives in `src/utils/routeGuard.js` (`ROLES` and `ROLE_ACCESS`).

### Login flow

1. User submits credentials in `views/auth/Login.js`.
2. `store/auth.js#\`login()\`` calls `services/authService.js#\`login()\`` → `apiLogin` (form-urlencoded) on `POST /api/v1/auth/login`.
3. Backend returns `{ access_token, token_type }`. Token stored in `localStorage["rms_token"]`.
4. `authService.login` then calls `GET /api/v1/users/me` and stores the mapped user in `localStorage["rms_session"]` and the `auth` store.
5. SPA redirects to `getHomeRoute(user.role)`.

### Usage in components

```js
import * as authStore from "../store/auth.js";

if (authStore.isAuthenticated()) {
  const user = authStore.currentUser();
  console.log(user.username, user.role);
}
```

### Role-guard a view

```js
import { guardRole, ROLES } from "../utils/routeGuard.js";

const user = authStore.currentUser();
if (!guardRole(user, [ROLES.ADMIN, ROLES.WAITER])) return; // auto-redirects
```

### Logout

```js
authStore.logout();           // clears token + session + store
window.location.hash = "#/login";
```

## 4. Routing

`main.js` keeps a `routes` object — **not a switch** — and listens to `hashchange`:

```js
const routes = {
  "/login":     { view: Login,        shell: false, auth: false },
  "/dashboard": { view: Dashboard,    shell: true,  auth: true },
  "/pos":       { view: PosView,      shell: true,  auth: true },
  // ...
};
```

- `shell: true` renders the AppShell first; the view mounts inside `#main-content`.
- View modules expose `render(el)` (may return a Promise) and optionally `init()` and `destroy()`.

### Add a new route

1. Create `src/views/new-page/NewPage.js` exporting `render`, `init`, `destroy`.
2. Import the module in `main.js`.
3. Add a row to `routes`.
4. Add the path to `ROLE_ACCESS` in `routeGuard.js` so the guard knows who can see it.
5. Add the menu item to `NAV_SECTIONS` in `components/layout/AppShell.js` if it should appear in the sidebar.

```js
// main.js
import NewPage from "./views/new-page/NewPage.js";

const routes = {
  // ...
  "/new-page": { view: NewPage, shell: true, auth: true },
};
```

```js
// routeGuard.js
const ROLE_ACCESS = {
  // ...
  "/new-page": [ROLES.ADMIN, ROLES.WAITER],
};
```

## 5. Views — minimal template

`src/views/my-module/MyModule.js`:

```js
import * as authStore from "../../store/auth.js";
import { guardRole, ROLES } from "../../utils/routeGuard.js";
import { showToast } from "../../components/ui/ToastManager.js";
import { Skeletons, withLoading } from "../../utils/withLoading.js";

export async function render(container) {
  const user = authStore.currentUser();
  if (!guardRole(user, [ROLES.ADMIN])) return;

  container.innerHTML = Skeletons.list({ title: "My module" });

  // fetch data...
  // container.innerHTML = real markup
  // attach event listeners
}

export function init() {
  // runs after render(); good place to bind DOM events
}

export function destroy() {
  // runs before the view unmounts; remove listeners and timers
}
```

## 6. State store

A tiny observable factory in `store/index.js`:

```js
import { createStore } from "../store/index.js";

const store = createStore({ items: [], loading: false, error: null });
store.getState();
store.setState({ loading: true });                 // merge
store.setState((s) => ({ items: [...s.items, x] }));
const off = store.subscribe((next, prev) => { /* ... */ });
off();
```

Existing module stores: `auth`, `posData`, `reservations`, `payments`, `reports`, `inventory`, `menu`, `settings`.

## 7. Services → backend

All HTTP calls go through `services/api.js`:

| Export | Use |
|---|---|
| `apiGet(path)` | GET `/api/v1/...` with Bearer auto-attached. |
| `apiPost(path, body)` | JSON POST. |
| `apiPut(path, body)` | JSON PUT. |
| `apiDelete(path)` | DELETE. |
| `apiLogin(username, password)` | `application/x-www-form-urlencoded` POST to `/api/v1/auth/login`. |
| `getToken / setToken / removeToken` | low-level token access. |

401 responses auto-clear the token and redirect to `#/login`. Non-2xx responses throw an `Error` with the backend's `detail` message (the SPA surfaces it via toast).

Create new service modules as thin wrappers — never call `fetch` directly from components.

## 8. Forms & feedback

| What | Where | How |
|---|---|---|
| Input field | `components/forms/InputField.js` | `inputField({ id, label, type, value, ... })`. |
| Password input | `components/forms/PasswordToggle.js` | adds show/hide toggle. |
| Checkbox | `components/forms/CheckboxField.js` | |
| Submit button (with spinner) | `components/forms/SubmitButton.js` | `initSubmitButton(form, onSubmit)`. |
| Toast | `components/ui/ToastManager.js` | `showToast({ type, message })`. Types: `success / error / warning / info`. |
| Skeleton on view load | `utils/withLoading.js` | `withLoading(renderFn, Skeletons.xxx)` or `renderWithSkeleton()`. |
| Dev role switcher | `components/dev/RoleSwitcher.js` | dev-only, convenient for testing role guard. |

## 9. Adding a module end-to-end

| Step | Where |
|---|---|
| 1. Backend model + migration | `backend/app/db/models/*.py`, `alembic/versions/00N_*.py` |
| 2. Backend schemas | `backend/app/db/schemas/*.py` |
| 3. Backend repository | `backend/app/repositories/*.py` |
| 4. Backend service | `backend/app/services/*.py` |
| 5. Backend router | `backend/app/api/v1/*.py`, register in `router.py` |
| 6. Frontend service | `frontend/src/services/newThingService.js` |
| 7. Frontend store (if needed) | `frontend/src/store/newThing.js` |
| 8. Frontend view | `frontend/src/views/new-thing/NewThing.js` |
| 9. Register route | `main.js` (import + `routes`) |
| 10. Guard it | `routeGuard.js` (`ROLE_ACCESS`) |
| 11. Sidebar entry | `AppShell.js` (`NAV_SECTIONS`) |
| 12. (optional) Modal/skeleton | `components/ui/*` or `utils/withLoading.js` |

## 10. Demo users — gone

The old `{role}123` hardcoded users (`usr_001 admin`, etc.) were used by the mock-only prototype. They do **not** exist against the live backend. Create the first admin through `POST /api/v1/auth/register` (currently public) and additional users through the same endpoint (when called by an authenticated admin) or via the Users view reachable from `/admin`. Demo seed users may be added via `python -m app.db.seed` on the backend; see [USER_CREDENTIALS.md](USER_CREDENTIALS.md).

## 11. Useful commands

```bash
pnpm install          # install deps
pnpm dev              # dev server with HMR
pnpm build            # production bundle in dist/
pnpm preview          # serve dist/
pnpm lint             # eslint src/
pnpm lint:fix         # eslint --fix
pnpm format           # prettier write
pnpm format:check     # prettier check
```

## 12. Security notes for contributors

- JWT token lives in `localStorage` (XS-leak risk in production — track future migration to `HttpOnly` cookies).
- Never write passwords back into `mock*.js` or any service file.
- `Register` is open today only so the first admin can boot — flag this before going to production.
- Enforce role checks at the backend (`Depends(get_current_user)` + role guard) too — the frontend guard is UX only.
