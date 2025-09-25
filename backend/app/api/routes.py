"""
API Routes Configuration
Latest FastAPI patterns and best practices
"""

from fastapi import APIRouter
from app.api.endpoints import users, items, auth, admin_auth, admin_analytics, user_management, video_content

# Create main API router
api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["authentication"]
)

api_router.include_router(
    admin_auth.router,
    prefix="/admin/auth",
    tags=["admin-authentication"]
)

api_router.include_router(
    admin_analytics.router,
    prefix="/admin/analytics",
    tags=["admin-analytics"]
)

api_router.include_router(
    user_management.router,
    prefix="/admin/users",
    tags=["admin-user-management"]
)

api_router.include_router(
    video_content.router,
    prefix="/admin/videos",
    tags=["admin-video-content"]
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