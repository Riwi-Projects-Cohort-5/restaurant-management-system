from typing import Optional

from sqlalchemy.orm import Session

from app.repositories.user_repository import UserRepository
from app.core.security import verify_password, create_access_token, get_password_hash
from app.db.models.user import User


class AuthService:
    def __init__(self, db: Session):
        self.repo = UserRepository(db)

    def authenticate(self, username: str, password: str) -> Optional[str]:
        user = self.repo.get_by_username(username)
        if not user or not verify_password(password, user.hashed_password):
            return None
        return create_access_token(data={"sub": str(user.id), "role": user.role.value})

    def register(self, username: str, email: str, password: str, full_name: str, role: str = "waiter") -> User:
        hashed = get_password_hash(password)
        user = User(
            username=username,
            email=email,
            hashed_password=hashed,
            full_name=full_name,
            role=role,
        )
        return self.repo.create(user)
