# Backend — Sistema de Gestión de Restaurante

API REST desarrollada con Python y FastAPI, siguiendo una arquitectura por capas.

---

## Arquitectura

```
backend/
├── app/
│   ├── api/
│   │   ├── router.py          # Router central — registra todos los módulos bajo /api/v1/
│   │   └── v1/                # Endpoints por módulo
│   │       ├── auth.py
│   │       ├── categories.py
│   │       ├── inventory.py
│   │       ├── kitchen.py
│   │       ├── menu.py
│   │       ├── orders.py
│   │       ├── payments.py
│   │       ├── reports.py
│   │       ├── reservations.py
│   │       ├── tables.py
│   │       └── users.py
│   ├── core/
│   │   ├── config.py          # Variables de entorno (Settings con Pydantic)
│   │   ├── dependencies.py    # get_current_user para autenticación
│   │   └── security.py        # Hash bcrypt + JWT
│   ├── db/
│   │   ├── database.py        # SQLAlchemy engine, sesión, get_db()
│   │   ├── models/            # 11 modelos ORM
│   │   ├── schemas/           # Schemas Pydantic por entidad
│   │   └── seed.py            # Datos de prueba para desarrollo
│   ├── repositories/          # 11 repositorios (CRUD + consultas)
│   ├── services/              # 12 servicios (lógica de negocio)
│   ├── utils/
│   │   ├── date_utils.py
│   │   ├── pagination.py
│   │   └── validators.py
│   └── main.py                # Punto de entrada FastAPI
├── alembic/                   # Migraciones con Alembic
├── tests/                     # Pruebas con pytest
├── ruff.toml                  # Configuración del linter
├── requirements.txt
├── Dockerfile
└── .env.example
```

---

## Estado actual

### Capa de persistencia — app/db/

| Archivo | Descripción |
|---|---|
| database.py | Configuración de SQLAlchemy, motor, sesión y get_db() |
| models/ | 11 modelos ORM (User, Category, MenuItem, Table, Reservation, Order, OrderItem, Payment, InventoryItem, InventoryMovement, KitchenOrder) |
| schemas/ | Schemas Pydantic para validación de entrada y salida |
| seed.py | Datos de prueba (usuarios, mesas, categorías, menú, inventario, proveedores) |

### Capa de acceso a datos — app/repositories/

11 repositorios con operaciones CRUD y consultas específicas:
- UserRepository — CRUD y búsqueda por username o email
- CategoryRepository — CRUD y búsqueda por nombre
- MenuItemRepository — CRUD y filtro por categoría y disponibilidad
- TableRepository — CRUD y mesas disponibles
- ReservationRepository — CRUD y filtro por usuario o fecha
- OrderRepository — CRUD y pedidos activos
- PaymentRepository — CRUD y búsqueda por orden
- InventoryRepository — CRUD de ítems, movimientos y stock bajo
- KitchenRepository — pedidos pendientes y en preparación
- PurchaseRepository — CRUD de compras a proveedores
- RecipeRepository — CRUD de recetas
- ReportRepository — reportes de ventas y productos más vendidos

### Capa de lógica de negocio — app/services/

12 servicios que orquestan repositorios y validaciones:
- AuthService — login con JWT y registro con hash de contraseña
- UserService — CRUD de usuarios
- CategoryService — CRUD de categorías
- MenuItemService — CRUD de ítems del menú
- TableService — CRUD de mesas con gestión de estados
- ReservationService — CRUD y cancelación
- OrderService — CRUD y agregado de ítems con cálculo de subtotal
- PaymentService — CRUD y registro de pagos
- InventoryService — CRUD de ítems y registro de movimientos (entrada/salida)
- KitchenService — actualización de estados en cocina
- PurchaseService — CRUD de compras
- RecipeService — CRUD de recetas
- ReportService — reportes de ventas y productos

### Endpoints — app/api/v1/

11 módulos de endpoints conectados al router central:
- `/api/v1/auth` — registro y login
- `/api/v1/users` — CRUD de usuarios
- `/api/v1/categories` — CRUD de categorías
- `/api/v1/menu` — CRUD del menú
- `/api/v1/tables` — CRUD de mesas
- `/api/v1/reservations` — CRUD de reservaciones
- `/api/v1/orders` — CRUD de pedidos
- `/api/v1/payments` — CRUD de pagos
- `/api/v1/inventory` — CRUD de inventario
- `/api/v1/kitchen` — gestión de cocina
- `/api/v1/reports` — reportes

### Utilidades — app/utils/

- date_utils.py — funciones para fechas (now_utc, format_datetime, parse_date)
- validators.py — validaciones comunes (correo electrónico, números positivos)
- pagination.py — utilitario para paginación

### Configuración base — app/core/

- config.py — variables de entorno (Settings con Pydantic)
- security.py — hash de contraseñas (bcrypt), generación y verificación de JWT
- dependencies.py — dependencia get_current_user para autenticación

### Punto de entrada — app/main.py

Aplicación FastAPI con CORS, endpoints raíz (/) y health check (/health).

### Tests — tests/

Pruebas con pytest:
- test_health.py — tests del endpoint de salud
- test_models.py — tests de imports y nombres de tablas

---

## Linting — Ruff

El proyecto usa [Ruff](https://docs.astral.sh/ruff/) como linter. La configuración está en `backend/ruff.toml`.

### Configuración

| Opción | Valor |
|---|---|
| line-length | 100 |
| target-version | py313 |
| Reglas activas | E (pycodestyle), F (pyflakes), I (isort) |
| Exclusiones | alembic/versions/ |

### Ejecutar lint

```bash
# Verificar errores
ruff check app/ tests/

# Auto-fix
ruff check app/ tests/ --fix
```

---

## Variables de entorno

### Variables necesarias

| Variable | Descripción |
|---|---|
| DATABASE_URL | URL completa de conexión a PostgreSQL |
| SECRET_KEY | Clave secreta para firmar JWT (generar con `python -c "import secrets; print(secrets.token_urlsafe(64))"`) |
| TEST_DATABASE_URL | URL de la base de datos de pruebas |
| ALGORITHM | Algoritmo de firma JWT (default: HS256) |
| ACCESS_TOKEN_EXPIRE_MINUTES | Tiempo de expiración del token (default: 30) |

---

## Configuración de base de datos

### Con Docker Compose

```bash
# 1. Copiar .env.example a .env y completar las variables
cp .env.example .env

# 2. Iniciar PostgreSQL y el backend con Docker
docker compose up --build
```

Esto levanta dos servicios:
- database — PostgreSQL 17 en localhost:{DB_PORT} (por defecto 5432)
- backend — FastAPI en localhost:{API_PORT} (por defecto 8000)

El backend espera a que la base de datos esté saludable antes de arrancar. Una vez iniciado, ejecuta las migraciones automáticas con Alembic.

### Sin Docker (desarrollo local)

```bash
# 1. Tener PostgreSQL corriendo localmente

# 2. Crear la base de datos
createdb restaurant_db

# 3. Configurar variables de entorno (crear backend/.env)
cp .env.example .env
# Editar .env con tus credenciales y generar SECRET_KEY

# 4. Instalar dependencias
pip install -r requirements.txt
pip install ruff

# 5. Generar y ejecutar migraciones
alembic revision --autogenerate -m "initial"
alembic upgrade head

# 6. Iniciar el servidor
uvicorn app.main:app --reload
```

La aplicación estará disponible en http://localhost:8000 y la documentación interactiva en http://localhost:8000/docs.

---

## Ejecutar tests

```bash
# Asegurar que PostgreSQL esté corriendo y la DB de test exista
python -m pytest tests/ -v
```

---

## Desarrollo

### Code quality

```bash
# Lint
ruff check app/ tests/

# Auto-fix
ruff check app/ tests/ --fix
```

### Estructura de commits

El proyecto sigue convenciones de commits con prefijos de tipo:
- `feat`: nueva funcionalidad
- `fix`: corrección de bug
- `chore`: tareas de mantenimiento (lint, config, etc.)
- `docs`: documentación
