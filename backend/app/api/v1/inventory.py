"""
=============================================================
Módulo   : inventory.py
Ruta     : backend/app/api/v1/inventory.py
Responsable: Diego
Descripción: Endpoints REST para la gestión del inventario
            del restaurante. Controla ingredientes, stock
            disponible, movimientos de inventario y alertas
            de stock bajo. Se integra con el flujo de órdenes:
            al crear una orden se descuenta automáticamente.
Fecha    : 2026-07-14
=============================================================
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
)

router = APIRouter(prefix="/inventory", tags=["Inventory"])


@router.get("/", response_model=List[InventoryItemOut])
def obtener_inventario(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Retorna todos los items del inventario con paginación.
    Requiere autenticación — información interna del negocio.

    Args:
        skip : Número de registros a omitir (paginación).
        limit: Máximo de registros a retornar.

    Retorna:
        Lista de InventoryItemOut con todo el inventario.
    """
    service = InventoryService(db)
    return service.get_all(skip=skip, limit=limit)


@router.get("/low-stock", response_model=List[InventoryItemOut])
def obtener_items_stock_bajo(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Retorna los items del inventario que están por debajo
    del stock mínimo configurado — genera alertas para el staff.
    Requiere autenticación.

    Retorna:
        Lista de InventoryItemOut con items en stock bajo.
    """
    service = InventoryService(db)
    return service.get_low_stock()


@router.get("/{item_id}", response_model=InventoryItemOut)
def obtener_item_inventario_por_id(
    item_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Busca y retorna un item del inventario por su ID.
    Requiere autenticación.

    Args:
        item_id: UUID del item de inventario.

    Retorna:
        InventoryItemOut con los datos del item.

    Lanza:
        HTTPException 404 si el item no existe.
    """
    service = InventoryService(db)
    item = service.get_by_id(item_id)

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item de inventario con id {item_id} no encontrado"
        )
    return item


@router.post("/", response_model=InventoryItemOut, status_code=status.HTTP_201_CREATED)
def crear_item_inventario(
    data: InventoryItemCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Registra un nuevo ingrediente o item en el inventario.
    Requiere autenticación.

    Args:
        data: InventoryItemCreate con los datos del nuevo item
            (nombre, cantidad, unidad, stock mínimo, etc.).

    Retorna:
        InventoryItemOut con el item registrado.
        Código HTTP 201 Created.
    """
    service = InventoryService(db)
    return service.create(data)


@router.put("/{item_id}", response_model=InventoryItemOut)
def actualizar_item_inventario(
    item_id: UUID,
    data: InventoryItemUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Actualiza los datos o la cantidad de un item del inventario.
    Requiere autenticación.

    Usado para ajustes manuales de stock, cambio de stock mínimo,
    o actualización de datos del ingrediente.

    Args:
        item_id: UUID del item a actualizar.
        data   : InventoryItemUpdate con los campos a modificar.

    Retorna:
        InventoryItemOut con los datos actualizados.

    Lanza:
        HTTPException 404 si el item no existe.
    """
    service = InventoryService(db)
    updated = service.update(item_id, data.model_dump(exclude_none=True))

    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item de inventario con id {item_id} no encontrado"
        )
    return updated


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_item_inventario(
    item_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Elimina un item del inventario por su ID.
    Requiere autenticación.

    Args:
        item_id: UUID del item a eliminar.

    Retorna:
        HTTP 204 No Content si se eliminó correctamente.

    Lanza:
        HTTPException 404 si el item no existe.
    """
    service = InventoryService(db)
    deleted = service.delete(item_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item de inventario con id {item_id} no encontrado"
        )
