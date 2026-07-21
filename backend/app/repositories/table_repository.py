from typing import Optional
from uuid import UUID

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.db.models.table import Table, TableStatus


class TableRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, table_id: UUID) -> Optional[Table]:
        return self.db.query(Table).filter(Table.id == table_id).first()

    def get_by_number(self, number: int) -> Optional[Table]:
        return self.db.query(Table).filter(Table.number == number).first()

    def get_available(self) -> list[Table]:
        return self.db.query(Table).filter(Table.status == TableStatus.AVAILABLE).all()

    def get_all(self, skip: int = 0, limit: int = 100) -> list[Table]:
        return self.db.query(Table).offset(skip).limit(limit).all()

    def get_status_summary(self) -> dict:
        total = self.db.query(func.count(Table.id)).scalar() or 0
        available = self.db.query(func.count(Table.id)).filter(
            Table.status == TableStatus.AVAILABLE
        ).scalar() or 0
        occupied = self.db.query(func.count(Table.id)).filter(
            Table.status == TableStatus.OCCUPIED
        ).scalar() or 0
        reserved = self.db.query(func.count(Table.id)).filter(
            Table.status == TableStatus.RESERVED
        ).scalar() or 0
        return {
            "available": available,
            "occupied": occupied,
            "reserved": reserved,
            "total": total,
        }

    def create(self, table: Table) -> Table:
        self.db.add(table)
        self.db.commit()
        self.db.refresh(table)
        return table

    def update(self, table: Table) -> Table:
        self.db.commit()
        self.db.refresh(table)
        return table

    def delete(self, table: Table) -> None:
        self.db.delete(table)
        self.db.commit()
