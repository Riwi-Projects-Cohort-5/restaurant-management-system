
"""
=============================================================
Módulo   : menu.py
Ruta     : backend/app/api/v1/menu.py
Responsable: Diego
Descripción: Endpoints REST para la gestión del menú del
            restaurante. Permite listar, filtrar, crear,
            actualizar y eliminar items del menú.
            Los endpoints de lectura son públicos.
            Los endpoints de escritura requieren autenticación.
Fecha    : 2026-07-14
=============================================================
"""

from uuid import UUID
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

# Importamos la función que provee la sesión de base de datos
from app.db.database import get_db

# Importamos la dependencia de autenticación JWT
from app.core.dependencies import get_current_user

# Importamos el servicio que contiene la lógica de negocio del menú
from app.services.menu_item_service import MenuItemService

# Importamos los schemas de validación de datos (Pydantic)
from app.db.schemas.menu_item import MenuItemCreate, MenuItemUpdate, MenuItemOut

# Creamos el router con su prefijo y etiqueta para la documentación automática
router = APIRouter(prefix="/menu", tags=["Menu"])


@router.get("/available", response_model=List[MenuItemOut])
def obtener_items_disponibles(db: Session = Depends(get_db)):
    """
    Retorna únicamente los items del menú que están disponibles.
    No requiere autenticación — endpoint público.

    Retorna:
        Lista de MenuItemOut con los items disponibles.

    Nota: Esta ruta debe ir ANTES de /{item_id} para que FastAPI
    no la interprete como un parámetro de ruta.
    """
    service = MenuItemService(db)
    return service.get_available()


@router.get("/category/{category_id}", response_model=List[MenuItemOut])
def obtener_items_por_categoria(category_id: UUID, db: Session = Depends(get_db)):
    """
    Filtra y retorna los items del menú que pertenecen
    a una categoría específica.
    No requiere autenticación — endpoint público.

    Args:
        category_id: UUID de la categoría a filtrar.

    Retorna:
        Lista de MenuItemOut con los items de esa categoría.
    """
    service = MenuItemService(db)
    return service.get_by_category(category_id)


@router.get("/", response_model=List[MenuItemOut])
def obtener_todos_los_items(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Retorna todos los items del menú con paginación opcional.
    No requiere autenticación — endpoint público.

    Args:
        skip : Número de registros a omitir (para paginación).
        limit: Máximo de registros a retornar.

    Retorna:
        Lista de MenuItemOut con todos los items del menú.
    """
    service = MenuItemService(db)
    return service.get_all(skip=skip, limit=limit)


@router.get("/{item_id}", response_model=MenuItemOut)
def obtener_item_por_id(item_id: UUID, db: Session = Depends(get_db)):
    """
    Busca y retorna un item del menú por su ID único.
    No requiere autenticación — endpoint público.

    Args:
        item_id: UUID del item a buscar.

    Retorna:
        MenuItemOut con los datos del item encontrado.

    Lanza:
        HTTPException 404 si el item no existe.
    """
    service = MenuItemService(db)
    item = service.get_by_id(item_id)

    # Si el servicio retorna None, el item no existe en la BD
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item con id {item_id} no encontrado"
        )
    return item


@router.post("/", response_model=MenuItemOut, status_code=status.HTTP_201_CREATED)
def crear_item(
    data: MenuItemCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)  # Protegido: requiere JWT válido
):
    """
    Crea un nuevo item en el menú del restaurante.
    Requiere autenticación — solo usuarios autenticados pueden crear items.

    Args:
        data: MenuItemCreate con los datos del nuevo item
            (name, price, category_id, description, image_url).

    Retorna:
        MenuItemOut con los datos del item recién creado.
        Código HTTP 201 Created.
    """
    service = MenuItemService(db)
    return service.create(
        name=data.name,
        price=data.price,
        category_id=data.category_id,
        description=data.description,
        image_url=data.image_url
    )


@router.put("/{item_id}", response_model=MenuItemOut)
def actualizar_item(
    item_id: UUID,
    data: MenuItemUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)  # Protegido: requiere JWT válido
):
    """
    Actualiza los datos de un item existente en el menú.
    Requiere autenticación — solo usuarios autenticados pueden editar.

    Args:
        item_id: UUID del item a actualizar.
        data   : MenuItemUpdate con los campos a modificar
                (todos opcionales — solo se actualizan los enviados).

    Retorna:
        MenuItemOut con los datos actualizados del item.

    Lanza:
        HTTPException 404 si el item no existe.
    """
    service = MenuItemService(db)

    # Convertimos el schema a dict, excluyendo campos no enviados (None)
    updated = service.update(item_id, data.model_dump(exclude_none=True))

    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item con id {item_id} no encontrado"
        )
    return updated


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_item(
    item_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)  # Protegido: requiere JWT válido
):
    """
    Elimina un item del menú por su ID.
    Requiere autenticación — solo usuarios autenticados pueden eliminar.

    Args:
        item_id: UUID del item a eliminar.

    Retorna:
        HTTP 204 No Content si se eliminó correctamente.

    Lanza:
        HTTPException 404 si el item no existe.
    """
    service = MenuItemService(db)
    deleted = service.delete(item_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item con id {item_id} no encontrado"
        )
    # HTTP 204 no retorna body, FastAPI lo maneja automáticamente