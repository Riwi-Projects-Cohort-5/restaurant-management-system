# Contributing

Back to [docs/README.md](README.md).

Thank you for contributing to the Restaurant Management System. This file captures the Git workflow, commit style, testing commands and how to land a new module end-to-end.

## 1. Git workflow

### Branching

We follow a `develop`-based trunk. **Never commit directly to `main` or `develop`.**

1. `git fetch origin develop:develop` — keep your local `develop` up to date.
2. Create a feature branch **off `develop`** using the convention:

   ```
   <github-username>/<type>/<slug>
   ```

   - `type` is one of: `feature`, `fix`, `chore`, `docs`, `refactor`, `test`.
   - `slug` is a short kebab-case description (`responsive-design`, `night-mode`, `review-docs`).
   - `github-username` is your actual GitHub handle. Example: `Its-JrDev/chore/review-docs`.

   ```bash
   git checkout develop
   git checkout -b <your-handle>/<type>/<slug>
   ```

3. Rebase on `develop` regularly to avoid drift:

   ```bash
   git fetch origin develop:develop
   git rebase develop
   ```

### Pull requests

- Open PRs against **`develop`**, not `main`.
- One PR per logical change. If you need to ship multiple features, split them.
- Keep titles in lowercase imperative: `feat: add night mode theme toggle`.
- Add `closes #N` in the PR description to auto-close issues.
- Squash-merge into `develop` is the default.

### Releases to `main`

`main` is the production branch. It is only updated by merging a **release PR** from `develop` → `main`. The release flow is automated by `.github/workflows/release.yml`:

1. **Open a PR `develop` → `main`** (typically titled `release: vX.Y.Z` or `chore: cut release <date>`). The workflow's validation gate runs: backend lint + tests (with Postgres service container), frontend lint + prettier + build. No deploys run on a PR.
2. **Merge the PR** once the gate is green and reviewers approve (the `main` branch should be protected with "Require status checks to pass" and "Require a pull request before merging").
3. On push to `main`, the workflow:
   - Computes the next semver tag (first release → `v1.0.0` aligned with `frontend/package.json`; subsequent releases auto-bump by scanning commit subjects since the previous tag: `BREAKING CHANGE` / `!:` → major, `feat(...)` → minor, default → patch).
   - Creates and pushes the tag.
   - Publishes a GitHub Release with notes categorised via `.github/release.yml`.
   - Triggers production deploy to **Render** for the backend (`RENDER_PROD_SERVICE_ID`) and to **Vercel** for the frontend (`VERCEL_TOKEN`).

### Required secrets for production deploys

Add these to the repo's `Settings → Secrets and variables → Actions`:

| Secret | Platform | Purpose |
|---|---|---|
| `RENDER_API_KEY` | Render | API token, used by all Render deploy jobs (develop + main). |
| `RENDER_SERVICE_ID` | Render | Preview backend service ID — used by the `develop` deploy in `backend.yml`. |
| `RENDER_PROD_SERVICE_ID` | Render | **Production** backend service ID — used by the release workflow on `main`. |
| `VERCEL_TOKEN` | Vercel | API token, used by the frontend deploy job. Create at Vercel Account → Settings → Tokens. |
| `VERCEL_ORG_ID` | Vercel | Organisation ID from Vercel project Settings → General → Project ID (the `orgId` in `.vercel/project.json`). |
| `VERCEL_PROJECT_ID` | Vercel | Project ID from Vercel project Settings → General → Project ID. |

> If Vercel is already connected to the GitHub repo with auto-deploy enabled on `main`, the frontend deploy job is optional. The release workflow's `deploy-frontend` step will gracefully skip if `VERCEL_TOKEN` is not set.

> Keeping develop and production Render service IDs separate means preview deploys (to `develop`) and release deploys (to `main`) land on different services and never collide.

### Branch protection (recommended)

On GitHub → Settings → Branches:

- `main`: require pull request before merging, require status checks (`Validate backend`, `Validate frontend`, `Release gate`), require linear history, do not allow force pushes.
- `develop`: require pull request before merging (or allow direct pushes if the team is small), require `Backend CI/CD` and `Frontend CI` checks.

## 2. Commit style

Conventional Commits. Type + colon + short imperative description, lowercase.

Allowed types: `feat`, `fix`, `docs`, `chore`, `refactor`, `style`, `test`, `perf`, `build`, `ci`, `revert`.

Examples:

```
feat: add night mode theme toggle with dark UI palette
fix: resolve UUIDs to names in order detail
docs: reorganize documentation under docs/ui/
style: prettier format night-mode files
chore: bump tailwind to v4.3.3
```

Complex changes may optionally add a body, separated from the subject by an empty line. Avoid trailers you do not need (no "Co-Authored-By" spam).

## 3. Local development

### Backend

```bash
docker-compose up -d
cd backend
pip install -r requirements.txt
cp .env.example .env            # set SECRET_KEY
alembic upgrade head
python -m app.db.seed           # optional first admin + reference data
pytest                          # run tests
uvicorn app.main:app --reload   # dev server on :8000
```

### Frontend

```bash
cd frontend
pnpm install
pnpm dev        # :3000 with /api → :8000 proxy
pnpm lint
pnpm format:check
pnpm build      # verify production bundle
```

## 4. Lint & format

| Area | Command |
|---|---|
| Backend | `ruff check backend/` (project uses `backend/ruff.toml`). |
| Frontend lint | `pnpm lint` (eslint `src/`). |
| Frontend fix | `pnpm lint:fix`. |
| Frontend format | `pnpm format`. |
| Frontend format check | `pnpm format:check`. |

CI runs the same commands — make them pass locally before pushing.

## 5. Tests

### Backend (pytest)

```bash
cd backend
pytest
pytest tests/test_health.py     # single file
pytest -k reservations          # by name match
```

Shared fixtures live in `tests/conftest.py`.

### Frontend

There is no frontend test suite yet. Use `pnpm lint` and manual smoke checks against `/login`, `/dashboard`, `/orders`, `/kitchen`, `/tables`, `/reservations`, `/menu`, `/inventory`, `/payments`, `/reports`, `/settings`. Each view should render an empty skeleton, then populate from the live backend, then handle empty / error states.

## 6. Adding a new module end-to-end

The checklist below assumes a simple CRUD module named `foo` (singular model, one endpoint group, one SPA view).

### Backend

1. **Model** — `backend/app/db/models/foo.py`. Define the SQLAlchemy class. Add to `backend/app/db/models/__init__.py`'s `__all__`.
2. **Migration** — `cd backend && alembic revision -m "add foo"`. Write `upgrade()`/`downgrade()`. Apply with `alembic upgrade head`.
3. **Schema** — `backend/app/db/schemas/foo.py`. Define `FooCreate`, `FooUpdate`, `FooOut` (Pydantic v2).
4. **Repository** — `backend/app/repositories/foo_repository.py`. Expose CRUD methods using a `Session`.
5. **Service** — `backend/app/services/foo_service.py`. Business rules. Imports the repository and the DB session.
6. **Router** — `backend/app/api/v1/foo.py`. Endpoints; inject `Depends(get_db)` and `Depends(get_current_user)` where appropriate. Use the schemas for request/response models.
7. **Register the router** in `backend/app/api/router.py` (import + `api_router.include_router(foo.router)`).
8. **Tests** — `backend/tests/test_foo.py`.

### Frontend

1. **Service** — `frontend/src/services/fooService.js`. Wraps `apiGet/apiPost/apiPut/apiDelete` for `/api/v1/foo`.
2. **Store** (optional) — `frontend/src/store/foo.js` with `createStore()`.
3. **View** — `frontend/src/views/foo/list.js` (or `Foo.js`). Exports `render`, `init`, `destroy`. Use a Skeleton while loading.
4. **Register route** in `frontend/src/main.js` (import + row in `routes`).
5. **Guard** in `frontend/src/utils/routeGuard.js` (`ROLE_ACCESS[/foo] = [ROLES.ADMIN, ...]`).
6. **Sidebar entry** in `frontend/src/components/layout/AppShell.js` (`NAV_SECTIONS`).
7. **Modal** (if needed) — `frontend/src/components/ui/FooModal.js`.

### Docs
8. Update [backend/api-reference.md](backend/api-reference.md), [backend/database-guide.md](backend/database-guide.md) (new table), 
[frontend/overview.md](frontend/overview.md) if it adds a role or route.
9. Add a [CHANGELOG.md](CHANGELOG.md) entry like `docs: add /foo endpoint and Foo view`.

## 7. Review checklist

Before opening a PR, make sure:

- [ ] Branch is rebased on the latest `develop`.
- [ ] Commit subject follows Conventional Commits.
- [ ] `pnpm lint` and `pnpm format:check` pass on the frontend.
- [ ] `pytest` passes on the backend (or skip with a justification if it's a frontend-only change).
- [ ] New endpoints are reflected in `docs/backend/api-reference.md` and in a new `docs/backend/endpoints/<module>.md` file.
- [ ] New tables/columns have a migration and an entry in `docs/backend/database-guide.md`.
- [ ] New roles or routes are reflected in `frontend/src/utils/routeGuard.js` and `docs/frontend/overview.md`.
- [ ] `docs/README.md` index is still accurate (or has a new row).
- [ ] `CHANGELOG.md` captures the change.
- [ ] If this change targets `main` (release PR), the `Validate backend`, `Validate frontend` and `Release gate` checks pass before merging.

## 8. Code style quick wins

- Backend: keep routers thin, business logic in services, queries in repositories.
- Frontend: do not call `fetch` directly from views — go through a `services/*Service.js`.
- Do not introduce a UI framework (React/Vue) without team consensus.
- Tailwind v4 CSS-first — add new tokens in `frontend/src/styles/app.css` `@theme`, not in a JS config.
- Hash routing only — do not add a third-party router lib without discussing.
- Keep `localStorage` keys namespaced (`rms_token`, `rms_session`, `fogon-theme`).

## 9. Reporting issues

Open a GitHub issue with:

1. What you expected, what actually happened.
2. Minimal reproduction steps.
3. Backend log excerpt or browser console excerpt.
4. The role + view + route where it happened.

## 10. Security disclosures

Do not open public issues for security vulnerabilities. Privately report them to the maintainers (see the contact info on the repository's security policy). Never commit secrets, real credentials or production `SECRET_KEY` values.
