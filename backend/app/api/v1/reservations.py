"""

Módulo   : reservations.py
Ruta     : backend/app/api/v1/reservations.py
Responsable: Diego
Descripción: Endpoints REST para gestión de reservaciones.
            create recibe parámetros separados (no objeto).
            delete no existe — se usa cancel que cambia
            el estado a CANCELLED en lugar de eliminar.
Fecha    : 2026-07-15

"""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.db.schemas.reservation import (
    ReservationConfirm,
    ReservationCreate,
    ReservationOut,
    ReservationUpdate,
)
from app.services.reservation_service import InvalidEnumValueError, ReservationService

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
    reservation_id: str,
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
    return service.create(
        customer_id=None,
        table_id=data.table_id,
        reservation_date=data.reservation_date,
        guest_count=data.guest_count,
        guest_name=data.guest_name,
        guest_phone=data.guest_phone,
        notes=data.notes
    )


@router.put("/confirm/{reservation_id}", response_model=ReservationOut)
def confirmar_reservacion(
    reservation_id: str,
    data: ReservationConfirm,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Confirma una reservación y la asocia a una mesa.
    Cambia la reserva a CONFIRMED y la mesa a RESERVED.
    """
    service = ReservationService(db)
    try:
        confirmed = service.confirm_with_table(reservation_id, data.table_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e)
        )
    if not confirmed:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Reservación con id {reservation_id} no encontrada"
        )
    return confirmed


@router.put("/{reservation_id}", response_model=ReservationOut)
def actualizar_reservacion(
    reservation_id: str,
    data: ReservationUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Actualiza datos o estado de una reservación. Requiere autenticación."""
    service = ReservationService(db)
    try:
        updated = service.update(
            reservation_id, data.model_dump(exclude_none=True)
        )
    except InvalidEnumValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Reservación con id {reservation_id} no encontrada"
        )
    return updated


@router.delete("/{reservation_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_reservacion(
    reservation_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Elimina una reservación permanentemente. Requiere autenticación.
    Libera la mesa asignada si estaba reservada.
    """
    service = ReservationService(db)
    try:
        deleted = service.delete(reservation_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e)
        )
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Reservación con id {reservation_id} no encontrada"
        )
