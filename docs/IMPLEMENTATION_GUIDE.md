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
| Administrador | `admin` | `/admin` | Acceso total, CRUD reservas, crear usuarios |
| Mesero | `waiter` | `/orders` | Gestionar pedidos, ver estado de reservas |
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
  role: "admin",           // enum: admin|waiter|chef|cashier
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
| Reservaciones | `/reservations` | admin | CRUD completo de reservas |
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
