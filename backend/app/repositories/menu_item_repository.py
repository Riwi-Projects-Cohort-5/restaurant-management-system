from typing import Optional
from uuid import UUID

from sqlalchemy.orm import Session

from app.db.models.menu_item import MenuItem


class MenuItemRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, item_id: UUID) -> Optional[MenuItem]:
        return self.db.query(MenuItem).filter(MenuItem.id == item_id).first()

    def get_by_category(self, category_id: UUID) -> list[MenuItem]:
        return self.db.query(MenuItem).filter(MenuItem.category_id == category_id).all()

    def get_available(self) -> list[MenuItem]:
        return self.db.query(MenuItem).filter(MenuItem.is_available.is_(True)).all()

    def get_all(self, skip: int = 0, limit: int = 100) -> list[MenuItem]:
        return self.db.query(MenuItem).offset(skip).limit(limit).all()

    def create(self, item: MenuItem) -> MenuItem:
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def update(self, item: MenuItem) -> MenuItem:
        self.db.commit()
        self.db.refresh(item)
        return item

    def delete(self, item: MenuItem) -> None:
        self.db.delete(item)
        self.db.commit()
