from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel


class RecipeCreate(BaseModel):
    product_id: UUID
    ingredient_id: UUID
    required_quantity: Decimal


class RecipeOut(BaseModel):
    id: UUID
    product_id: UUID
    ingredient_id: UUID
    required_quantity: Decimal

    model_config = {"from_attributes": True}
