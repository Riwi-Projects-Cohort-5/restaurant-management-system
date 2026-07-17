from typing import Optional
from uuid import UUID

from sqlalchemy.orm import Session

from app.db.models.kitchen_order import KitchenOrder, KitchenOrderStatus
from app.repositories.kitchen_repository import KitchenRepository


class InvalidEnumValueError(Exception):
    pass


class KitchenService:
    def __init__(self, db: Session):
        self.repo = KitchenRepository(db)

    def get_by_id(self, kitchen_order_id: UUID) -> Optional[KitchenOrder]:
        return self.repo.get_by_id(kitchen_order_id)

    def get_by_order(self, order_id: UUID) -> list[KitchenOrder]:
        return self.repo.get_by_order(order_id)

    def get_pending(self) -> list[KitchenOrder]:
        return self.repo.get_pending()

    def get_in_progress(self) -> list[KitchenOrder]:
        return self.repo.get_in_progress()

    def create(self, order_id: UUID, menu_item_name: str, quantity: int,
            notes: Optional[str] = None, priority: int = 0) -> KitchenOrder:
        kitchen_order = KitchenOrder(
            order_id=order_id, menu_item_name=menu_item_name,
            quantity=quantity, notes=notes, priority=priority,
        )
        return self.repo.create(kitchen_order)

    def update_status(self, kitchen_order_id: UUID, status: str,
                      notes: Optional[str] = None) -> Optional[KitchenOrder]:
        kitchen_order = self.repo.get_by_id(kitchen_order_id)
        if not kitchen_order:
            return None
        try:
            kitchen_order.status = KitchenOrderStatus(status)
        except ValueError:
            raise InvalidEnumValueError(f"Invalid status: {status}. Must be one of: {[e.value for e in KitchenOrderStatus]}")
        if notes:
            kitchen_order.notes = notes
        return self.repo.update(kitchen_order)
