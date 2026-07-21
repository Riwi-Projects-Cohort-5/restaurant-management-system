import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Float, String, Text

from app.db.database import Base


class Setting(Base):
    __tablename__ = "settings"

    id = Column(String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    restaurant_name = Column(String(200), default="El Fogon Caribeno")
    address = Column(Text, default="")
    phone = Column(String(50), default="")
    email = Column(String(200), default="")
    tax_rate = Column(Float, default=11.5)
    currency = Column(String(10), default="USD")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
