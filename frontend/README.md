# Guia de Implementacion - Restaurant Management System

## Tabla de Contenidos

1. [Arquitectura del Proyecto](#1-arquitectura-del-proyecto)
2. [Configuracion Inicial](#2-configuracion-inicial)
3. [Sistema de Autenticacion](#3-sistema-de-autenticacion)
4. [Sistema de Roles y Permisos](#4-sistema-de-roles-y-permisos)
5. [Enrutamiento (Router)](#5-enrutamiento-router)
6. [Crear Nuevas Vistas/Modulos](#6-crear-nuevas-vistasmodulos)
7. [Estado Global (Store)](#6-estado-global-store)
8. [Endpoints para Backend](#7-endpoints-para-backend)

---

## 1. Arquitectura del Proyecto

```
frontend/
├── src/
│   ├── main.js              # Punto de entrada, enrutador principal
│   ├── App.js               # (Reservado para configuracion futura)
│   ├── services/
│   │   ├── mockUsers.js     # Usuarios demo + localStorage
│   │   └── authService.js   # Logica de autenticacion
│   ├── store/
│   │   ├── index.js         # Sistema de estado reactivo (createStore)
│   │   └── auth.js          # Estado de autenticacion
│   ├── utils/
│   │   └── routeGuard.js    # Proteccion de rutas por rol
│   ├── views/
│   │   ├── auth/            # Login y Registro
│   │   ├── dashboard/       # Panel principal
│   │   ├── inventory/       # Inventario
│   │   ├── kitchen/         # Cocina
│   │   ├── menu/            # Menu
│   │   ├── orders/          # Pedidos
│   │   ├── payments/        # Pagos
│   │   ├── reports/         # Reportes
│   │   ├── reservations/    # Reservaciones
│   │   ├── settings/        # Configuracion
│   │   └── tables/          # Mesas
│   ├── components/          # Componentes reutilizables
│   ├── router/              # Router (futuro)
│   └── styles/              # Estilos CSS
├── package.json
└── vite.config.js
```

---

## 2. Configuracion Inicial

### Ejutar el proyecto
```bash
cd frontend
npm install
npm run dev
```

### Dependencias
- **Vite** ^5.0.0 - Bundler
- **Tailwind CSS** ^3.4.0 - Estilos
- No usa frameworks (Vanilla JS + Tailwind)

---

## 3. Sistema de Autenticacion

### Flujo de Login

```
Usuario ingresa credenciales
        ↓
authService.login() busca en localStorage
        ↓
Si existe: guarda sesion + retorna usuario
Si no existe: retorna error
        ↓
Store auth.js actualiza estado
        ↓
Redirige a ruta segun rol
```

### Codigo clave

**Para hacer login:**
```javascript
import * as authStore from './store/auth.js';

const result = authStore.login(username, password);
if (result.success) {
  // Redirigir segun rol
  window.location.hash = `#${getHomeRoute(result.user.role)}`;
}
```

**Para verificar sesion:**
```javascript
if (authStore.isAuthenticated()) {
  const user = authStore.currentUser();
  console.log(user.username, user.role);
}
```

**Para cerrar sesion:**
```javascript
authStore.logout();
window.location.hash = '#/login';
```

---

## 4. Sistema de Roles y Permisos

### Roles disponibles

| Rol | Codigo | Ruta por defecto | Permisos |
|-----|--------|------------------|----------|
| Administrador | `admin` | `/admin` | Acceso total, crear usuarios |
| Cliente | `client` | `/dashboard` | Ver menu, hacer pedidos |
| Mesero | `waiter` | `/orders` | Gestionar pedidos |
| Cocinero | `chef` | `/kitchen` | Ver pedidos de cocina |
| Cajero | `cashier` | `/payments` | Procesar pagos |

### Proteger vistas por rol

**En la vista:**
```javascript
import { ROLES } from '../services/mockUsers.js';

const user = authStore.currentUser();
if (user.role !== ROLES.ADMIN) {
  // Mostrar error de acceso
  return;
}
```

**Usando routeGuard:**
```javascript
import { guardRole } from '../utils/routeGuard.js';

const user = authStore.currentUser();
if (!guardRole(user, [ROLES.ADMIN, ROLES.WAITER])) {
  return; // Redirige automaticamente si no tiene permiso
}
```

### Acceso a rutas (configurado en routeGuard.js)

```javascript
const ROLE_ACCESS = {
  "/admin": [ROLES.ADMIN],
  "/dashboard": [ROLES.ADMIN, ROLES.CLIENT],
  "/orders": [ROLES.ADMIN, ROLES.WAITER],
  "/kitchen": [ROLES.ADMIN, ROLES.CHEF],
  "/payments": [ROLES.ADMIN, ROLES.CASHIER],
  "/menu": ["*"],  // Todos los roles
};
```

---

## 5. Enrutamiento (Router)

### Como funciona

El sistema usa **hash routing** (`#/login`, `#/dashboard`, etc.)

**Archivo:** `src/main.js`

```javascript
function route() {
  const hash = window.location.hash || "#/login";
  const path = hash.replace("#", "");
  
  // Si no esta autenticado y no es login, ir a login
  if (!authStore.isAuthenticated() && path !== "/login") {
    window.location.hash = "#/login";
    return;
  }
  
  // Switch con las rutas
  switch (path) {
    case "/login":
      renderLogin(app);
      break;
    case "/admin":
      renderRegister(app);
      break;
    // ... mas rutas
  }
}

window.addEventListener("hashchange", route);
route(); // Ejecutar al cargar
```

### Agregar una ruta nueva

1. Crear la vista en `views/nueva-vista/`
2. Importar en `main.js`
3. Agregar case en el switch

```javascript
// En main.js
import { renderNuevaVista } from './views/nueva-vista/index.js';

// Dentro del switch
case "/nueva-vista":
  renderNuevaVista(app);
  break;
```

---

## 6. Crear Nuevas Vistas/Modulos

### Plantilla basica de vista

Crear archivo: `src/views/mi-modulo/index.js`

```javascript
import * as authStore from '../../store/auth.js';
import { ROLES } from '../../services/mockUsers.js';

export function renderMiModulo(container) {
  // 1. Verificar permisos
  const user = authStore.currentUser();
  if (!user) {
    window.location.hash = '#/login';
    return;
  }
  
  // 2. Renderizar HTML
  container.innerHTML = `
    <div class="min-h-screen bg-gray-50">
      <nav class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <h1 class="text-xl font-bold text-gray-900">Mi Modulo</h1>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-600">
                ${user.username}
                <span class="ml-1 inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
                  ${user.role}
                </span>
              </span>
              <button id="logout-btn" class="rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <!-- CONTENIDO AQUI -->
        <div id="content">
          <!-- Formularios, tablas, etc. -->
        </div>
      </main>
    </div>
  `;
  
  // 3. Agregar event listeners
  document.getElementById('logout-btn').addEventListener('click', () => {
    authStore.logout();
    window.location.hash = '#/login';
  });
}
```

### Registrar en el router

**En `src/main.js`:**

```javascript
// Arriba del archivo, importar
import { renderMiModulo } from './views/mi-modulo/index.js';

// En el switch de la funcion route()
case "/mi-modulo":
  renderMiModulo(app);
  break;
```

---

## 7. Estado Global (Store)

### Como funciona el store

El store es un sistema reactivo simple:

```javascript
import { createStore } from './store/index.js';

// Crear store
const miStore = createStore({
  items: [],
  loading: false,
  error: null
});

// Obtener estado
const state = miStore.getState();

// Actualizar estado
miStore.setState({ loading: true });

// Suscribirse a cambios
const unsubscribe = miStore.subscribe((newState, prevState) => {
  console.log('Estado cambio:', newState);
});

// Cancelar suscripcion
unsubscribe();
```

### Store de autenticacion (referencia)

**Ubicacion:** `src/store/auth.js`

Funciones disponibles:
- `login(username, password)` - Iniciar sesion
- `logout()` - Cerrar sesion
- `currentUser()` - Obtener usuario actual
- `isAuthenticated()` - Verificar si esta autenticado
- `hasRole(...roles)` - Verificar roles
- `canAccess(allowedRoles)` - Verificar acceso a ruta
- `addUser(userData)` - Crear usuario (solo admin)
- `removeUser(userId)` - Eliminar usuario
- `changeUserRole(userId, newRole)` - Cambiar rol
- `listUsers()` - Listar usuarios (sin passwords)
- `subscribe(listener)` - Suscribirse a cambios

---

## 8. Endpoints para Backend

Cuando se implemente el backend, estos son los endpoints necesarios:

### Autenticacion

```javascript
// POST /auth/login
// Body: { username: string, password: string }
// Response: { success: boolean, user?: object, error?: string }

// POST /auth/logout
// Response: { success: boolean }

// GET /auth/me
// Response: { user: object } (requiere token)
```

### Usuarios (solo admin)

```javascript
// GET /auth/users
// Response: { users: array } (sin passwords)

// POST /auth/register
// Body: { username, email, password, role }
// Response: { success: boolean, user?: object, error?: string }

// PUT /auth/users/:id
// Body: { role?: string }
// Response: { success: boolean, user?: object, error?: string }

// DELETE /auth/users/:id
// Response: { success: boolean, error?: string }
```

### Modelo de Usuario

```javascript
{
  id: "usr_001",           // string unico
  username: "admin",       // string unico
  email: "admin@restaurant.com",  // string unico
  password: "hashed...",   // NUNCA en texto plano en BD
  role: "admin",           // enum: admin|client|waiter|chef|cashier
  createdAt: "ISO8601",    // fecha creacion
  updatedAt: "ISO8601"     // fecha actualizacion (opcional)
}
```

### Reglas de negocio

1. **Username unico** - No duplicados
2. **Email unico** - No duplicados
3. **Minimo 1 admin** - No se puede eliminar el ultimo admin
4. **Password minimo 6 caracteres**
5. **Solo admin puede crear usuarios**
6. **Password hasheado** - Usar bcrypt o argon2

---

## 9. Modulos Pendientes de Implementar

Cada modulo sigue la misma estructura:

| Modulo | Ruta | Rol Principal | Descripcion |
|--------|------|---------------|-------------|
| Menu | `/menu` | Todos | Ver/ gestionar platos |
| Mesas | `/tables` | admin, waiter | Estado de mesas |
| Pedidos | `/orders` | admin, waiter | Crear/gestionar pedidos |
| Cocina | `/kitchen` | admin, chef | Ver pedidos pendientes |
| Pagos | `/payments` | admin, cashier | Procesar cobros |
| Inventario | `/inventory` | admin | Stock de ingredientes |
| Reservaciones | `/reservations` | admin, client | Reservar mesas |
| Reportes | `/reports` | admin | Estadisticas |
| Configuracion | `/settings` | admin | Ajustes del sistema |

---

## 10. Checklist para Implementar un Modulo

- [ ] Crear carpeta en `views/nombre-modulo/`
- [ ] Crear archivo `index.js` con funcion `renderNombreModulo(container)`
- [ ] Verificar autenticacion al inicio de la vista
- [ ] Verificar permisos/roles si es necesario
- [ ] Usar Tailwind CSS para estilos
- [ ] Agregar ruta en `main.js` (import + switch case)
- [ ] Agregar acceso en `routeGuard.js` (si es necesario)
- [ ] Crear servicio en `services/` si necesita llamadas API
- [ ] Crear store en `store/` si necesita estado local

---

## 11. Usuarios Demo

| Usuario | Contrasena | Rol |
|---------|------------|-----|
| admin | admin123 | admin |
| client | client123 | client |
| waiter | waiter123 | waiter |
| chef | chef123 | chef |
| cashier | cashier123 | cashier |

**Nota:** Los passwords son `{rol}123` - Solo para desarrollo.

---

## 12. Comandos Utiles

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para produccion
npm run build

# Preview de produccion
npm run preview
```

---

## Notas para el Equipo Backend

1. **Sesiones:** Actualmente usa localStorage. En produccion usar JWT
2. **Passwords:** Siempre hashear con bcrypt/argon2
3. **Rate limiting:** Implementar en endpoint de login
4. **CORS:** Configurar para el dominio del frontend
5. **Validaciones:** Replicar las validaciones del frontend en el backend

## Frontend: Estado Actual y Guia de Implementacion

### Lo que ya funciona

**Auth (login + registro):**
- Login con 5 usuarios demo (localStorage)
- Registro de usuarios nuevos (solo admin)
- Sistema de roles con 5 permisos: `admin`, `client`, `waiter`, `chef`, `cashier`
- Sesion persistente via localStorage
- Proteccion de rutas por rol

**Routing:**
- Hash routing vanilla JS (`#/login`, `#/dashboard`, etc.)
- Redireccion automatica segun rol al loguear
- Guard de rutas no autenticadas

**Store:**
- Sistema reactivo pub/sub (`createStore`)
- Estado de auth con login/logout/subscribe

### Modulos pendientes (carpetas vacias)

| Modulo | Ruta | Rol Principal | Estado |
|--------|------|---------------|--------|
| Menu | `/menu` | Todos | Carpetas vacias, sin Codigo |
| Mesas | `/tables` | admin, waiter | Carpetas vacias, sin Codigo |
| Pedidos | `/orders` | admin, waiter | Carpetas vacias, sin Codigo |
| Cocina | `/kitchen` | admin, chef | Carpetas vacias, sin Codigo |
| Pagos | `/payments` | admin, cashier | Carpetas vacias, sin Codigo |
| Inventario | `/inventory` | admin | Carpetas vacias, sin Codigo |
| Reservaciones | `/reservations` | admin, client | Carpetas vacias, sin Codigo |
| Reportes | `/reports` | admin | Carpetas vacias, sin Codigo |
| Configuracion | `/settings` | admin | Carpetas vacias, sin Codigo |

### Credenciales Demo

| Usuario | Contrasena | Rol |
|---------|------------|-----|
| admin | admin123 | admin |
| client | client123 | client |
| waiter | waiter123 | waiter |
| chef | chef123 | chef |
| cashier | cashier123 | cashier |

### Como Ejecutar el Frontend

```bash
cd frontend
npm install
npm run dev
# Abre http://localhost:3000
```

### Problemas Encontrados en el Frontend

1. **Tailwind via CDN** (`index.html:8`): `cdn.tailwindcss.com` no es recomendado para produccion. Ya tienes `tailwindcss` en `package.json` pero no esta configurado con PostCSS. Se necesita:
   ```bash
   npx tailwindcss init -p
   ```
   Y cambiar el `<script>` CDN por los archivos CSS generados.

2. **Vite sin proxy**: `vite.config.js` no tiene proxy configurado para las llamadas al backend. Cuando se implemente el backend, agregar:
   ```js
   server: {
     proxy: { '/api': 'http://localhost:8000' }
   }
   ```

3. **`.env.example` del frontend esta vacio**: Deberia tener:
   ```
   VITE_API_URL=http://localhost:8000
   ```

4. **`App.js` vacio**: Reservado pero sin uso.

5. **Componentes no extraidos**: Las carpetas `components/common/`, `components/layout/`, `components/ui/`, `components/forms/` estan vacias. La nav bar y el layout de auth se repiten en multiples vistas y deberian extraerse.

6. **`main.js:34-44`**: Dashboard, Orders, Kitchen y Payments todos usan la misma funcion `renderDashboard()` que solo muestra "Welcome" con un titulo. Cada modulo necesita su propia vista.

7. **Sin servicio HTTP**: No hay cliente HTTP configurado (fetch wrapper, axios, etc.) para conectarse al backend.

8. **`store/auth.js:86-106`**: El default export duplica todos los named exports. Es redundante, se puede eliminar.

### Endpoints Necesarios

#### Autenticacion
| Metodo | Ruta | Body | Response | Auth |
|--------|------|------|----------|------|
| POST | `/api/v1/auth/login` | `{ username, password }` | `{ access_token, token_type, user }` | No |
| POST | `/api/v1/auth/register` | `{ username, email, password, role }` | `{ user }` | Admin |
| GET | `/api/v1/auth/me` | - | `{ user }` | Token |
| POST | `/api/v1/auth/logout` | - | `{ success }` | Token |

#### Usuarios (CRUD)
| Metodo | Ruta | Body | Response | Auth |
|--------|------|------|----------|------|
| GET | `/api/v1/users` | - | `[{ user }]` | Admin |
| GET | `/api/v1/users/:id` | - | `{ user }` | Admin |
| POST | `/api/v1/users` | `{ username, email, password, role }` | `{ user }` | Admin |
| PUT | `/api/v1/users/:id` | `{ role? }` | `{ user }` | Admin |
| DELETE | `/api/v1/users/:id` | - | `{ success }` | Admin |

#### Modulos Pendientes (definir endpoints)
| Modulo | Rutas esperadas |
|--------|-----------------|
| Menu | `GET/POST /api/v1/menu`, `GET/PUT/DELETE /api/v1/menu/:id` |
| Mesas | `GET/POST /api/v1/tables`, `PUT /api/v1/tables/:id/status` |
| Pedidos | `GET/POST /api/v1/orders`, `PUT /api/v1/orders/:id/status` |
| Cocina | `GET /api/v1/kitchen/pending`, `PUT /api/v1/kitchen/orders/:id` |
| Pagos | `GET/POST /api/v1/payments`, `GET /api/v1/payments/:order_id` |
| Inventario | `GET/POST /api/v1/inventory`, `PUT /api/v1/inventory/:id` |
| Reservaciones | `GET/POST /api/v1/reservations`, `PUT/DELETE /api/v1/reservations/:id` |
| Reportes | `GET /api/v1/reports/sales`, `GET /api/v1/reports/popular` |

### Reglas de Negocio

1. **Username y email unicos** - Sin duplicados
2. **Minimo 1 admin** - No se puede eliminar ni cambiar rol del ultimo admin
3. **Password minimo 6 caracteres**
4. **Solo admin puede crear/eliminar usuarios**
5. **Passwords hasheados** - bcrypt, nunca texto plano
6. **JWT para sesiones** - Expiracion configurable
7. **CORS** - Permitir solo el dominio del frontend

---
## Comandos Utiles

```bash
# Frontend
cd frontend && npm install && npm run dev

# Backend (cuando este implementado)
cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload

# Docker (cuando este implementado)
docker-compose up -d

# Build produccion
cd frontend && npm run build
```

---

## Orden de Implementacion Recomendado

1. **Database schema** - Crear `init/01_schema.sql` con todas las tablas
2. **Backend auth** - `config.py`, `database.py`, `security.py`, `models/user.py`, `api/v1/auth.py`
3. **Backend CRUD users** - `api/v1/users.py`
4. **Docker** - `docker-compose.yml`, Dockerfiles, conectar todo
5. **Frontend - API service** - Crear `services/api.js` con fetch wrapper + JWT
6. **Frontend - Modulos** - Implementar vistas una por una
7. **Frontend - Tailwind config** - Mover de CDN a PostCSS
8. **Scripts** - `dev.sh`, `build.sh`, `deploy.sh`

---

## Notas para el Equipo

### Frontend
- El login y registro ya funcionan con localStorage
- Cada modulo nuevo: crear `views/modulo/index.js`, importar en `main.js`, agregar case en switch
- Usar `routeGuard.js` para proteger rutas
- Usar `createStore` del `store/index.js` para estado local de cada modulo
- Tailwind CSS: usar clases del CDN actualmente, migrar a PostCSS para produccion

### Backend
- Seguir la arquitectura en capas: `api -> services -> repositories -> db`
- Todos los archivos `.py` estan vacios, hay que implementar desde cero
- JWT para autenticacion, bcrypt para passwords
- CORS configurar para `http://localhost:3000`

### Database
- PostgreSQL 16
- Usar Enums para roles y estados
- Tabla `users` es la unica con definicion clara (ver modelos en Backend)
- Los demas modulos (menu, orders, tables, etc.) necesitan disenar su schema

