# Documentation Index — Restaurant Management System

This is the entry point for the project documentation. All files live under `docs/` unless noted otherwise. Root-level docs (`README.md`, `structure-explanation.md`) sit at the repository root.

## Quick links

| Document | What it covers |
|---|---|
| [../README.md](../README.md) | Project overview, quick start, tech stack |
| [../structure-explanation.md](../structure-explanation.md) | Repository layout — every directory and its purpose |
| [vision.md](vision.md) | Product vision, users, MVP scope |
| [architecture.md](architecture.md) | System architecture (C4 diagrams, layered backend, container topology) |
| [backend-overview.md](backend-overview.md) | Backend modules, layers, tech stack |
| [backend/endpoints/DOCUMENTACION_BACKEND.md](backend/endpoints/DOCUMENTACION_BACKEND.md) | End-to-end backend write-up with examples |
| [api-reference.md](api-reference.md) | Canonical API reference — one table per resource |
| [database-guide.md](database-guide.md) | Schema, tables, relationships, migrations |
| [frontend-overview.md](frontend-overview.md) | Frontend architecture, routing, state, theming |
| [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) | How to build a new frontend view/module |
| [USER_CREDENTIALS.md](USER_CREDENTIALS.md) | How users are created, roles, security notes |
| [contributing.md](contributing.md) | Git workflow, commit style, testing commands |
| [CHANGELOG.md](CHANGELOG.md) | Documentation change log |
| [ui/design-system/README.md](ui/design-system/README.md) | Tailwind v4 design tokens, light/dark themes |
| [ui/feedback-system/README.md](ui/feedback-system/README.md) | Toast, skeleton, spinner primitives |

## Audience map

| You are... | Read first |
|---|---|
| New developer | `README.md` → `structure-explanation.md` → `architecture.md` → `contributing.md` |
| Backend contributor | `backend-overview.md` → `api-reference.md` → `database-guide.md` |
| Frontend contributor | `frontend-overview.md` → `IMPLEMENTATION_GUIDE.md` → `ui/design-system/README.md` |
| Product owner / stakeholder | `vision.md` → `README.md` |
| DevOps | `architecture.md` → `../docker-compose.yml` → `../render.yaml` |

## Conventions

- Docs are written in English to keep the codebase accessible; module / endpoint names stay as they are in code.
- Every doc should end with a link back to this index (`docs/README.md`).
- When you add a new doc, also add a row to the table above and a `CHANGELOG.md` entry.
