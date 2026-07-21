"""

Módulo   : users.py
Ruta     : backend/app/api/v1/users.py
Responsable: Diego
Descripción: Endpoints REST para la gestión de usuarios del
            sistema. Permite consultar, actualizar y eliminar
            usuarios. Todos los endpoints requieren
            autenticación — solo administradores deberían
            gestionar usuarios en producción.
Fecha    : 2026-07-14

"""

from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.db.schemas.user import UserOut, UserUpdate
from app.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/", response_model=List[UserOut])
def obtener_todos_los_usuarios(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Retorna todos los usuarios registrados en el sistema.
    Requiere autenticación — solo administradores.

    Args:
        skip : Número de registros a omitir (paginación).
        limit: Máximo de registros a retornar.

    Retorna:
        Lista de UserOut con todos los usuarios (sin contraseñas).
    """
    service = UserService(db)
    return service.get_all(skip=skip, limit=limit)


@router.get("/me", response_model=UserOut)
def obtener_usuario_actual(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Retorna los datos del usuario actualmente autenticado.
    Requiere autenticación.

    Útil para que el frontend muestre el perfil del usuario
    logueado sin necesitar su ID explícitamente.

    Retorna:
        UserOut con los datos del usuario autenticado.
    """
    service = UserService(db)

    user = current_user

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    return user


@router.get("/{user_id}", response_model=UserOut)
def obtener_usuario_por_id(
    user_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Busca y retorna un usuario específico por su ID.
    Requiere autenticación.

    Args:
        user_id: UUID del usuario a buscar.

    Retorna:
        UserOut con los datos del usuario (sin contraseña).

    Lanza:
        HTTPException 404 si el usuario no existe.
    """
    service = UserService(db)
    user = service.get_by_id(user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Usuario con id {user_id} no encontrado"
        )
    return user


@router.put("/{user_id}", response_model=UserOut)
def actualizar_usuario(
    user_id: UUID,
    data: UserUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Actualiza los datos de un usuario existente.
    Requiere autenticación.

    Permite cambiar nombre, email, rol u otros datos.
    Si se envía una nueva contraseña, se hashea automáticamente
    en el servicio antes de guardarla.

    Args:
        user_id: UUID del usuario a actualizar.
        data   : UserUpdate con los campos a modificar.

    Retorna:
        UserOut con los datos actualizados.

    Lanza:
        HTTPException 404 si el usuario no existe.
    """
    service = UserService(db)
    updated = service.update(user_id, data.model_dump(exclude_none=True))

    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Usuario con id {user_id} no encontrado"
        )
    return updated


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_usuario(
    user_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Elimina un usuario del sistema por su ID.
    Requiere autenticación — solo administradores.

    Args:
        user_id: UUID del usuario a eliminar.

    Retorna:
        HTTP 204 No Content si se eliminó correctamente.

    Lanza:
        HTTPException 404 si el usuario no existe.
    """
    service = UserService(db)
    deleted = service.delete(user_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Usuario con id {user_id} no encontrado"
        )
