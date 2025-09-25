"""
Admin User Pydantic schemas for request/response models
"""

from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr


class AdminPermission(BaseModel):
    resource: str  # 'users', 'videos', 'analytics', 'system'
    actions: List[str]  # ['read', 'write', 'delete', 'export']


class AdminUserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "admin"  # 'super_admin', 'admin', 'moderator'
    is_active: bool = True


class AdminUserCreate(AdminUserBase):
    password: str
    permissions: Optional[List[AdminPermission]] = None


class AdminUserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None
    permissions: Optional[List[AdminPermission]] = None


class AdminUserResponse(AdminUserBase):
    id: int
    permissions: List[AdminPermission]
    last_login: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class AdminLoginRequest(BaseModel):
    email: EmailStr
    password: str


class AdminLoginResponse(BaseModel):
    access_token: str
    token_type: str = "Bearer"
    user: AdminUserResponse


class AdminTokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[int] = None
    role: Optional[str] = None
    permissions: Optional[List[AdminPermission]] = None