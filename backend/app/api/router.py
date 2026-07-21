"""

Módulo   : router.py
Ruta     : backend/app/api/router.py
Responsable: Diego
Descripción: Router principal de la API v1. Centraliza y
            registra todos los módulos de endpoints bajo
            el prefijo /api/v1.
Fecha    : 2026-07-16

"""

from fastapi import APIRouter

from app.api.v1 import (
    auth,
    categories,
    inventory,
    kitchen,
    locations,
    menu,
    orders,
    payments,
    reports,
    reservations,
    settings,
    tables,
    users,
)

# Router principal — el prefijo /api/v1 se aplica en main.py al hacer include_router
api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(categories.router)
api_router.include_router(locations.router)
api_router.include_router(tables.router)
api_router.include_router(reservations.router)
api_router.include_router(menu.router)
api_router.include_router(orders.router)
api_router.include_router(kitchen.router)
api_router.include_router(inventory.router)
api_router.include_router(payments.router)
api_router.include_router(reports.router)
api_router.include_router(settings.router)
