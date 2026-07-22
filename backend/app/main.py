"""

Módulo   : main.py
Ruta     : backend/app/main.py
Descripción: Punto de entrada de la aplicación FastAPI.
            Inicializa el servidor, configura CORS,
            registra el router principal y define los
            endpoints base de salud del sistema.
Fecha    : 2026-07-14

"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.router import api_router
from app.core.config import get_settings

# Importamos el router principal que contiene todos los módulos

# Cargamos la configuración desde variables de entorno
settings = get_settings()

# Creamos la instancia principal de FastAPI
app = FastAPI(title=settings.PROJECT_NAME)

# Configuramos CORS para permitir peticiones desde el frontend
# En producción se deben restringir los orígenes permitidos
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=[
        "Authorization",
        "Content-Type",
        "Accept",
        "Origin",
        "X-Requested-With",
    ],
    expose_headers=["Content-Length"],
    max_age=600,
)

# Registramos el router principal con todos los endpoints bajo /api/v1
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )


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
