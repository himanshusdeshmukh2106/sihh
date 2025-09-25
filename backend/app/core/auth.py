"""
Authentication utilities for admin users
"""

import json
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.database import get_db
from app.models.models import AdminUser
from app.schemas.admin import AdminTokenData, AdminPermission

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Security scheme
security = HTTPBearer()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> AdminTokenData:
    """Verify and decode a JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        user_id: int = payload.get("user_id")
        role: str = payload.get("role")
        permissions_data: List[Dict] = payload.get("permissions", [])
        
        if email is None or user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Convert permissions data to AdminPermission objects
        permissions = [
            AdminPermission(resource=p["resource"], actions=p["actions"])
            for p in permissions_data
        ]
        
        return AdminTokenData(
            email=email,
            user_id=user_id,
            role=role,
            permissions=permissions
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_admin_user_by_email(db: Session, email: str) -> Optional[AdminUser]:
    """Get admin user by email"""
    return db.query(AdminUser).filter(AdminUser.email == email).first()


def authenticate_admin_user(db: Session, email: str, password: str) -> Optional[AdminUser]:
    """Authenticate admin user"""
    user = get_admin_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def parse_permissions(permissions_json: Optional[str]) -> List[AdminPermission]:
    """Parse permissions from JSON string"""
    if not permissions_json:
        return []
    
    try:
        permissions_data = json.loads(permissions_json)
        
        # Handle both dictionary and array formats
        if isinstance(permissions_data, dict):
            # Convert dictionary format to list format
            return [
                AdminPermission(resource=resource, actions=actions)
                for resource, actions in permissions_data.items()
            ]
        elif isinstance(permissions_data, list):
            # Handle array format
            return [
                AdminPermission(resource=p["resource"], actions=p["actions"])
                for p in permissions_data
            ]
        else:
            return []
    except (json.JSONDecodeError, KeyError):
        return []


def serialize_permissions(permissions: List[AdminPermission]) -> str:
    """Serialize permissions to JSON string"""
    return json.dumps([
        {"resource": p.resource, "actions": p.actions}
        for p in permissions
    ])


async def get_current_admin_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> AdminUser:
    """Get current authenticated admin user"""
    token_data = verify_token(credentials.credentials)
    
    user = db.query(AdminUser).filter(AdminUser.id == token_data.user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Inactive user",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user


def require_permissions(required_permissions: List[Dict[str, Any]]):
    """Decorator to require specific permissions"""
    def permission_checker(current_user: AdminUser = Depends(get_current_admin_user)):
        user_permissions = parse_permissions(current_user.permissions)
        
        for required in required_permissions:
            resource = required["resource"]
            actions = required["actions"]
            
            # Find matching permission
            user_permission = next(
                (p for p in user_permissions if p.resource == resource),
                None
            )
            
            if not user_permission:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Missing permission for resource: {resource}"
                )
            
            # Check if user has all required actions
            missing_actions = set(actions) - set(user_permission.actions)
            if missing_actions:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Missing actions for {resource}: {list(missing_actions)}"
                )
        
        return current_user
    
    return permission_checker