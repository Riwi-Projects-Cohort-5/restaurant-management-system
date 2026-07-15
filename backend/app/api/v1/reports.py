"""
=============================================================
Módulo   : reports.py
Ruta     : backend/app/api/v1/reports.py
Responsable: Diego
Descripción: Endpoints REST para la generación de reportes
            operativos del restaurante. Consolida datos de
            ventas, inventario, productos más vendidos,
            ingresos y desempeño operativo.
            Todos los endpoints requieren autenticación —
            solo administradores y gerentes acceden a reportes.
Fecha    : 2026-07-14
=============================================================
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date

from app.db.database import get_db
from app.core.dependencies import get_current_user
from app.services.report_service import ReportService
from app.db.schemas.report import ReportOut

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("/sales", response_model=ReportOut)
def reporte_ventas(
    start_date: Optional[date] = Query(None, description="Fecha de inicio (YYYY-MM-DD)"),
    end_date: Optional[date] = Query(None, description="Fecha de fin (YYYY-MM-DD)"),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Genera el reporte de ventas del restaurante.
    Requiere autenticación — solo administradores.

    Puede filtrarse por rango de fechas. Si no se proveen
    fechas, retorna el reporte del día actual.

    Args:
        start_date: Fecha de inicio del período a reportar.
        end_date  : Fecha de fin del período a reportar.

    Retorna:
        ReportOut con datos consolidados de ventas:
        total de ventas, número de órdenes, promedio por orden.
    """
    service = ReportService(db)
    return service.get_sales_report(start_date=start_date, end_date=end_date)


@router.get("/products", response_model=ReportOut)
def reporte_productos_mas_vendidos(
    limit: int = Query(10, description="Top N productos a mostrar"),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Genera el reporte de productos más vendidos.
    Requiere autenticación.

    Args:
        limit: Número de productos top a incluir en el reporte.

    Retorna:
        ReportOut con los productos más vendidos, cantidad
        vendida e ingresos generados por cada uno.
    """
    service = ReportService(db)
    return service.get_top_products(limit=limit)


@router.get("/inventory", response_model=ReportOut)
def reporte_inventario(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Genera el reporte de estado actual del inventario.
    Requiere autenticación.

    Incluye consumo de ingredientes, items en stock bajo
    y proyección de reposición.

    Retorna:
        ReportOut con el estado consolidado del inventario.
    """
    service = ReportService(db)
    return service.get_inventory_report()


@router.get("/dashboard", response_model=ReportOut)
def reporte_dashboard(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Genera el reporte consolidado para el dashboard del gerente.
    Requiere autenticación.

    Combina en una sola respuesta:
    - Ventas del día
    - Órdenes activas
    - Items en stock bajo
    - Productos más vendidos del día
    - Ingresos totales

    Retorna:
        ReportOut con métricas operativas del día actual.
    """
    service = ReportService(db)
    return service.get_dashboard()
