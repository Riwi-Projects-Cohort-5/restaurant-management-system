"""

Módulo   : payments.py
Ruta     : backend/app/api/v1/payments.py
Responsable: Diego
Descripción: Endpoints REST para procesamiento de pagos.
            El service no tiene update — solo create, get_by_id,
            get_by_order y get_all. create recibe parámetros
            separados, no un objeto completo.
Fecha    : 2026-07-15

"""

from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.db.schemas.payment import PaymentCreate, PaymentOut, PaymentUpdate
from app.services.payment_service import PaymentService

router = APIRouter(prefix="/payments", tags=["Payments"])


@router.get("/", response_model=List[PaymentOut])
def obtener_todos_los_pagos(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Retorna historial completo de pagos. Requiere autenticación."""
    service = PaymentService(db)
    return service.get_all(skip=skip, limit=limit)


@router.get("/order/{order_id}", response_model=PaymentOut)
def obtener_pago_por_orden(
    order_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Retorna el pago asociado a una orden.
    Esta ruta va ANTES de /{payment_id} para evitar conflictos.
    Lanza 404 si la orden no tiene pago registrado.
    """
    service = PaymentService(db)
    payment = service.get_by_order(order_id)
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontró pago para la orden {order_id}"
        )
    return payment


@router.get("/{payment_id}", response_model=PaymentOut)
def obtener_pago_por_id(
    payment_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Retorna un pago por su ID. Lanza 404 si no existe."""
    service = PaymentService(db)
    payment = service.get_by_id(payment_id)
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pago con id {payment_id} no encontrado"
        )
    return payment


@router.post("/", response_model=PaymentOut, status_code=status.HTTP_201_CREATED)
def registrar_pago(
    data: PaymentCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Registra el pago de una orden. Requiere autenticación.
    Al crear el pago, la orden pasa a PAID automáticamente.
    Lanza 404 si la orden no existe.
    """
    service = PaymentService(db)
    # create recibe parámetros separados, no el objeto data directamente
    try:
        payment = service.create(
            order_id=data.order_id,
            amount=data.amount,
            method=data.method
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Orden con id {data.order_id} no encontrada"
        )
    return payment


@router.put("/{payment_id}", response_model=PaymentOut)
def actualizar_estado_pago(
    payment_id: UUID,
    data: PaymentUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Actualiza el estado de un pago. Requiere autenticación."""
    service = PaymentService(db)
    updated = service.update_status(payment_id, data.status)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pago con id {payment_id} no encontrado"
        )
    return updated


@router.delete("/{payment_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_pago(
    payment_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Elimina un pago por su ID. Requiere autenticación."""
    service = PaymentService(db)
    deleted = service.delete(payment_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pago con id {payment_id} no encontrado"
        )
