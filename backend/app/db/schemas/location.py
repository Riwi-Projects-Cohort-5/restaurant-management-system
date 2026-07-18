from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class LocationCreate(BaseModel):
    name: str


class LocationUpdate(BaseModel):
    name: Optional[str] = None


class LocationOut(BaseModel):
    id: UUID
    name: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
