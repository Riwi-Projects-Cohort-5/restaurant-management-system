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
    customer_id = Column(String(30), ForeignKey("customers.id"), nullable=True)
    table_id = Column(UUID(as_uuid=True), ForeignKey("tables.id"), nullable=True)
    guest_name = Column(String(100), nullable=True)
    guest_phone = Column(String(20), nullable=True)
    reservation_date = Column(DateTime(timezone=True), nullable=False)
    guest_count = Column(Integer, nullable=False)
    status = Column(SAEnum(ReservationStatus, name="reservationstatus", create_type=False, values_callable=lambda x: [e.value for e in x]), nullable=False, default=ReservationStatus.PENDING)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    customer = relationship("Customer", back_populates="reservations")
    table = relationship("Table", back_populates="reservations")
    orders = relationship("Order", back_populates="reservation")


def generate_reservation_id(db) -> str:
    from sqlalchemy.exc import IntegrityError

    for _ in range(5):
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

        reservation_id = f"{prefix}{new_num:04d}"
        try:
            db.flush()
            return reservation_id
        except IntegrityError:
            db.rollback()
            continue

    raise ValueError("No se pudo generar un ID de reservación único después de varios intentos.")
