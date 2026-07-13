from uuid import UUID
from typing import Optional
from datetime import datetime

from sqlalchemy.orm import Session

from app.db.models.reservation import Reservation, ReservationStatus
from app.repositories.reservation_repository import ReservationRepository


class ReservationService:
    def __init__(self, db: Session):
        self.repo = ReservationRepository(db)

    def get_by_id(self, reservation_id: UUID) -> Optional[Reservation]:
        return self.repo.get_by_id(reservation_id)

    def get_by_user(self, user_id: UUID) -> list[Reservation]:
        return self.repo.get_by_user(user_id)

    def get_all(self, skip: int = 0, limit: int = 100) -> list[Reservation]:
        return self.repo.get_all(skip, limit)

    def create(self, user_id: UUID, table_id: UUID, reservation_date: datetime,
               guest_count: int, notes: Optional[str] = None) -> Reservation:
        reservation = Reservation(
            user_id=user_id, table_id=table_id,
            reservation_date=reservation_date, guest_count=guest_count,
            notes=notes,
        )
        return self.repo.create(reservation)

    def update(self, reservation_id: UUID, data: dict) -> Optional[Reservation]:
        reservation = self.repo.get_by_id(reservation_id)
        if not reservation:
            return None
        for key, value in data.items():
            if value is not None and hasattr(reservation, key):
                if key == "status":
                    value = ReservationStatus(value)
                setattr(reservation, key, value)
        return self.repo.update(reservation)

    def cancel(self, reservation_id: UUID) -> bool:
        reservation = self.repo.get_by_id(reservation_id)
        if not reservation:
            return False
        reservation.status = ReservationStatus.CANCELLED
        self.repo.update(reservation)
        return True
