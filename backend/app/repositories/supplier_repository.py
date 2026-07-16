from uuid import UUID
from typing import Optional

from sqlalchemy.orm import Session

from app.db.models.supplier import Supplier


class SupplierRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, supplier_id: UUID) -> Optional[Supplier]:
        return self.db.query(Supplier).filter(Supplier.id == supplier_id).first()

    def get_active(self) -> list[Supplier]:
        return self.db.query(Supplier).filter(Supplier.is_active.is_(True)).all()

    def get_all(self, skip: int = 0, limit: int = 100) -> list[Supplier]:
        return self.db.query(Supplier).offset(skip).limit(limit).all()

    def create(self, supplier: Supplier) -> Supplier:
        self.db.add(supplier)
        self.db.commit()
        self.db.refresh(supplier)
        return supplier

    def update(self, supplier: Supplier) -> Supplier:
        self.db.commit()
        self.db.refresh(supplier)
        return supplier

    def delete(self, supplier: Supplier) -> None:
        self.db.delete(supplier)
        self.db.commit()
