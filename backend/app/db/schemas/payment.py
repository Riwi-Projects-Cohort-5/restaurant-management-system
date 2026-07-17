from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel


class PaymentCreate(BaseModel):
    order_id: UUID
    amount: Decimal
    method: str


class PaymentOut(BaseModel):
    id: UUID
    order_id: UUID
    amount: Decimal
    method: str
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
