"""
Admin analytics endpoints
"""

from datetime import datetime, timedelta
from typing import Optional, List
from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.orm import Session

from app.models.database import get_db
from app.models.models import AdminUser
from app.schemas.analytics import (
    UserAnalytics,
    SportAnalytics,
    EngagementMetrics,
    SystemMetrics,
    AnalyticsSummary,
    AnalyticsRequest
)
from app.services.analytics_service import (
    get_user_analytics,
    get_sport_analytics,
    get_engagement_metrics,
    get_system_metrics
)
from app.core.auth import get_current_admin_user, require_permissions

router = APIRouter()


@router.get("/users", response_model=UserAnalytics)
async def get_user_analytics_endpoint(
    start_date: Optional[datetime] = Query(None, description="Start date for analytics"),
    end_date: Optional[datetime] = Query(None, description="End date for analytics"),
    sports: Optional[List[str]] = Query(None, description="Filter by sports"),
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(require_permissions([
        {"resource": "analytics", "actions": ["read"]}
    ]))
) -> UserAnalytics:
    """
    Get user analytics data
    """
    try:
        return get_user_analytics(
            db=db,
            start_date=start_date,
            end_date=end_date,
            sports=sports
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve user analytics: {str(e)}"
        )


@router.get("/sports", response_model=SportAnalytics)
async def get_sport_analytics_endpoint(
    start_date: Optional[datetime] = Query(None, description="Start date for analytics"),
    end_date: Optional[datetime] = Query(None, description="End date for analytics"),
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(require_permissions([
        {"resource": "analytics", "actions": ["read"]}
    ]))
) -> SportAnalytics:
    """
    Get sport analytics data
    """
    try:
        return get_sport_analytics(
            db=db,
            start_date=start_date,
            end_date=end_date
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve sport analytics: {str(e)}"
        )


@router.get("/engagement", response_model=EngagementMetrics)
async def get_engagement_metrics_endpoint(
    start_date: Optional[datetime] = Query(None, description="Start date for analytics"),
    end_date: Optional[datetime] = Query(None, description="End date for analytics"),
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(require_permissions([
        {"resource": "analytics", "actions": ["read"]}
    ]))
) -> EngagementMetrics:
    """
    Get engagement metrics
    """
    try:
        return get_engagement_metrics(
            db=db,
            start_date=start_date,
            end_date=end_date
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve engagement metrics: {str(e)}"
        )


@router.get("/system", response_model=SystemMetrics)
async def get_system_metrics_endpoint(
    current_user: AdminUser = Depends(require_permissions([
        {"resource": "system", "actions": ["read"]}
    ]))
) -> SystemMetrics:
    """
    Get system metrics
    """
    try:
        return get_system_metrics()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve system metrics: {str(e)}"
        )


@router.get("/summary", response_model=AnalyticsSummary)
async def get_analytics_summary(
    start_date: Optional[datetime] = Query(None, description="Start date for analytics"),
    end_date: Optional[datetime] = Query(None, description="End date for analytics"),
    sports: Optional[List[str]] = Query(None, description="Filter by sports"),
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(require_permissions([
        {"resource": "analytics", "actions": ["read"]}
    ]))
) -> AnalyticsSummary:
    """
    Get comprehensive analytics summary
    """
    try:
        user_analytics = get_user_analytics(
            db=db,
            start_date=start_date,
            end_date=end_date,
            sports=sports
        )
        
        sport_analytics = get_sport_analytics(
            db=db,
            start_date=start_date,
            end_date=end_date
        )
        
        engagement_metrics = get_engagement_metrics(
            db=db,
            start_date=start_date,
            end_date=end_date
        )
        
        system_metrics = get_system_metrics()
        
        return AnalyticsSummary(
            user_analytics=user_analytics,
            sport_analytics=sport_analytics,
            engagement_metrics=engagement_metrics,
            system_metrics=system_metrics,
            generated_at=datetime.utcnow()
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve analytics summary: {str(e)}"
        )


@router.post("/export")
async def export_analytics_data(
    request: AnalyticsRequest,
    format: str = Query("csv", description="Export format: csv, excel, pdf"),
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(require_permissions([
        {"resource": "analytics", "actions": ["export"]}
    ]))
):
    """
    Export analytics data in various formats
    """
    # This would implement actual export functionality
    # For now, return a mock response
    return {
        "message": "Export functionality will be implemented in task 16",
        "format": format,
        "request": request.model_dump(),
        "status": "pending"
    }