# Component — `rms/component` (217 tokens)

Component-scoped tokens. See [design.md](design.md) for architecture.

---

## Button (15 tokens)

### Colors
| Token | Value |
|-------|-------|
| `button.color.primaryBg` | `{interactive.color.primary}` |
| `button.color.primaryBgHover` | `{interactive.color.primaryHover}` |
| `button.color.primaryBgActive` | `{interactive.color.primaryActive}` |
| `button.color.primaryText` | `{text.color.onBrand}` |
| `button.color.primaryBorder` | `{interactive.color.primary}` |
| `button.color.secondaryBg` | `{interactive.color.secondary}` |
| `button.color.secondaryBgHover` | `{interactive.color.secondaryHover}` |
| `button.color.secondaryText` | `{interactive.color.onSecondary}` |
| `button.color.secondaryBorder` | `{border.color.default}` |
| `button.color.dangerBg` | `{color.error.600}` |
| `button.color.dangerBgHover` | `{color.error.700}` |
| `button.color.dangerText` | `{text.color.onBrand}` |
| `button.color.ghostBg` | `transparent` |
| `button.color.ghostBgHover` | `{color.neutral.100}` |
| `button.color.ghostText` | `{text.color.default}` |

### Spacing
| Token | Value |
|-------|-------|
| `button.paddingX` | `{spacing.4}` (16px) |
| `button.paddingY` | `{spacing.2}` (8px) |

### Sizing
| Token | Value (px) |
|-------|------------|
| `button.height.sm` | 32 |
| `button.height.md` | 40 |
| `button.height.lg` | 48 |

### Radius
| Token | Value |
|-------|-------|
| `button.radius` | `{radius.component}` (6px) |

### Typography
| Token | Value |
|-------|-------|
| `button.fontSize` | `{fontSize.sm}` (14px) |
| `button.fontWeight` | `{fontWeight.medium}` (500) |

---

## Input (15 tokens)

### Colors
| Token | Value |
|-------|-------|
| `input.color.bg` | `{surface.color.primary}` |
| `input.color.bgHover` | `{surface.color.primary}` |
| `input.color.bgDisabled` | `{bg.color.disabled}` |
| `input.color.border` | `{border.color.default}` |
| `input.color.borderHover` | `{border.color.strong}` |
| `input.color.borderFocus` | `{border.color.focus}` |
| `input.color.borderError` | `{status.color.error}` |
| `input.color.text` | `{text.color.default}` |
| `input.color.placeholder` | `{text.color.muted}` |
| `input.color.label` | `{text.color.default}` |
| `input.color.helper` | `{text.color.secondary}` |
| `input.color.error` | `{status.color.errorStrong}` |

### Spacing
| Token | Value |
|-------|-------|
| `input.paddingX` | `{spacing.3}` (12px) |
| `input.paddingY` | `{spacing.2}` (8px) |

### Sizing
| Token | Value (px) |
|-------|------------|
| `input.height` | 40 |

### Radius
| Token | Value |
|-------|-------|
| `input.radius` | `{radius.input}` (6px) |

### Typography
| Token | Value |
|-------|-------|
| `input.fontSize` | `{fontSize.sm}` (14px) |

### Border Width
| Token | Value |
|-------|-------|
| `input.borderWidth` | `{borderWidth.xs}` (1px) |

---

## Select (9 tokens)

### Colors
| Token | Value |
|-------|-------|
| `select.color.bg` | `{input.color.bg}` |
| `select.color.border` | `{input.color.border}` |
| `select.color.borderFocus` | `{input.color.borderFocus}` |
| `select.color.text` | `{input.color.text}` |
| `select.color.icon` | `{text.color.muted}` |
| `select.color.placeholder` | `{input.color.placeholder}` |

### Spacing
| Token | Value |
|-------|-------|
| `select.paddingX` | `{input.paddingX}` |
| `select.paddingY` | `{input.paddingY}` |

### Sizing
| Token | Value |
|-------|-------|
| `select.height` | `{input.height}` |

### Radius
| Token | Value |
|-------|-------|
| `select.radius` | `{input.radius}` |

### Typography
| Token | Value |
|-------|-------|
| `select.fontSize` | `{input.fontSize}` |

---

## Search (9 tokens)

### Colors
| Token | Value |
|-------|-------|
| `search.color.bg` | `{color.neutral.50}` |
| `search.color.border` | `{border.color.subtle}` |
| `search.color.borderFocus` | `{border.color.focus}` |
| `search.color.text` | `{text.color.default}` |
| `search.color.placeholder` | `{text.color.muted}` |
| `search.color.icon` | `{text.color.muted}` |

### Spacing
| Token | Value |
|-------|-------|
| `search.paddingX` | `{spacing.4}` (16px) |
| `search.paddingY` | `{spacing.2}` (8px) |

### Sizing
| Token | Value (px) |
|-------|------------|
| `search.height` | 40 |

### Radius
| Token | Value |
|-------|-------|
| `search.radius` | `{radius.full}` (9999px) |

### Typography
| Token | Value |
|-------|-------|
| `search.fontSize` | `{fontSize.sm}` (14px) |

---

## Navigation (11 tokens)

### Colors
| Token | Value |
|-------|-------|
| `nav.color.bg` | `{surface.color.primary}` |
| `nav.color.border` | `{border.color.subtle}` |
| `nav.color.text` | `{text.color.default}` |
| `nav.color.textActive` | `{interactive.color.primary}` |
| `nav.color.textHover` | `{text.color.secondary}` |
| `nav.color.icon` | `{text.color.muted}` |
| `nav.color.iconActive` | `{interactive.color.primary}` |
| `nav.color.indicator` | `{interactive.color.primary}` |

### Spacing
| Token | Value |
|-------|-------|
| `nav.paddingX` | `{spacing.4}` (16px) |
| `nav.paddingY` | `{spacing.3}` (12px) |
| `nav.gap` | `{spacing.1}` (4px) |

### Sizing
| Token | Value (px) |
|-------|------------|
| `nav.height` | 48 |

### Typography
| Token | Value |
|-------|-------|
| `nav.fontSize` | `{fontSize.sm}` (14px) |

---

## Sidebar (12 tokens)

### Colors
| Token | Value |
|-------|-------|
| `sidebar.color.bg` | `{color.neutral.900}` |
| `sidebar.color.bgHover` | `{color.neutral.800}` |
| `sidebar.color.bgActive` | `{color.neutral.700}` |
| `sidebar.color.text` | `{color.neutral.300}` |
| `sidebar.color.textActive` | `{color.neutral.0}` |
| `sidebar.color.icon` | `{color.neutral.400}` |
| `sidebar.color.iconActive` | `{color.neutral.0}` |
| `sidebar.color.border` | `{color.neutral.700}` |
| `sidebar.color.brand` | `{color.brand.500}` |

### Spacing
| Token | Value |
|-------|-------|
| `sidebar.paddingX` | `{spacing.4}` (16px) |
| `sidebar.paddingY` | `{spacing.3}` (12px) |
| `sidebar.gap` | `{spacing.1}` (4px) |

### Sizing
| Token | Value (px) |
|-------|------------|
| `sidebar.width` | 256 |
| `sidebar.widthCollapsed` | 64 |

### Typography
| Token | Value |
|-------|-------|
| `sidebar.fontSize` | `{fontSize.sm}` (14px) |

---

## Topbar (7 tokens)

### Colors
| Token | Value |
|-------|-------|
| `topbar.color.bg` | `{surface.color.primary}` |
| `topbar.color.border` | `{border.color.subtle}` |
| `topbar.color.text` | `{text.color.default}` |
| `topbar.color.icon` | `{text.color.muted}` |
| `topbar.color.iconHover` | `{text.color.default}` |

### Spacing
| Token | Value |
|-------|-------|
| `topbar.paddingX` | `{spacing.6}` (24px) |
| `topbar.paddingY` | `{spacing.3}` (12px) |

### Sizing
| Token | Value (px) |
|-------|------------|
| `topbar.height` | 64 |

---

## Table (9 tokens)

### Colors
| Token | Value |
|-------|-------|
| `table.color.bg` | `{surface.color.primary}` |
| `table.color.bgHeader` | `{color.neutral.50}` |
| `table.color.bgRow` | `{surface.color.primary}` |
| `table.color.bgRowHover` | `{color.neutral.50}` |
| `table.color.bgRowSelected` | `{color.primary.50}` |
| `table.color.border` | `{border.color.default}` |
| `table.color.text` | `{text.color.default}` |
| `table.color.textHeader` | `{text.color.secondary}` |
| `table.color.textSelected` | `{interactive.color.primary}` |

### Spacing
| Token | Value |
|-------|-------|
| `table.paddingX` | `{spacing.4}` (16px) |
| `table.paddingY` | `{spacing.3}` (12px) |

### Sizing
| Token | Value (px) |
|-------|------------|
| `table.rowHeight` | 48 |

### Typography
| Token | Value |
|-------|-------|
| `table.fontSize` | `{fontSize.sm}` (14px) |

---

## Card (10 tokens)

### Colors
| Token | Value |
|-------|-------|
| `card.color.bg` | `{surface.color.primary}` |
| `card.color.bgHover` | `{color.neutral.50}` |
| `card.color.border` | `{border.color.default}` |
| `card.color.borderHover` | `{border.color.strong}` |
| `card.color.text` | `{text.color.default}` |
| `card.color.shadow` | `{elevation.low}` |
| `card.color.shadowHover` | `{elevation.medium}` |

### Spacing
| Token | Value |
|-------|-------|
| `card.paddingX` | `{spacing.5}` (20px) |
| `card.paddingY` | `{spacing.5}` (20px) |
| `card.gap` | `{spacing.4}` (16px) |

### Radius
| Token | Value |
|-------|-------|
| `card.radius` | `{radius.card}` (8px) |

---

## Dialog (9 tokens)

### Colors
| Token | Value |
|-------|-------|
| `dialog.color.bg` | `{surface.color.primary}` |
| `dialog.color.overlay` | `{bg.color.overlay}` |
| `dialog.color.border` | `{border.color.default}` |
| `dialog.color.text` | `{text.color.default}` |
| `dialog.color.textHeading` | `{text.color.default}` |
| `dialog.color.shadow` | `{elevation.overlay}` |

### Spacing
| Token | Value |
|-------|-------|
| `dialog.paddingX` | `{spacing.6}` (24px) |
| `dialog.paddingY` | `{spacing.6}` (24px) |

### Radius
| Token | Value |
|-------|-------|
| `dialog.radius` | `{radius.modal}` (12px) |

### Sizing
| Token | Value (px) |
|-------|------------|
| `dialog.width.sm` | 400 |
| `dialog.width.md` | 560 |
| `dialog.width.lg` | 720 |

---

## Badge (14 tokens)

### Colors
| Token | Value |
|-------|-------|
| `badge.color.defaultBg` | `{color.neutral.100}` |
| `badge.color.defaultText` | `{text.color.default}` |
| `badge.color.successBg` | `{status.color.successSubtle}` |
| `badge.color.successText` | `{status.color.successStrong}` |
| `badge.color.warningBg` | `{status.color.warningSubtle}` |
| `badge.color.warningText` | `{status.color.warningStrong}` |
| `badge.color.errorBg` | `{status.color.errorSubtle}` |
| `badge.color.errorText` | `{status.color.errorStrong}` |
| `badge.color.infoBg` | `{status.color.infoSubtle}` |
| `badge.color.infoText` | `{status.color.infoStrong}` |
| `badge.color.brandBg` | `{color.brand.50}` |
| `badge.color.brandText` | `{color.brand.700}` |

### Spacing
| Token | Value |
|-------|-------|
| `badge.paddingX` | `{spacing.2}` (8px) |
| `badge.paddingY` | `{spacing.0}` (0px) |

### Radius
| Token | Value |
|-------|-------|
| `badge.radius` | `{radius.badge}` (9999px) |

### Typography
| Token | Value |
|-------|-------|
| `badge.fontSize` | `{fontSize.2xs}` (10px) |

---

## Status Indicator (7 tokens)

### Colors
| Token | Value |
|-------|-------|
| `statusIndicator.color.active` | `{status.color.success}` |
| `statusIndicator.color.warning` | `{status.color.warning}` |
| `statusIndicator.color.error` | `{status.color.error}` |
| `statusIndicator.color.offline` | `{color.neutral.400}` |

### Sizing
| Token | Value (px) |
|-------|------------|
| `statusIndicator.dotSize.sm` | 6 |
| `statusIndicator.dotSize.md` | 8 |
| `statusIndicator.dotSize.lg` | 10 |
| `statusIndicator.ringWidth` | 2 |

---

## Toast (11 tokens)

### Colors
| Token | Value |
|-------|-------|
| `toast.color.bg` | `{surface.color.primary}` |
| `toast.color.border` | `{border.color.default}` |
| `toast.color.text` | `{text.color.default}` |
| `toast.color.successBorder` | `{status.color.success}` |
| `toast.color.warningBorder` | `{status.color.warning}` |
| `toast.color.errorBorder` | `{status.color.error}` |
| `toast.color.infoBorder` | `{status.color.info}` |
| `toast.color.shadow` | `{elevation.high}` |

### Spacing
| Token | Value |
|-------|-------|
| `toast.paddingX` | `{spacing.4}` (16px) |
| `toast.paddingY` | `{spacing.3}` (12px) |

### Sizing
| Token | Value (px) |
|-------|------------|
| `toast.width` | 380 |

### Radius
| Token | Value |
|-------|-------|
| `toast.radius` | `{radius.card}` (8px) |

### Typography
| Token | Value |
|-------|-------|
| `toast.fontSize` | `{fontSize.sm}` (14px) |

---

## Pagination (9 tokens)

### Colors
| Token | Value |
|-------|-------|
| `pagination.color.bg` | `{surface.color.primary}` |
| `pagination.color.bgHover` | `{color.neutral.50}` |
| `pagination.color.bgActive` | `{interactive.color.primary}` |
| `pagination.color.text` | `{text.color.default}` |
| `pagination.color.textActive` | `{text.color.onBrand}` |
| `pagination.color.border` | `{border.color.default}` |

### Spacing
| Token | Value |
|-------|-------|
| `pagination.gap` | `{spacing.1}` (4px) |

### Sizing
| Token | Value (px) |
|-------|------------|
| `pagination.size` | 36 |

### Radius
| Token | Value |
|-------|-------|
| `pagination.radius` | `{radius.component}` (6px) |

### Typography
| Token | Value |
|-------|-------|
| `pagination.fontSize` | `{fontSize.sm}` (14px) |

---

## Form (8 tokens)

### Colors
| Token | Value |
|-------|-------|
| `form.color.label` | `{text.color.default}` |
| `form.color.helper` | `{text.color.secondary}` |
| `form.color.required` | `{status.color.error}` |
| `form.color.error` | `{status.color.errorStrong}` |

### Spacing
| Token | Value |
|-------|-------|
| `form.gap` | `{spacing.4}` (16px) |
| `form.labelGap` | `{spacing.1}` (4px) |
| `form.groupGap` | `{spacing.6}` (24px) |

### Typography
| Token | Value |
|-------|-------|
| `form.fontSize` | `{fontSize.sm}` (14px) |
| `form.labelFontSize` | `{fontSize.sm}` (14px) |
| `form.labelFontWeight` | `{fontWeight.medium}` (500) |

---

## Chart (11 tokens)

| Token | Value |
|-------|-------|
| `chart.color.series1` | `{color.primary.500}` |
| `chart.color.series2` | `{color.brand.500}` |
| `chart.color.series3` | `{color.accent.500}` |
| `chart.color.series4` | `{color.info.500}` |
| `chart.color.series5` | `{color.success.500}` |
| `chart.color.series6` | `{color.secondary.500}` |
| `chart.color.grid` | `{border.color.subtle}` |
| `chart.color.axis` | `{border.color.default}` |
| `chart.color.label` | `{text.color.muted}` |
| `chart.color.tooltip` | `{surface.color.inverse}` |
| `chart.color.tooltipText` | `{text.color.inverse}` |

---

## Widget (12 tokens)

### Colors
| Token | Value |
|-------|-------|
| `widget.color.bg` | `{surface.color.primary}` |
| `widget.color.bgAlt` | `{surface.color.secondary}` |
| `widget.color.border` | `{border.color.default}` |
| `widget.color.text` | `{text.color.default}` |
| `widget.color.textSecondary` | `{text.color.secondary}` |
| `widget.color.shadow` | `{elevation.low}` |

### Spacing
| Token | Value |
|-------|-------|
| `widget.paddingX` | `{spacing.5}` (20px) |
| `widget.paddingY` | `{spacing.5}` (20px) |
| `widget.gap` | `{spacing.4}` (16px) |

### Radius
| Token | Value |
|-------|-------|
| `widget.radius` | `{radius.card}` (8px) |

### Typography
| Token | Value |
|-------|-------|
| `widget.titleFontSize` | `{fontSize.lg}` (18px) |
| `widget.titleFontWeight` | `{fontWeight.semibold}` (600) |
| `widget.valueFontSize` | `{fontSize.3xl}` (30px) |
| `widget.valueFontWeight` | `{fontWeight.bold}` (700) |
