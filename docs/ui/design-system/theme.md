# Night Mode — Theme System

## Overview

El Fogón Caribeño tiene dos temas que reflejan la identidad visual del logo:

| Tema | Selector | Inspiración |
|------|----------|-------------|
| **Light** | default | Sol del Caribe, cobre/terracota del fogón, tonos cálidos |
| **Dark** | `[data-theme="dark"]` | Luna creciente, vasija oxidada con pátina azulada, olas teal |

## Arquitectura

```
localStorage('fogon-theme') ──> theme.js ──> data-theme="dark" on <html> ──> CSS custom properties override ──> Tailwind utilities
```

- Tema persistido en `localStorage` bajo key `fogon-theme`
- `initTheme()` se ejecuta en `main.js` antes de `renderView()` para evitar flash
- Toggle button en Login (esquina superior derecha) y AppShell topbar

## Assets — Logo y Scene Variants

Todos en `frontend/public/logos/`:

### Logos

| Archivo | Tema | Uso |
|---------|------|-----|
| `logo-00.png` | Light | Login mobile |
| `logo-00-night.png` | Dark | Login mobile |
| `logo-01.png` | Light | Sidebar header, Login desktop |
| `logo-01-night.png` | Dark | Sidebar header, Login desktop |
| `logo-02.png` | Light | Login brand panel (desktop) |
| `logo-02-night.png` | Dark | Login brand panel (desktop) |
| `logo-03.png` | Light | Sidebar header (nombre), Login tablet |
| `logo-03-night.png` | Dark | Sidebar header (nombre), Login tablet |

### Scenes (fondos del brand panel en Login)

| Archivo | Tema | Descripción |
|---------|------|-------------|
| `sun-scene.svg` | Light | Sol, cielo cálido, mar |
| `moon-scene.svg` | Dark | Luna creciente, cielo nocturno, vasija azul oxidada, olas teal |

### Nomenclatura

Los logos night siguen el patrón `{basename}-night.png`. La utilidad `getLogoPath('logo-01')` resuelve automáticamente al archivo correcto según el tema activo.

## Theme Utility API

`frontend/src/utils/theme.js`

| Función | Retorno | Descripción |
|---------|---------|-------------|
| `getTheme()` | `'light' \| 'dark'` | Lee el tema actual de localStorage |
| `setTheme(theme)` | `void` | Persiste y aplica el tema |
| `toggleTheme()` | `'light' \| 'dark'` | Cambia y retorna el nuevo tema |
| `isDark()` | `boolean` | Shortcut para `getTheme() === 'dark'` |
| `initTheme()` | `void` | Aplica el tema persisted al `<html>` en load |
| `getLogoPath(basename)` | `string` | Retorna `/logos/{basename}[-night].png` |
| `getScenePath()` | `string` | Retorna `/logos/{sun\|moon}-scene.svg` |

## Dark Mode — Inversión de Escalas

El dark theme invierte la dirección de las escalas `brand`, `neutral`, `primary` y `secondary` para que las clases Tailwind existentes funcionen correctamente:

- **Indices bajos (50–200)** → colores oscuros → fondos, inputs, superficies
- **Indices medios (300–500)** → tonos medios → borders, sidebar bg
- **Indices altos (600–900)** → colores claros → texto, headings, acentos

Esto permite que `bg-brand-100` sea claro en light mode (`#fcedd7`) y oscuro en dark mode (`#132b35`) **sin cambiar los componentes**.

## CSS Variables de Efectos

Los ring/shadow usan CSS custom properties para evitar colores hardcodeados:

| Variable | Light | Dark |
|----------|-------|------|
| `--ring-brand` | `rgba(229,119,34,0.15)` | `rgba(74,125,141,0.3)` |
| `--ring-error` | `rgba(239,68,68,0.15)` | `rgba(160,96,96,0.3)` |
| `--ring-primary` | `rgba(31,170,125,0.15)` | `rgba(56,186,219,0.3)` |
| `--shadow-brand-hover` | `rgba(229,119,34,0.18)` | `rgba(74,125,141,0.25)` |

**Regla:** nunca hardcodear `rgba()` de brand en componentes. Usar siempre `var(--ring-brand)` o `var(--shadow-brand-hover)`.

## Inspiración Visual

| Elemento | Light | Dark |
|----------|-------|------|
| Cielo | Sol radiante | Luna creciente con estrellas |
| Vasija | Barro terracota brillante | Cerámica azul oscuro con pátina oxidada |
| Olas | Azul turquesa brillante | Teal profundo con reflejos plateados |
| Fuego | Naranja/cobre | Cyan/azul (llama fría) |
| Paleta base | Cobre cálido (`#e57722`) | Teal oxidado (`#4a7d8d`) |
