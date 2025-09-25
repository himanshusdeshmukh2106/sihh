"""
Admin authentication endpoints
"""

import json
from datetime import datetime, timedelta
from typing import Dict, Any
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session

from app.models.database import get_db
from app.models.models import AdminUser
from app.schemas.admin import (
    AdminLoginRequest,
    AdminLoginResponse,
    AdminUserResponse,
    AdminUserCreate,
    AdminPermission
)
from app.core.auth import (
    authenticate_admin_user,
    create_access_token,
    get_current_admin_user,
    get_password_hash,
    parse_permissions,
    serialize_permissions
)

router = APIRouter()


@router.post("/login", response_model=AdminLoginResponse)
async def admin_login(
    login_data: AdminLoginRequest,
    db: Session = Depends(get_db)
) -> AdminLoginResponse:
    """
    Admin user login endpoint
    """
    user = authenticate_admin_user(db, login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is deactivated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.commit()
    
    # Parse permissions
    permissions = parse_permissions(user.permissions)
    
    # Create access token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={
            "sub": user.email,
            "user_id": user.id,
            "role": user.role,
            "permissions": [
                {"resource": p.resource, "actions": p.actions}
                for p in permissions
            ]
        },
        expires_delta=access_token_expires
    )
    
    # Create user response
    user_response = AdminUserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        is_active=user.is_active,
        permissions=permissions,
        last_login=user.last_login,
        created_at=user.created_at,
        updated_at=user.updated_at
    )
    
    return AdminLoginResponse(
        access_token=access_token,
        token_type="Bearer",
        user=user_response
    )


@router.post("/logout")
async def admin_logout(
    current_user: AdminUser = Depends(get_current_admin_user)
) -> Dict[str, str]:
    """
    Admin user logout endpoint
    """
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=AdminUserResponse)
async def get_current_admin_profile(
    current_user: AdminUser = Depends(get_current_admin_user)
) -> AdminUserResponse:
    """
    Get current admin user profile
    """
    permissions = parse_permissions(current_user.permissions)
    
    return AdminUserResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        role=current_user.role,
        is_active=current_user.is_active,
        permissions=permissions,
        last_login=current_user.last_login,
        created_at=current_user.created_at,
        updated_at=current_user.updated_at
    )


@router.post("/refresh")
async def refresh_token(
    current_user: AdminUser = Depends(get_current_admin_user)
) -> Dict[str, str]:
    """
    Refresh access token
    """
    permissions = parse_permissions(current_user.permissions)
    
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={
            "sub": current_user.email,
            "user_id": current_user.id,
            "role": current_user.role,
            "permissions": [
                {"resource": p.resource, "actions": p.actions}
                for p in permissions
            ]
        },
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "Bearer"}


# Development endpoint to create initial admin user
@router.post("/create-admin", response_model=AdminUserResponse)
async def create_admin_user(
    admin_data: AdminUserCreate,
    db: Session = Depends(get_db)
) -> AdminUserResponse:
    """
    Create admin user (for development/setup only)
    In production, this should be protected or removed
    """
    # Check if admin already exists
    existing_admin = db.query(AdminUser).filter(AdminUser.email == admin_data.email).first()
    if existing_admin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin user with this email already exists"
        )
    
    # Default permissions for super admin
    if not admin_data.permissions:
        admin_data.permissions = [
            AdminPermission(resource="users", actions=["read", "write", "delete", "export"]),
            AdminPermission(resource="videos", actions=["read", "write", "delete", "export"]),
            AdminPermission(resource="analytics", actions=["read", "export"]),
            AdminPermission(resource="system", actions=["read", "write"])
        ]
    
    # Create admin user
    hashed_password = get_password_hash(admin_data.password)
    permissions_json = serialize_permissions(admin_data.permissions)
    
    db_admin = AdminUser(
        email=admin_data.email,
        full_name=admin_data.full_name,
        hashed_password=hashed_password,
        role=admin_data.role,
        is_active=admin_data.is_active,
        permissions=permissions_json
    )
    
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    
    return AdminUserResponse(
        id=db_admin.id,
        email=db_admin.email,
        full_name=db_admin.full_name,
        role=db_admin.role,
        is_active=db_admin.is_active,
        permissions=admin_data.permissions,
        last_login=db_admin.last_login,
        created_at=db_admin.created_at,
        updated_at=db_admin.updated_at
    )