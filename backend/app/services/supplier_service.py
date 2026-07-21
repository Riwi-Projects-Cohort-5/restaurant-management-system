from typing import Optional
from uuid import UUID

from sqlalchemy.orm import Session

from app.db.models.supplier import Supplier
from app.repositories.supplier_repository import SupplierRepository


class SupplierService:
    def __init__(self, db: Session):
        self.repo = SupplierRepository(db)

    def get_by_id(self, supplier_id: UUID) -> Optional[Supplier]:
        return self.repo.get_by_id(supplier_id)

    def get_active(self) -> list[Supplier]:
        return self.repo.get_active()

    def get_all(self, skip: int = 0, limit: int = 100) -> list[Supplier]:
        return self.repo.get_all(skip, limit)

    def create(self, name: str, phone: Optional[str] = None,
               email: Optional[str] = None, address: Optional[str] = None) -> Supplier:
        supplier = Supplier(name=name, phone=phone, email=email, address=address)
        return self.repo.create(supplier)

    def update(self, supplier_id: UUID, data: dict) -> Optional[Supplier]:
        supplier = self.repo.get_by_id(supplier_id)
        if not supplier:
            return None
        for key, value in data.items():
            if value is not None and hasattr(supplier, key):
                setattr(supplier, key, value)
        return self.repo.update(supplier)

    def delete(self, supplier_id: UUID) -> bool:
        supplier = self.repo.get_by_id(supplier_id)
        if not supplier:
            return False
        self.repo.delete(supplier)
        return True
