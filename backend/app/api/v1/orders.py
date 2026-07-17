"""

Módulo   : orders.py
Ruta     : backend/app/api/v1/orders.py
Responsable: Diego
Descripción: Endpoints REST para la gestión de pedidos.
            El service maneja create, add_item y update_status
            como operaciones separadas — no un update genérico.
Fecha    : 2026-07-15

"""

from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.db.schemas.order import OrderCreate, OrderItemCreate, OrderOut, OrderUpdate
from app.services.order_service import OrderService

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.get("/", response_model=List[OrderOut])
def obtener_todas_las_ordenes(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Retorna todas las órdenes con paginación. Requiere autenticación."""
    service = OrderService(db)
    return service.get_all(skip=skip, limit=limit)


@router.get("/active", response_model=List[OrderOut])
def obtener_ordenes_activas(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Retorna órdenes activas (PENDING o READY). Requiere autenticación."""
    service = OrderService(db)
    return service.get_active()


@router.get("/{order_id}", response_model=OrderOut)
def obtener_orden_por_id(
    order_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Retorna una orden por su ID. Lanza 404 si no existe."""
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
    Crea una nueva orden para una mesa. Requiere autenticación.
    El user_id se extrae del token JWT del usuario autenticado.
    """
    service = OrderService(db)
    # El user_id viene del token JWT, no del body de la petición
    return service.create(
        user_id=UUID(current_user["sub"]),
        table_id=data.table_id
    )


@router.post("/{order_id}/items", response_model=OrderOut)
def agregar_item_a_orden(
    order_id: UUID,
    data: OrderItemCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Agrega un item del menú a una orden existente.
    Requiere autenticación.
    Calcula precio unitario y subtotal automáticamente.
    """
    service = OrderService(db)
    updated = service.add_item(
        order_id=order_id,
        menu_item_id=data.menu_item_id,
        quantity=data.quantity
    )
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Orden o item de menú no encontrado"
        )
    return updated


@router.put("/{order_id}/status", response_model=OrderOut)
def actualizar_estado_orden(
    order_id: UUID,
    data: OrderUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Actualiza el estado de una orden. Requiere autenticación.
    Estados válidos: PENDING, READY, PAID.
    """
    service = OrderService(db)
    updated = service.update_status(order_id, data.status)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Orden con id {order_id} no encontrada"
        )
    return updated
