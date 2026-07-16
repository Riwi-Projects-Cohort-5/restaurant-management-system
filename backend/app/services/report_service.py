from datetime import datetime

from sqlalchemy.orm import Session

from app.repositories.report_repository import ReportRepository


class ReportService:
    def __init__(self, db: Session):
        self.repo = ReportRepository(db)

    def get_sales(self, start_date: datetime, end_date: datetime) -> dict:
        return self.repo.get_sales(start_date, end_date)

    def get_top_products(
        self, start_date: datetime, end_date: datetime, limit: int = 10
    ) -> list[dict]:
        return self.repo.get_top_products(start_date, end_date, limit)
