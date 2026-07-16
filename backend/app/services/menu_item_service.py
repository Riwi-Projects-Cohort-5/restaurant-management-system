from decimal import Decimal
from typing import Optional
from uuid import UUID

from sqlalchemy.orm import Session

from app.db.models.menu_item import MenuItem
from app.repositories.menu_item_repository import MenuItemRepository


class MenuItemService:
    def __init__(self, db: Session):
        self.repo = MenuItemRepository(db)

    def get_by_id(self, item_id: UUID) -> Optional[MenuItem]:
        return self.repo.get_by_id(item_id)

    def get_by_category(self, category_id: UUID) -> list[MenuItem]:
        return self.repo.get_by_category(category_id)

    def get_available(self) -> list[MenuItem]:
        return self.repo.get_available()

    def get_all(self, skip: int = 0, limit: int = 100) -> list[MenuItem]:
        return self.repo.get_all(skip, limit)

    def create(self, name: str, price: Decimal, category_id: UUID,
               description: Optional[str] = None, image_url: Optional[str] = None) -> MenuItem:
        item = MenuItem(
            name=name, price=price, category_id=category_id,
            description=description, image_url=image_url,
        )
        return self.repo.create(item)

    def update(self, item_id: UUID, data: dict) -> Optional[MenuItem]:
        item = self.repo.get_by_id(item_id)
        if not item:
            return None
        for key, value in data.items():
            if value is not None and hasattr(item, key):
                setattr(item, key, value)
        return self.repo.update(item)

    def delete(self, item_id: UUID) -> bool:
        item = self.repo.get_by_id(item_id)
        if not item:
            return False
        self.repo.delete(item)
        return True
