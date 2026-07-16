# Documentación Técnica — Backend
## Restaurant Management System

**Responsable del módulo:** Diego  
**Fecha:** Julio 2026  
**Versión:** 1.1.0

---

## 1. Descripción General

El backend del **Restaurant Management System** es una API REST que gestiona la operación completa de un restaurante. Cubre desde la gestión de mesas y reservaciones, hasta el procesamiento de pedidos, cocina, inventario, pagos y reportes.

La API está construida siguiendo una arquitectura en capas que separa responsabilidades: presentación (endpoints), lógica de negocio (services), acceso a datos (repositories) y modelos de base de datos.

---

## 2. Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|---|---|---|
| **Python** | 3.13 | Lenguaje principal del backend |
| **FastAPI** | 0.139.0 | Framework para construir la API REST |
| **SQLAlchemy** | 2.0.48 | ORM para interactuar con la base de datos |
| **PostgreSQL** | — | Base de datos relacional principal |
| **Pydantic** | 2.13.3 | Validación de datos de entrada y salida |
| **Alembic** | 1.18.4 | Migraciones de base de datos |
| **JWT (python-jose)** | 3.5.0 | Autenticación mediante tokens |
| **Passlib + bcrypt** | 1.7.4 / 4.0.1 | Hash seguro de contraseñas |
| **Docker + Compose** | — | Contenedorización y orquestación de servicios |
| **Uvicorn** | 0.51.0 | Servidor ASGI para correr FastAPI |

### ¿Por qué FastAPI?

FastAPI fue elegido por tres razones principales:

1. **Rendimiento:** Es uno de los frameworks Python más rápidos disponibles, comparable a Node.js.
2. **Documentación automática:** Genera una interfaz Swagger UI en `/docs` que permite probar todos los endpoints sin herramientas externas.
3. **Validación integrada:** Usa Pydantic para validar automáticamente los datos de entrada, reduciendo código repetitivo.

### ¿Por qué PostgreSQL?

PostgreSQL fue elegido porque el sistema maneja relaciones complejas entre entidades (mesas → reservaciones → pedidos → pagos), y su soporte robusto para llaves foráneas, transacciones y tipos de datos avanzados lo hace ideal para este caso de uso.

---

## 3. Arquitectura del Proyecto

El backend sigue una arquitectura de **4 capas desacopladas**:

```
Cliente (HTTP Request)
        ↓
┌─────────────────────┐
│   API / Endpoints   │  ← Recibe la petición, valida con schemas
│   (app/api/v1/)     │
└─────────────────────┘
        ↓
┌─────────────────────┐
│      Services       │  ← Aplica la lógica de negocio
│   (app/services/)   │
└─────────────────────┘
        ↓
┌─────────────────────┐
│    Repositories     │  ← Consulta la base de datos
│  (app/repositories/)│
└─────────────────────┘
        ↓
┌─────────────────────┐
│   Models / DB       │  ← Tablas de PostgreSQL via SQLAlchemy
│   (app/db/)         │
└─────────────────────┘
```

Esta separación permite que cada capa pueda modificarse sin afectar a las demás.

---

## 4. Instalación y Ejecución

### Requisitos previos

- Python 3.13+
- Docker Desktop instalado y en ejecución
- Git

### Pasos

**1. Clonar el repositorio:**
```bash
git clone <url-del-repositorio>
cd restaurant-management-system-1
```

**2. Levantar la base de datos con Docker:**
```bash
docker-compose up -d
```

**3. Instalar dependencias:**
```bash
cd backend
pip install -r requirements.txt
```

**4. Iniciar el servidor:**
```bash
python -m uvicorn app.main:app --reload
```

**5. Acceder a la documentación interactiva:**
```
http://127.0.0.1:8000/docs
```

---

## 5. Autenticación

La API usa autenticación basada en **JWT (JSON Web Tokens)**.

### Flujo de autenticación

1. El cliente registra un usuario en `POST /api/v1/auth/register`
2. El cliente inicia sesión en `POST /api/v1/auth/login` y recibe un `access_token`
3. Para acceder a endpoints protegidos, el token debe enviarse en el header:

```
Authorization: Bearer <access_token>
```

Los endpoints marcados con 🔒 requieren este token. Los endpoints públicos no requieren autenticación.

---

## 6. Endpoints

Todos los endpoints están bajo el prefijo `/api/v1/`.

---

### 🔐 Auth — Autenticación

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/api/v1/auth/register` | Registra un nuevo usuario | Público |
| POST | `/api/v1/auth/login` | Inicia sesión y retorna token JWT | Público |

**Ejemplo — Registro:**
```json
POST /api/v1/auth/register
{
  "username": "diego",
  "email": "diego@restaurante.com",
  "password": "contraseña123",
  "full_name": "Diego Pérez",
  "role": "waiter"
}
```

**Roles disponibles:** `waiter`, `admin`, `kitchen`

---

### 👤 Users — Usuarios

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/api/v1/users/` | Lista todos los usuarios | 🔒 |
| GET | `/api/v1/users/me` | Retorna el usuario autenticado actual | 🔒 |
| GET | `/api/v1/users/{user_id}` | Retorna un usuario por ID | 🔒 |
| PUT | `/api/v1/users/{user_id}` | Actualiza datos de un usuario | 🔒 |
| DELETE | `/api/v1/users/{user_id}` | Elimina un usuario | 🔒 |

---

### 🏷️ Categories — Categorías

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/api/v1/categories/` | Lista todas las categorías | Público |
| GET | `/api/v1/categories/{category_id}` | Retorna una categoría por ID | Público |
| POST | `/api/v1/categories/` | Crea una nueva categoría | 🔒 |
| PUT | `/api/v1/categories/{category_id}` | Actualiza una categoría | 🔒 |
| DELETE | `/api/v1/categories/{category_id}` | Elimina una categoría | 🔒 |

**Ejemplo — Crear categoría:**
```json
POST /api/v1/categories/
{
  "name": "Platos principales",
  "description": "Platos fuertes del restaurante"
}
```

---

### 🪑 Tables — Mesas

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/api/v1/tables/` | Lista todas las mesas | Público |
| GET | `/api/v1/tables/available` | Lista mesas disponibles | Público |
| GET | `/api/v1/tables/{table_id}` | Retorna una mesa por ID | Público |
| POST | `/api/v1/tables/` | Crea una nueva mesa | 🔒 |
| PUT | `/api/v1/tables/{table_id}` | Actualiza datos o estado de una mesa | 🔒 |
| DELETE | `/api/v1/tables/{table_id}` | Elimina una mesa | 🔒 |

**Estados de mesa:** `available`, `reserved`, `occupied`

---

### 📅 Reservations — Reservaciones

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/api/v1/reservations/` | Lista todas las reservaciones | 🔒 |
| GET | `/api/v1/reservations/{reservation_id}` | Retorna una reservación por ID | 🔒 |
| POST | `/api/v1/reservations/` | Crea una nueva reservación | 🔒 |
| PUT | `/api/v1/reservations/{reservation_id}` | Actualiza una reservación | 🔒 |
| DELETE | `/api/v1/reservations/{reservation_id}` | Cancela una reservación | 🔒 |

**Estados de reservación:** `pending`, `confirmed`, `cancelled`

**Ejemplo — Crear reservación:**
```json
POST /api/v1/reservations/
{
  "table_id": "uuid-de-la-mesa",
  "reservation_date": "2026-07-20T19:00:00",
  "guest_count": 4,
  "notes": "Mesa cerca de la ventana"
}
```

---

### 🍽️ Menu — Menú

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/api/v1/menu/` | Lista todos los items del menú | Público |
| GET | `/api/v1/menu/available` | Lista solo items disponibles | Público |
| GET | `/api/v1/menu/{item_id}` | Retorna un item por ID | Público |
| GET | `/api/v1/menu/category/{category_id}` | Filtra items por categoría | Público |
| POST | `/api/v1/menu/` | Crea un nuevo item en el menú | 🔒 |
| PUT | `/api/v1/menu/{item_id}` | Actualiza un item del menú | 🔒 |
| DELETE | `/api/v1/menu/{item_id}` | Elimina un item del menú | 🔒 |

---

### 📋 Orders — Pedidos

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/api/v1/orders/` | Lista todos los pedidos | 🔒 |
| GET | `/api/v1/orders/active` | Lista pedidos activos | 🔒 |
| GET | `/api/v1/orders/{order_id}` | Retorna un pedido por ID | 🔒 |
| POST | `/api/v1/orders/` | Crea un nuevo pedido | 🔒 |
| POST | `/api/v1/orders/{order_id}/items` | Agrega un item a un pedido | 🔒 |
| PUT | `/api/v1/orders/{order_id}/status` | Actualiza el estado del pedido | 🔒 |

**Estados de pedido:** `pending`, `ready`, `paid`

**Ejemplo — Crear pedido:**
```json
POST /api/v1/orders/
{
  "table_id": "uuid-de-la-mesa"
}
```

**Ejemplo — Agregar item:**
```json
POST /api/v1/orders/{order_id}/items
{
  "menu_item_id": "uuid-del-item",
  "quantity": 2
}
```

---

### 👨‍🍳 Kitchen — Cocina

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/api/v1/kitchen/` | Lista órdenes pendientes e in-progress | 🔒 |
| GET | `/api/v1/kitchen/pending` | Lista órdenes pendientes | 🔒 |
| GET | `/api/v1/kitchen/in-progress` | Lista órdenes en preparación | 🔒 |
| GET | `/api/v1/kitchen/order/{order_id}` | Órdenes de cocina de un pedido | 🔒 |
| GET | `/api/v1/kitchen/{kitchen_order_id}` | Retorna una orden de cocina por ID | 🔒 |
| PUT | `/api/v1/kitchen/{kitchen_order_id}/status` | Actualiza estado de cocina | 🔒 |

**Estados de cocina:** `pending`, `in_progress`, `ready`

---

### 📦 Inventory — Inventario

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/api/v1/inventory/` | Lista todo el inventario | 🔒 |
| GET | `/api/v1/inventory/low-stock` | Lista items con stock bajo | 🔒 |
| GET | `/api/v1/inventory/{item_id}` | Retorna un item por ID | 🔒 |
| POST | `/api/v1/inventory/` | Registra un nuevo item | 🔒 |
| PUT | `/api/v1/inventory/{item_id}` | Actualiza un item | 🔒 |
| POST | `/api/v1/inventory/{item_id}/movements` | Registra movimiento de stock | 🔒 |

**Tipos de movimiento:** `in` (entrada), `out` (salida)

---

### 💳 Payments — Pagos

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/api/v1/payments/` | Lista todos los pagos | 🔒 |
| GET | `/api/v1/payments/{payment_id}` | Retorna un pago por ID | 🔒 |
| GET | `/api/v1/payments/order/{order_id}` | Retorna el pago de un pedido | 🔒 |
| POST | `/api/v1/payments/` | Registra un nuevo pago | 🔒 |

**Ejemplo — Registrar pago:**
```json
POST /api/v1/payments/
{
  "order_id": "uuid-del-pedido",
  "amount": 45000,
  "method": "cash"
}
```

---

### 📊 Reports — Reportes

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/api/v1/reports/sales` | Reporte de ventas por rango de fechas | 🔒 |
| GET | `/api/v1/reports/products` | Productos más vendidos | 🔒 |

**Ejemplo de uso:**
```
GET /api/v1/reports/sales?start_date=2026-07-01T00:00:00&end_date=2026-07-15T23:59:59
```

---

## 7. Códigos de Respuesta HTTP

| Código | Significado | Cuándo ocurre |
|---|---|---|
| 200 | OK | Solicitud exitosa |
| 201 | Created | Recurso creado exitosamente |
| 204 | No Content | Eliminación exitosa |
| 401 | Unauthorized | Token inválido o ausente |
| 404 | Not Found | Recurso no encontrado |
| 422 | Unprocessable Entity | Datos de entrada inválidos |
| 500 | Internal Server Error | Error interno del servidor |

---

## 8. Flujo Operativo del Sistema

```
Cliente reserva mesa → Mesa: RESERVED
        ↓
Cliente llega → Mesa: OCCUPIED
        ↓
Mesero crea pedido → Order: PENDING
        ↓
Inventario se descuenta automáticamente
        ↓
Pedido llega a cocina → Kitchen: PENDING → IN_PROGRESS → READY
        ↓
Mesero entrega → Cliente consume
        ↓
Cajero registra pago → Order: PAID
        ↓
Mesa vuelve a: AVAILABLE → Datos alimentan Reportes
```

---

## 9. Endpoints Base del Servidor

| Ruta | Descripción |
|---|---|
| `GET /` | Confirma que el servidor está corriendo |
| `GET /health` | Verificación de salud del servidor |
| `GET /docs` | Documentación interactiva Swagger UI |
| `GET /openapi.json` | Esquema OpenAPI en formato JSON |
