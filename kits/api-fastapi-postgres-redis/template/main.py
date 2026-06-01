"""
openenv — api-fastapi-postgres-redis
FastAPI application entrypoint.

Run locally:
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base
from app.routers import health, users


# ── Lifespan ──────────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Startup: create database tables.
    Shutdown: dispose of the engine connection pool.
    """
    if settings.APP_ENV != "testing":
        try:
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
        except Exception as e:
            print(f"Database connection failed: {e}")
    yield
    await engine.dispose()


# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title=settings.APP_NAME,
    description="Production API built with FastAPI, PostgreSQL, and Redis.",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(health.router, prefix=settings.API_PREFIX, tags=["health"])
app.include_router(users.router, prefix=settings.API_PREFIX, tags=["users"])


# ── Root ──────────────────────────────────────────────────────────────────────
@app.get("/", tags=["root"])
async def root():
    """API root — useful as a quick liveness probe."""
    return {
        "name": settings.APP_NAME,
        "version": "0.1.0",
        "docs": "/docs",
        "health": f"{settings.API_PREFIX}/health",
    }
