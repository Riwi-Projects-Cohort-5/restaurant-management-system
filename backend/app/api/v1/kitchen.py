"""

Módulo   : kitchen.py
Ruta     : backend/app/api/v1/kitchen.py
Responsable: Diego
Descripción: Endpoints REST para el panel de cocina.
            El service usa update_status en lugar de update
            genérico, y create recibe parámetros separados.
            No existe KitchenOrderCreate en schemas.
Fecha    : 2026-07-15

"""

from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.db.schemas.kitchen import KitchenOrderOut, KitchenOrderUpdate
from app.services.kitchen_service import InvalidEnumValueError, KitchenService

router = APIRouter(prefix="/kitchen", tags=["Kitchen"])


@router.get("/", response_model=List[KitchenOrderOut])
def obtener_ordenes_cocina(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Retorna todas las órdenes de cocina. Requiere autenticación."""
    service = KitchenService(db)
    pending = service.get_pending()
    in_progress = service.get_in_progress()
    ready = service.get_ready()
    return pending + in_progress + ready


@router.get("/pending", response_model=List[KitchenOrderOut])
def obtener_ordenes_pendientes(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Retorna órdenes pendientes de preparación. Requiere autenticación."""
    service = KitchenService(db)
    return service.get_pending()


@router.get("/in-progress", response_model=List[KitchenOrderOut])
def obtener_ordenes_en_progreso(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Retorna órdenes en preparación actualmente. Requiere autenticación."""
    service = KitchenService(db)
    return service.get_in_progress()


@router.get("/order/{order_id}", response_model=List[KitchenOrderOut])
def obtener_ordenes_por_pedido(
    order_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Retorna todas las órdenes de cocina de un pedido específico."""
    service = KitchenService(db)
    return service.get_by_order(order_id)


@router.get("/{kitchen_order_id}", response_model=KitchenOrderOut)
def obtener_orden_cocina_por_id(
    kitchen_order_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Retorna una orden de cocina por su ID. Lanza 404 si no existe."""
    service = KitchenService(db)
    order = service.get_by_id(kitchen_order_id)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Orden de cocina con id {kitchen_order_id} no encontrada"
        )
    return order


@router.put("/{kitchen_order_id}/status", response_model=KitchenOrderOut)
def actualizar_estado_orden_cocina(
    kitchen_order_id: UUID,
    data: KitchenOrderUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Actualiza el estado de una orden en cocina. Requiere autenticación.
    Estados válidos: pending, in_progress, ready.
    El cocinero usa este endpoint para avanzar el estado del plato.
    """
    service = KitchenService(db)
    try:
        updated = service.update_status(
            kitchen_order_id=kitchen_order_id,
            status=data.status,
            notes=data.notes
        )
    except InvalidEnumValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Orden de cocina con id {kitchen_order_id} no encontrada"
        )
    return updated
