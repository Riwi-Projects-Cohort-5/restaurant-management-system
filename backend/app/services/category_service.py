from uuid import UUID
from typing import Optional

from sqlalchemy.orm import Session

from app.db.models.category import Category
from app.repositories.category_repository import CategoryRepository


class CategoryService:
    def __init__(self, db: Session):
        self.repo = CategoryRepository(db)

    def get_by_id(self, category_id: UUID) -> Optional[Category]:
        return self.repo.get_by_id(category_id)

    def get_all(self, skip: int = 0, limit: int = 100) -> list[Category]:
        return self.repo.get_all(skip, limit)

    def create(self, name: str, description: Optional[str] = None) -> Category:
        category = Category(name=name, description=description)
        return self.repo.create(category)

    def update(self, category_id: UUID, data: dict) -> Optional[Category]:
        category = self.repo.get_by_id(category_id)
        if not category:
            return None
        for key, value in data.items():
            if value is not None and hasattr(category, key):
                setattr(category, key, value)
        return self.repo.update(category)

    def delete(self, category_id: UUID) -> bool:
        category = self.repo.get_by_id(category_id)
        if not category:
            return False
        self.repo.delete(category)
        return True
