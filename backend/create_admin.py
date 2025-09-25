"""
Script to create initial admin user
Run this once to set up the first admin user
"""

import asyncio
from sqlalchemy.orm import Session
from app.models.database import SessionLocal
from app.models.models import AdminUser
from app.core.auth import get_password_hash, serialize_permissions
from app.schemas.admin import AdminPermission


def create_initial_admin():
    """Create the initial admin user"""
    db = SessionLocal()
    
    try:
        # Check if admin already exists
        existing_admin = db.query(AdminUser).filter(
            AdminUser.email == "admin@sportsplatform.com"
        ).first()
        
        if existing_admin:
            print("Admin user already exists!")
            return
        
        # Create default permissions for super admin
        permissions = [
            AdminPermission(resource="users", actions=["read", "write", "delete", "export"]),
            AdminPermission(resource="videos", actions=["read", "write", "delete", "export"]),
            AdminPermission(resource="analytics", actions=["read", "export"]),
            AdminPermission(resource="system", actions=["read", "write"])
        ]
        
        # Create admin user
        hashed_password = get_password_hash("admin123")
        permissions_json = serialize_permissions(permissions)
        
        admin_user = AdminUser(
            email="admin@sportsplatform.com",
            full_name="Admin User",
            hashed_password=hashed_password,
            role="super_admin",
            is_active=True,
            permissions=permissions_json
        )
        
        db.add(admin_user)
        db.commit()
        
        print("✅ Initial admin user created successfully!")
        print("Email: admin@sportsplatform.com")
        print("Password: admin123")
        print("Role: super_admin")
        
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    create_initial_admin()