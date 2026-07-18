"""

Módulo   : tables.py
Ruta     : backend/app/api/v1/tables.py
Responsable: Diego
Descripción: Endpoints REST para la gestión de mesas del
            restaurante. Estados posibles: AVAILABLE,
            RESERVED, OCCUPIED.
Fecha    : 2026-07-15

"""

from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.db.schemas.table import TableCreate, TableOut, TableUpdate
from app.services.table_service import TableService

router = APIRouter(prefix="/tables", tags=["Tables"])


@router.get("/", response_model=List[TableOut])
def obtener_todas_las_mesas(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Retorna todas las mesas con paginación. Endpoint público."""
    service = TableService(db)
    return service.get_all(skip=skip, limit=limit)


@router.get("/available", response_model=List[TableOut])
def obtener_mesas_disponibles(db: Session = Depends(get_db)):
    """Retorna solo las mesas con estado AVAILABLE. Endpoint público."""
    service = TableService(db)
    return service.get_available()


@router.get("/{table_id}", response_model=TableOut)
def obtener_mesa_por_id(table_id: UUID, db: Session = Depends(get_db)):
    """Retorna una mesa por su ID. Lanza 404 si no existe."""
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
    Crea una nueva mesa. Requiere autenticación.
    El service recibe los parámetros por separado, no el objeto completo.
    """
    service = TableService(db)
    return service.create(
        number=data.number,
        capacity=data.capacity,
        location_id=data.location_id,
    )


@router.put("/{table_id}", response_model=TableOut)
def actualizar_mesa(
    table_id: UUID,
    data: TableUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Actualiza datos o estado de una mesa. Requiere autenticación."""
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
    """Elimina una mesa por su ID. Requiere autenticación."""
    service = TableService(db)
    deleted = service.delete(table_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Mesa con id {table_id} no encontrada"
        )
