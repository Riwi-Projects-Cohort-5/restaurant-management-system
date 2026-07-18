from typing import Optional
from uuid import UUID

from sqlalchemy.orm import Session

from app.db.models.location import Location


class LocationRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, location_id: UUID) -> Optional[Location]:
        return self.db.query(Location).filter(Location.id == location_id).first()

    def get_by_name(self, name: str) -> Optional[Location]:
        return self.db.query(Location).filter(Location.name == name).first()

    def name_exists_for_other(self, name: str, exclude_id: UUID) -> bool:
        return self.db.query(Location).filter(Location.name == name, Location.id != exclude_id).first() is not None

    def get_all(self, skip: int = 0, limit: int = 100) -> list[Location]:
        return self.db.query(Location).offset(skip).limit(limit).all()

    def create(self, location: Location) -> Location:
        self.db.add(location)
        self.db.commit()
        self.db.refresh(location)
        return location

    def update(self, location: Location) -> Location:
        self.db.commit()
        self.db.refresh(location)
        return location

    def delete(self, location: Location) -> None:
        self.db.delete(location)
        self.db.commit()
