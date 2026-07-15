"""
=============================================================
Módulo   : kitchen.py
Ruta     : backend/app/api/v1/kitchen.py
Responsable: Diego
Descripción: Endpoints REST para el panel de cocina.
            Permite a los cocineros ver los pedidos entrantes,
            actualizar su estado de preparación y notificar
            al mesero cuando un pedido está listo.
            Todos los endpoints requieren autenticación.
Fecha    : 2026-07-14
=============================================================
"""

from uuid import UUID
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.dependencies import get_current_user
from app.services.kitchen_service import KitchenService
from app.db.schemas.kitchen import KitchenOrderUpdate, KitchenOrderOut

router = APIRouter(prefix="/kitchen", tags=["Kitchen"])


@router.get("/", response_model=List[KitchenOrderOut])
def obtener_ordenes_cocina(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Retorna todas las órdenes en el panel de cocina.
    Requiere autenticación — solo staff puede ver el panel.

    Args:
        skip : Número de registros a omitir (paginación).
        limit: Máximo de registros a retornar.

    Retorna:
        Lista de KitchenOrderOut con todas las órdenes de cocina.
    """
    service = KitchenService(db)
    return service.get_all(skip=skip, limit=limit)


@router.get("/pending", response_model=List[KitchenOrderOut])
def obtener_ordenes_pendientes_cocina(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Retorna las órdenes pendientes de preparación en cocina.
    Este es el endpoint principal del panel de cocina —
    muestra lo que los cocineros deben preparar ahora.
    Requiere autenticación.

    Retorna:
        Lista de KitchenOrderOut con órdenes pendientes.
    """
    service = KitchenService(db)
    return service.get_pending()


@router.get("/{kitchen_order_id}", response_model=KitchenOrderOut)
def obtener_orden_cocina_por_id(
    kitchen_order_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Busca y retorna una orden de cocina específica por su ID.
    Requiere autenticación.

    Args:
        kitchen_order_id: UUID de la orden de cocina.

    Retorna:
        KitchenOrderOut con los datos de la orden.

    Lanza:
        HTTPException 404 si la orden no existe.
    """
    service = KitchenService(db)
    order = service.get_by_id(kitchen_order_id)

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Orden de cocina con id {kitchen_order_id} no encontrada"
        )
    return order


@router.put("/{kitchen_order_id}", response_model=KitchenOrderOut)
def actualizar_orden_cocina(
    kitchen_order_id: UUID,
    data: KitchenOrderUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Actualiza el estado de una orden en cocina.
    Requiere autenticación.

    Flujo principal de cocina:
    PENDING → IN_PROGRESS → READY → (notifica al mesero)

    Args:
        kitchen_order_id: UUID de la orden de cocina.
        data            : KitchenOrderUpdate con el nuevo estado.

    Retorna:
        KitchenOrderOut con el estado actualizado.

    Lanza:
        HTTPException 404 si la orden no existe.
    """
    service = KitchenService(db)
    updated = service.update(
        kitchen_order_id, data.model_dump(exclude_none=True)
    )

    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Orden de cocina con id {kitchen_order_id} no encontrada"
        )
    return updated


@router.delete("/{kitchen_order_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_orden_cocina(
    kitchen_order_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Elimina una orden del panel de cocina por su ID.
    Requiere autenticación.

    Args:
        kitchen_order_id: UUID de la orden a eliminar.

    Retorna:
        HTTP 204 No Content si se eliminó correctamente.

    Lanza:
        HTTPException 404 si la orden no existe.
    """
    service = KitchenService(db)
    deleted = service.delete(kitchen_order_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Orden de cocina con id {kitchen_order_id} no encontrada"
        )
