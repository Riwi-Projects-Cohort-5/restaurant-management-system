from uuid import UUID
from typing import Optional
from decimal import Decimal

from sqlalchemy.orm import Session

from app.db.models.purchase import Purchase
from app.db.models.purchase_detail import PurchaseDetail
from app.repositories.purchase_repository import PurchaseRepository


class PurchaseService:
    def __init__(self, db: Session):
        self.repo = PurchaseRepository(db)
        self.db = db

    def get_by_id(self, purchase_id: UUID) -> Optional[Purchase]:
        return self.repo.get_by_id(purchase_id)

    def get_by_supplier(self, supplier_id: UUID) -> list[Purchase]:
        return self.repo.get_by_supplier(supplier_id)

    def get_all(self, skip: int = 0, limit: int = 100) -> list[Purchase]:
        return self.repo.get_all(skip, limit)

    def create(self, supplier_id: UUID, details: list[dict] = None,
               notes: Optional[str] = None) -> Purchase:
        total = Decimal("0")
        purchase_details = []
        if details:
            for d in details:
                qty = Decimal(str(d["quantity"]))
                cost = Decimal(str(d.get("unit_cost", 0)))
                subtotal = qty * cost
                total += subtotal
                purchase_details.append(PurchaseDetail(
                    ingredient_id=d["ingredient_id"],
                    quantity=qty,
                    unit_cost=cost,
                    subtotal=subtotal,
                ))

        purchase = Purchase(
            supplier_id=supplier_id,
            total=total,
            notes=notes,
        )
        purchase.purchase_details = purchase_details
        return self.repo.create(purchase)

    def update_status(self, purchase_id: UUID, status: str) -> Optional[Purchase]:
        purchase = self.repo.get_by_id(purchase_id)
        if not purchase:
            return None
        purchase.status = status
        return self.repo.update(purchase)
