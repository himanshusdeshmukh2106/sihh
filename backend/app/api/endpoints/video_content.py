"""
Video content management endpoints for admin dashboard
"""

from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, status, Depends, Query, UploadFile, File
from sqlalchemy.orm import Session

from app.models.database import get_db
from app.models.models import AdminUser, VideoContent, VideoModerationLog
from app.schemas.video_content import (
    VideoContentResponse,
    VideoContentListResponse,
    VideoContentCreate,
    VideoContentUpdate,
    VideoModerationRequest,
    VideoSearchRequest,
    PaginatedVideoResponse,
    VideoAnalytics,
    VideoEngagementUpdate,
    VideoBulkAction
)
from app.services.video_content_service import (
    get_videos_with_filters,
    get_video_by_id,
    create_video_content,
    update_video_content,
    delete_video_content,
    moderate_video,
    get_video_analytics,
    update_video_engagement,
    search_videos
)
from app.core.auth import get_current_admin_user, require_permissions

router = APIRouter()


@router.get("/", response_model=PaginatedVideoResponse)
async def list_videos(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Search by title or description"),
    sport: Optional[str] = Query(None, description="Filter by sport"),
    category: Optional[str] = Query(None, description="Filter by category"),
    status: Optional[str] = Query(None, description="Filter by status"),
    moderation_status: Optional[str] = Query(None, description="Filter by moderation status"),
    difficulty_level: Optional[str] = Query(None, description="Filter by difficulty level"),
    sort_by: str = Query("created_at", description="Sort field"),
    sort_order: str = Query("desc", description="Sort order: asc or desc"),
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(require_permissions([
        {"resource": "videos", "actions": ["read"]}
    ]))
) -> PaginatedVideoResponse:
    """
    Get paginated list of videos with filtering and search
    """
    try:
        result = get_videos_with_filters(
            db=db,
            page=page,
            limit=limit,
            search=search,
            sport=sport,
            category=category,
            status=status,
            moderation_status=moderation_status,
            difficulty_level=difficulty_level,
            sort_by=sort_by,
            sort_order=sort_order
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve videos: {str(e)}"
        )


@router.get("/{video_id}", response_model=VideoContentResponse)
async def get_video_details(
    video_id: int,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(require_permissions([
        {"resource": "videos", "actions": ["read"]}
    ]))
) -> VideoContentResponse:
    """
    Get detailed information about a specific video
    """
    try:
        video = get_video_by_id(db, video_id)
        if not video:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Video not found"
            )
        return video
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve video details: {str(e)}"
        )


@router.post("/", response_model=VideoContentResponse)
async def create_video(
    video_data: VideoContentCreate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(require_permissions([
        {"resource": "videos", "actions": ["write"]}
    ]))
) -> VideoContentResponse:
    """
    Create a new video content entry
    """
    try:
        video = create_video_content(db, video_data, current_user.id)
        return video
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create video: {str(e)}"
        )


@router.put("/{video_id}", response_model=VideoContentResponse)
async def update_video(
    video_id: int,
    video_data: VideoContentUpdate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(require_permissions([
        {"resource": "videos", "actions": ["write"]}
    ]))
) -> VideoContentResponse:
    """
    Update video content information
    """
    try:
        video = update_video_content(db, video_id, video_data)
        if not video:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Video not found"
            )
        return video
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update video: {str(e)}"
        )


@router.post("/{video_id}/moderate")
async def moderate_video_endpoint(
    video_id: int,
    moderation_request: VideoModerationRequest,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(require_permissions([
        {"resource": "videos", "actions": ["write"]}
    ]))
) -> Dict[str, str]:
    """
    Moderate video content (approve, reject, flag, unflag)
    """
    try:
        result = moderate_video(
            db=db,
            video_id=video_id,
            action=moderation_request.action,
            reason=moderation_request.reason,
            admin_id=current_user.id
        )
        
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Video not found"
            )
        
        return {"message": f"Video {moderation_request.action}ed successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to moderate video: {str(e)}"
        )


@router.delete("/{video_id}")
async def delete_video(
    video_id: int,
    permanent: bool = Query(False, description="Permanently delete video"),
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(require_permissions([
        {"resource": "videos", "actions": ["delete"]}
    ]))
) -> Dict[str, str]:
    """
    Delete or soft-delete a video
    """
    try:
        result = delete_video_content(db, video_id, permanent, current_user.id)
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Video not found"
            )
        
        message = "Video permanently deleted" if permanent else "Video marked as deleted"
        return {"message": message}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete video: {str(e)}"
        )


@router.post("/search", response_model=List[VideoContentListResponse])
async def search_videos_endpoint(
    search_request: VideoSearchRequest,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(require_permissions([
        {"resource": "videos", "actions": ["read"]}
    ]))
) -> List[VideoContentListResponse]:
    """
    Advanced video search with multiple criteria
    """
    try:
        videos = search_videos(db, search_request)
        return videos
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to search videos: {str(e)}"
        )


@router.get("/analytics/summary", response_model=VideoAnalytics)
async def get_video_analytics_summary(
    start_date: Optional[datetime] = Query(None, description="Start date for analytics"),
    end_date: Optional[datetime] = Query(None, description="End date for analytics"),
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(require_permissions([
        {"resource": "videos", "actions": ["read"]}
    ]))
) -> VideoAnalytics:
    """
    Get video analytics summary
    """
    try:
        analytics = get_video_analytics(db, start_date, end_date)
        return analytics
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve video analytics: {str(e)}"
        )


@router.post("/{video_id}/engagement")
async def update_video_engagement_endpoint(
    video_id: int,
    engagement_update: VideoEngagementUpdate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(require_permissions([
        {"resource": "videos", "actions": ["read"]}
    ]))
) -> Dict[str, str]:
    """
    Update video engagement metrics (views, likes, etc.)
    """
    try:
        result = update_video_engagement(
            db=db,
            video_id=video_id,
            action=engagement_update.action,
            user_id=engagement_update.user_id
        )
        
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Video not found"
            )
        
        return {"message": f"Video {engagement_update.action} updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update video engagement: {str(e)}"
        )


@router.post("/bulk-moderate")
async def bulk_moderate_videos(
    video_ids: List[int],
    action: str,
    reason: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(require_permissions([
        {"resource": "videos", "actions": ["write"]}
    ]))
) -> Dict[str, Any]:
    """
    Perform bulk moderation on multiple videos
    """
    try:
        from app.services.video_content_service import bulk_moderate_videos as bulk_moderate_service
        
        result = bulk_moderate_service(
            db=db,
            video_ids=video_ids,
            action=action,
            reason=reason,
            admin_id=current_user.id
        )
        
        return {
            "message": f"Bulk {action} applied to videos",
            "processed": result["processed"],
            "failed": result["failed"],
            "total": len(video_ids)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to perform bulk moderation: {str(e)}"
        )


@router.get("/moderation/queue")
async def get_moderation_queue(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(require_permissions([
        {"resource": "videos", "actions": ["read"]}
    ]))
) -> PaginatedVideoResponse:
    """
    Get videos pending moderation
    """
    try:
        result = get_videos_with_filters(
            db=db,
            page=page,
            limit=limit,
            moderation_status="unreviewed",
            sort_by="created_at",
            sort_order="asc"
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve moderation queue: {str(e)}"
        )


@router.get("/categories/options")
async def get_video_categories(
    current_user: AdminUser = Depends(require_permissions([
        {"resource": "videos", "actions": ["read"]}
    ]))
) -> Dict[str, List[str]]:
    """
    Get available video categories and options
    """
    return {
        "categories": ["tutorial", "workout", "technique", "match", "training"],
        "difficulty_levels": ["beginner", "intermediate", "advanced"],
        "sports": [
            "football", "basketball", "tennis", "cricket", "swimming",
            "athletics", "badminton", "volleyball", "hockey", "boxing"
        ],
        "statuses": ["pending", "approved", "rejected", "flagged"],
        "moderation_statuses": ["unreviewed", "approved", "rejected"]
    }


@router.post("/upload")
async def upload_video(
    file: UploadFile = File(...),
    title: str = Query(...),
    sport: str = Query(...),
    category: str = Query(...),
    description: Optional[str] = Query(None),
    difficulty_level: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(require_permissions([
        {"resource": "videos", "actions": ["write"]}
    ]))
) -> Dict[str, str]:
    """
    Upload a new video file
    """
    try:
        # This would implement actual file upload logic
        # For now, return a mock response
        return {
            "message": "Video upload functionality will be implemented with file storage service",
            "filename": file.filename,
            "title": title,
            "sport": sport,
            "category": category
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload video: {str(e)}"
        )