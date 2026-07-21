from decimal import Decimal
from typing import Optional
from uuid import UUID

from sqlalchemy.orm import Session

from app.db.models.recipe import Recipe
from app.repositories.recipe_repository import RecipeRepository


class RecipeService:
    def __init__(self, db: Session):
        self.repo = RecipeRepository(db)

    def get_by_id(self, recipe_id: UUID) -> Optional[Recipe]:
        return self.repo.get_by_id(recipe_id)

    def get_by_product(self, product_id: UUID) -> list[Recipe]:
        return self.repo.get_by_product(product_id)

    def get_all(self, skip: int = 0, limit: int = 100) -> list[Recipe]:
        return self.repo.get_all(skip, limit)

    def create(self, product_id: UUID, ingredient_id: UUID,
               required_quantity: Decimal) -> Recipe:
        recipe = Recipe(
            product_id=product_id,
            ingredient_id=ingredient_id,
            required_quantity=required_quantity,
        )
        return self.repo.create(recipe)

    def delete(self, recipe_id: UUID) -> bool:
        recipe = self.repo.get_by_id(recipe_id)
        if not recipe:
            return False
        self.repo.delete(recipe)
        return True
