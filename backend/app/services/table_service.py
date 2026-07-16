from uuid import UUID
from typing import Optional

from sqlalchemy.orm import Session

from app.db.models.table import Table, TableStatus
from app.repositories.table_repository import TableRepository


class InvalidEnumValueError(Exception):
    pass


class TableService:
    def __init__(self, db: Session):
        self.repo = TableRepository(db)

    def get_by_id(self, table_id: UUID) -> Optional[Table]:
        return self.repo.get_by_id(table_id)

    def get_available(self) -> list[Table]:
        return self.repo.get_available()

    def get_all(self, skip: int = 0, limit: int = 100) -> list[Table]:
        return self.repo.get_all(skip, limit)

    def create(self, number: int, capacity: int, location: Optional[str] = None) -> Table:
        table = Table(number=number, capacity=capacity, location=location)
        return self.repo.create(table)

    def update(self, table_id: UUID, data: dict) -> Optional[Table]:
        table = self.repo.get_by_id(table_id)
        if not table:
            return None
        for key, value in data.items():
            if value is not None and hasattr(table, key):
                if key == "status":
                    try:
                        value = TableStatus(value)
                    except ValueError:
                        raise InvalidEnumValueError(f"Invalid status: {value}. Must be one of: {[e.value for e in TableStatus]}")
                setattr(table, key, value)
        return self.repo.update(table)

    def delete(self, table_id: UUID) -> bool:
        table = self.repo.get_by_id(table_id)
        if not table:
            return False
        self.repo.delete(table)
        return True
