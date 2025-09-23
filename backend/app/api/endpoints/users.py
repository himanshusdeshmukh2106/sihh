"""
Users endpoints
Modern FastAPI CRUD patterns
"""

from fastapi import APIRouter, HTTPException, status, Query
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

router = APIRouter()


class UserCreate(BaseModel):
    """User creation model"""
    email: str
    full_name: str
    is_active: bool = True


class UserUpdate(BaseModel):
    """User update model"""
    email: Optional[str] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = None


class UserResponse(BaseModel):
    """User response model"""
    id: str
    email: str
    full_name: str
    is_active: bool
    created_at: str


@router.get("/", response_model=List[UserResponse])
async def get_users(
    skip: int = Query(0, ge=0, description="Number of users to skip"),
    limit: int = Query(10, ge=1, le=100, description="Number of users to return")
) -> List[UserResponse]:
    """
    Get list of users with pagination
    """
    # Mock data - replace with real database query
    mock_users = [
        UserResponse(
            id="user_1",
            email="user1@example.com",
            full_name="User One",
            is_active=True,
            created_at="2024-01-01T00:00:00Z"
        ),
        UserResponse(
            id="user_2",
            email="user2@example.com",
            full_name="User Two",
            is_active=True,
            created_at="2024-01-02T00:00:00Z"
        )
    ]
    
    return mock_users[skip:skip + limit]


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: str) -> UserResponse:
    """
    Get user by ID
    """
    # Mock data - replace with real database query
    if user_id == "user_1":
        return UserResponse(
            id=user_id,
            email="user1@example.com",
            full_name="User One",
            is_active=True,
            created_at="2024-01-01T00:00:00Z"
        )
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="User not found"
    )


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate) -> UserResponse:
    """
    Create new user
    """
    # Mock creation - replace with real database logic
    return UserResponse(
        id="new_user_123",
        email=user.email,
        full_name=user.full_name,
        is_active=user.is_active,
        created_at="2024-01-01T00:00:00Z"
    )


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(user_id: str, user_update: UserUpdate) -> UserResponse:
    """
    Update user by ID
    """
    # Mock update - replace with real database logic
    if user_id != "user_1":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse(
        id=user_id,
        email=user_update.email or "user1@example.com",
        full_name=user_update.full_name or "Updated User",
        is_active=user_update.is_active if user_update.is_active is not None else True,
        created_at="2024-01-01T00:00:00Z"
    )


@router.delete("/{user_id}")
async def delete_user(user_id: str) -> Dict[str, str]:
    """
    Delete user by ID
    """
    # Mock deletion - replace with real database logic
    if user_id != "user_1":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {"message": f"User {user_id} deleted successfully"}