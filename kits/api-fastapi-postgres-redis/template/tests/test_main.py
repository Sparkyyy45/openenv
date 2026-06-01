"""
Test suite for the FastAPI application.

Uses httpx.AsyncClient for async test requests and
overrides the database dependency with an in-memory SQLite engine.

Run:
    pytest -v
    pytest --cov=app
"""

import os
os.environ["APP_ENV"] = "testing"

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.database import Base, get_db
from main import app


# ── Test database setup ───────────────────────────────────────────────────────
# Use an in-memory SQLite database for tests (fast, no Docker needed)
TEST_DATABASE_URL = "sqlite+aiosqlite:///./test.db"

test_engine = create_async_engine(TEST_DATABASE_URL, echo=False)
test_session = async_sessionmaker(
    test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def override_get_db():
    async with test_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


app.dependency_overrides[get_db] = override_get_db


# ── Fixtures ──────────────────────────────────────────────────────────────────
@pytest_asyncio.fixture(autouse=True)
async def setup_database():
    """Create tables before each test, drop after."""
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture
async def client():
    """Async HTTP test client."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


# ── Tests ─────────────────────────────────────────────────────────────────────
@pytest.mark.asyncio
async def test_root(client: AsyncClient):
    """Root endpoint returns app info."""
    response = await client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "name" in data
    assert "docs" in data


@pytest.mark.asyncio
async def test_health(client: AsyncClient):
    """Health endpoint returns status."""
    response = await client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ("ok", "degraded")
    assert "timestamp" in data


@pytest.mark.asyncio
async def test_create_user(client: AsyncClient):
    """POST /api/users creates a new user."""
    payload = {"email": "test@example.com", "full_name": "Test User"}
    response = await client.post("/api/users", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["full_name"] == "Test User"
    assert data["is_active"] is True
    assert "id" in data
    assert "created_at" in data


@pytest.mark.asyncio
async def test_create_duplicate_user(client: AsyncClient):
    """POST /api/users with duplicate email returns 409."""
    payload = {"email": "dupe@example.com", "full_name": "User A"}
    await client.post("/api/users", json=payload)

    response = await client.post("/api/users", json=payload)
    assert response.status_code == 409


@pytest.mark.asyncio
async def test_list_users(client: AsyncClient):
    """GET /api/users returns a list."""
    # Create two users
    await client.post("/api/users", json={"email": "a@example.com"})
    await client.post("/api/users", json={"email": "b@example.com"})

    response = await client.get("/api/users")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2


@pytest.mark.asyncio
async def test_get_user(client: AsyncClient):
    """GET /api/users/{id} returns a single user."""
    create_resp = await client.post(
        "/api/users", json={"email": "single@example.com"}
    )
    user_id = create_resp.json()["id"]

    response = await client.get(f"/api/users/{user_id}")
    assert response.status_code == 200
    assert response.json()["email"] == "single@example.com"


@pytest.mark.asyncio
async def test_get_user_not_found(client: AsyncClient):
    """GET /api/users/{id} returns 404 for non-existent ID."""
    import uuid

    response = await client.get(f"/api/users/{uuid.uuid4()}")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_update_user(client: AsyncClient):
    """PATCH /api/users/{id} updates fields."""
    create_resp = await client.post(
        "/api/users", json={"email": "patch@example.com", "full_name": "Old Name"}
    )
    user_id = create_resp.json()["id"]

    response = await client.patch(
        f"/api/users/{user_id}", json={"full_name": "New Name"}
    )
    assert response.status_code == 200
    assert response.json()["full_name"] == "New Name"
    assert response.json()["email"] == "patch@example.com"  # unchanged


@pytest.mark.asyncio
async def test_delete_user(client: AsyncClient):
    """DELETE /api/users/{id} removes the user."""
    create_resp = await client.post(
        "/api/users", json={"email": "delete@example.com"}
    )
    user_id = create_resp.json()["id"]

    # Delete
    response = await client.delete(f"/api/users/{user_id}")
    assert response.status_code == 204

    # Verify gone
    get_resp = await client.get(f"/api/users/{user_id}")
    assert get_resp.status_code == 404
