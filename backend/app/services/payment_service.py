from decimal import Decimal
from typing import Optional
from uuid import UUID

from sqlalchemy.orm import Session

from app.db.models.order import OrderStatus
from app.db.models.payment import Payment, PaymentMethod, PaymentStatus
from app.repositories.order_repository import OrderRepository
from app.repositories.payment_repository import PaymentRepository


class InvalidEnumValueError(Exception):
    pass


class PaymentService:
    def __init__(self, db: Session):
        self.repo = PaymentRepository(db)
        self.order_repo = OrderRepository(db)

    def get_by_id(self, payment_id: UUID) -> Optional[Payment]:
        return self.repo.get_by_id(payment_id)

    def get_by_order(self, order_id: UUID) -> Optional[Payment]:
        return self.repo.get_by_order(order_id)

    def get_all(self, skip: int = 0, limit: int = 100) -> list[Payment]:
        return self.repo.get_all(skip, limit)

    def create(self, order_id: UUID, amount: Decimal, method: str) -> Optional[Payment]:
        order = self.order_repo.get_by_id(order_id)
        if not order:
            return None
        if order.status != OrderStatus.SERVED:
            raise ValueError("La orden debe estar 'served' para registrar un pago.")
        if amount <= 0:
            raise ValueError("El monto del pago debe ser mayor a 0.")
        if amount > order.total:
            raise ValueError(f"El monto del pago ({amount}) excede el total de la orden ({order.total}).")
        try:
            method_enum = PaymentMethod(method)
        except ValueError:
            raise InvalidEnumValueError(f"Invalid payment method: {method}. Must be one of: {[e.value for e in PaymentMethod]}")
        payment = Payment(
            order_id=order_id, amount=amount,
            method=method_enum, status=PaymentStatus.COMPLETED,
        )
        result = self.repo.create(payment)
        order.status = OrderStatus.COMPLETED
        self.order_repo.db.commit()
        return result

    def update_status(self, payment_id: UUID, new_status: str) -> Optional[Payment]:
        payment = self.repo.get_by_id(payment_id)
        if not payment:
            return None
        try:
            payment.status = PaymentStatus(new_status)
        except ValueError:
            raise InvalidEnumValueError(f"Invalid status: {new_status}. Must be one of: {[e.value for e in PaymentStatus]}")
        return self.repo.update(payment)

    def delete(self, payment_id: UUID) -> bool:
        payment = self.repo.get_by_id(payment_id)
        if not payment:
            return False
        self.repo.db.delete(payment)
        self.repo.db.commit()
        return True
