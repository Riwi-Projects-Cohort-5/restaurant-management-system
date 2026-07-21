from datetime import datetime
from decimal import Decimal
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class MenuItemCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: Decimal
    category_id: UUID
    image_url: Optional[str] = None


class MenuItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    category_id: Optional[UUID] = None
    is_available: Optional[bool] = None
    image_url: Optional[str] = None


class MenuItemOut(BaseModel):
    id: UUID
    name: str
    description: Optional[str]
    price: Decimal
    category_id: UUID
    is_available: bool
    image_url: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
