"""
=============================================================
Módulo   : orders.py
Ruta     : backend/app/api/v1/orders.py
Responsable: Diego
Descripción: Endpoints REST para la gestión de pedidos del
            restaurante. Cubre el ciclo completo de una orden:
            PENDING → (cocina) → READY → (mesero) → PAID.
            Al crear una orden se descuenta el inventario
            y se notifica a cocina simultáneamente.
Fecha    : 2026-07-14
=============================================================
"""

from uuid import UUID
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.dependencies import get_current_user
from app.services.order_service import OrderService
from app.db.schemas.order import OrderCreate, OrderUpdate, OrderOut

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.get("/", response_model=List[OrderOut])
def obtener_todas_las_ordenes(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Retorna todas las órdenes del sistema con paginación.
    Requiere autenticación — información sensible del negocio.

    Args:
        skip : Número de registros a omitir (paginación).
        limit: Máximo de registros a retornar.

    Retorna:
        Lista de OrderOut con todas las órdenes.
    """
    service = OrderService(db)
    return service.get_all(skip=skip, limit=limit)


@router.get("/active", response_model=List[OrderOut])
def obtener_ordenes_activas(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Retorna únicamente las órdenes activas (PENDING o READY).
    Útil para el panel de cocina y el seguimiento en tiempo real.
    Requiere autenticación.

    Retorna:
        Lista de OrderOut con órdenes activas.
    """
    service = OrderService(db)
    return service.get_active()


@router.get("/{order_id}", response_model=OrderOut)
def obtener_orden_por_id(
    order_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Busca y retorna una orden específica por su ID.
    Requiere autenticación.

    Args:
        order_id: UUID de la orden a buscar.

    Retorna:
        OrderOut con los datos completos de la orden.

    Lanza:
        HTTPException 404 si la orden no existe.
    """
    service = OrderService(db)
    order = service.get_by_id(order_id)

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Orden con id {order_id} no encontrada"
        )
    return order


@router.post("/", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def crear_orden(
    data: OrderCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Crea una nueva orden para una mesa.
    Requiere autenticación — solo meseros/staff pueden crear órdenes.

    Al crear la orden:
    - Se registra con estado PENDING
    - Se descuenta del inventario automáticamente
    - Se envía al panel de cocina

    Args:
        data: OrderCreate con los datos de la orden
            (table_id, items, notas, etc.).

    Retorna:
        OrderOut con los datos de la orden creada.
        Código HTTP 201 Created.
    """
    service = OrderService(db)
    return service.create(data)


@router.put("/{order_id}", response_model=OrderOut)
def actualizar_orden(
    order_id: UUID,
    data: OrderUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Actualiza el estado o los datos de una orden existente.
    Requiere autenticación.

    Usado para cambiar estados en el flujo operativo:
    PENDING → READY → PAID

    Args:
        order_id: UUID de la orden a actualizar.
        data    : OrderUpdate con los campos a modificar.

    Retorna:
        OrderOut con los datos actualizados.

    Lanza:
        HTTPException 404 si la orden no existe.
    """
    service = OrderService(db)
    updated = service.update(order_id, data.model_dump(exclude_none=True))

    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Orden con id {order_id} no encontrada"
        )
    return updated


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_orden(
    order_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Elimina una orden del sistema por su ID.
    Requiere autenticación.

    Args:
        order_id: UUID de la orden a eliminar.

    Retorna:
        HTTP 204 No Content si se eliminó correctamente.

    Lanza:
        HTTPException 404 si la orden no existe.
    """
    service = OrderService(db)
    deleted = service.delete(order_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Orden con id {order_id} no encontrada"
        )
