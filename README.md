# Sistema de Gestión de Restaurante

## Descripción general
Este proyecto implementa un backend en FastAPI para un sistema de gestión de restaurante con módulos de autenticación, usuarios, mesas, reservas, menú, pedidos, pagos, inventario y reportes.

## Fuente de verdad adoptada
Se adoptó SQLAlchemy/Alembic como fuente de verdad para el esquema del sistema. Los modelos ORM son la base para la definición de la estructura de la base de datos y para la generación de migraciones.

## Configuración de entorno
Copie el archivo backend/.env.example a backend/.env y ajuste los valores antes de ejecutar el proyecto.

```bash
cp backend/.env.example backend/.env
```

## Ejecutar la API
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Verificar salud de la API
```bash
curl http://localhost:8000/health
```

## Estado de endpoints
Los endpoints REST de la API aún están en fase inicial. En este momento se dispone del endpoint base y del health check, mientras se continúa trabajando en la integración completa de módulos.

## Pruebas mínimas
```bash
cd backend
pytest tests/test_health.py
```
