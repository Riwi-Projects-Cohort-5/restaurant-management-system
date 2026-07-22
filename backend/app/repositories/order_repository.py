from typing import Optional
from uuid import UUID

from sqlalchemy.orm import Session

from app.db.models.order import Order, OrderStatus


class OrderRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, order_id: UUID) -> Optional[Order]:
        return self.db.query(Order).filter(Order.id == order_id).first()

    def get_by_waiter(self, waiter_id: UUID) -> list[Order]:
        return self.db.query(Order).filter(Order.waiter_id == waiter_id).all()

    def get_by_table(self, table_id: UUID) -> list[Order]:
        return self.db.query(Order).filter(Order.table_id == table_id).all()

    def get_active(self) -> list[Order]:
        return self.db.query(Order).filter(
            Order.status.in_([OrderStatus.PENDING, OrderStatus.IN_PROGRESS])
        ).all()

    def get_all(self, skip: int = 0, limit: int = 100) -> list[Order]:
        return self.db.query(Order).offset(skip).limit(limit).all()

    def create(self, order: Order) -> Order:
        self.db.add(order)
        try:
            self.db.commit()
        except Exception:
            self.db.rollback()
            raise
        self.db.refresh(order)
        return order

    def update(self, order: Order) -> Order:
        try:
            self.db.commit()
            self.db.refresh(order)
            return order
        except Exception:
            self.db.rollback()
            raise

    def delete(self, order: Order) -> None:
        self.db.delete(order)
        try:
            self.db.commit()
        except Exception:
            self.db.rollback()
            raise
