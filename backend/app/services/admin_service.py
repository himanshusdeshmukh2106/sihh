"""
Admin user service functions
"""

import json
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.models.models import AdminUser
from app.schemas.admin import AdminUserCreate, AdminUserUpdate, AdminPermission
from app.core.auth import get_password_hash, parse_permissions, serialize_permissions


def get_admin_user(db: Session, user_id: int) -> Optional[AdminUser]:
    """Get admin user by ID"""
    return db.query(AdminUser).filter(AdminUser.id == user_id).first()


def get_admin_user_by_email(db: Session, email: str) -> Optional[AdminUser]:
    """Get admin user by email"""
    return db.query(AdminUser).filter(AdminUser.email == email).first()


def get_admin_users(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    is_active: Optional[bool] = None,
    role: Optional[str] = None
) -> List[AdminUser]:
    """Get list of admin users with optional filters"""
    query = db.query(AdminUser)
    
    if is_active is not None:
        query = query.filter(AdminUser.is_active == is_active)
    
    if role:
        query = query.filter(AdminUser.role == role)
    
    return query.offset(skip).limit(limit).all()


def create_admin_user(db: Session, admin_data: AdminUserCreate) -> AdminUser:
    """Create a new admin user"""
    # Hash password
    hashed_password = get_password_hash(admin_data.password)
    
    # Serialize permissions
    permissions_json = None
    if admin_data.permissions:
        permissions_json = serialize_permissions(admin_data.permissions)
    
    # Create admin user
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
    
    return db_admin


def update_admin_user(
    db: Session, 
    user_id: int, 
    admin_data: AdminUserUpdate
) -> Optional[AdminUser]:
    """Update an admin user"""
    db_admin = get_admin_user(db, user_id)
    if not db_admin:
        return None
    
    # Update fields
    update_data = admin_data.model_dump(exclude_unset=True)
    
    # Handle permissions separately
    if "permissions" in update_data:
        permissions = update_data.pop("permissions")
        if permissions:
            update_data["permissions"] = serialize_permissions(permissions)
        else:
            update_data["permissions"] = None
    
    # Update admin user
    for field, value in update_data.items():
        setattr(db_admin, field, value)
    
    db.commit()
    db.refresh(db_admin)
    
    return db_admin


def delete_admin_user(db: Session, user_id: int) -> bool:
    """Delete an admin user"""
    db_admin = get_admin_user(db, user_id)
    if not db_admin:
        return False
    
    db.delete(db_admin)
    db.commit()
    
    return True


def deactivate_admin_user(db: Session, user_id: int) -> Optional[AdminUser]:
    """Deactivate an admin user"""
    db_admin = get_admin_user(db, user_id)
    if not db_admin:
        return None
    
    db_admin.is_active = False
    db.commit()
    db.refresh(db_admin)
    
    return db_admin


def activate_admin_user(db: Session, user_id: int) -> Optional[AdminUser]:
    """Activate an admin user"""
    db_admin = get_admin_user(db, user_id)
    if not db_admin:
        return None
    
    db_admin.is_active = True
    db.commit()
    db.refresh(db_admin)
    
    return db_admin


def get_admin_permissions(db: Session, user_id: int) -> List[AdminPermission]:
    """Get admin user permissions"""
    db_admin = get_admin_user(db, user_id)
    if not db_admin:
        return []
    
    return parse_permissions(db_admin.permissions)


def update_admin_permissions(
    db: Session, 
    user_id: int, 
    permissions: List[AdminPermission]
) -> Optional[AdminUser]:
    """Update admin user permissions"""
    db_admin = get_admin_user(db, user_id)
    if not db_admin:
        return None
    
    db_admin.permissions = serialize_permissions(permissions)
    db.commit()
    db.refresh(db_admin)
    
    return db_admin