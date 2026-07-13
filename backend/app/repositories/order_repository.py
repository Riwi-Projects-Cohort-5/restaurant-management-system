from uuid import UUID
from typing import Optional

from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.models.order import Order, OrderStatus


class OrderRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, order_id: UUID) -> Optional[Order]:
        return self.db.query(Order).filter(Order.id == order_id).first()

    def get_by_user(self, user_id: UUID) -> list[Order]:
        return self.db.query(Order).filter(Order.user_id == user_id).all()

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
        self.db.commit()
        self.db.refresh(order)
        return order

    def update(self, order: Order) -> Order:
        self.db.commit()
        self.db.refresh(order)
        return order

    def delete(self, order: Order) -> None:
        self.db.delete(order)
        self.db.commit()
