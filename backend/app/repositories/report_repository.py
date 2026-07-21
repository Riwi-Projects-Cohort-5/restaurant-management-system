from datetime import datetime, timezone

from sqlalchemy import Date, cast, func
from sqlalchemy.orm import Session

from app.db.models.menu_item import MenuItem
from app.db.models.order import Order
from app.db.models.order_item import OrderItem
from app.db.models.payment import Payment, PaymentStatus
from app.db.models.reservation import Reservation, ReservationStatus
from app.db.models.table import Table, TableStatus


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

    def get_daily_sales(self, start_date: datetime, end_date: datetime) -> list[dict]:
        results = self.db.query(
            cast(Payment.created_at, Date).label("date"),
            func.coalesce(func.sum(Payment.amount), 0).label("revenue"),
            func.count(func.distinct(Order.id)).label("orders"),
        ).join(Order, Payment.order_id == Order.id).filter(
            Payment.status == PaymentStatus.COMPLETED,
            Payment.created_at >= start_date,
            Payment.created_at <= end_date,
        ).group_by(cast(Payment.created_at, Date)).order_by(
            cast(Payment.created_at, Date)
        ).all()
        return [
            {
                "date": str(r.date),
                "revenue": float(r.revenue),
                "orders": r.orders,
            }
            for r in results
        ]

    def get_today_stats(self) -> dict:
        today = datetime.now(timezone.utc).date()
        today_start = datetime.combine(today, datetime.min.time()).replace(tzinfo=timezone.utc)
        today_end = datetime.combine(today, datetime.max.time()).replace(tzinfo=timezone.utc)

        sales = self.db.query(
            func.coalesce(func.sum(Payment.amount), 0).label("revenue"),
            func.count(func.distinct(Order.id)).label("orders"),
        ).join(Order, Payment.order_id == Order.id).filter(
            Payment.status == PaymentStatus.COMPLETED,
            Payment.created_at >= today_start,
            Payment.created_at <= today_end,
        ).first()

        active_tables = self.db.query(func.count(Table.id)).filter(
            Table.status == TableStatus.OCCUPIED
        ).scalar()

        total_tables = self.db.query(func.count(Table.id)).scalar()

        reservations_today = self.db.query(func.count(Reservation.id)).filter(
            Reservation.reservation_date >= today_start,
            Reservation.reservation_date <= today_end,
            Reservation.status.in_([
                ReservationStatus.CONFIRMED,
                ReservationStatus.PENDING,
            ]),
        ).scalar()

        return {
            "revenue": float(sales.revenue) if sales.revenue else 0.0,
            "orders": sales.orders,
            "active_tables": active_tables or 0,
            "total_tables": total_tables or 0,
            "reservations": reservations_today or 0,
        }
