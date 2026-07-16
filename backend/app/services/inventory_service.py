from uuid import UUID
from typing import Optional
from decimal import Decimal

from sqlalchemy.orm import Session

from app.db.models.inventory_item import InventoryItem
from app.db.models.inventory_movement import InventoryMovement, MovementType
from app.repositories.inventory_repository import InventoryRepository


class InventoryService:
    def __init__(self, db: Session):
        self.repo = InventoryRepository(db)

    def get_item_by_id(self, item_id: UUID) -> Optional[InventoryItem]:
        return self.repo.get_item_by_id(item_id)

    def get_all_items(self, skip: int = 0, limit: int = 100) -> list[InventoryItem]:
        return self.repo.get_all_items(skip, limit)

    def get_low_stock(self) -> list[InventoryItem]:
        return self.repo.get_low_stock()

    def create_item(self, name: str, unit: str, quantity: Decimal = 0,
                    min_stock: Decimal = 0) -> InventoryItem:
        item = InventoryItem(name=name, unit=unit, quantity=quantity, min_stock=min_stock)
        return self.repo.create_item(item)

    def update_item(self, item_id: UUID, data: dict) -> Optional[InventoryItem]:
        item = self.repo.get_item_by_id(item_id)
        if not item:
            return None
        for key, value in data.items():
            if value is not None and hasattr(item, key):
                setattr(item, key, value)
        return self.repo.update_item(item)

    def register_movement(self, item_id: UUID, movement_type: str,
                        quantity: Decimal, reason: Optional[str] = None) -> Optional[InventoryMovement]:
        item = self.repo.get_item_by_id(item_id)
        if not item:
            return None
        movement = InventoryMovement(
            item_id=item_id, type=MovementType(movement_type),
            quantity=quantity, reason=reason,
        )
        if movement_type == "in":
            item.quantity += quantity
        else:
            item.quantity -= quantity
        self.repo.update_item(item)
        return self.repo.create_movement(movement)

    def get_movements(self, item_id: UUID) -> list[InventoryMovement]:
        return self.repo.get_movements_by_item(item_id)
