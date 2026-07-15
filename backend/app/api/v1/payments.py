
"""
=============================================================
Módulo   : payments.py
Ruta     : backend/app/api/v1/payments.py
Responsable: Diego
Descripción: Endpoints REST para el procesamiento de pagos.
            Gestiona el cierre de cuentas del restaurante.
            Al registrar un pago, la orden pasa a PAID y
            la mesa queda disponible para el siguiente cliente.
            Todos los endpoints requieren autenticación.
Fecha    : 2026-07-14
=============================================================
"""

from uuid import UUID
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.dependencies import get_current_user
from app.services.payment_service import PaymentService
from app.db.schemas.payment import PaymentCreate, PaymentUpdate, PaymentOut

router = APIRouter(prefix="/payments", tags=["Payments"])


@router.get("/", response_model=List[PaymentOut])
def obtener_todos_los_pagos(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Retorna el historial completo de pagos con paginación.
    Requiere autenticación — información financiera sensible.

    Args:
        skip : Número de registros a omitir (paginación).
        limit: Máximo de registros a retornar.

    Retorna:
        Lista de PaymentOut con todos los pagos registrados.
    """
    service = PaymentService(db)
    return service.get_all(skip=skip, limit=limit)


@router.get("/{payment_id}", response_model=PaymentOut)
def obtener_pago_por_id(
    payment_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Busca y retorna un pago específico por su ID.
    Requiere autenticación.

    Args:
        payment_id: UUID del pago a buscar.

    Retorna:
        PaymentOut con los datos del pago.

    Lanza:
        HTTPException 404 si el pago no existe.
    """
    service = PaymentService(db)
    payment = service.get_by_id(payment_id)

    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pago con id {payment_id} no encontrado"
        )
    return payment


@router.get("/order/{order_id}", response_model=PaymentOut)
def obtener_pago_por_orden(
    order_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Busca el pago asociado a una orden específica.
    Útil para verificar si una orden ya fue pagada.
    Requiere autenticación.

    Args:
        order_id: UUID de la orden cuyo pago se busca.

    Retorna:
        PaymentOut con los datos del pago de esa orden.

    Lanza:
        HTTPException 404 si no existe pago para esa orden.
    """
    service = PaymentService(db)
    payment = service.get_by_order(order_id)

    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontró pago para la orden {order_id}"
        )
    return payment


@router.post("/", response_model=PaymentOut, status_code=status.HTTP_201_CREATED)
def registrar_pago(
    data: PaymentCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Registra el pago de una orden — cierra la cuenta del cliente.
    Requiere autenticación — solo cajeros/staff pueden registrar pagos.

    Al registrar el pago:
    - La orden pasa a estado PAID
    - La mesa queda disponible (AVAILABLE)
    - Los datos se registran para reportes

    Args:
        data: PaymentCreate con los datos del pago
            (order_id, amount, method, etc.).

    Retorna:
        PaymentOut con los datos del pago registrado.
        Código HTTP 201 Created.
    """
    service = PaymentService(db)
    return service.create(data)


@router.put("/{payment_id}", response_model=PaymentOut)
def actualizar_pago(
    payment_id: UUID,
    data: PaymentUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Actualiza los datos de un pago existente.
    Requiere autenticación — usado para correcciones o reembolsos.

    Args:
        payment_id: UUID del pago a actualizar.
        data      : PaymentUpdate con los campos a modificar.

    Retorna:
        PaymentOut con los datos actualizados.

    Lanza:
        HTTPException 404 si el pago no existe.
    """
    service = PaymentService(db)
    updated = service.update(payment_id, data.model_dump(exclude_none=True))

    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pago con id {payment_id} no encontrado"
        )
    return updated