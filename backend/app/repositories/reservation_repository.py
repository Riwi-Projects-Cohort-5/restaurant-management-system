from datetime import datetime
from typing import Optional

from sqlalchemy.orm import Session

from app.db.models.reservation import Reservation


class ReservationRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, reservation_id: str) -> Optional[Reservation]:
        return self.db.query(Reservation).filter(Reservation.id == reservation_id).first()

    def get_by_customer(self, customer_id: str) -> list[Reservation]:
        return self.db.query(Reservation).filter(Reservation.customer_id == customer_id).all()

    def get_by_table_and_date(self, table_id: str, date: datetime) -> list[Reservation]:
        return self.db.query(Reservation).filter(
            Reservation.table_id == table_id,
            Reservation.reservation_date == date,
        ).all()

    def get_all(self, skip: int = 0, limit: int = 100) -> list[Reservation]:
        return self.db.query(Reservation).offset(skip).limit(limit).all()

    def create(self, reservation: Reservation) -> Reservation:
        self.db.add(reservation)
        self.db.commit()
        self.db.refresh(reservation)
        return reservation

    def update(self, reservation: Reservation) -> Reservation:
        self.db.commit()
        self.db.refresh(reservation)
        return reservation

    def delete(self, reservation: Reservation) -> None:
        self.db.delete(reservation)
        self.db.commit()
