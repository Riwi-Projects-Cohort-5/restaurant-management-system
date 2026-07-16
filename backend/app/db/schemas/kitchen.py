from datetime import datetime
from uuid import UUID
from typing import Optional

from pydantic import BaseModel


class KitchenOrderUpdate(BaseModel):
    status: str
    notes: Optional[str] = None


class KitchenOrderOut(BaseModel):
    id: UUID
    order_id: UUID
    menu_item_name: str
    quantity: int
    notes: Optional[str]
    status: str
    priority: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
