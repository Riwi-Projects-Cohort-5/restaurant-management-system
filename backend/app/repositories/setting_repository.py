from typing import Optional

from sqlalchemy.orm import Session

from app.db.models.setting import Setting


class SettingRepository:
    def __init__(self, db: Session):
        self.db = db

    def get(self) -> Optional[Setting]:
        return self.db.query(Setting).first()

    def get_or_create(self) -> Setting:
        setting = self.db.query(Setting).first()
        if not setting:
            setting = Setting(id="default")
            self.db.add(setting)
            self.db.commit()
            self.db.refresh(setting)
        return setting

    def update(self, setting: Setting) -> Setting:
        self.db.commit()
        self.db.refresh(setting)
        return setting
