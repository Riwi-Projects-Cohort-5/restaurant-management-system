from uuid import UUID
from typing import Optional
from decimal import Decimal

from sqlalchemy.orm import Session

from app.db.models.order import Order, OrderStatus
from app.db.models.order_item import OrderItem
from app.repositories.order_repository import OrderRepository
from app.repositories.menu_item_repository import MenuItemRepository


class InvalidEnumValueError(Exception):
    pass


class OrderService:
    def __init__(self, db: Session):
        self.repo = OrderRepository(db)
        self.menu_repo = MenuItemRepository(db)

    def get_by_id(self, order_id: UUID) -> Optional[Order]:
        return self.repo.get_by_id(order_id)

    def get_by_waiter(self, waiter_id: UUID) -> list[Order]:
        return self.repo.get_by_waiter(waiter_id)

    def get_active(self) -> list[Order]:
        return self.repo.get_active()

    def get_all(self, skip: int = 0, limit: int = 100) -> list[Order]:
        return self.repo.get_all(skip, limit)

    def create(self, waiter_id: UUID, table_id: UUID) -> Order:
        order = Order(waiter_id=waiter_id, table_id=table_id)
        return self.repo.create(order)

    def add_item(self, order_id: UUID, menu_item_id: UUID, quantity: int = 1) -> Optional[Order]:
        order = self.repo.get_by_id(order_id)
        if not order:
            return None
        item = self.menu_repo.get_by_id(menu_item_id)
        if not item:
            return None
        unit_price = item.price
        subtotal = unit_price * quantity
        order_item = OrderItem(
            order_id=order_id,
            menu_item_id=menu_item_id,
            quantity=quantity,
            unit_price=unit_price,
            subtotal=subtotal,
        )
        order.total = (order.total or 0) + subtotal
        self.repo.db.add(order_item)
        return self.repo.update(order)

    def update_status(self, order_id: UUID, status: str) -> Optional[Order]:
        order = self.repo.get_by_id(order_id)
        if not order:
            return None
        try:
            order.status = OrderStatus(status)
        except ValueError:
            raise InvalidEnumValueError(f"Invalid status: {status}. Must be one of: {[e.value for e in OrderStatus]}")
        return self.repo.update(order)
