# Guia del Proyecto — Restaurant Management System (El Fogon)

Guia practica para el equipo. Explica como funciona el proyecto, como estan organizadas las vistas, y como modificar o agregar funcionalidades.

---

## 1. Visión General

Sistema de gestion para restaurante llamado **"El Fogón"**. Permite gestionar pedidos (POS), cocina, mesas, reservaciones, inventario, pagos, y reportes. Cada rol del usuario (admin, waiter, chef, cashier) tiene acceso a vistas diferentes.

### Stack tecnologico

| Capa | Tecnologia | Version |
|------|-----------|---------|
| Frontend | JavaScript vanilla (ES Modules) | - |
| Build | Vite | 8.1 |
| CSS | Tailwind CSS | v4 |
| Iconos | Lucide | 1.24 |
| Charts | Chart.js | 4.5 |
| Backend | FastAPI (Python 3.13) | 0.139 |
| ORM | SQLAlchemy | 2.0 |
| DB | PostgreSQL (Docker) | 17 |
| Auth | JWT + bcrypt | - |

**Punto clave:** El frontend NO usa React, Vue ni Angular. Es JavaScript puro con modulos ES.

---

## 2. Estructura del Proyecto

```
restaurant-management-system/
├── frontend/                  # Frontend (Vite + Tailwind)
│   ├── src/
│   │   ├── main.js            # Punto de entrada + router
│   │   ├── views/             # Vistas (paginas completas)
│   │   ├── components/        # Componentes reutilizables
│   │   ├── api/               # Capa de datos (mock localStorage)
│   │   ├── store/             # Estado reactivo (pub/sub)
│   │   ├── services/          # Logica de negocio (localStorage)
│   │   ├── utils/             # Utilidades (guards, CSV, etc.)
│   │   └── styles/app.css     # Sistema de diseño (tokens Tailwind)
│   └── package.json
│
├── backend/                   # Backend (FastAPI)
│   ├── app/
│   │   ├── api/v1/            # Endpoints REST
│   │   ├── services/          # Logica de negocio
│   │   ├── repositories/      # Acceso a datos
│   │   ├── db/models/         # Modelos SQLAlchemy (16 tablas)
│   │   └── db/schemas/        # Schemas Pydantic
│   └── alembic/               # Migraciones de DB
│
├── database/                  # Scripts SQL legacy
├── docs/                      # Documentacion
└── docker-compose.yml         # PostgreSQL + Backend
```

---

## 3. Cómo Funciona el Routing (Vistas)

El router esta implementado manualmente en `frontend/src/main.js` usando **hash routing** (`#/ruta`). No hay libreria de routing.

### Flujo de una peticion de ruta

```
Usuario cambia URL -> hashchange event -> route() en main.js
  |
  |-- ¿Esta autenticado?  -> No -> redirigir a #/login
  |
  |-- ¿Es ruta publica?   -> Redirigir a home del rol
  |
  |-- ¿Tiene permiso?     -> No -> redirigir a home del rol
  |
  +-- Renderizar la vista correspondiente
```

### Tabla de rutas

| Ruta | Vista | Roles permitidos |
|------|-------|-----------------|
| `#/login` | Pagina de login | Todos (no autenticados) |
| `#/dashboard` | Dashboard con stats | admin, waiter, chef, cashier |
| `#/orders` | POS / Pedidos | admin, waiter |
| `#/tables` | Gestion de mesas | admin, waiter |
| `#/kitchen` | Cocina (Kanban) | admin, chef |
| `#/payments` | Pagos (proximamente) | admin, cashier |
| `#/reservations` | Lista de reservaciones | admin |
| `#/reservation-status` | Busqueda por codigo | admin, waiter |
| `#/create-user` | Crear usuarios | admin |

### Home por rol

| Rol | Home |
|-----|------|
| admin | `#/dashboard` |
| waiter | `#/orders` |
| chef | `#/kitchen` |
| cashier | `#/payments` |

Los guards de ruta estan en `frontend/src/utils/routeGuard.js`.

---

## 4. Arquitectura de Componentes

Cada componente y vista sigue el mismo patron de 3 funciones:

```javascript
// components/ui/Badge.js
export function render(props) {
  // Retorna un string HTML
  return `<span class="...">Texto</span>`;
}

export function init() {
  // Adjunta event listeners al DOM
}

export function destroy() {
  // Limpia event listeners y estado
}
```

### Diferencia entre views y components

| | `views/` | `components/` |
|---|----------|---------------|
| **Que es** | Una pagina completa | Un pedazo reutilizable de UI |
| **Quien la llama** | `main.js` (el router) | Una vista u otro componente |
| **Tiene init/destroy** | Si | No siempre (solo si tiene estado) |
| **Ejemplo** | `Dashboard.js`, `PosView.js` | `StatCard.js`, `Badge.js`, `CartPanel.js` |

### Sistema de eventos

Los componentes usan atributos `data-onclick` en el HTML:

```html
<button data-onclick="handleExportOrders">Exportar</button>
```

La vista registra la funcion en `window` durante `init()`:

```javascript
export function init() {
  window.handleExportOrders = handleExportOrders;
  bindDataOnclickListeners();
}
```

Y `bindDataOnclickListeners()` escanea el DOM para adjuntar los listeners:

```javascript
function bindDataOnclickListeners() {
  document.querySelectorAll('[data-onclick]').forEach(function (el) {
    var handlerName = el.getAttribute('data-onclick');
    if (handlerName && typeof window[handlerName] === 'function') {
      el.addEventListener('click', window[handlerName]);
    }
  });
}
```

**Siempre** limpiar handlers en `destroy()` para evitar memory leaks.

---

## 5. Como Agregar una Nueva Vista

Supongamos que quieres agregar una vista de **"Reportes"**.

### Paso 1: Crear la vista

Crear `frontend/src/views/reports/Reports.js`:

```javascript
import { render as PageHeader } from '../../components/common/PageHeader.js';

let _state = {
  loaded: false,
  data: [],
};

function renderInnerHtml() {
  if (!_state.loaded) return '<div class="text-center py-12">Cargando...</div>';

  return `
    <div id="view-reports" class="p-6">
      ${PageHeader({ title: 'Reportes' })}
      <!-- Tu contenido aqui -->
    </div>
  `;
}

export function render() {
  return renderInnerHtml();
}

export function init() {
  _state.loaded = false;

  fetchData().then(function (result) {
    _state.data = result.data;
    _state.loaded = true;
    rerender();
  });

  bindDataOnclickListeners();
}

function rerender() {
  var container = document.getElementById('view-reports');
  if (!container) return;
  container.innerHTML = renderInnerHtml();
  bindDataOnclickListeners();
}

function bindDataOnclickListeners() {
  document.querySelectorAll('[data-onclick]').forEach(function (el) {
    var handlerName = el.getAttribute('data-onclick');
    if (handlerName && typeof window[handlerName] === 'function') {
      el.addEventListener('click', window[handlerName]);
    }
  });
}

export function destroy() {
  document.querySelectorAll('[data-onclick]').forEach(function (el) {
    var handlerName = el.getAttribute('data-onclick');
    if (handlerName && typeof window[handlerName] === 'function') {
      el.removeEventListener('click', window[handlerName]);
    }
  });
}

export default { render, init, destroy };
```

### Paso 2: Registrar la ruta en main.js

En `frontend/src/main.js`, agregar el import y el case en el switch:

```javascript
// Import arriba del archivo
import ReportsView from "./views/reports/Reports.js";

// Dentro del switch(path)
case "/reports":
  renderWithNav(ReportsView.render());
  ReportsView.init();
  currentView = ReportsView;
  break;
```

### Paso 3: Agregar permisos en routeGuard.js

En `frontend/src/utils/routeGuard.js`, agregar la ruta:

```javascript
const ROLE_ACCESS = {
  // ... rutas existentes
  "/reports": [ROLES.ADMIN],  // o los roles que quieras
};
```

### Paso 4: Agregar link en la navegacion

En `main.js`, dentro de `buildNav(user)`, agregar el link:

```javascript
if (user.role === "admin") {
  links.push(`<a href="#/reports" class="nav-link">Reports</a>`);
}
```

O si usas el `Sidebar.js`, agregar el item al array `navItems`.

### Paso 5: Crear capa de datos (si aplica)

Crear `frontend/src/api/reports.js` o `frontend/src/services/reportService.js` con los datos mock en localStorage, siguiendo el patron de `api/orders.js`.

---

## 6. Como Modificar una Vista Existente

### Donde encontrar que

| Quiero modificar... | Busco en... |
|---------------------|-------------|
| El layout general de la pagina | `views/nombre/Vista.js` |
| Un componente visual especifico | `components/nombre/Componente.js` |
| Los colores y estilos | `styles/app.css` (tokens `@theme`) |
| Los datos que se muestran | `api/nombre.js` o `services/` |
| Las reglas de acceso | `utils/routeGuard.js` |
| La navegacion | `main.js` (buildNav) o `components/layout/Sidebar.js` |
| El estado global | `store/auth.js` o `store/reservations.js` |

### Cambiar el orden de secciones dentro de una vista

Dentro de cada vista, el HTML se construye como un string en `renderInnerHtml()`. El orden de las secciones es simplemente el orden en que se concatenan los strings:

```javascript
// Ejemplo: Dashboard.js - renderInnerHtml()
return `
  ${WelcomeBanner(...)}           <!-- 1ro: Banner de bienvenida -->
  ${PageHeader(...)}              <!-- 2do: Header de pagina -->
  <div class="grid ...">          <!-- 3ro: Tarjetas de stats -->
    ${statsHtml}
  </div>
  ${chartGrid}                    <!-- 4to: Grafico + estado de mesas -->
  ${recentOrdersCard}             <!-- 5to: Pedidos recientes -->
`;
```

Para reordenar, simplemente cambia el orden de los bloques en el template string.

### Agregar un componente a una vista existente

1. Importar el componente al inicio del archivo de la vista
2. Llamarlo dentro de `renderInnerHtml()` en la posicion que quieras
3. Si tiene interaccion, registrar sus handlers en `init()` y limpiarlos en `destroy()`

### Cambiar datos mock

Cada modulo en `api/` tiene un array `DEFAULT_*` al inicio del archivo. Editar ese array cambia los datos que aparecen por defecto:

```javascript
// api/orders.js
const DEFAULT_ORDERS = [
  { id: 1043, table: 3, ... },  // Modificar estos objetos
];
```

---

## 7. Sistema de Diseno (Tailwind v4)

Todos los tokens de diseno estan definidos en `frontend/src/styles/app.css` usando la directiva `@theme`.

### Paleta de colores

| Familia | Uso | Ejemplo de clase |
|---------|-----|-------------------|
| `brand-*` | Color principal del restaurante (naranja) | `bg-brand-500`, `text-brand-700` |
| `primary-*` | Acciones primarias (verde) | `bg-primary-500` |
| `secondary-*` | Elementos secundarios (marron) | `text-secondary-600` |
| `accent-*` | Acentos y highlights (amarillo) | `bg-accent-400` |
| `neutral-*` | Grises para texto y bordes | `text-neutral-700`, `border-neutral-200` |
| `success-*` | Estados exitosos | `bg-success-500` |
| `warning-*` | Advertencias | `bg-warning-500` |
| `error-*` | Errores | `bg-error-500` |
| `info-*` | Informacion | `bg-info-500` |

### Espaciado

Basado en la grilla de 4px. Clases: `gap-1` (4px), `gap-2` (8px), `gap-3` (12px), `gap-4` (16px), `gap-6` (24px), `gap-8` (32px).

### Tipografia

| Token | Valor | Uso |
|-------|-------|-----|
| `font-sans` | Inter | Texto general |
| `font-display` | Plus Jakarta Sans | Titulos y branding |
| `font-mono` | Fira Mono | Codigo/datos |

### Border Radius

`rounded-sm` (4px), `rounded-md` (6px), `rounded-lg` (8px), `rounded-xl` (12px), `rounded-2xl` (16px).

### Regla: no hardcodear valores

Siempre usar los tokens definidos en `app.css`. Si necesitas un valor nuevo, agregarlo al bloque `@theme` primero.

---

## 8. Conexion Frontend <-> Backend

### Estado actual

El frontend funciona **100% con localStorage** como mock. NO esta conectado al backend todavia. Cada modulo en `api/` lee y escribe en localStorage con un `setTimeout` fake para simular latencia de red.

### Como funciona la capa de datos mock

```
Vista (ej: Dashboard.js)
  +-- import { fetchDashboardStats } from '../../api/dashboard.js'
       +-- Lee de localStorage, retorna { ok: true, data: ... }
```

### Como conectar al backend real

Cuando quieras conectar, solo necesitas cambiar los modulos en `api/`. Por ejemplo, `api/orders.js`:

```javascript
// ANTES (mock)
export async function fetchOrders(filter = "all") {
  await delay();
  let orders = getOrders();  // localStorage
  return { ok: true, data: orders };
}

// DESPUES (real)
export async function fetchOrders(filter = "all") {
  const res = await fetch(`/api/v1/orders?status=${filter}`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  if (!res.ok) return { ok: false, error: 'Error' };
  const data = await res.json();
  return { ok: true, data };
}
```

La forma de respuesta `{ ok: true/false, data/error }` ya esta estandarizada para que las vistas no necesiten cambios.

### Backend: Endpoints disponibles

| Modulo | Endpoint | Metodo |
|--------|----------|--------|
| Auth | `/api/v1/auth/login` | POST |
| Usuarios | `/api/v1/users/` | GET, POST |
| Categorias | `/api/v1/categories/` | GET, POST |
| Mesas | `/api/v1/tables/` | GET, POST |
| Menu | `/api/v1/menu/` | GET, POST |
| Pedidos | `/api/v1/orders/` | GET, POST |
| Cocina | `/api/v1/kitchen/` | GET, PUT |
| Inventario | `/api/v1/inventory/` | GET, POST |
| Pagos | `/api/v1/payments/` | GET, POST |
| Reportes | `/api/v1/reports/sales` | GET |

---

## 9. Credenciales de Prueba (Mock)

| Usuario | Contrasena | Rol |
|---------|-----------|-----|
| admin | admin123 | Administrator |
| waiter | waiter123 | Waiter |
| chef | chef123 | Chef |
| cashier | cashier123 | Cashier |

---

## 10. Vistas Pendientes (Placeholders)

Estas vistas tienen archivos `.gitkeep` pero aun no estan implementadas:

- `views/menu/` — Gestion del menu
- `views/inventory/` — Inventario
- `views/payments/` — Pagos (route muestra "coming soon")
- `views/reports/` — Reportes
- `views/settings/` — Configuracion

Para implementar cualquiera de estas, seguir el Paso a Paso de la seccion 5.

---

## 11. Comandos Utiles

```bash
# Instalar dependencias del frontend
cd frontend && npm install

# Ejecutar en desarrollo
cd frontend && npm run dev    # Frontend en http://localhost:3000

# Ejecutar backend con Docker
docker-compose up --build     # PostgreSQL + FastAPI

# Build de produccion
cd frontend && npm run build
```