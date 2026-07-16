from typing import Optional
from datetime import datetime

from sqlalchemy.orm import Session

from app.db.models.reservation import Reservation, ReservationStatus, generate_reservation_id
from app.repositories.reservation_repository import ReservationRepository


class InvalidEnumValueError(Exception):
    pass


class ReservationService:
    def __init__(self, db: Session):
        self.repo = ReservationRepository(db)
        self.db = db

    def get_by_id(self, reservation_id: str) -> Optional[Reservation]:
        return self.repo.get_by_id(reservation_id)

    def get_by_customer(self, customer_id: str) -> list[Reservation]:
        return self.repo.get_by_customer(customer_id)

    def get_all(self, skip: int = 0, limit: int = 100) -> list[Reservation]:
        return self.repo.get_all(skip, limit)

    def create(self, customer_id: str, table_id: str, reservation_date: datetime,
               guest_count: int, notes: Optional[str] = None) -> Reservation:
        reservation_id = generate_reservation_id(self.db)
        reservation = Reservation(
            id=reservation_id,
            customer_id=customer_id, table_id=table_id,
            reservation_date=reservation_date, guest_count=guest_count,
            notes=notes,
        )
        return self.repo.create(reservation)

    def update(self, reservation_id: str, data: dict) -> Optional[Reservation]:
        reservation = self.repo.get_by_id(reservation_id)
        if not reservation:
            return None
        for key, value in data.items():
            if value is not None and hasattr(reservation, key):
                if key == "status":
                    try:
                        value = ReservationStatus(value)
                    except ValueError:
                        raise InvalidEnumValueError(f"Invalid status: {value}. Must be one of: {[e.value for e in ReservationStatus]}")
                setattr(reservation, key, value)
        return self.repo.update(reservation)

    def cancel(self, reservation_id: str) -> bool:
        reservation = self.repo.get_by_id(reservation_id)
        if not reservation:
            return False
        reservation.status = ReservationStatus.CANCELLED
        self.repo.update(reservation)
        return True
