from typing import Optional
from uuid import UUID

from sqlalchemy.orm import Session

from app.db.models.purchase import Purchase


class PurchaseRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, purchase_id: UUID) -> Optional[Purchase]:
        return self.db.query(Purchase).filter(Purchase.id == purchase_id).first()

    def get_by_supplier(self, supplier_id: UUID) -> list[Purchase]:
        return self.db.query(Purchase).filter(Purchase.supplier_id == supplier_id).all()

    def get_all(self, skip: int = 0, limit: int = 100) -> list[Purchase]:
        return self.db.query(Purchase).offset(skip).limit(limit).all()

    def create(self, purchase: Purchase) -> Purchase:
        self.db.add(purchase)
        self.db.commit()
        self.db.refresh(purchase)
        return purchase

    def update(self, purchase: Purchase) -> Purchase:
        self.db.commit()
        self.db.refresh(purchase)
        return purchase
