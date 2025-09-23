"""
API Routes Configuration
Latest FastAPI patterns and best practices
"""

from fastapi import APIRouter
from app.api.endpoints import users, items, auth

# Create main API router
api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["authentication"]
)

api_router.include_router(
    users.router,
    prefix="/users",
    tags=["users"]
)

api_router.include_router(
    items.router,
    prefix="/items",
    tags=["items"]
)