# Restaurant Management System

Sistema integral de gestion de restaurantes. Vanilla JS (SPA) + FastAPI + PostgreSQL.

## Equipo

| Nombre | Rol |
|--------|-----|
| Emanuel Sandoval | Backend |
| Diego Gonzalez | Backend |
| Juan Cano | Frontend / UX/UI |
| Milton Ortega | Frontend / Product Owner |
| Jose Romero | UX/UI / Scrum Master |

---

## Estado del Proyecto

| Capa | Estado | Detalle |
|------|--------|---------|
| Frontend - Auth | Funcional | Login, registro, roles, sesion (localStorage) |
| Frontend - Modulos | Pendiente | 9 modulos con carpetas vacias |
| Backend | Pendiente | Estructura scaffoldeada, archivos vacios |
| Database | Pendiente | Sin init scripts ni schema |
| Docker | Pendiente | docker-compose.yml y Dockerfiles vacios |
| Scripts | Pendiente | dev.sh, build.sh, deploy.sh vacios |

---

## Stack Tecnologico

| Capa | Tecnologias |
|------|-------------|
| Frontend | HTML5, Vanilla JS (SPA), Tailwind CSS (CDN), Vite 5 |
| Backend | Python, FastAPI (pendiente) |
| Base de datos | PostgreSQL |
| Infraestructura | Docker, Railway |

---

## Estructura del Proyecto

```
restaurant-management-system/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── router.py              # (vacio)
│   │   │   └── v1/
│   │   │       ├── auth.py            # (vacio)
│   │   │       ├── users.py           # (vacio)
│   │   │       ├── menu.py            # (vacio)
│   │   │       ├── orders.py          # (vacio)
│   │   │       ├── tables.py          # (vacio)
│   │   │       ├── kitchen.py         # (vacio)
│   │   │       ├── payments.py        # (vacio)
│   │   │       ├── inventory.py       # (vacio)
│   │   │       ├── reservations.py    # (vacio)
│   │   │       └── reports.py         # (vacio)
│   │   ├── core/
│   │   │   ├── config.py              # (vacio)
│   │   │   ├── dependencies.py        # (vacio)
│   │   │   └── security.py            # (vacio)
│   │   ├── db/
│   │   │   ├── database.py            # (vacio)
│   │   │   ├── models/                # (vacio)
│   │   │   ├── schemas/               # (vacio)
│   │   │   └── migrations/            # (vacio)
│   │   ├── repositories/              # (vacio)
│   │   ├── services/                  # (vacio)
│   │   ├── utils/                     # (vacio)
│   │   └── main.py                    # (vacio)
│   ├── tests/                         # (vacio)
│   ├── Dockerfile                     # (vacio)
│   ├── requirements.txt               # (vacio)
│   └── README.md                      # (vacio)
├── database/
│   ├── init/                          # Scripts SQL de inicializacion
│   ├── seed/                          # Datos de prueba
│   ├── backups/
│   └── Dockerfile                     # (vacio)
├── frontend/
│   ├── src/
│   │   ├── main.js                    # Router principal + entrada
│   │   ├── App.js                     # (vacio, reservado)
│   │   ├── services/
│   │   │   ├── mockUsers.js           # Usuarios demo + localStorage
│   │   │   └── authService.js         # Logica de autenticacion mock
│   │   ├── store/
│   │   │   ├── index.js               # createStore (reactivo pub/sub)
│   │   │   └── auth.js                # Estado de autenticacion
│   │   ├── utils/
│   │   │   └── routeGuard.js          # Proteccion de rutas por rol
│   │   ├── views/
│   │   │   ├── auth/login.js          # Login (implementado)
│   │   │   ├── auth/register.js       # Registro admin (implementado)
│   │   │   ├── dashboard/             # (vacio)
│   │   │   ├── inventory/             # (vacio)
│   │   │   ├── kitchen/               # (vacio)
│   │   │   ├── menu/                  # (vacio)
│   │   │   ├── orders/                # (vacio)
│   │   │   ├── payments/              # (vacio)
│   │   │   ├── reports/               # (vacio)
│   │   │   ├── reservations/          # (vacio)
│   │   │   ├── settings/              # (vacio)
│   │   │   └── tables/                # (vacio)
│   │   ├── components/                # (vacio - extraer componentes)
│   │   ├── router/                    # (vacio)
│   │   ├── styles/                    # (vacio)
│   │   └── assets/                    # Iconos, fuentes, imagenes
│   ├── index.html                     # Entry HTML (Tailwind CDN)
│   ├── package.json
│   └── vite.config.js
├── scripts/
│   ├── dev.sh                         # (vacio)
│   ├── build.sh                       # (vacio)
│   └── deploy.sh                      # (vacio)
├── docs/
│   ├── IMPLEMENTATION_GUIDE.md        # Guia tecnica completa
│   └── USER_CREDENTIALS.md            # Credenciales y modelo de usuario
├── docker-compose.yml                 # (vacio)
├── .env.example
├── .gitignore
└── README.md                          # Este archivo
```

---

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

---

## Backend: Guia de Implementacion

### Estructura existente (archivos vacios)

La estructura de directorios ya esta definida con arquitectura en capas:

```
backend/app/
├── core/           # Configuracion, seguridad, dependencias
├── api/            # Rutas FastAPI (v1/)
├── db/             # Database, models, schemas, migrations
├── repositories/   # Capa de acceso a datos
├── services/       # Logica de negocio
└── utils/          # Utilidades
```

### Archivos que se necesitan implementar

#### 1. `requirements.txt`
```
fastapi>=0.104.0
uvicorn[standard]>=0.24.0
sqlalchemy>=2.0.0
psycopg2-binary>=2.9.0
python-jose[cryptography]>=3.3.0
passlib[bcrypt]>=1.7.4
python-multipart>=0.0.6
pydantic>=2.0.0
pydantic-settings>=2.0.0
alembic>=1.13.0
```

#### 2. `app/main.py` - Entrada de la API
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router
from app.core.config import settings

app = FastAPI(title="Restaurant Management System API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/health")
def health_check():
    return {"status": "ok"}
```

#### 3. `app/core/config.py` - Variables de entorno
```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]

    class Config:
        env_file = ".env"

settings = Settings()
```

#### 4. `app/db/database.py` - Conexion PostgreSQL
```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

#### 5. `app/db/models/user.py` - Modelo de usuario
```python
from sqlalchemy import Column, String, Enum, DateTime
from sqlalchemy.sql import func
from app.db.database import Base
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    CLIENT = "client"
    WAITER = "waiter"
    CHEF = "chef"
    CASHIER = "cashier"

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.CLIENT)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
```

#### 6. `app/core/security.py` - JWT + bcrypt
```python
from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
```

### Modelo de Datos (tablas SQL)

```sql
-- Tabla de usuarios
CREATE TYPE user_role AS ENUM ('admin', 'client', 'waiter', 'chef', 'cashier');

CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'client',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);
```

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

## Database: Guia de Implementacion

### Variables de Entorno (`.env`)
```
POSTGRES_DB=restaurant_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=tu_password_seguro
DB_PORT=5432
API_PORT=8000
```

### docker-compose.yml (a implementar)
```yaml
version: "3.8"
services:
  db:
    build: ./database
    environment:
      POSTGRES_DB: restaurant_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    ports:
      - "${DB_PORT}:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./database/init:/docker-entrypoint-initdb.d

  backend:
    build: ./backend
    ports:
      - "${API_PORT}:8000"
    environment:
      DATABASE_URL: postgresql://postgres:${POSTGRES_PASSWORD}@db:5432/restaurant_db
      SECRET_KEY: ${SECRET_KEY}
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  pgdata:
```

### database/Dockerfile (a implementar)
```dockerfile
FROM postgres:16-alpine
COPY init/ /docker-entrypoint-initdb.d/
```

### database/init/01_schema.sql (a crear)
Contiene las tablas: `users`, `menu_items`, `tables`, `orders`, `order_items`, `payments`, `inventory`, `reservations`.

### database/seed/01_demo_data.sql (a crear)
Inserta los 5 usuarios demo y datos de prueba para menus, mesas, etc.

---

## Infraestructura Pendiente

| Archivo | Estado | Que hacer |
|---------|--------|-----------|
| `docker-compose.yml` | Vacio | Definir servicios db, backend, frontend |
| `backend/Dockerfile` | Vacio | Python 3.11-slim, pip install, uvicorn |
| `backend/requirements.txt` | Vacio | Listar dependencias Python |
| `database/Dockerfile` | Vacio | PostgreSQL 16-alpine + init scripts |
| `database/init/*.sql` | Vacio | Schema + seed data |
| `scripts/dev.sh` | Vacio | Levantar entorno de desarrollo |
| `scripts/build.sh` | Vacio | Build frontend + backend |
| `scripts/deploy.sh` | Vacio | Deploy a Railway |
| `frontend/.env.example` | Vacio | Agregar `VITE_API_URL` |

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

---

RIWI Capstone Project Cohort 5 2026
