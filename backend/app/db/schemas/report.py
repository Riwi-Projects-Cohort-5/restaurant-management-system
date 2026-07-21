from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel


class ReportSales(BaseModel):
    total_revenue: Decimal
    total_orders: int
    start_date: datetime
    end_date: datetime


class ReportTopProducts(BaseModel):
    menu_item_name: str
    total_quantity: int
    total_revenue: Decimal


class ReportDailySales(BaseModel):
    date: str
    revenue: float
    orders: int


class ReportTodayStats(BaseModel):
    revenue: float
    orders: int
    active_tables: int
    total_tables: int
    reservations: int
