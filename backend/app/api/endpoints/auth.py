"""
Authentication endpoints
Modern FastAPI authentication patterns
"""

from fastapi import APIRouter, HTTPException, status
from fastapi.security import HTTPBearer
from pydantic import BaseModel
from typing import Dict, Any

router = APIRouter()
security = HTTPBearer()


class LoginRequest(BaseModel):
    """Login request model"""
    email: str
    password: str


class LoginResponse(BaseModel):
    """Login response model"""
    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: str


class RegisterRequest(BaseModel):
    """Registration request model"""
    email: str
    password: str
    full_name: str


@router.post("/login", response_model=LoginResponse)
async def login(login_data: LoginRequest) -> LoginResponse:
    """
    User login endpoint
    """
    # Mock authentication - replace with real logic
    if login_data.email == "user@example.com" and login_data.password == "password":
        return LoginResponse(
            access_token="mock_jwt_token_here",
            user_id="user_123",
            email=login_data.email
        )
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials"
    )


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(register_data: RegisterRequest) -> Dict[str, Any]:
    """
    User registration endpoint
    """
    # Mock registration - replace with real logic
    return {
        "message": "User registered successfully",
        "user_id": "new_user_123",
        "email": register_data.email
    }


@router.post("/logout")
async def logout() -> Dict[str, str]:
    """
    User logout endpoint
    """
    return {"message": "Logged out successfully"}


@router.get("/me")
async def get_current_user() -> Dict[str, Any]:
    """
    Get current user profile
    """
    # Mock user data - replace with real logic
    return {
        "user_id": "user_123",
        "email": "user@example.com",
        "full_name": "John Doe",
        "is_active": True
    }