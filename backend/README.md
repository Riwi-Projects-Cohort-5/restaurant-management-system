# Backend — Sistema de Gestión de Restaurante

API REST desarrollada con Python 3.13 y FastAPI, siguiendo una arquitectura por capas con SQLAlchemy, PostgreSQL y autenticación JWT.

---

## Arquitectura

```
backend/
├── app/
│   ├── api/
│   │   ├── router.py          # Router central — registra todos los módulos bajo /api/v1/
│   │   └── v1/                # Endpoints por módulo (50 endpoints)
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
│   │   ├── models/            # 16 modelos ORM
│   │   ├── schemas/           # 14 schemas Pydantic por entidad
│   │   └── seed.py            # Datos de prueba para desarrollo
│   ├── repositories/          # 13 repositorios (CRUD + consultas)
│   ├── services/              # 14 servicios (lógica de negocio)
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
├── entrypoint.sh
└── .env.example
```

---

## Estado actual

### Capa de persistencia — app/db/

| Archivo | Descripción |
|---|---|
| database.py | Configuración de SQLAlchemy, motor, sesión y get_db() |
| seed.py | Datos de prueba (4 usuarios, 3 clientes, 4 mesas, 4 categorías, 7 ítems, 5 ingredientes, 2 proveedores) |
| models/ | 16 modelos ORM |
| schemas/ | 14 archivos de schemas Pydantic |

#### Modelos ORM (16)

| Modelo | Descripción |
|---|---|
| User | Usuarios del sistema con roles (ADMIN, MANAGER, WAITER, KITCHEN, CASHIER) |
| Customer | Clientes del restaurante |
| Category | Categorías del menú |
| MenuItem | Ítems del menú con precios y disponibilidad |
| Table | Mesas del restaurante con estados (AVAILABLE, OCCUPIED, RESERVED, MAINTENANCE) |
| Reservation | Reservas con estados (PENDING, CONFIRMED, CANCELLED, COMPLETED) |
| Order | Pedidos con estados (PENDING, PREPARING, READY, SERVED, PAID, CANCELLED) |
| OrderItem | Ítems individuales de cada pedido |
| KitchenOrder | Órdenes de cocina con estados (PENDING, IN_PROGRESS, READY) |
| Payment | Pagos registrados (CASH, CREDIT_CARD, DEBIT_CARD, QR) |
| InventoryItem | Ítems de inventario con stock y nivel mínimo |
| InventoryMovement | Movimientos de inventario (ENTRY, EXIT, ADJUSTMENT) |
| Recipe | Recetas que vinculan ítems del menú con ingredientes |
| Supplier | Proveedores |
| Purchase | Compras a proveedores |
| PurchaseDetail | Detalle de cada compra |

### Capa de acceso a datos — app/repositories/

13 repositorios con operaciones CRUD y consultas específicas:

| Repositorio | Funcionalidad principal |
|---|---|
| UserRepository | CRUD y búsqueda por username o email |
| CategoryRepository | CRUD y búsqueda por nombre |
| MenuItemRepository | CRUD y filtro por categoría y disponibilidad |
| TableRepository | CRUD y mesas disponibles |
| ReservationRepository | CRUD y filtro por usuario o fecha |
| OrderRepository | CRUD y pedidos activos |
| PaymentRepository | CRUD y búsqueda por orden |
| InventoryRepository | CRUD de ítems, movimientos y stock bajo |
| KitchenRepository | Pedidos pendientes y en preparación |
| ReportRepository | Reportes de ventas y productos más vendidos |
| PurchaseRepository | CRUD de compras y detalle |
| RecipeRepository | CRUD de recetas |
| SupplierRepository | CRUD de proveedores |

### Capa de lógica de negocio — app/services/

14 servicios que orquestan repositorios y validaciones:

| Servicio | Funcionalidad principal |
|---|---|
| AuthService | Login con JWT y registro con hash de contraseña |
| UserService | CRUD de usuarios |
| CategoryService | CRUD de categorías |
| MenuItemService | CRUD de ítems del menú |
| TableService | CRUD de mesas con gestión de estados |
| ReservationService | CRUD y cancelación |
| OrderService | CRUD y agregado de ítems con cálculo de subtotal |
| PaymentService | CRUD y registro de pagos |
| InventoryService | CRUD de ítems y registro de movimientos |
| KitchenService | Actualización de estados en cocina |
| ReportService | Reportes de ventas y productos |
| PurchaseService | CRUD de compras a proveedores |
| RecipeService | CRUD de recetas |
| SupplierService | CRUD de proveedores |

### Punto de entrada — app/main.py

Aplicación FastAPI con:
- CORS habilitado (todos los orígenes)
- Router central bajo `/api/v1`
- Endpoints raíz (`GET /`) y health check (`GET /health`)

---

## Endpoints API (50)

### Auth (`/api/v1/auth`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/login` | No | Login con OAuth2 form, retorna JWT |
| POST | `/register` | No | Registrar nuevo usuario |

### Users (`/api/v1/users`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/` | Sí | Listar usuarios (paginado) |
| GET | `/me` | Sí | Usuario autenticado actual |
| GET | `/{user_id}` | Sí | Obtener usuario por ID |
| PUT | `/{user_id}` | Sí | Actualizar usuario |
| DELETE | `/{user_id}` | Sí | Eliminar usuario |

### Categories (`/api/v1/categories`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/` | No | Listar categorías (paginado) |
| GET | `/{category_id}` | No | Obtener categoría |
| POST | `/` | Sí | Crear categoría |
| PUT | `/{category_id}` | Sí | Actualizar categoría |
| DELETE | `/{category_id}` | Sí | Eliminar categoría |

### Tables (`/api/v1/tables`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/` | No | Listar mesas (paginado) |
| GET | `/available` | No | Mesas disponibles |
| GET | `/{table_id}` | No | Obtener mesa |
| POST | `/` | Sí | Crear mesa |
| PUT | `/{table_id}` | Sí | Actualizar mesa |
| DELETE | `/{table_id}` | Sí | Eliminar mesa |

### Reservations (`/api/v1/reservations`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/` | Sí | Listar reservas (paginado) |
| GET | `/{reservation_id}` | Sí | Obtener reserva |
| POST | `/` | Sí | Crear reserva |
| PUT | `/{reservation_id}` | Sí | Actualizar reserva |
| DELETE | `/{reservation_id}` | Sí | Cancelar reserva |

### Menu (`/api/v1/menu`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/available` | No | Ítems disponibles |
| GET | `/category/{category_id}` | No | Ítems por categoría |
| GET | `/` | No | Listar menú (paginado) |
| GET | `/{item_id}` | No | Obtener ítem |
| POST | `/` | Sí | Crear ítem |
| PUT | `/{item_id}` | Sí | Actualizar ítem |
| DELETE | `/{item_id}` | Sí | Eliminar ítem |

### Orders (`/api/v1/orders`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/` | Sí | Listar pedidos (paginado) |
| GET | `/active` | Sí | Pedidos activos (PENDING/READY) |
| GET | `/{order_id}` | Sí | Obtener pedido |
| POST | `/` | Sí | Crear pedido |
| POST | `/{order_id}/items` | Sí | Agregar ítem al pedido |
| PUT | `/{order_id}/status` | Sí | Actualizar estado del pedido |

### Kitchen (`/api/v1/kitchen`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/` | Sí | Listar órdenes de cocina |
| GET | `/pending` | Sí | Pendientes |
| GET | `/in-progress` | Sí | En preparación |
| GET | `/order/{order_id}` | Sí | Órdenes por pedido |
| GET | `/{kitchen_order_id}` | Sí | Obtener orden de cocina |
| PUT | `/{kitchen_order_id}/status` | Sí | Actualizar estado + notas |

### Inventory (`/api/v1/inventory`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/` | Sí | Listar inventario (paginado) |
| GET | `/low-stock` | Sí | Stock bajo |
| GET | `/{item_id}` | Sí | Obtener ítem |
| POST | `/` | Sí | Crear ítem |
| PUT | `/{item_id}` | Sí | Actualizar ítem |
| POST | `/{item_id}/movements` | Sí | Registrar movimiento |

### Payments (`/api/v1/payments`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/` | Sí | Listar pagos (paginado) |
| GET | `/order/{order_id}` | Sí | Pago por pedido |
| GET | `/{payment_id}` | Sí | Obtener pago |
| POST | `/` | Sí | Registrar pago |

### Reports (`/api/v1/reports`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/sales` | Sí | Reporte de ventas (start_date, end_date) |
| GET | `/products` | Sí | Top productos (start_date, end_date, limit) |

---

## Variables de entorno

| Variable | Valor por defecto | Descripción |
|---|---|---|
| DATABASE_URL | `postgresql://postgres:postgres@localhost:5432/restaurant_db` | URL de conexión a PostgreSQL |
| SECRET_KEY | *(requerida)* | Clave secreta para firmar JWT |
| ALGORITHM | `HS256` | Algoritmo de firma JWT |
| ACCESS_TOKEN_EXPIRE_MINUTES | `30` | Tiempo de expiración del token |
| API_V1_PREFIX | `/api/v1` | Prefijo de la API |
| PROJECT_NAME | `Restaurant Management System` | Nombre del proyecto |

---

## Configuración

### Con Docker Compose

```bash
# 1. Copiar .env.example a .env y completar las variables
cp .env.example .env

# 2. Iniciar PostgreSQL y el backend
docker compose up --build
```

Esto levanta dos servicios:
- **database** — PostgreSQL 17 en localhost:5432
- **backend** — FastAPI en localhost:8000

El backend ejecuta automáticamente:
1. Espera a que la base de datos esté saludable
2. Aplica migraciones con Alembic
3. Ejecuta el seed de datos de prueba
4. Inicia el servidor uvicorn

### Sin Docker (desarrollo local)

```bash
# 1. Tener PostgreSQL corriendo localmente

# 2. Crear la base de datos
createdb restaurant_db

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 4. Instalar dependencias
pip install -r requirements.txt

# 5. Generar y ejecutar migraciones
alembic revision --autogenerate -m "initial"
alembic upgrade head

# 6. Opcional: poblar datos de prueba
python -m app.db.seed

# 7. Iniciar el servidor
uvicorn app.main:app --reload
```

La aplicación estará disponible en http://localhost:8000 y la documentación interactiva en http://localhost:8000/docs.

---

## Dependencias

| Paquete | Versión | Propósito |
|---|---|---|
| fastapi | 0.139.0 | Framework web |
| uvicorn | 0.51.0 | Servidor ASGI |
| sqlalchemy | 2.0.48 | ORM / database toolkit |
| psycopg2-binary | 2.9.12 | Adaptador PostgreSQL |
| pydantic | 2.13.3 | Validación de datos |
| pydantic-settings | 2.14.2 | Settings desde env vars |
| python-jose | 3.5.0 | JWT encode/decode |
| python-multipart | 0.0.32 | Parsing de form data (OAuth2) |
| python-dotenv | 1.2.2 | Carga de archivos .env |
| alembic | 1.18.4 | Migraciones de base de datos |
| bcrypt | 5.0.0 | Hash de contraseñas |
| email-validator | 2.2.0 | Validación de email para Pydantic |

---

## Linting (Ruff)

El proyecto usa [Ruff](https://docs.astral.sh/ruff/) como linter y formateador.

### Configuración (ruff.toml)

```toml
line-length = 100
target-version = "py313"

[lint]
select = ["E", "F", "I"]
ignore = ["E501"]
```

### Comandos

```bash
# Verificar errores
ruff check .

# Corregir errores automáticos
ruff check --fix .

# Formatear código
ruff format .

# Verificar sin modificar
ruff check . --diff
```

---

## Tests

```bash
# Ejecutar todos los tests
pytest

# Ejecutar con verbose
pytest -v

# Ejecutar un archivo específico
pytest tests/test_health.py

# Ejecutar con cobertura
pytest --cov=app
```

### Tests existentes

| Archivo | Descripción |
|---|---|
| conftest.py | Fixtures: configuración de test DB, sesión de prueba |
| test_health.py | Tests para endpoints `/` y `/health` |
| test_models.py | Tests de importación de modelos y nombres de tablas |

---

## Migraciones (Alembic)

```bash
# Generar nueva migración
alembic revision --autogenerate -m "descripcion del cambio"

# Aplicar migraciones pendientes
alembic upgrade head

# Retroceder una migración
alembic downgrade -1

# Ver historial de migraciones
alembic history
```

La migración inicial (`001_initial.py`) crea 8 enums y 16 tablas.
