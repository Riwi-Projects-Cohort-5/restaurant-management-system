from typing import Optional
from uuid import UUID

from sqlalchemy.orm import Session

from app.db.models.kitchen_order import KitchenOrder, KitchenOrderStatus


class KitchenRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, kitchen_order_id: UUID) -> Optional[KitchenOrder]:
        return self.db.query(KitchenOrder).filter(KitchenOrder.id == kitchen_order_id).first()

    def get_by_order(self, order_id: UUID) -> list[KitchenOrder]:
        return self.db.query(KitchenOrder).filter(KitchenOrder.order_id == order_id).all()

    def get_pending(self) -> list[KitchenOrder]:
        return self.db.query(KitchenOrder).filter(
            KitchenOrder.status == KitchenOrderStatus.PENDING
        ).order_by(KitchenOrder.priority.desc()).all()

    def get_in_progress(self) -> list[KitchenOrder]:
        return self.db.query(KitchenOrder).filter(
            KitchenOrder.status == KitchenOrderStatus.PREPARING
        ).all()

    def create(self, kitchen_order: KitchenOrder) -> KitchenOrder:
        self.db.add(kitchen_order)
        self.db.commit()
        self.db.refresh(kitchen_order)
        return kitchen_order

    def update(self, kitchen_order: KitchenOrder) -> KitchenOrder:
        self.db.commit()
        self.db.refresh(kitchen_order)
        return kitchen_order
