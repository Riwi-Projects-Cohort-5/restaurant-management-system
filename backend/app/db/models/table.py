import enum
import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Integer
from sqlalchemy import Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.database import Base


class TableStatus(str, enum.Enum):
    AVAILABLE = "available"
    OCCUPIED = "occupied"
    RESERVED = "reserved"
    MAINTENANCE = "maintenance"


class Table(Base):
    __tablename__ = "tables"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    number = Column(Integer, unique=True, nullable=False)
    capacity = Column(Integer, nullable=False)
    status = Column(SAEnum("available", "occupied", "reserved", "maintenance", name="tablestatus", create_type=False), nullable=False, default="available")
    location_id = Column(UUID(as_uuid=True), ForeignKey("locations.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    location_ref = relationship("Location", back_populates="tables", foreign_keys=[location_id])
    reservations = relationship("Reservation", back_populates="table")
    orders = relationship("Order", back_populates="table")
