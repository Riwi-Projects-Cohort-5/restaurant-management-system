"""
=============================================================
Módulo   : router.py
Ruta     : backend/app/api/router.py
Responsable: Diego
Descripción: Router principal de la API v1. Centraliza y
            registra todos los módulos de endpoints bajo
            el prefijo /api/v1. Cada módulo tiene su propio
            prefijo y tag para la documentación automática.
Fecha    : 2026-07-14
=============================================================
"""

from fastapi import APIRouter

# Importamos el router de cada módulo funcional
from app.api.v1 import (
    auth,
    users,
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

# Registramos cada módulo — cada uno ya tiene su propio prefix y tags
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(tables.router)
api_router.include_router(reservations.router)
api_router.include_router(menu.router)
api_router.include_router(orders.router)
api_router.include_router(kitchen.router)
api_router.include_router(inventory.router)
api_router.include_router(payments.router)
api_router.include_router(reports.router)