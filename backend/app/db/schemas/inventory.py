from datetime import datetime
from uuid import UUID
from typing import Optional
from decimal import Decimal

from pydantic import BaseModel


class InventoryItemCreate(BaseModel):
    name: str
    unit: str
    quantity: Decimal = 0
    min_stock: Decimal = 0


class InventoryItemUpdate(BaseModel):
    name: Optional[str] = None
    unit: Optional[str] = None
    quantity: Optional[Decimal] = None
    min_stock: Optional[Decimal] = None
    is_active: Optional[bool] = None


class InventoryItemOut(BaseModel):
    id: UUID
    name: str
    unit: str
    quantity: Decimal
    min_stock: Decimal
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class InventoryMovementCreate(BaseModel):
    item_id: UUID
    type: str
    quantity: Decimal
    reason: Optional[str] = None


class InventoryMovementOut(BaseModel):
    id: UUID
    item_id: UUID
    type: str
    quantity: Decimal
    reason: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}
