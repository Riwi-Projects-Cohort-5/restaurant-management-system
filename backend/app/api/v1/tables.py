"""
=============================================================
Módulo   : tables.py
Ruta     : backend/app/api/v1/tables.py
Responsable: Diego
Descripción: Endpoints REST para la gestión de mesas del
            restaurante. Permite crear, consultar, actualizar
            estado y eliminar mesas. Los estados posibles son:
            AVAILABLE, RESERVED, OCCUPIED.
Fecha    : 2026-07-14
=============================================================
"""

from uuid import UUID
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.dependencies import get_current_user
from app.services.table_service import TableService
from app.db.schemas.table import TableCreate, TableUpdate, TableOut

router = APIRouter(prefix="/tables", tags=["Tables"])


@router.get("/", response_model=List[TableOut])
def obtener_todas_las_mesas(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Retorna todas las mesas del restaurante con paginación opcional.
    No requiere autenticación — endpoint público.

    Args:
        skip : Número de registros a omitir (paginación).
        limit: Máximo de registros a retornar.

    Retorna:
        Lista de TableOut con todas las mesas.
    """
    service = TableService(db)
    return service.get_all(skip=skip, limit=limit)


@router.get("/available", response_model=List[TableOut])
def obtener_mesas_disponibles(db: Session = Depends(get_db)):
    """
    Retorna únicamente las mesas con estado AVAILABLE.
    Útil para el flujo de reservas — verificar disponibilidad.
    No requiere autenticación — endpoint público.

    Retorna:
        Lista de TableOut con mesas disponibles.
    """
    service = TableService(db)
    return service.get_available()


@router.get("/{table_id}", response_model=TableOut)
def obtener_mesa_por_id(table_id: UUID, db: Session = Depends(get_db)):
    """
    Busca y retorna una mesa específica por su ID.
    No requiere autenticación — endpoint público.

    Args:
        table_id: UUID de la mesa a buscar.

    Retorna:
        TableOut con los datos de la mesa.

    Lanza:
        HTTPException 404 si la mesa no existe.
    """
    service = TableService(db)
    table = service.get_by_id(table_id)

    if not table:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Mesa con id {table_id} no encontrada"
        )
    return table


@router.post("/", response_model=TableOut, status_code=status.HTTP_201_CREATED)
def crear_mesa(
    data: TableCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Crea una nueva mesa en el restaurante.
    Requiere autenticación — solo administradores pueden crear mesas.

    Args:
        data: TableCreate con los datos de la nueva mesa
            (número, capacidad, ubicación, etc.).

    Retorna:
        TableOut con los datos de la mesa creada.
        Código HTTP 201 Created.
    """
    service = TableService(db)
    return service.create(data)


@router.put("/{table_id}", response_model=TableOut)
def actualizar_mesa(
    table_id: UUID,
    data: TableUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Actualiza los datos o el estado de una mesa existente.
    Requiere autenticación.

    Usado en el flujo operativo para cambiar estados:
    AVAILABLE → RESERVED → OCCUPIED → AVAILABLE

    Args:
        table_id: UUID de la mesa a actualizar.
        data    : TableUpdate con los campos a modificar.

    Retorna:
        TableOut con los datos actualizados.

    Lanza:
        HTTPException 404 si la mesa no existe.
    """
    service = TableService(db)
    updated = service.update(table_id, data.model_dump(exclude_none=True))

    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Mesa con id {table_id} no encontrada"
        )
    return updated


@router.delete("/{table_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_mesa(
    table_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Elimina una mesa del sistema por su ID.
    Requiere autenticación — solo administradores pueden eliminar mesas.

    Args:
        table_id: UUID de la mesa a eliminar.

    Retorna:
        HTTP 204 No Content si se eliminó correctamente.

    Lanza:
        HTTPException 404 si la mesa no existe.
    """
    service = TableService(db)
    deleted = service.delete(table_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Mesa con id {table_id} no encontrada"
        )
