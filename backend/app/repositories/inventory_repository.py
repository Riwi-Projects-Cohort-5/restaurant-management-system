from typing import Optional
from uuid import UUID

from sqlalchemy.orm import Session

from app.db.models.inventory_item import InventoryItem
from app.db.models.inventory_movement import InventoryMovement


class InventoryRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_item_by_id(self, item_id: UUID) -> Optional[InventoryItem]:
        return self.db.query(InventoryItem).filter(InventoryItem.id == item_id).first()

    def get_all_items(self, skip: int = 0, limit: int = 100) -> list[InventoryItem]:
        return self.db.query(InventoryItem).offset(skip).limit(limit).all()

    def get_low_stock(self) -> list[InventoryItem]:
        return self.db.query(InventoryItem).filter(
            InventoryItem.quantity <= InventoryItem.min_stock
        ).all()

    def create_item(self, item: InventoryItem) -> InventoryItem:
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def update_item(self, item: InventoryItem) -> InventoryItem:
        self.db.commit()
        self.db.refresh(item)
        return item

    def get_movements_by_item(self, item_id: UUID) -> list[InventoryMovement]:
        return self.db.query(InventoryMovement).filter(
            InventoryMovement.item_id == item_id
        ).all()

    def create_movement(self, movement: InventoryMovement) -> InventoryMovement:
        self.db.add(movement)
        self.db.commit()
        self.db.refresh(movement)
        return movement
