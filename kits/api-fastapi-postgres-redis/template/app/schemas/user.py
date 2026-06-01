"""
User Pydantic schemas.

Separates input (Create/Update) from output (Read) models
following the multi-model pattern for clean API contracts.
"""

import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr, ConfigDict


# ── Base ──────────────────────────────────────────────────────────────────────
class UserBase(BaseModel):
    """Shared fields for all user schemas."""
    email: EmailStr
    full_name: str | None = None


# ── Create ────────────────────────────────────────────────────────────────────
class UserCreate(UserBase):
    """Fields required to create a new user."""
    pass


# ── Update ────────────────────────────────────────────────────────────────────
class UserUpdate(BaseModel):
    """
    Fields that can be updated.
    All optional — supports partial updates via PATCH.
    """
    email: EmailStr | None = None
    full_name: str | None = None
    is_active: bool | None = None


# ── Read ──────────────────────────────────────────────────────────────────────
class UserRead(UserBase):
    """User returned in API responses."""
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
