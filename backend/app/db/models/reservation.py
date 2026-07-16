import enum
from datetime import date, datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy import Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.database import Base


class ReservationStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"


class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(String(30), primary_key=True)
    customer_id = Column(String(30), ForeignKey("customers.id"), nullable=False)
    table_id = Column(UUID(as_uuid=True), ForeignKey("tables.id"), nullable=True)
    reservation_date = Column(DateTime(timezone=True), nullable=False)
    guest_count = Column(Integer, nullable=False)
    status = Column(
        SAEnum(
            "pending", "confirmed", "cancelled", "completed",
            name="reservationstatus", create_type=False,
        ),
        nullable=False, default="pending",
    )
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    customer = relationship("Customer", back_populates="reservations")
    table = relationship("Table", back_populates="reservations")


def generate_reservation_id(db) -> str:
    today = date.today()
    date_str = today.strftime("%Y%m%d")
    prefix = f"RF-{date_str}-"

    last = (
        db.query(Reservation)
        .filter(Reservation.id.like(f"{prefix}%"))
        .order_by(Reservation.id.desc())
        .first()
    )

    if last:
        last_num = int(last.id.split("-")[-1])
        new_num = last_num + 1
    else:
        new_num = 1

    return f"{prefix}{new_num:04d}"
