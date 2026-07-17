from datetime import datetime

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.db.models.menu_item import MenuItem
from app.db.models.order import Order
from app.db.models.order_item import OrderItem
from app.db.models.payment import Payment, PaymentStatus


class ReportRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_sales(self, start_date: datetime, end_date: datetime) -> dict:
        result = self.db.query(
            func.coalesce(func.sum(Payment.amount), 0).label("total_revenue"),
            func.count(func.distinct(Order.id)).label("total_orders"),
        ).join(Order, Payment.order_id == Order.id).filter(
            Payment.status == PaymentStatus.COMPLETED,
            Payment.created_at >= start_date,
            Payment.created_at <= end_date,
        ).first()
        return {
            "total_revenue": result.total_revenue,
            "total_orders": result.total_orders,
            "start_date": start_date,
            "end_date": end_date,
        }

    def get_top_products(self, start_date: datetime, end_date: datetime, limit: int = 10) -> list[dict]:
        results = self.db.query(
            MenuItem.name.label("menu_item_name"),
            func.sum(OrderItem.quantity).label("total_quantity"),
            func.sum(OrderItem.subtotal).label("total_revenue"),
        ).join(OrderItem, MenuItem.id == OrderItem.menu_item_id
        ).join(Order, OrderItem.order_id == Order.id
        ).join(Payment, Payment.order_id == Order.id).filter(
            Payment.status == PaymentStatus.COMPLETED,
            Payment.created_at >= start_date,
            Payment.created_at <= end_date,
        ).group_by(MenuItem.name).order_by(
            func.sum(OrderItem.quantity).desc()
        ).limit(limit).all()
        return [
            {
                "menu_item_name": r.menu_item_name,
                "total_quantity": r.total_quantity,
                "total_revenue": r.total_revenue,
            }
            for r in results
        ]
