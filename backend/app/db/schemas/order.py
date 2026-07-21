from datetime import datetime
from decimal import Decimal
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class OrderItemCreate(BaseModel):
    menu_item_id: UUID
    quantity: int = 1
    notes: Optional[str] = None


class OrderCreate(BaseModel):
    table_id: UUID
    reservation_id: Optional[str] = None


class OrderUpdate(BaseModel):
    status: Optional[str] = None


class OrderItemOut(BaseModel):
    id: UUID
    menu_item_id: UUID
    quantity: int
    unit_price: Decimal
    subtotal: Decimal

    model_config = {"from_attributes": True}


class OrderOut(BaseModel):
    id: UUID
    waiter_id: UUID
    table_id: UUID
    reservation_id: Optional[str] = None
    status: str
    total: Decimal
    created_at: datetime
    updated_at: datetime
    order_items: list[OrderItemOut] = []

    model_config = {"from_attributes": True}
