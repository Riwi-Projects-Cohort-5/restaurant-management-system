from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.db.schemas.location import LocationCreate, LocationOut, LocationUpdate
from app.services.location_service import LocationService

router = APIRouter(prefix="/locations", tags=["Locations"])


@router.get("/", response_model=List[LocationOut])
def obtener_todas_las_ubicaciones(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    service = LocationService(db)
    return service.get_all(skip=skip, limit=limit)


@router.get("/{location_id}", response_model=LocationOut)
def obtener_ubicacion_por_id(location_id: UUID, db: Session = Depends(get_db)):
    service = LocationService(db)
    location = service.get_by_id(location_id)
    if not location:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ubicación con id {location_id} no encontrada",
        )
    return location


@router.post("/", response_model=LocationOut, status_code=status.HTTP_201_CREATED)
def crear_ubicacion(
    data: LocationCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = LocationService(db)
    existing = service.get_by_name(data.name)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Ya existe una ubicación con el nombre '{data.name}'",
        )
    return service.create(name=data.name)


@router.put("/{location_id}", response_model=LocationOut)
def actualizar_ubicacion(
    location_id: UUID,
    data: LocationUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = LocationService(db)
    updated = service.update(location_id, data.model_dump(exclude_none=True))
    if updated == "conflict":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Ya existe una ubicación con el nombre '{data.name}'",
        )
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ubicación con id {location_id} no encontrada",
        )
    return updated


@router.delete("/{location_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_ubicacion(
    location_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    service = LocationService(db)
    deleted = service.delete(location_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ubicación con id {location_id} no encontrada",
        )
