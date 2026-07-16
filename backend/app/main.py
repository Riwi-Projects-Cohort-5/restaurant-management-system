"""

Módulo   : main.py
Ruta     : backend/app/main.py
Descripción: Punto de entrada de la aplicación FastAPI.
            Inicializa el servidor, configura CORS,
            registra el router principal y define los
            endpoints base de salud del sistema.
Fecha    : 2026-07-14

"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.api.router import api_router

# Importamos el router principal que contiene todos los módulos
from app.api.router import api_router

# Cargamos la configuración desde variables de entorno
settings = get_settings()

# Creamos la instancia principal de FastAPI
app = FastAPI(title=settings.PROJECT_NAME)

# Configuramos CORS para permitir peticiones desde el frontend
# En producción se deben restringir los orígenes permitidos
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registramos el router principal con todos los endpoints bajo /api/v1
app.include_router(api_router)
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/")
def root():
    """
    Endpoint raíz — confirma que el servidor está corriendo.
    Retorna el nombre del sistema.
    """
    return {"message": "Restaurant Management System API"}


@app.get("/health")
def health_check():
    """
    Endpoint de salud — usado por Docker y sistemas de monitoreo
    para verificar que el servidor responde correctamente.
    """
    return {"status": "ok"}