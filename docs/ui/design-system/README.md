# Restaurant Management System — Design System

## Architecture

Tailwind CSS v4 with CSS-first configuration. All design tokens live in `frontend/src/styles/app.css` inside the `@theme` block. No `tailwind.config.js` — Tailwind v4 reads CSS custom properties directly.

```
app.css (@theme) ──> Tailwind utilities ──> Components
```

### What's defined in `@theme`

| Category | Variables | Count |
|----------|-----------|-------|
| Colors | `--color-brand-*`, `--color-primary-*`, `--color-neutral-*`, `--color-secondary-*`, `--color-accent-*`, `--color-success-*`, `--color-warning-*`, `--color-error-*`, `--color-info-*` | ~80 |
| Spacing | `--spacing-sp-0` through `--spacing-sp-32` | 16 |
| Radius | `--radius-radius-none` through `--radius-radius-full` | 9 |
| Typography | `--font-sans`, `--font-display`, `--text-text-label/button/heading` | 5 |
| Layout | `--topbar-height`, `--sidebar-width`, `--sidebar-collapsed` | 3 |
| Duration | `--duration-fast/normal/slow`, `--animate-duration-*` | 6 |

**Total: ~119 CSS custom properties** (not 578 tokens).

### Tailwind Usage Pattern

Components use Tailwind utility classes that map to `@theme` variables:

```html
<!-- Color: bg-{scale}-{shade} -->
<div class="bg-brand-50 text-neutral-900">

<!-- Spacing: p-{sp-{n}} or standard Tailwind spacing -->
<div class="p-4 gap-2">

<!-- Radius: rounded-{radius-*} -->
<div class="rounded-lg">

<!-- Typography: font-display, font-sans -->
<h1 class="font-display text-heading font-semibold">
```

### What's NOT in the codebase

The following are documented in the old token docs but **do not exist as actual tokens**:

- Semantic layer (`text.color.default`, `bg.color.primary`, `surface.color.*`, etc.)
- Component-scoped tokens (`button.color.primaryBg`, `input.color.bg`, `toast.color.*`, etc.)
- Dark theme overrides (`rms/semantic-dark`)
- Penpot token export/import pipeline

These were part of an initial design system plan. The actual implementation uses Tailwind utility classes directly.

## Files

| File | Contents |
|------|----------|
| `app.css` | Source of truth — all `@theme` variables, base styles, animations |
| [primitives.md](primitives.md) | Actual CSS custom properties defined in `@theme` |
