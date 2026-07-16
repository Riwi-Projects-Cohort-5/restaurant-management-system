# Backend — Sistema de Gestión de Restaurante

API REST desarrollada con Python y FastAPI, siguiendo una arquitectura por capas.

---

## Estado actual (implementado)

### Capa de persistencia — app/db/

| Archivo | Descripción |
|---|---|
| database.py | Configuración de SQLAlchemy, motor, sesión y get_db() |
| models/ | 11 modelos ORM (User, Category, MenuItem, Table, Reservation, Order, OrderItem, Payment, InventoryItem, InventoryMovement, KitchenOrder) |
| schemas/ | Schemas Pydantic para la validación de entrada y salida de cada entidad |

### Capa de acceso a datos — app/repositories/

10 repositorios con operaciones CRUD y consultas específicas:
- UserRepository — CRUD y búsqueda por username o email
- CategoryRepository — CRUD y búsqueda por nombre
- MenuItemRepository — CRUD y filtro por categoría y disponibilidad
- TableRepository — CRUD y mesas disponibles
- ReservationRepository — CRUD y filtro por usuario o fecha
- OrderRepository — CRUD y pedidos activos
- PaymentRepository — CRUD y búsqueda por orden
- InventoryRepository — CRUD de ítems, movimientos y stock bajo
- KitchenRepository — pedidos pendientes y en preparación
- ReportRepository — reportes de ventas y productos más vendidos

### Capa de lógica de negocio — app/services/

11 servicios que orquestan repositorios y validaciones:
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
- ReportService — reportes de ventas y productos

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

---

## Lo que falta por implementar

| Módulo | Estado |
|---|---|
| Endpoints de API (api/v1/) | Archivos creados pero vacíos — falta conectar los services con rutas HTTP |
| Router central (api/router.py) | Archivo vacío — falta registrar los módulos bajo /api/v1/ |
| Migraciones Alembic (alembic/versions/) | Sin migraciones — falta generar la migración inicial con alembic revision --autogenerate |
| Tests (tests/) | Sin implementar — faltan pruebas unitarias e de integración |
| Seed data | Sin datos de prueba para desarrollo |
| .env.example | Archivo vacío — falta definir las variables de entorno necesarias |

---

## Configuración de base de datos

La conexión se define mediante variables de entorno en app/core/config.py usando la clase Settings de Pydantic.

### Variables necesarias

| Variable | Valor por defecto | Descripción |
|---|---|---|
| DATABASE_URL | postgresql://postgres:miclave123@database:5432/restaurant_db | URL completa de conexión a PostgreSQL |
| SECRET_KEY | super-secret-key-change-in-production | Clave secreta para firmar JWT |
| ALGORITHM | HS256 | Algoritmo de firma JWT |
| ACCESS_TOKEN_EXPIRE_MINUTES | 30 | Tiempo de expiración del token |

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
echo "DATABASE_URL=postgresql://postgres:tu_password@localhost:5432/restaurant_db" > .env

# 4. Instalar dependencias
pip install -r requirements.txt
pip install email-validator

# 5. Generar y ejecutar migraciones
alembic revision --autogenerate -m "initial"
alembic upgrade head

# 6. Iniciar el servidor
uvicorn app.main:app --reload
```

La aplicación estará disponible en http://localhost:8000 y la documentación interactiva en http://localhost:8000/docs.