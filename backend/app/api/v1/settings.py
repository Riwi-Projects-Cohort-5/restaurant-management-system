from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.db.schemas.setting import SettingOut, SettingUpdate
from app.services.setting_service import SettingService

router = APIRouter(prefix="/settings", tags=["Settings"])


@router.get("/", response_model=SettingOut)
def obtener_configuracion(
    db: Session = Depends(get_db),
):
    service = SettingService(db)
    return service.get()


@router.put("/", response_model=SettingOut)
def actualizar_configuracion(
    data: SettingUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = SettingService(db)
    return service.update(data.model_dump(exclude_none=True))
