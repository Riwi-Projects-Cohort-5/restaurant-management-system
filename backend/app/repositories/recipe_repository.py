from uuid import UUID
from typing import Optional

from sqlalchemy.orm import Session

from app.db.models.recipe import Recipe


class RecipeRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, recipe_id: UUID) -> Optional[Recipe]:
        return self.db.query(Recipe).filter(Recipe.id == recipe_id).first()

    def get_by_product(self, product_id: UUID) -> list[Recipe]:
        return self.db.query(Recipe).filter(Recipe.product_id == product_id).all()

    def get_all(self, skip: int = 0, limit: int = 100) -> list[Recipe]:
        return self.db.query(Recipe).offset(skip).limit(limit).all()

    def create(self, recipe: Recipe) -> Recipe:
        self.db.add(recipe)
        self.db.commit()
        self.db.refresh(recipe)
        return recipe

    def delete(self, recipe: Recipe) -> None:
        self.db.delete(recipe)
        self.db.commit()
