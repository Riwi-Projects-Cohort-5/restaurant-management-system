from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel

from app.db.schemas.location import LocationOut


class TableCreate(BaseModel):
    number: int
    capacity: int
    location_id: Optional[UUID] = None


class TableUpdate(BaseModel):
    capacity: Optional[int] = None
    status: Optional[str] = None
    location_id: Optional[UUID] = None


class TableOut(BaseModel):
    id: UUID
    number: int
    capacity: int
    status: str
    location_id: Optional[UUID]
    location_ref: Optional[LocationOut] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
