
from sqlalchemy.orm import Session

from app.db.models.setting import Setting
from app.repositories.setting_repository import SettingRepository


class SettingService:
    def __init__(self, db: Session):
        self.repo = SettingRepository(db)

    def get(self) -> Setting:
        return self.repo.get_or_create()

    def update(self, data: dict) -> Setting:
        setting = self.repo.get_or_create()
        for key, value in data.items():
            if value is not None and hasattr(setting, key):
                setattr(setting, key, value)
        return self.repo.update(setting)
