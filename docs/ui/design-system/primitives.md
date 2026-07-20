# Primitives — Actual CSS Custom Properties

Source of truth: `frontend/src/styles/app.css` `@theme` block. See [design.md](design.md) for architecture.

---

## Color (80 tokens)

### brand (warm orange — primary brand)

| Token | Value | Tailwind class |
|-------|-------|----------------|
| `--color-brand-50` | `#fef7ee` | `bg-brand-50`, `text-brand-50` |
| `--color-brand-100` | `#fcedd7` | `bg-brand-100` |
| `--color-brand-200` | `#f8d7ae` | `bg-brand-200` (skeleton placeholder) |
| `--color-brand-300` | `#f2ba7a` | `bg-brand-300` |
| `--color-brand-400` | `#eb9344` | `bg-brand-400` |
| `--color-brand-500` | `#e57722` | `bg-brand-500` (brand accent) |
| `--color-brand-600` | `#d65e18` | `bg-brand-600` |
| `--color-brand-700` | `#b14616` | `bg-brand-700` |
| `--color-brand-800` | `#8d3919` | `bg-brand-800` |
| `--color-brand-900` | `#723117` | `bg-brand-900` |

### primary (green — actions/interactive)

| Token | Value | Tailwind class |
|-------|-------|----------------|
| `--color-primary-50` | `#effcf6` | `bg-primary-50` |
| `--color-primary-100` | `#d9f7e8` | `bg-primary-100` |
| `--color-primary-200` | `#b5edd4` | `bg-primary-200` |
| `--color-primary-300` | `#7eddb8` | `bg-primary-300` |
| `--color-primary-400` | `#40c597` | `bg-primary-400` |
| `--color-primary-500` | `#1faa7d` | `bg-primary-500` |
| `--color-primary-600` | `#138964` | `bg-primary-600` (primary action) |
| `--color-primary-700` | `#126e52` | `bg-primary-700` (hover) |
| `--color-primary-800` | `#135843` | `bg-primary-800` (active) |
| `--color-primary-900` | `#114838` | `bg-primary-900` |

### neutral (grays)

| Token | Value | Tailwind class |
|-------|-------|----------------|
| `--color-neutral-0` | `#ffffff` | `bg-neutral-0` (white) |
| `--color-neutral-50` | `#f9fafb` | `bg-neutral-50` |
| `--color-neutral-100` | `#f3f4f6` | `bg-neutral-100` |
| `--color-neutral-200` | `#e5e7eb` | `bg-neutral-200` (borders) |
| `--color-neutral-300` | `#d1d5db` | `bg-neutral-300` |
| `--color-neutral-400` | `#9ca3af` | `bg-neutral-400` (muted text) |
| `--color-neutral-500` | `#6b7280` | `bg-neutral-500` (secondary text) |
| `--color-neutral-600` | `#4b5563` | `bg-neutral-600` |
| `--color-neutral-700` | `#374151` | `bg-neutral-700` |
| `--color-neutral-800` | `#1f2937` | `bg-neutral-800` |
| `--color-neutral-900` | `#111827` | `bg-neutral-900` (primary text) |
| `--color-neutral-950` | `#030712` | `bg-neutral-950` |

### secondary (warm grays)

| Token | Value |
|-------|-------|
| `--color-secondary-50` | `#f8f7f6` |
| `--color-secondary-100` | `#efede9` |
| `--color-secondary-200` | `#ddd9d1` |
| `--color-secondary-300` | `#c5beb2` |
| `--color-secondary-400` | `#aa9f8f` |
| `--color-secondary-500` | `#958877` |
| `--color-secondary-600` | `#88796b` |
| `--color-secondary-700` | `#716559` |
| `--color-secondary-800` | `#5e544b` |
| `--color-secondary-900` | `#4f473f` |

### accent (amber)

| Token | Value |
|-------|-------|
| `--color-accent-50` | `#fffbeb` |
| `--color-accent-100` | `#fef3c7` |
| `--color-accent-200` | `#fde68a` |
| `--color-accent-300` | `#fcd34d` |
| `--color-accent-400` | `#fbbf24` |
| `--color-accent-500` | `#f59e0b` |
| `--color-accent-600` | `#d97706` |
| `--color-accent-700` | `#b45309` |
| `--color-accent-800` | `#92400e` |
| `--color-accent-900` | `#78350f` |

### success / warning / error / info

Identical scales (50–900) for semantic status colors. Used in toasts, badges, and status indicators.

---

## Spacing (16 tokens)

| Token | Value | Tailwind class |
|-------|-------|----------------|
| `--spacing-sp-0` | 0px | `p-sp-0`, `m-sp-0`, `gap-sp-0` |
| `--spacing-sp-1` | 4px | `p-sp-1`, `gap-sp-1` |
| `--spacing-sp-2` | 8px | `p-sp-2`, `gap-sp-2` |
| `--spacing-sp-3` | 12px | `p-sp-3`, `gap-sp-3` |
| `--spacing-sp-4` | 16px | `p-sp-4`, `gap-sp-4` |
| `--spacing-sp-5` | 20px | `p-sp-5`, `gap-sp-5` |
| `--spacing-sp-6` | 24px | `p-sp-6`, `gap-sp-6` |
| `--spacing-sp-7` | 28px | `p-sp-7`, `gap-sp-7` |
| `--spacing-sp-8` | 32px | `p-sp-8`, `gap-sp-8` |
| `--spacing-sp-9` | 36px | `p-sp-9`, `gap-sp-9` |
| `--spacing-sp-10` | 40px | `p-sp-10`, `gap-sp-10` |
| `--spacing-sp-12` | 48px | `p-sp-12`, `gap-sp-12` |
| `--spacing-sp-14` | 56px | `p-sp-14`, `gap-sp-14` |
| `--spacing-sp-16` | 64px | `p-sp-16`, `gap-sp-16` |
| `--spacing-sp-20` | 80px | `p-sp-20`, `gap-sp-20` |
| `--spacing-sp-24` | 96px | `p-sp-24`, `gap-sp-24` |
| `--spacing-sp-32` | 128px | `p-sp-32`, `gap-sp-32` |

---

## Border Radius (9 tokens)

| Token | Value | Tailwind class |
|-------|-------|----------------|
| `--radius-radius-none` | 0px | `rounded-none` |
| `--radius-radius-xs` | 2px | `rounded-xs` |
| `--radius-radius-sm` | 4px | `rounded-sm` |
| `--radius-radius-md` | 6px | `rounded-md` |
| `--radius-radius-lg` | 8px | `rounded-lg` (cards, inputs) |
| `--radius-radius-xl` | 12px | `rounded-xl` (modals) |
| `--radius-radius-2xl` | 16px | `rounded-2xl` |
| `--radius-radius-3xl` | 24px | `rounded-3xl` |
| `--radius-radius-full` | 9999px | `rounded-full` (badges, pills, avatars) |

---

## Typography

| Token | Value | Usage |
|-------|-------|-------|
| `--font-sans` | `"Inter", system-ui, sans-serif` | Body text, UI elements |
| `--font-display` | `"Plus Jakarta Sans", "Inter", sans-serif` | Headings, display text |
| `--text-text-label` | 13px | Form labels |
| `--text-text-button` | 14px | Button text |
| `--text-text-heading` | 28px | Page headings |

---

## Layout

| Token | Value | Usage |
|-------|-------|-------|
| `--topbar-height` | 64px | Top navigation bar height |
| `--sidebar-width` | 256px | Sidebar expanded width |
| `--sidebar-collapsed` | 64px | Sidebar collapsed width |

---

## Animation Duration

| Token | Value | Tailwind class |
|-------|-------|----------------|
| `--duration-fast` | 100ms | `duration-fast` |
| `--duration-normal` | 200ms | `duration-normal` |
| `--duration-slow` | 300ms | `duration-slow` |
