from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class ReservationCreate(BaseModel):
    table_id: Optional[UUID] = None
    guest_name: Optional[str] = None
    guest_phone: Optional[str] = None
    reservation_date: datetime
    guest_count: int
    notes: Optional[str] = None


class ReservationUpdate(BaseModel):
    reservation_date: Optional[datetime] = None
    guest_count: Optional[int] = None
    guest_name: Optional[str] = None
    guest_phone: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class ReservationConfirm(BaseModel):
    table_id: UUID


class ReservationOut(BaseModel):
    id: str
    customer_id: Optional[str] = None
    table_id: Optional[UUID] = None
    guest_name: Optional[str] = None
    guest_phone: Optional[str] = None
    reservation_date: datetime
    guest_count: int
    status: str
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
