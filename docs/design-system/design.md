# Restaurant Management System — Design System / Tokens

## Architecture

Tokens are organized in three tiers across four sets:

```
primitives ──> semantic ──> component
                    │
              semantic-dark (override)
```

| Set | Tokens | Status | Purpose |
|-----|--------|--------|---------|
| `rms/primitives` | 261 | Active | Raw values |
| `rms/semantic` | 100 | Active | Meaningful aliases |
| `rms/component` | 217 | Active | Component-scoped |
| `rms/semantic-dark` | 59 | Inactive | Dark overrides |

## Themes

| Theme | Group | Active Sets |
|-------|-------|-------------|
| Light | `color-scheme` | `rms/primitives`, `rms/semantic`, `rms/component` |
| Dark | `color-scheme` | `rms/primitives`, `rms/semantic-dark`, `rms/component` |

## Files

| File | Contents |
|------|----------|
| [primitives.md](primitives.md) | Every raw value token individually listed |
| [semantic.md](semantic.md) | Every semantic alias individually listed |
| [component.md](component.md) | Every component-scoped token individually listed |
| [themes.md](themes.md) | Themes and dark overrides |
