"""

Módulo   : inventory.py
Ruta     : backend/app/api/v1/inventory.py
Responsable: Diego
Descripción: Endpoints REST para gestión de inventario.
            El service usa nombres específicos: get_all_items,
            get_item_by_id, create_item, update_item.
            También maneja movimientos de stock.
Fecha    : 2026-07-15

"""

from uuid import UUID
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.dependencies import get_current_user
from app.services.inventory_service import InventoryService
from app.db.schemas.inventory import (
    InventoryItemCreate,
    InventoryItemUpdate,
    InventoryItemOut,
    InventoryMovementCreate,
    InventoryMovementOut,
)

router = APIRouter(prefix="/inventory", tags=["Inventory"])


@router.get("/", response_model=List[InventoryItemOut])
def obtener_inventario(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Retorna todos los items del inventario. Requiere autenticación."""
    service = InventoryService(db)
    # Método correcto: get_all_items (no get_all)
    return service.get_all_items(skip=skip, limit=limit)


@router.get("/low-stock", response_model=List[InventoryItemOut])
def obtener_items_stock_bajo(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Retorna items por debajo del stock mínimo. Requiere autenticación."""
    service = InventoryService(db)
    return service.get_low_stock()


@router.get("/{item_id}", response_model=InventoryItemOut)
def obtener_item_por_id(
    item_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Retorna un item del inventario por su ID. Lanza 404 si no existe."""
    service = InventoryService(db)
    # Método correcto: get_item_by_id (no get_by_id)
    item = service.get_item_by_id(item_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item con id {item_id} no encontrado"
        )
    return item


@router.post("/", response_model=InventoryItemOut, status_code=status.HTTP_201_CREATED)
def crear_item_inventario(
    data: InventoryItemCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Registra un nuevo item en el inventario. Requiere autenticación."""
    service = InventoryService(db)
    # Método correcto: create_item con parámetros separados
    return service.create_item(
        name=data.name,
        unit=data.unit,
        quantity=data.quantity,
        min_stock=data.min_stock
    )


@router.put("/{item_id}", response_model=InventoryItemOut)
def actualizar_item_inventario(
    item_id: UUID,
    data: InventoryItemUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Actualiza datos de un item del inventario. Requiere autenticación."""
    service = InventoryService(db)
    # Método correcto: update_item (no update)
    updated = service.update_item(item_id, data.model_dump(exclude_none=True))
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item con id {item_id} no encontrado"
        )
    return updated


@router.post("/{item_id}/movements", response_model=InventoryMovementOut)
def registrar_movimiento(
    item_id: UUID,
    data: InventoryMovementCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Registra un movimiento de inventario (entrada o salida).
    Requiere autenticación.
    type: 'in' para entradas, 'out' para salidas.
    """
    service = InventoryService(db)
    movement = service.register_movement(
        item_id=item_id,
        movement_type=data.type,
        quantity=data.quantity,
        reason=data.reason
    )
    if not movement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item con id {item_id} no encontrado"
        )
    return movement
