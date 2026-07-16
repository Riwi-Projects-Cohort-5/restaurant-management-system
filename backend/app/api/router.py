"""
=============================================================
Módulo   : router.py
Ruta     : backend/app/api/router.py
Responsable: Diego
Descripción: Router principal de la API v1. Centraliza y
            registra todos los módulos de endpoints bajo
            el prefijo /api/v1.
Fecha    : 2026-07-16
=============================================================
"""

from fastapi import APIRouter

from app.api.v1 import (
    auth,
    users,
    categories,
    tables,
    reservations,
    menu,
    orders,
    kitchen,
    inventory,
    payments,
    reports,
)

# Router principal que agrupa todos los módulos bajo /api/v1
api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(categories.router)
api_router.include_router(tables.router)
api_router.include_router(reservations.router)
api_router.include_router(menu.router)
api_router.include_router(orders.router)
api_router.include_router(kitchen.router)
api_router.include_router(inventory.router)
api_router.include_router(payments.router)
api_router.include_router(reports.router)