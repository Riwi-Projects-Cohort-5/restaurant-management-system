"""

Módulo   : auth.py
Ruta     : backend/app/api/v1/auth.py
Responsable: Diego
Descripción: Endpoints REST para autenticación de usuarios.
            Maneja registro, inicio de sesión y generación
            de tokens JWT. El token generado debe incluirse
            en el header Authorization de las peticiones
            protegidas: "Bearer <token>"
Fecha    : 2026-07-14

"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.services.auth_service import AuthService
from app.db.schemas.user import UserCreate, UserOut

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login")
def login(
    # OAuth2PasswordRequestForm espera un form con "username" y "password"
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Autentica un usuario y retorna un token JWT de acceso.
    No requiere autenticación previa — es el endpoint de entrada.

    Recibe un formulario con:
        username: Nombre de usuario registrado.
        password: Contraseña en texto plano (se verifica contra el hash).

    Retorna:
        access_token: Token JWT para usar en endpoints protegidos.
        token_type  : Siempre "bearer".

    Lanza:
        HTTPException 401 si las credenciales son incorrectas.
    """
    service = AuthService(db)

    # El servicio verifica la contraseña y retorna el token si es válido
    token = service.authenticate(
        username=form_data.username,
        password=form_data.password
    )

    # Si authenticate retorna None, las credenciales son incorrectas
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return {"access_token": token, "token_type": "bearer"}


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(
    data: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Registra un nuevo usuario en el sistema.
    No requiere autenticación — permite crear la primera cuenta.

    En producción este endpoint debería protegerse para que
    solo administradores puedan crear nuevos usuarios.

    Args:
        data: UserCreate con los datos del nuevo usuario
              (username, email, password, full_name, role).

    Retorna:
        UserOut con los datos del usuario creado (sin contraseña).
        Código HTTP 201 Created.

    Nota: La contraseña se hashea automáticamente en el servicio,
          nunca se guarda en texto plano en la base de datos.
    """
    service = AuthService(db)

    return service.register(
        username=data.username,
        email=data.email,
        password=data.password,
        full_name=data.full_name,
        role=data.role if hasattr(data, "role") else "waiter"
    )
