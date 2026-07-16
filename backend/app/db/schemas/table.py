from datetime import datetime
from uuid import UUID
from typing import Optional

from pydantic import BaseModel


class TableCreate(BaseModel):
    number: int
    capacity: int
    location: Optional[str] = None


class TableUpdate(BaseModel):
    capacity: Optional[int] = None
    status: Optional[str] = None
    location: Optional[str] = None


class TableOut(BaseModel):
    id: UUID
    number: int
    capacity: int
    status: str
    location: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
