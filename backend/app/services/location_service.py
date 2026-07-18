from typing import Optional
from uuid import UUID

from sqlalchemy.orm import Session

from app.db.models.location import Location
from app.repositories.location_repository import LocationRepository


class LocationService:
    def __init__(self, db: Session):
        self.repo = LocationRepository(db)

    def get_by_id(self, location_id: UUID) -> Optional[Location]:
        return self.repo.get_by_id(location_id)

    def get_by_name(self, name: str) -> Optional[Location]:
        return self.repo.get_by_name(name)

    def get_all(self, skip: int = 0, limit: int = 100) -> list[Location]:
        return self.repo.get_all(skip, limit)

    def create(self, name: str) -> Location:
        location = Location(name=name)
        return self.repo.create(location)

    def update(self, location_id: UUID, data: dict) -> Optional[Location]:
        location = self.repo.get_by_id(location_id)
        if not location:
            return None
        for key, value in data.items():
            if value is not None and hasattr(location, key):
                setattr(location, key, value)
        return self.repo.update(location)

    def delete(self, location_id: UUID) -> bool:
        location = self.repo.get_by_id(location_id)
        if not location:
            return False
        self.repo.delete(location)
        return True
