from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class SettingUpdate(BaseModel):
    restaurant_name: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    tax_rate: Optional[float] = None
    currency: Optional[str] = None


class SettingOut(BaseModel):
    id: str
    restaurant_name: str
    address: str
    phone: str
    email: str
    tax_rate: float
    currency: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
