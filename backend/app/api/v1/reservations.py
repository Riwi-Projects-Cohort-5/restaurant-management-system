"""
=============================================================
Módulo   : reservations.py
Ruta     : backend/app/api/v1/reservations.py
Responsable: Diego
Descripción: Endpoints REST para la gestión de reservaciones
             del restaurante. Permite a los clientes reservar
             mesas con anticipación. Al confirmar una reserva,
             la mesa pasa a estado RESERVED automáticamente.
Fecha    : 2026-07-14
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
    """
    Retorna todas las reservaciones registradas con paginación.
    Requiere autenticación — solo staff puede ver todas las reservas.

    Args:
        skip : Número de registros a omitir (paginación).
        limit: Máximo de registros a retornar.

    Retorna:
        Lista de ReservationOut con todas las reservaciones.
    """
    service = ReservationService(db)
    return service.get_all(skip=skip, limit=limit)


@router.get("/active", response_model=List[ReservationOut])
def obtener_reservaciones_activas(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Retorna únicamente las reservaciones activas (pendientes o confirmadas).
    Útil para el panel de recepción — ver qué clientes llegan hoy.
    Requiere autenticación.

    Retorna:
        Lista de ReservationOut con reservaciones activas.
    """
    service = ReservationService(db)
    return service.get_active()


@router.get("/{reservation_id}", response_model=ReservationOut)
def obtener_reservacion_por_id(
    reservation_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Busca y retorna una reservación específica por su ID.
    Requiere autenticación.

    Args:
        reservation_id: UUID de la reservación a buscar.

    Retorna:
        ReservationOut con los datos de la reservación.

    Lanza:
        HTTPException 404 si la reservación no existe.
    """
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
    Crea una nueva reservación para una mesa.
    Requiere autenticación.

    Al crear la reservación:
    - Se verifica disponibilidad de la mesa en la fecha/hora solicitada
    - La mesa pasa a estado RESERVED
    - Se confirma al cliente

    Args:
        data: ReservationCreate con los datos de la reservación
              (table_id, fecha, hora, número de personas, notas).

    Retorna:
        ReservationOut con los datos de la reservación creada.
        Código HTTP 201 Created.
    """
    service = ReservationService(db)
    return service.create(data)


@router.put("/{reservation_id}", response_model=ReservationOut)
def actualizar_reservacion(
    reservation_id: UUID,
    data: ReservationUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Actualiza los datos o el estado de una reservación existente.
    Requiere autenticación.

    Usado para confirmar, modificar o cancelar reservaciones:
    PENDING → CONFIRMED → CANCELLED

    Args:
        reservation_id: UUID de la reservación a actualizar.
        data          : ReservationUpdate con los campos a modificar.

    Retorna:
        ReservationOut con los datos actualizados.

    Lanza:
        HTTPException 404 si la reservación no existe.
    """
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
    Elimina o cancela una reservación por su ID.
    Requiere autenticación.

    Al cancelar:
    - La reservación se elimina del sistema
    - La mesa vuelve a estado AVAILABLE

    Args:
        reservation_id: UUID de la reservación a cancelar.

    Retorna:
        HTTP 204 No Content si se canceló correctamente.

    Lanza:
        HTTPException 404 si la reservación no existe.
    """
    service = ReservationService(db)
    deleted = service.delete(reservation_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Reservación con id {reservation_id} no encontrada"
        )
