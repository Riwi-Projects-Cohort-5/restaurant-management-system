"""

Módulo   : reports.py
Ruta     : backend/app/api/v1/reports.py
Responsable: Diego
Descripción: Endpoints REST para reportes operativos.
            El service solo tiene get_sales y get_top_products,
            ambos requieren start_date y end_date obligatorios.
            No existe ReportOut genérico — retornamos dict.
Fecha    : 2026-07-15

"""

from datetime import datetime

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.services.report_service import ReportService

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("/sales")
def reporte_ventas(
    # Fechas obligatorias — el service las requiere siempre
    start_date: datetime = Query(..., description="Fecha de inicio (ISO format)"),
    end_date: datetime = Query(..., description="Fecha de fin (ISO format)"),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Genera reporte de ventas en un rango de fechas.
    Requiere autenticación.

    Retorna:
        total_revenue, total_orders, start_date, end_date.

    Ejemplo de uso:
        GET /reports/sales?start_date=2026-07-01T00:00:00&end_date=2026-07-15T23:59:59
    """
    service = ReportService(db)
    return service.get_sales(start_date=start_date, end_date=end_date)


@router.get("/products")
def reporte_productos_mas_vendidos(
    start_date: datetime = Query(..., description="Fecha de inicio (ISO format)"),
    end_date: datetime = Query(..., description="Fecha de fin (ISO format)"),
    limit: int = Query(10, description="Top N productos"),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Genera reporte de productos más vendidos en un rango de fechas.
    Requiere autenticación.

    Retorna lista con: menu_item_name, total_quantity, total_revenue.

    Ejemplo de uso:
        GET /reports/products?start_date=2026-07-01T00:00:00&end_date=2026-07-15T23:59:59&limit=5
    """
    service = ReportService(db)
    return service.get_top_products(
        start_date=start_date,
        end_date=end_date,
        limit=limit
    )


@router.get("/daily-sales")
def reporte_ventas_diarias(
    start_date: datetime = Query(..., description="Fecha de inicio (ISO format)"),
    end_date: datetime = Query(..., description="Fecha de fin (ISO format)"),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Retorna ventas agrupadas por día en un rango de fechas.
    Requiere autenticación.

    Retorna lista con: date, revenue, orders.
    """
    service = ReportService(db)
    return service.get_daily_sales(start_date=start_date, end_date=end_date)


@router.get("/today-stats")
def estadisticas_hoy(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Retorna estadísticas del día actual: revenue, órdenes,
    mesas activas, total mesas, reservaciones.
    Requiere autenticación.
    """
    service = ReportService(db)
    return service.get_today_stats()
