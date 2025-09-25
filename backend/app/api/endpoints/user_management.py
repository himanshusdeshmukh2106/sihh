"""
User management endpoints for admin dashboard
"""

from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func

from app.models.database import get_db
from app.models.models import AdminUser, User
from app.schemas.user_management import (
    UserListResponse,
    UserDetailResponse,
    UserSearchRequest,
    UserStatusUpdate,
    UserActivitySummary,
    PaginatedUserResponse
)
from app.services.user_management_service import (
    get_users_with_filters,
    get_user_detail,
    update_user_status,
    get_user_activity_summary,
    search_users
)
from app.core.auth import get_current_admin_user, require_permissions

router = APIRouter()


@router.get("/", response_model=PaginatedUserResponse)
async def list_users(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Search by name, email, or sport"),
    sport: Optional[str] = Query(None, description="Filter by primary sport"),
    status: Optional[str] = Query(None, description="Filter by user status"),
    experience_level: Optional[str] = Query(None, description="Filter by experience level"),
    location: Optional[str] = Query(None, description="Filter by city"),
    sort_by: str = Query("created_at", description="Sort field"),
    sort_order: str = Query("desc", description="Sort order: asc or desc"),
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(require_permissions([
        {"resource": "users", "actions": ["read"]}
    ]))
) -> PaginatedUserResponse:
    """
    Get paginated list of users with filtering and search
    """
    try:
        result = get_users_with_filters(
            db=db,
            page=page,
            limit=limit,
            search=search,
            sport=sport,
            status=status,
            experience_level=experience_level,
            location=location,
            sort_by=sort_by,
            sort_order=sort_order
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve users: {str(e)}"
        )


@router.get("/{user_id}", response_model=UserDetailResponse)
async def get_user_details(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(require_permissions([
        {"resource": "users", "actions": ["read"]}
    ]))
) -> UserDetailResponse:
    """
    Get detailed information about a specific user
    """
    try:
        user_detail = get_user_detail(db, user_id)
        if not user_detail:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return user_detail
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve user details: {str(e)}"
        )


@router.patch("/{user_id}/status", response_model=UserDetailResponse)
async def update_user_status_endpoint(
    user_id: int,
    status_update: UserStatusUpdate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(require_permissions([
        {"resource": "users", "actions": ["write"]}
    ]))
) -> UserDetailResponse:
    """
    Update user status (activate, deactivate, suspend)
    """
    try:
        updated_user = update_user_status(
            db=db,
            user_id=user_id,
            new_status=status_update.status,
            reason=status_update.reason,
            admin_id=current_user.id
        )
        
        if not updated_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return updated_user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update user status: {str(e)}"
        )


@router.get("/{user_id}/activity", response_model=UserActivitySummary)
async def get_user_activity(
    user_id: int,
    days: int = Query(30, ge=1, le=365, description="Number of days to look back"),
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(require_permissions([
        {"resource": "users", "actions": ["read"]}
    ]))
) -> UserActivitySummary:
    """
    Get user activity summary and engagement metrics
    """
    try:
        activity_summary = get_user_activity_summary(db, user_id, days)
        if not activity_summary:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return activity_summary
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve user activity: {str(e)}"
        )


@router.post("/search", response_model=List[UserListResponse])
async def search_users_endpoint(
    search_request: UserSearchRequest,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(require_permissions([
        {"resource": "users", "actions": ["read"]}
    ]))
) -> List[UserListResponse]:
    """
    Advanced user search with multiple criteria
    """
    try:
        users = search_users(db, search_request)
        return users
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to search users: {str(e)}"
        )


@router.get("/stats/summary")
async def get_user_stats_summary(
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(require_permissions([
        {"resource": "users", "actions": ["read"]}
    ]))
) -> Dict[str, Any]:
    """
    Get user statistics summary
    """
    try:
        total_users = db.query(User).count()
        active_users = db.query(User).filter(User.is_active.is_(True)).count()
        completed_profiles = db.query(User).filter(User.profile_completed.is_(True)).count()
        
        # New users this month
        month_ago = datetime.utcnow() - timedelta(days=30)
        new_users_this_month = db.query(User).filter(
            User.created_at >= month_ago
        ).count()
        
        # Users by sport
        sport_stats = db.query(
            User.primary_sport,
            func.count(User.id).label('count')
        ).filter(
            User.primary_sport.isnot(None)
        ).group_by(User.primary_sport).order_by(func.count(User.id).desc()).limit(5).all()
        
        return {
            "total_users": total_users,
            "active_users": active_users,
            "completed_profiles": completed_profiles,
            "new_users_this_month": new_users_this_month,
            "completion_rate": round((completed_profiles / total_users) * 100, 2) if total_users > 0 else 0,
            "top_sports": [{"sport": sport, "count": count} for sport, count in sport_stats]
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve user statistics: {str(e)}"
        )


@router.delete("/{user_id}")
async def delete_user(
    user_id: int,
    permanent: bool = Query(False, description="Permanently delete user data"),
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(require_permissions([
        {"resource": "users", "actions": ["delete"]}
    ]))
) -> Dict[str, str]:
    """
    Delete or deactivate a user account
    """
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        if permanent:
            # Permanent deletion - only for super admins
            if current_user.role != "super_admin":
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Only super admins can permanently delete users"
                )
            db.delete(user)
            message = "User permanently deleted"
        else:
            # Soft delete - deactivate account
            user.is_active = False
            message = "User account deactivated"
        
        db.commit()
        
        return {"message": message}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete user: {str(e)}"
        )