# Themes

See [design.md](design.md) for architecture overview.

---

## Theme Definitions

### Light
- Group: `color-scheme`
- Active sets: `rms/primitives`, `rms/semantic`, `rms/component`

### Dark
- Group: `color-scheme`
- Active sets: `rms/primitives`, `rms/semantic-dark`, `rms/component`

---

## Dark Overrides — `rms/semantic-dark` (59 tokens)

### Text Color
| Token | Light | Dark |
|-------|-------|------|
| `text.color.default` | `{color.neutral.900}` | `{color.neutral.50}` |
| `text.color.secondary` | `{color.neutral.600}` | `{color.neutral.400}` |
| `text.color.muted` | `{color.neutral.400}` | `{color.neutral.500}` |
| `text.color.inverse` | `{color.neutral.0}` | `{color.neutral.900}` |
| `text.color.disabled` | `{color.neutral.300}` | `{color.neutral.600}` |
| `text.color.link` | `{color.primary.600}` | `{color.primary.400}` |
| `text.color.linkHover` | `{color.primary.700}` | `{color.primary.300}` |
| `text.color.onBrand` | `{color.neutral.0}` | `{color.neutral.0}` |
| `text.color.onSuccess` | `{color.neutral.0}` | `{color.neutral.0}` |
| `text.color.onError` | `{color.neutral.0}` | `{color.neutral.0}` |
| `text.color.onWarning` | `{color.neutral.900}` | `{color.neutral.900}` |

### Background Color
| Token | Light | Dark |
|-------|-------|------|
| `bg.color.primary` | `{color.neutral.0}` | `{color.neutral.950}` |
| `bg.color.secondary` | `{color.neutral.50}` | `{color.neutral.900}` |
| `bg.color.tertiary` | `{color.neutral.100}` | `{color.neutral.800}` |
| `bg.color.inverse` | `{color.neutral.900}` | `{color.neutral.0}` |
| `bg.color.disabled` | `{color.neutral.100}` | `{color.neutral.800}` |
| `bg.color.brand` | `{color.brand.500}` | `{color.brand.600}` |
| `bg.color.brandSubtle` | `{color.brand.50}` | `{color.brand.900}` |
| `bg.color.overlay` | `{color.neutral.900}` | `{color.neutral.950}` |

### Surface Color
| Token | Light | Dark |
|-------|-------|------|
| `surface.color.primary` | `{color.neutral.0}` | `{color.neutral.900}` |
| `surface.color.secondary` | `{color.neutral.50}` | `{color.neutral.800}` |
| `surface.color.tertiary` | `{color.neutral.100}` | `{color.neutral.700}` |
| `surface.color.inverse` | `{color.neutral.800}` | `{color.neutral.50}` |
| `surface.color.disabled` | `{color.neutral.100}` | `{color.neutral.800}` |
| `surface.color.brand` | `{color.brand.500}` | `{color.brand.600}` |
| `surface.color.brandSubtle` | `{color.brand.50}` | `{color.brand.900}` |
| `surface.color.elevated` | `{color.neutral.0}` | `{color.neutral.800}` |

### Border Color
| Token | Light | Dark |
|-------|-------|------|
| `border.color.default` | `{color.neutral.200}` | `{color.neutral.700}` |
| `border.color.strong` | `{color.neutral.400}` | `{color.neutral.500}` |
| `border.color.subtle` | `{color.neutral.100}` | `{color.neutral.800}` |
| `border.color.brand` | `{color.brand.500}` | `{color.brand.500}` |
| `border.color.focus` | `{color.primary.500}` | `{color.primary.400}` |
| `border.color.disabled` | `{color.neutral.200}` | `{color.neutral.700}` |

### Interactive Color
| Token | Light | Dark |
|-------|-------|------|
| `interactive.color.primary` | `{color.primary.600}` | `{color.primary.500}` |
| `interactive.color.primaryHover` | `{color.primary.700}` | `{color.primary.400}` |
| `interactive.color.primaryActive` | `{color.primary.800}` | `{color.primary.300}` |
| `interactive.color.secondary` | `{color.neutral.0}` | `{color.neutral.800}` |
| `interactive.color.secondaryHover` | `{color.neutral.50}` | `{color.neutral.700}` |
| `interactive.color.secondaryActive` | `{color.neutral.100}` | `{color.neutral.600}` |
| `interactive.color.disabled` | `{color.neutral.200}` | `{color.neutral.700}` |
| `interactive.color.onPrimary` | `{color.neutral.0}` | `{color.neutral.0}` |
| `interactive.color.onSecondary` | `{color.neutral.700}` | `{color.neutral.200}` |

### Status Color
| Token | Light | Dark |
|-------|-------|------|
| `status.color.success` | `{color.success.500}` | `{color.success.400}` |
| `status.color.successSubtle` | `{color.success.50}` | `{color.success.900}` |
| `status.color.successStrong` | `{color.success.600}` | `{color.success.300}` |
| `status.color.warning` | `{color.warning.500}` | `{color.warning.400}` |
| `status.color.warningSubtle` | `{color.warning.50}` | `{color.warning.900}` |
| `status.color.warningStrong` | `{color.warning.600}` | `{color.warning.300}` |
| `status.color.error` | `{color.error.500}` | `{color.error.400}` |
| `status.color.errorSubtle` | `{color.error.50}` | `{color.error.900}` |
| `status.color.errorStrong` | `{color.error.600}` | `{color.error.300}` |
| `status.color.info` | `{color.info.500}` | `{color.info.400}` |
| `status.color.infoSubtle` | `{color.info.50}` | `{color.info.900}` |
| `status.color.infoStrong` | `{color.info.600}` | `{color.info.300}` |

### Elevation
| Token | Light | Dark |
|-------|-------|------|
| `elevation.none` | `{shadow.xs}` | `{shadow.xs}` |
| `elevation.low` | `{shadow.sm}` | `0 1px 3px 0 rgba(0,0,0,0.3), 0 1px 2px -1px rgba(0,0,0,0.3)` |
| `elevation.medium` | `{shadow.md}` | `0 4px 6px -1px rgba(0,0,0,0.4), 0 2px 4px -2px rgba(0,0,0,0.3)` |
| `elevation.high` | `{shadow.lg}` | `0 10px 15px -3px rgba(0,0,0,0.4), 0 4px 6px -4px rgba(0,0,0,0.3)` |
| `elevation.overlay` | `{shadow.xl}` | `0 20px 25px -5px rgba(0,0,0,0.5), 0 8px 10px -6px rgba(0,0,0,0.4)` |
