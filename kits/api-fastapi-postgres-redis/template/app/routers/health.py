"""
Health check router.

Reports database and Redis connectivity alongside basic app info.
Used by Docker healthchecks, load balancers, and `openenv doctor`.
"""

from datetime import datetime, timezone

import redis.asyncio as aioredis
from fastapi import APIRouter
from sqlalchemy import text

from app.config import settings
from app.database import async_session

router = APIRouter()


@router.get("/health")
async def health_check():
    """
    GET /api/health

    Returns:
        200 — all services reachable
        503 — one or more services unreachable
    """
    status = "ok"
    db_status = "connected"
    redis_status = "connected"
    checks: dict = {}

    # ── Database check ────────────────────────────────────────────────────────
    try:
        async with async_session() as session:
            result = await session.execute(text("SELECT 1"))
            result.scalar()
    except Exception as exc:
        db_status = f"error: {exc}"
        status = "degraded"

    # ── Redis check ───────────────────────────────────────────────────────────
    try:
        r = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
        pong = await r.ping()
        if not pong:
            raise ConnectionError("Redis ping returned False")
        await r.aclose()
    except Exception as exc:
        redis_status = f"error: {exc}"
        status = "degraded"

    checks = {
        "database": db_status,
        "redis": redis_status,
    }

    http_status = 200 if status == "ok" else 503

    return {
        "status": status,
        **checks,
        "environment": settings.APP_ENV,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    } | ({"_http_status": http_status} if http_status != 200 else {})
