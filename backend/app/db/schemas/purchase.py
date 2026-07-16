from datetime import datetime
from decimal import Decimal
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class PurchaseDetailCreate(BaseModel):
    ingredient_id: UUID
    quantity: Decimal
    unit_cost: Optional[Decimal] = None


class PurchaseDetailOut(BaseModel):
    id: UUID
    purchase_id: UUID
    ingredient_id: UUID
    quantity: Decimal
    unit_cost: Optional[Decimal]
    subtotal: Optional[Decimal]

    model_config = {"from_attributes": True}


class PurchaseCreate(BaseModel):
    supplier_id: UUID
    notes: Optional[str] = None
    details: list[PurchaseDetailCreate] = []


class PurchaseUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None


class PurchaseOut(BaseModel):
    id: UUID
    supplier_id: UUID
    purchase_date: datetime
    status: str
    total: Decimal
    notes: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}
