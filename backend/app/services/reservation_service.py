from datetime import datetime
from typing import Optional
from uuid import UUID

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db.models.reservation import Reservation, ReservationStatus, generate_reservation_id
from app.db.models.table import Table, TableStatus
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

    def create(self, customer_id: Optional[str] = None, table_id: Optional[str] = None,
               reservation_date: Optional[datetime] = None, guest_count: int = 1,
               guest_name: Optional[str] = None, guest_phone: Optional[str] = None,
               notes: Optional[str] = None) -> Reservation:
        reservation_id = generate_reservation_id(self.db)
        reservation = Reservation(
            id=reservation_id,
            customer_id=customer_id, table_id=table_id,
            guest_name=guest_name, guest_phone=guest_phone,
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

    def confirm_with_table(self, reservation_id: str, table_id: UUID) -> Optional[Reservation]:
        reservation = self.repo.get_by_id(reservation_id)
        if not reservation:
            return None

        table = self.db.query(Table).filter(Table.id == table_id).first()
        if not table:
            return None

        if table.status != TableStatus.AVAILABLE:
            raise ValueError(f"Table {table.number} is not available (status: {table.status.value})")

        reservation.table_id = table_id
        reservation.status = ReservationStatus.CONFIRMED
        table.status = TableStatus.RESERVED

        self.db.commit()
        self.db.refresh(reservation)
        self.db.refresh(table)
        return reservation

    def cancel(self, reservation_id: str) -> bool:
        reservation = self.repo.get_by_id(reservation_id)
        if not reservation:
            return False

        if reservation.table_id:
            table = self.db.query(Table).filter(Table.id == reservation.table_id).first()
            if table and table.status == TableStatus.RESERVED:
                table.status = TableStatus.AVAILABLE
                self.db.flush()

        reservation.status = ReservationStatus.CANCELLED
        self.repo.update(reservation)
        return True

    def delete(self, reservation_id: str) -> bool:
        reservation = self.repo.get_by_id(reservation_id)
        if not reservation:
            return False

        if reservation.table_id:
            table = self.db.query(Table).filter(Table.id == reservation.table_id).first()
            if table and table.status == TableStatus.RESERVED:
                table.status = TableStatus.AVAILABLE
                self.db.flush()

        try:
            self.repo.delete(reservation)
        except IntegrityError:
            self.db.rollback()
            raise ValueError("No se puede eliminar: la reservación tiene órdenes vinculadas. Cancela primero las órdenes asociadas.")
        return True
