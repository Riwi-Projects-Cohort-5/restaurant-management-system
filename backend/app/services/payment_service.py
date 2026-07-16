from uuid import UUID
from typing import Optional
from decimal import Decimal

from sqlalchemy.orm import Session

from app.db.models.payment import Payment, PaymentMethod, PaymentStatus
from app.repositories.payment_repository import PaymentRepository
from app.repositories.order_repository import OrderRepository


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
        try:
            method_enum = PaymentMethod(method)
        except ValueError:
            raise InvalidEnumValueError(f"Invalid payment method: {method}. Must be one of: {[e.value for e in PaymentMethod]}")
        payment = Payment(
            order_id=order_id, amount=amount,
            method=method_enum, status=PaymentStatus.COMPLETED,
        )
        return self.repo.create(payment)
