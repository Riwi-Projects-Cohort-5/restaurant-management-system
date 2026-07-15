"""
=============================================================
Módulo   : reservations.py
Ruta     : backend/app/api/v1/reservations.py
Responsable: Diego
Descripción: Endpoints REST para gestión de reservaciones.
            create recibe parámetros separados (no objeto).
            delete no existe — se usa cancel que cambia
            el estado a CANCELLED en lugar de eliminar.
Fecha    : 2026-07-15
=============================================================
"""

from uuid import UUID
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.dependencies import get_current_user
from app.services.reservation_service import ReservationService
from app.db.schemas.reservation import ReservationCreate, ReservationUpdate, ReservationOut

router = APIRouter(prefix="/reservations", tags=["Reservations"])


@router.get("/", response_model=List[ReservationOut])
def obtener_todas_las_reservaciones(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Retorna todas las reservaciones. Requiere autenticación."""
    service = ReservationService(db)
    return service.get_all(skip=skip, limit=limit)


@router.get("/{reservation_id}", response_model=ReservationOut)
def obtener_reservacion_por_id(
    reservation_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Retorna una reservación por su ID. Lanza 404 si no existe."""
    service = ReservationService(db)
    reservation = service.get_by_id(reservation_id)
    if not reservation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Reservación con id {reservation_id} no encontrada"
        )
    return reservation


@router.post("/", response_model=ReservationOut, status_code=status.HTTP_201_CREATED)
def crear_reservacion(
    data: ReservationCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Crea una nueva reservación. Requiere autenticación.
    El user_id se extrae del token JWT del usuario autenticado.
    """
    service = ReservationService(db)
    # create recibe parámetros separados; user_id viene del token
    return service.create(
        user_id=UUID(current_user["sub"]),
        table_id=data.table_id,
        reservation_date=data.reservation_date,
        guest_count=data.guest_count,
        notes=data.notes
    )


@router.put("/{reservation_id}", response_model=ReservationOut)
def actualizar_reservacion(
    reservation_id: UUID,
    data: ReservationUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Actualiza datos o estado de una reservación. Requiere autenticación."""
    service = ReservationService(db)
    updated = service.update(
        reservation_id, data.model_dump(exclude_none=True)
    )
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Reservación con id {reservation_id} no encontrada"
        )
    return updated


@router.delete("/{reservation_id}", status_code=status.HTTP_204_NO_CONTENT)
def cancelar_reservacion(
    reservation_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Cancela una reservación. Requiere autenticación.
    No elimina el registro — cambia el estado a CANCELLED.
    Esto preserva el historial de reservaciones.
    """
    service = ReservationService(db)
    # El service usa cancel() en lugar de delete()
    cancelled = service.cancel(reservation_id)
    if not cancelled:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Reservación con id {reservation_id} no encontrada"
        )