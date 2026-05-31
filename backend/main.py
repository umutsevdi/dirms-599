import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import get_settings
from app.db.database import engine, Base
from app.api import auth, entity, employees, archetypes, inventory

settings = get_settings()


def _check_database_connection():
    from sqlalchemy import text

    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
    except Exception as e:
        raise RuntimeError(f"Error while connecting to DB: {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    if not os.path.exists(env_path):
        raise RuntimeError(".env not found")
    _check_database_connection()
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title=settings.APP_NAME,
    description="Backend API for Disaster Management System",
    version="1.0.0",
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router, prefix="/api")
app.include_router(entity.router, prefix="/api")
app.include_router(employees.router, prefix="/api")
app.include_router(archetypes.router, prefix="/api")
app.include_router(inventory.router, prefix="/api")


@app.get("/")
def root():
    return {
        "message": "Disaster Management System API",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
