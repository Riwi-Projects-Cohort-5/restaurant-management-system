"""

Modulo   : main.py
Ruta     : backend/app/main.py
Descripcion: Punto de entrada de la aplicacion FastAPI.
            Inicializa el servidor, configura CORS,
            registra el router principal y define los
            endpoints base de salud del sistema.
Fecha    : 2026-07-14

"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.api.router import api_router

settings = get_settings()

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/")
def root():
    return {"message": "Restaurant Management System API"}


@app.get("/health")
def health_check():
    return {"status": "ok"}
