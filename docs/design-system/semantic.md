# Semantic — `rms/semantic` (100 tokens)

Meaningful aliases referencing primitives. See [design.md](design.md) for architecture.

---

## Text Color (11 tokens)

| Token | Value |
|-------|-------|
| `text.color.default` | `{color.neutral.900}` |
| `text.color.secondary` | `{color.neutral.600}` |
| `text.color.muted` | `{color.neutral.400}` |
| `text.color.inverse` | `{color.neutral.0}` |
| `text.color.disabled` | `{color.neutral.300}` |
| `text.color.link` | `{color.primary.600}` |
| `text.color.linkHover` | `{color.primary.700}` |
| `text.color.onBrand` | `{color.neutral.0}` |
| `text.color.onSuccess` | `{color.neutral.0}` |
| `text.color.onError` | `{color.neutral.0}` |
| `text.color.onWarning` | `{color.neutral.900}` |

## Background Color (8 tokens)

| Token | Value |
|-------|-------|
| `bg.color.primary` | `{color.neutral.0}` |
| `bg.color.secondary` | `{color.neutral.50}` |
| `bg.color.tertiary` | `{color.neutral.100}` |
| `bg.color.inverse` | `{color.neutral.900}` |
| `bg.color.disabled` | `{color.neutral.100}` |
| `bg.color.brand` | `{color.brand.500}` |
| `bg.color.brandSubtle` | `{color.brand.50}` |
| `bg.color.overlay` | `{color.neutral.900}` |

## Surface Color (8 tokens)

| Token | Value |
|-------|-------|
| `surface.color.primary` | `{color.neutral.0}` |
| `surface.color.secondary` | `{color.neutral.50}` |
| `surface.color.tertiary` | `{color.neutral.100}` |
| `surface.color.inverse` | `{color.neutral.800}` |
| `surface.color.disabled` | `{color.neutral.100}` |
| `surface.color.brand` | `{color.brand.500}` |
| `surface.color.brandSubtle` | `{color.brand.50}` |
| `surface.color.elevated` | `{color.neutral.0}` |

## Border Color (6 tokens)

| Token | Value |
|-------|-------|
| `border.color.default` | `{color.neutral.200}` |
| `border.color.strong` | `{color.neutral.400}` |
| `border.color.subtle` | `{color.neutral.100}` |
| `border.color.brand` | `{color.brand.500}` |
| `border.color.focus` | `{color.primary.500}` |
| `border.color.disabled` | `{color.neutral.200}` |

## Interactive Color (9 tokens)

| Token | Value |
|-------|-------|
| `interactive.color.primary` | `{color.primary.600}` |
| `interactive.color.primaryHover` | `{color.primary.700}` |
| `interactive.color.primaryActive` | `{color.primary.800}` |
| `interactive.color.secondary` | `{color.neutral.0}` |
| `interactive.color.secondaryHover` | `{color.neutral.50}` |
| `interactive.color.secondaryActive` | `{color.neutral.100}` |
| `interactive.color.disabled` | `{color.neutral.200}` |
| `interactive.color.onPrimary` | `{color.neutral.0}` |
| `interactive.color.onSecondary` | `{color.neutral.700}` |

## Status Color (12 tokens)

| Token | Value |
|-------|-------|
| `status.color.success` | `{color.success.500}` |
| `status.color.successSubtle` | `{color.success.50}` |
| `status.color.successStrong` | `{color.success.600}` |
| `status.color.warning` | `{color.warning.500}` |
| `status.color.warningSubtle` | `{color.warning.50}` |
| `status.color.warningStrong` | `{color.warning.600}` |
| `status.color.error` | `{color.error.500}` |
| `status.color.errorSubtle` | `{color.error.50}` |
| `status.color.errorStrong` | `{color.error.600}` |
| `status.color.info` | `{color.info.500}` |
| `status.color.infoSubtle` | `{color.info.50}` |
| `status.color.infoStrong` | `{color.info.600}` |

---

## Spacing (9 tokens)

| Token | Value |
|-------|-------|
| `space.none` | `{spacing.0}` |
| `space.xxs` | `{spacing.1}` |
| `space.xs` | `{spacing.2}` |
| `space.sm` | `{spacing.3}` |
| `space.md` | `{spacing.4}` |
| `space.lg` | `{spacing.6}` |
| `space.xl` | `{spacing.8}` |
| `space.2xl` | `{spacing.12}` |
| `space.3xl` | `{spacing.16}` |

---

## Border Radius (8 tokens)

| Token | Value |
|-------|-------|
| `radius.component` | `{radius.md}` (6px) |
| `radius.card` | `{radius.lg}` (8px) |
| `radius.modal` | `{radius.xl}` (12px) |
| `radius.button` | `{radius.md}` (6px) |
| `radius.input` | `{radius.md}` (6px) |
| `radius.badge` | `{radius.full}` (9999px) |
| `radius.avatar` | `{radius.full}` (9999px) |
| `radius.tag` | `{radius.sm}` (4px) |

---

## Elevation / Shadow (5 tokens)

| Token | Value |
|-------|-------|
| `elevation.none` | `{shadow.xs}` |
| `elevation.low` | `{shadow.sm}` |
| `elevation.medium` | `{shadow.md}` |
| `elevation.high` | `{shadow.lg}` |
| `elevation.overlay` | `{shadow.xl}` |

---

## Typography (21 tokens)

### Font Families
| Token | Value |
|-------|-------|
| `typography.display.family` | `{fontFamily.display}` (Plus Jakarta Sans) |
| `typography.heading.family` | `{fontFamily.display}` (Plus Jakarta Sans) |
| `typography.body.family` | `{fontFamily.body}` (Inter) |
| `typography.caption.family` | `{fontFamily.body}` (Inter) |
| `typography.label.family` | `{fontFamily.body}` (Inter) |
| `typography.button.family` | `{fontFamily.body}` (Inter) |
| `typography.mono.family` | `{fontFamily.mono}` (Fira Mono) |

### Font Weights
| Token | Value |
|-------|-------|
| `typography.display.weight` | `{fontWeight.bold}` (700) |
| `typography.heading.weight` | `{fontWeight.semibold}` (600) |
| `typography.body.weight` | `{fontWeight.normal}` (400) |
| `typography.caption.weight` | `{fontWeight.normal}` (400) |
| `typography.label.weight` | `{fontWeight.medium}` (500) |
| `typography.button.weight` | `{fontWeight.medium}` (500) |
| `typography.mono.weight` | `{fontWeight.normal}` (400) |

### Letter Spacing
| Token | Value |
|-------|-------|
| `typography.display.tracking` | `{letterSpacing.tighter}` (-0.05em) |
| `typography.heading.tracking` | `{letterSpacing.tight}` (-0.025em) |
| `typography.body.tracking` | `{letterSpacing.normal}` (0em) |
| `typography.caption.tracking` | `{letterSpacing.normal}` (0em) |
| `typography.label.tracking` | `{letterSpacing.normal}` (0em) |
| `typography.button.tracking` | `{letterSpacing.wide}` (0.025em) |
| `typography.mono.tracking` | `{letterSpacing.normal}` (0em) |

---

## Transition Duration (3 tokens)

| Token | Value (ms) |
|-------|------------|
| `transition.duration.fast` | 100 |
| `transition.duration.normal` | 200 |
| `transition.duration.slow` | 300 |
