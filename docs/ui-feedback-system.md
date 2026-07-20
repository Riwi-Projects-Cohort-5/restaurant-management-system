# UI Feedback System — Toast, Skeleton & Spinner

Branch `Its-JrDev/feature/ui-feedback-system`. All three systems are vanilla JS, no framework dependencies.

---

## 1. Toast Notifications

### Architecture

Two-layer design:

| Layer | File | Role |
|-------|------|------|
| Factory | `components/ui/Toast.js` | `createToast()` — returns `{ html, init() }` for a single toast |
| Manager | `components/ui/ToastManager.js` | Singleton `toast` — manages container, stacking, timers, dismiss |

CSS animations live in `styles/app.css` (keyframes `toast-slide-in` / `toast-slide-out`).

### Import

```js
import { toast } from "../../components/ui/ToastManager.js";
```

### API

| Method | Signature | Returns |
|--------|-----------|---------|
| `show()` | `({ type, title, message, duration?, dismissible? })` | `id` (string) |
| `success()` | `(title, message, options?)` | `id` |
| `error()` | `(title, message, options?)` | `id` |
| `warning()` | `(title, message, options?)` | `id` |
| `info()` | `(title, message, options?)` | `id` |
| `dismiss()` | `(id)` | `void` |
| `dismissAll()` | `()` | `void` |

**Defaults:** `duration = 3000ms`, `dismissible = true`, `maxToasts = 5` (oldest auto-dismissed on overflow).

### Variants

| Type | Icon | Background | ARIA role | ARIA live |
|------|------|------------|-----------|-----------|
| `success` | `check-circle` | `bg-success-600` | `status` | `polite` |
| `error` | `x-circle` | `bg-error-600` | `alert` | `assertive` |
| `warning` | `alert-triangle` | `bg-warning-500` | `status` | `polite` |
| `info` | `info` | `bg-info-600` | `status` | `polite` |

### DOM Structure

```
div[data-toast-id]  fixed top-[80px] right-5 z-[9999]
  ├─ i[data-lucide]        icon (w-5 h-5)
  ├─ div                   title + optional divider + message
  │   ├─ p                 title (text-sm font-semibold, truncate)
  │   ├─ span              divider (w-px h-3.5 bg-white/30)
  │   └─ p                 message (text-xs font-medium, truncate)
  └─ button[data-toast-dismiss]  close (w-7 h-7, border-none)
      └─ i[data-lucide="x"]
```

### Animations

- **In:** `toast-slide-in` — 400ms, cubic-bezier(0.21, 1.02, 0.73, 1) — slides from right with bounce overshoot
- **Out:** `toast-slide-out` — 250ms, ease-in — slides right and fades

### Usage Examples

```js
// Validation warning
toast.warning("Validation", "Please enter a product name");

// Success after CRUD
toast.success("Stock Updated", "Inventory item updated successfully");

// Error on failure
toast.error("Login Failed", result.error);

// Custom duration
toast.info("Notice", "System maintenance at 3am", { duration: 5000 });

// Non-dismissible
toast.error("Critical", "Session expired", { dismissible: false });
```

### Views Using Toast

| View | Usage |
|------|-------|
| `views/auth/Login.js` | `success` on login, `error` on failure |
| `views/auth/register.js` | `error` on validation, `success`/`error` on create |
| `views/menu/list.js` | `warning` on empty fields before save |
| `views/inventory/Inventory.js` | `warning` on validation, `success` on CRUD, `success` on delete |
| `views/payments/list.js` | `warning` on validation before save |
| `views/settings/Settings.js` | `success` on save, `success` on reset |

---

## 2. Skeleton Loading System

### Architecture

| Layer | File | Role |
|-------|------|------|
| Primitive | `components/ui/Skeleton.js` | `Skeleton(opts)` — single placeholder element |
| Orchestrator | `utils/withLoading.js` | `withLoading()`, `renderWithSkeleton()`, all `Skeletons.*` builders |

Skeletons use Tailwind `animate-pulse` (opacity pulse) on `bg-brand-200` (`#f8d7ae`).

### Skeleton Primitive

```js
Skeleton({ variant, width, height, size, lines, class })
```

| Variant | Output | Key props |
|---------|--------|-----------|
| `"text"` (default) | `<div class="h-4 rounded bg-brand-200 animate-pulse">` | `width`, `lines` (multi-line wraps in `flex flex-col gap-2`, last line 60%) |
| `"circle"` | `<div class="rounded-full bg-brand-200 animate-pulse">` | `size` (default 40px) |
| `"rect"` | `<div class="rounded-lg bg-brand-200 animate-pulse">` | `width`, `height` |

All output `aria-hidden="true"`.

**Note:** `rect` variant hardcodes `rounded-lg`. For pill-shaped elements (category tabs, badges), use raw HTML instead of `Skeleton({ variant: "rect" })`.

### withLoading() — Page-Level Skeletons

```js
withLoading(view, skeletonHtml, delay)
```

Wraps a view object `{ render, init, destroy }`. On `render(el)`:
1. Sets `el.innerHTML = skeletonHtml` immediately
2. After `delay` ms, calls original `render(el)` + `createIcons()` + `init()`
3. `destroy()` clears the timer + calls original `destroy()`

**Standard export pattern:**
```js
export default withLoading(MyView, Skeletons.mySkeleton(), delay);
```

### renderWithSkeleton() — Sub-View Skeletons

```js
renderWithSkeleton(el, skeletonHtml, renderFn, delay)
```

For navigation within an already-loaded view (clicking "New Order", "View Detail", etc.):
1. Sets `el.innerHTML = skeletonHtml` immediately
2. After `delay` ms, calls `renderFn()` + `createIcons()`

No lifecycle management — the router replaces the container on next navigation.

### Delay Values

| Context | Delay | Rationale |
|---------|-------|-----------|
| List views (withLoading) | 600–1000ms | Matches perceived data fetch time |
| Sub-views (renderWithSkeleton) | 400ms | Quick transition, no network call |

**Per-view delays:**

| View | Delay |
|------|-------|
| Dashboard | 1000ms |
| Reports | 1000ms |
| Settings | 600ms |
| All others (menu, inventory, orders, payments, reservations, tables, kitchen) | 800ms |
| All sub-views | 400ms |

### Tier 1 Helpers (Atomic Building Blocks)

Defined in `withLoading.js`, not exported:

| Helper | Signature | Output |
|--------|-----------|--------|
| `_pill(w)` | `(width)` | `rounded-full` rect — for tab/pill buttons |
| `_searchBar()` | `()` | Search icon circle + text bar in bordered container |
| `_badge(w)` | `(width)` | Small `rounded-full` rect — for count badges |
| `_btn(w)` | `(width)` | `rounded-lg` rect — for buttons |
| `_inputField(labelW)` | `(labelWidth)` | Label text + input rect stacked |

### Tier 2 Helpers (Mid-Level Composites)

| Helper | Signature | Output |
|--------|-----------|--------|
| `_pageHeader(opts)` | `({ titleW, badgeW, rightBtns })` | Back button + title + optional badge/right buttons |
| `_sectionCard(titleW, body, opts)` | `(titleWidth, bodyHtml, { headerRight })` | White card with `bg-brand-50` header bar + content |
| `_infoCardGrid(items, cols)` | `(cardCount, columns)` | Grid of centered stat/info cards |
| `_dataTable(opts)` | `({ columns, rows, thead })` | Full table with `table-fixed`, zebra rows, typed columns |
| `_actionBar(opts)` | `({ left, right, footer })` | Button row with optional footer styling |
| `_tabRow(widths)` | `(widthArray)` | Row of `rounded-full` pill buttons |
| `_keyValueRow(labelW, valueW)` | `(labelWidth, valueWidth)` | Single key-value row |

**`_dataTable` column types:**

| Type | Output |
|------|--------|
| `"text"` | `Skeleton({ variant: "text", width })` |
| `"badge"` | `Skeleton({ variant: "rect", width: 56, height: 24, class: "rounded-full" })` |
| `"actions"` | Two small rect buttons |
| `"progress"` | Container with inner `bg-brand-300` bar |
| `"circle-text"` | Circle + text side by side |

### All Skeleton Builders (17 total)

#### Top-Level View Skeletons

| Builder | View | What it renders |
|---------|------|-----------------|
| `Skeletons.dashboard()` | Dashboard | Welcome banner, page header, 4 stat cards, chart + status cards, recent orders table (7 cols, 5 rows) |
| `Skeletons.menuCards(count)` | Menu | Header + Add Product, filter row (search + 2 selects + clear), auto-fill card grid |
| `Skeletons.inventoryTable()` | Inventory | Header + badge + Add Item, 4 tabs, search bar, full table (7 cols) |
| `Skeletons.ordersTable()` | Orders/POS | Header + New Order, 3 tabs, table (8 cols, 6 rows) |
| `Skeletons.paymentsTable()` | Payments | Header + 2 buttons, 5 tabs, search + date filter, table (9 cols) |
| `Skeletons.reservationsTable()` | Reservations | Header, 5 tab pills, search + date filter, table (8 cols) |
| `Skeletons.reports()` | Reports | Header, date range section card, 3 stat cards, chart area (240px), top products table |
| `Skeletons.tables()` | Tables | Header, 4 tabs, legend dots, area section with 6 table cards |
| `Skeletons.kitchen()` | Kitchen | Title + urgent legend, 3-column kanban (New/Preparing/Ready), each with 3 cards |
| `Skeletons.settings()` | Settings | Header, profile section (2 inputs + 2-col grid), tax/currency (3-col grid), action bar |

#### Sub-View Skeletons

| Builder | View | What it renders |
|---------|------|-----------------|
| `Skeletons.menuDetail()` | Menu detail | Header, card (image + name + badge + description + 2-col grid), action bar |
| `Skeletons.menuForm()` | Menu create/edit | Header, section card (5 inputs + checkbox), action bar |
| `Skeletons.inventoryDetail()` | Inventory detail | Header, 4 info cards, stock bar, action bar, movements table |
| `Skeletons.inventoryForm()` | Inventory create/edit | Header, section card (name + unit + 2-col grid + checkbox), action bar |
| `Skeletons.orderDetail()` | Order detail | Header, 3×2 info grid, 5-step stepper, items table, notes, action bar |
| `Skeletons.newOrder()` | New order (POS) | Back + title, 2-col: left (8 category pills + 8-item grid), right (cart: header + items + totals + 2 buttons) |
| `Skeletons.paymentDetail()` | Payment detail | Header, 4×2 info grid, items table, action bar |
| `Skeletons.newPayment()` | New payment | Header, section card (4 inputs), action bar |
| `Skeletons.paymentConfig()` | Payment config | Header, section card (4 toggle rows) |
| `Skeletons.reservationDetail()` | Reservation detail | Header + badge + 2 buttons, 4-col info grid, details section card |
| `Skeletons.newReservation()` | New reservation | Header, section card (2-col form: 6 inputs + textarea), footer action bar |
| `Skeletons.tablesDetail()` | Table detail | Back + name + status badge, 3 `bg-brand-50` info cards (centered), neutral center block |
| `Skeletons.tablesManageAreas()` | Manage areas | Header, 2-col: left (2 expandable area cards), right (2 sidebar cards) |

### Integration Pattern

Every view with sub-views follows the same state management:

```js
let subView = "list";
let selectedId = null;

function render(el) {
  if (subView === "detail" && selectedId) {
    renderWithSkeleton(el, Skeletons.xxxDetail(), () => renderDetail(el, selectedId), 400);
  } else if (subView === "create") {
    renderWithSkeleton(el, Skeletons.xxxForm(), () => renderForm(el, null), 400);
  } else {
    renderList(el);  // No skeleton for list re-renders
  }
}
```

**Navigation handlers** call `renderWithSkeleton` for detail/form transitions. **Mutations** (save/rename/delete) call `render*()` directly — no skeleton for action feedback.

---

## 3. Spinner

### File

`components/ui/Spinner.js`

### API

```js
Spinner(opts?)
```

| Option | Default | Description |
|--------|---------|-------------|
| `size` | `16` | Width and height in px |
| `class` | `""` | Additional CSS classes (e.g. `"text-white"`) |

Returns an inline SVG (Lucide `Loader2` icon with Tailwind `animate-spin`).

Also available as `Spinner.html()` (alias) and on `window.Spinner`.

### SubmitButton Integration

`components/forms/SubmitButton.js` imports Spinner and provides the loading-button pattern:

```js
// 1. Render the button
submitContainer.innerHTML = SubmitButton({ text: "Sign In", id: "signInBtn" });

// 2. Attach loading behavior
initSubmitButton("signInBtn", { loadingText: "Signing in..." });

// 3. Toggle loading state
signInBtn._setLoading(true);   // Shows: [Spinner 18px white] "Signing in..."
signInBtn._setLoading(false);  // Restores original text
```

**`initSubmitButton(id, options)`** attaches `_setLoading(loading)` to a button element. When `true`: disables button, replaces innerHTML with Spinner + loading text. When `false`: restores original text, re-enables button.

### Views Using Spinner

| View | Usage |
|------|-------|
| `views/auth/Login.js` | `initSubmitButton("signInBtn", { loadingText: "Signing in..." })` — spinner shown during auth |
| `views/auth/register.js` | **Not used** — no loading indicator on register form |

---

## 4. File Reference

| File | Lines | Purpose |
|------|-------|---------|
| `components/ui/Toast.js` | 112 | Toast HTML factory + color/icon maps |
| `components/ui/ToastManager.js` | 116 | Singleton: show/dismiss/stack/auto-hide |
| `components/ui/Skeleton.js` | 46 | Base skeleton primitive (text/circle/rect) |
| `components/ui/Spinner.js` | 20 | Inline SVG spinner (Lucide Loader2) |
| `components/forms/SubmitButton.js` | 48 | Submit button factory + `initSubmitButton` with spinner |
| `utils/withLoading.js` | ~1012 | `withLoading()`, `renderWithSkeleton()`, 17 `Skeletons.*` builders, Tier 1+2 helpers |
| `styles/app.css` | ~311 | Toast animation keyframes (`toast-slide-in`, `toast-slide-out`) |
