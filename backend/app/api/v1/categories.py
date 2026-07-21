"""

Módulo   : categories.py
Ruta     : backend/app/api/v1/categories.py
Responsable: Diego
Descripción: Endpoints REST para la gestión de categorías
            del menú. Las categorías agrupan los items del
            menú (ej: Entradas, Platos principales, Bebidas).
            Los GET son públicos; escritura requiere auth.
Fecha    : 2026-07-16

"""

from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.db.schemas.category import CategoryCreate, CategoryOut, CategoryUpdate
from app.services.category_service import CategoryService

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.get("/", response_model=List[CategoryOut])
def obtener_todas_las_categorias(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Retorna todas las categorías del menú con paginación.
    No requiere autenticación — endpoint público.
    """
    service = CategoryService(db)
    return service.get_all(skip=skip, limit=limit)


@router.get("/{category_id}", response_model=CategoryOut)
def obtener_categoria_por_id(
    category_id: UUID,
    db: Session = Depends(get_db)
):
    """
    Retorna una categoría específica por su ID.
    No requiere autenticación — endpoint público.

    Lanza:
        HTTPException 404 si la categoría no existe.
    """
    service = CategoryService(db)
    category = service.get_by_id(category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Categoría con id {category_id} no encontrada"
        )
    return category


@router.post("/", response_model=CategoryOut, status_code=status.HTTP_201_CREATED)
def crear_categoria(
    data: CategoryCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Crea una nueva categoría de menú. Requiere autenticación.

    Args:
        data: CategoryCreate con nombre y descripción opcional.

    Retorna:
        CategoryOut con los datos de la categoría creada.
        Código HTTP 201 Created.
    """
    service = CategoryService(db)
    # El service recibe parámetros separados, no el objeto completo
    return service.create(
        name=data.name,
        description=data.description
    )


@router.put("/{category_id}", response_model=CategoryOut)
def actualizar_categoria(
    category_id: UUID,
    data: CategoryUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Actualiza los datos de una categoría existente.
    Requiere autenticación.

    Lanza:
        HTTPException 404 si la categoría no existe.
    """
    service = CategoryService(db)
    updated = service.update(category_id, data.model_dump(exclude_none=True))
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Categoría con id {category_id} no encontrada"
        )
    return updated


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_categoria(
    category_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Elimina una categoría por su ID. Requiere autenticación.

    Lanza:
        HTTPException 404 si la categoría no existe.
    """
    service = CategoryService(db)
    deleted = service.delete(category_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Categoría con id {category_id} no encontrada"
        )