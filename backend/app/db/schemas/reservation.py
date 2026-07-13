from datetime import datetime
from uuid import UUID
from typing import Optional

from pydantic import BaseModel


class ReservationCreate(BaseModel):
    table_id: UUID
    reservation_date: datetime
    guest_count: int
    notes: Optional[str] = None


class ReservationUpdate(BaseModel):
    reservation_date: Optional[datetime] = None
    guest_count: Optional[int] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class ReservationOut(BaseModel):
    id: UUID
    user_id: UUID
    table_id: UUID
    reservation_date: datetime
    guest_count: int
    status: str
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
