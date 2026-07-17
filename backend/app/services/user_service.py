from typing import Optional
from uuid import UUID

from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.db.models.user import User, UserRole
from app.repositories.user_repository import UserRepository


class InvalidEnumValueError(Exception):
    pass


class UserService:
    def __init__(self, db: Session):
        self.repo = UserRepository(db)

    def get_by_id(self, user_id: UUID) -> Optional[User]:
        return self.repo.get_by_id(user_id)

    def get_all(self, skip: int = 0, limit: int = 100) -> list[User]:
        return self.repo.get_all(skip, limit)

    def create(self, username: str, email: str, password: str, full_name: str, role: str = "waiter") -> User:
        try:
            role_enum = UserRole(role)
        except ValueError:
            raise InvalidEnumValueError(f"Invalid role: {role}. Must be one of: {[e.value for e in UserRole]}")
        hashed = get_password_hash(password)
        user = User(
            username=username,
            email=email,
            hashed_password=hashed,
            full_name=full_name,
            role=role_enum,
        )
        return self.repo.create(user)

    def update(self, user_id: UUID, data: dict) -> Optional[User]:
        user = self.repo.get_by_id(user_id)
        if not user:
            return None
        for key, value in data.items():
            if value is not None and hasattr(user, key):
                if key == "role":
                    try:
                        value = UserRole(value)
                    except ValueError:
                        raise InvalidEnumValueError(f"Invalid role: {value}. Must be one of: {[e.value for e in UserRole]}")
                setattr(user, key, value)
        return self.repo.update(user)

    def delete(self, user_id: UUID) -> bool:
        user = self.repo.get_by_id(user_id)
        if not user:
            return False
        self.repo.delete(user)
        return True
