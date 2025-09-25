"""
Video content service functions
"""

import json
from datetime import datetime, timedelta
from typing import List, Optional, Dict
from sqlalchemy.orm import Session
from sqlalchemy import or_, func, desc, asc

from app.models.models import VideoContent, VideoModerationLog
from app.schemas.video_content import (
    VideoContentResponse,
    VideoContentListResponse,
    VideoContentCreate,
    VideoContentUpdate,
    VideoSearchRequest,
    PaginatedVideoResponse,
    VideoAnalytics
)


def get_videos_with_filters(
    db: Session,
    page: int = 1,
    limit: int = 20,
    search: Optional[str] = None,
    sport: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    moderation_status: Optional[str] = None,
    difficulty_level: Optional[str] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc"
) -> PaginatedVideoResponse:
    """Get paginated list of videos with filtering"""
    
    # Base query
    query = db.query(VideoContent)
    
    # Apply filters
    if search:
        search_filter = or_(
            VideoContent.title.ilike(f"%{search}%"),
            VideoContent.description.ilike(f"%{search}%"),
            VideoContent.tags.ilike(f"%{search}%")
        )
        query = query.filter(search_filter)
    
    if sport:
        query = query.filter(VideoContent.sport == sport)
    
    if category:
        query = query.filter(VideoContent.category == category)
    
    if status:
        query = query.filter(VideoContent.status == status)
    
    if moderation_status:
        query = query.filter(VideoContent.moderation_status == moderation_status)
    
    if difficulty_level:
        query = query.filter(VideoContent.difficulty_level == difficulty_level)
    
    # Apply sorting
    sort_column = getattr(VideoContent, sort_by, VideoContent.created_at)
    if sort_order.lower() == "desc":
        query = query.order_by(desc(sort_column))
    else:
        query = query.order_by(asc(sort_column))
    
    # Get total count
    total = query.count()
    
    # Apply pagination
    offset = (page - 1) * limit
    videos = query.offset(offset).limit(limit).all()
    
    # Convert to response format
    video_responses = []
    for video in videos:
        video_responses.append(VideoContentListResponse(
            id=video.id,
            title=video.title,
            sport=video.sport,
            category=video.category,
            status=video.status,
            moderation_status=video.moderation_status,
            view_count=video.view_count,
            duration=video.duration,
            thumbnail_url=video.thumbnail_url,
            created_at=video.created_at,
            published_at=video.published_at
        ))
    
    total_pages = (total + limit - 1) // limit
    
    return PaginatedVideoResponse(
        videos=video_responses,
        total=total,
        page=page,
        limit=limit,
        total_pages=total_pages,
        has_next=page < total_pages,
        has_prev=page > 1
    )


def get_video_by_id(db: Session, video_id: int) -> Optional[VideoContentResponse]:
    """Get detailed information about a specific video"""
    
    video = db.query(VideoContent).filter(VideoContent.id == video_id).first()
    if not video:
        return None
    
    # Parse tags from JSON string
    tags = []
    if video.tags:
        try:
            tags = json.loads(video.tags)
        except json.JSONDecodeError:
            tags = []
    
    return VideoContentResponse(
        id=video.id,
        title=video.title,
        description=video.description,
        file_url=video.file_url,
        thumbnail_url=video.thumbnail_url,
        duration=video.duration,
        file_size=video.file_size,
        sport=video.sport,
        category=video.category,
        difficulty_level=video.difficulty_level,
        tags=tags,
        status=video.status,
        moderation_status=video.moderation_status,
        moderation_reason=video.moderation_reason,
        moderated_by=video.moderated_by,
        moderated_at=video.moderated_at,
        uploaded_by=video.uploaded_by,
        upload_source=video.upload_source,
        view_count=video.view_count,
        like_count=video.like_count,
        dislike_count=video.dislike_count,
        share_count=video.share_count,
        created_at=video.created_at,
        updated_at=video.updated_at,
        published_at=video.published_at
    )


def create_video_content(
    db: Session,
    video_data: VideoContentCreate,
    admin_id: int
) -> VideoContentResponse:
    """Create a new video content entry"""
    
    # Serialize tags to JSON
    tags_json = None
    if video_data.tags:
        tags_json = json.dumps(video_data.tags)
    
    # Create video content
    db_video = VideoContent(
        title=video_data.title,
        description=video_data.description,
        file_url=video_data.file_url,
        thumbnail_url=video_data.thumbnail_url,
        duration=video_data.duration,
        file_size=video_data.file_size,
        sport=video_data.sport,
        category=video_data.category,
        difficulty_level=video_data.difficulty_level,
        tags=tags_json,
        upload_source=video_data.upload_source,
        uploaded_by=admin_id,
        status="approved",  # Admin uploads are auto-approved
        moderation_status="approved",
        moderated_by=admin_id,
        moderated_at=datetime.utcnow(),
        published_at=datetime.utcnow()
    )
    
    db.add(db_video)
    db.commit()
    db.refresh(db_video)
    
    return get_video_by_id(db, db_video.id)


def update_video_content(
    db: Session,
    video_id: int,
    video_data: VideoContentUpdate
) -> Optional[VideoContentResponse]:
    """Update video content information"""
    
    video = db.query(VideoContent).filter(VideoContent.id == video_id).first()
    if not video:
        return None
    
    # Update fields
    update_data = video_data.model_dump(exclude_unset=True)
    
    # Handle tags separately
    if "tags" in update_data:
        tags = update_data.pop("tags")
        if tags:
            update_data["tags"] = json.dumps(tags)
        else:
            update_data["tags"] = None
    
    # Update video
    for field, value in update_data.items():
        setattr(video, field, value)
    
    video.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(video)
    
    return get_video_by_id(db, video_id)


def moderate_video(
    db: Session,
    video_id: int,
    action: str,
    reason: Optional[str] = None,
    admin_id: int = None
) -> bool:
    """Moderate video content"""
    
    video = db.query(VideoContent).filter(VideoContent.id == video_id).first()
    if not video:
        return False
    
    previous_status = video.moderation_status
    
    # Update moderation status based on action
    if action == "approve":
        video.moderation_status = "approved"
        video.status = "approved"
        video.published_at = datetime.utcnow()
    elif action == "reject":
        video.moderation_status = "rejected"
        video.status = "rejected"
        video.published_at = None
    elif action == "flag":
        video.moderation_status = "rejected"
        video.status = "flagged"
        video.published_at = None
    elif action == "unflag":
        video.moderation_status = "approved"
        video.status = "approved"
        video.published_at = datetime.utcnow()
    
    video.moderation_reason = reason
    video.moderated_by = admin_id
    video.moderated_at = datetime.utcnow()
    video.updated_at = datetime.utcnow()
    
    # Log moderation action
    moderation_log = VideoModerationLog(
        video_id=video_id,
        admin_id=admin_id,
        action=action,
        reason=reason,
        previous_status=previous_status,
        new_status=video.moderation_status
    )
    
    db.add(moderation_log)
    db.commit()
    
    return True


def delete_video_content(
    db: Session,
    video_id: int,
    permanent: bool = False,
    admin_id: int = None
) -> bool:
    """Delete or soft-delete video content"""
    
    video = db.query(VideoContent).filter(VideoContent.id == video_id).first()
    if not video:
        return False
    
    if permanent:
        # Permanent deletion
        db.delete(video)
    else:
        # Soft delete - mark as deleted
        video.status = "deleted"
        video.moderation_status = "rejected"
        video.moderated_by = admin_id
        video.moderated_at = datetime.utcnow()
        video.updated_at = datetime.utcnow()
    
    db.commit()
    return True


def search_videos(
    db: Session,
    search_request: VideoSearchRequest
) -> List[VideoContentListResponse]:
    """Advanced video search with multiple criteria"""
    
    query = db.query(VideoContent)
    
    # Text search
    if search_request.query:
        text_filter = or_(
            VideoContent.title.ilike(f"%{search_request.query}%"),
            VideoContent.description.ilike(f"%{search_request.query}%"),
            VideoContent.tags.ilike(f"%{search_request.query}%")
        )
        query = query.filter(text_filter)
    
    # Sports filter
    if search_request.sports:
        query = query.filter(VideoContent.sport.in_(search_request.sports))
    
    # Categories filter
    if search_request.categories:
        query = query.filter(VideoContent.category.in_(search_request.categories))
    
    # Difficulty levels filter
    if search_request.difficulty_levels:
        query = query.filter(VideoContent.difficulty_level.in_(search_request.difficulty_levels))
    
    # Status filter
    if search_request.status:
        query = query.filter(VideoContent.status.in_(search_request.status))
    
    # Moderation status filter
    if search_request.moderation_status:
        query = query.filter(VideoContent.moderation_status.in_(search_request.moderation_status))
    
    # Date range filters
    if search_request.uploaded_after:
        query = query.filter(VideoContent.created_at >= search_request.uploaded_after)
    
    if search_request.uploaded_before:
        query = query.filter(VideoContent.created_at <= search_request.uploaded_before)
    
    # Duration filters
    if search_request.min_duration:
        query = query.filter(VideoContent.duration >= search_request.min_duration)
    
    if search_request.max_duration:
        query = query.filter(VideoContent.duration <= search_request.max_duration)
    
    # Views filter
    if search_request.min_views:
        query = query.filter(VideoContent.view_count >= search_request.min_views)
    
    # Tags filter
    if search_request.tags:
        for tag in search_request.tags:
            query = query.filter(VideoContent.tags.ilike(f"%{tag}%"))
    
    # Apply limit and get results
    videos = query.limit(search_request.limit).all()
    
    # Convert to response format
    video_responses = []
    for video in videos:
        video_responses.append(VideoContentListResponse(
            id=video.id,
            title=video.title,
            sport=video.sport,
            category=video.category,
            status=video.status,
            moderation_status=video.moderation_status,
            view_count=video.view_count,
            duration=video.duration,
            thumbnail_url=video.thumbnail_url,
            created_at=video.created_at,
            published_at=video.published_at
        ))
    
    return video_responses


def get_video_analytics(
    db: Session,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None
) -> VideoAnalytics:
    """Get video analytics summary"""
    
    # Default date range
    if not end_date:
        end_date = datetime.utcnow()
    if not start_date:
        start_date = end_date - timedelta(days=30)
    
    # Base query for date range
    base_query = db.query(VideoContent).filter(
        VideoContent.created_at >= start_date,
        VideoContent.created_at <= end_date
    )
    
    # Basic counts
    total_videos = base_query.count()
    approved_videos = base_query.filter(VideoContent.status == "approved").count()
    pending_videos = base_query.filter(VideoContent.moderation_status == "unreviewed").count()
    flagged_videos = base_query.filter(VideoContent.status == "flagged").count()
    
    # Engagement metrics
    total_views = db.query(func.sum(VideoContent.view_count)).scalar() or 0
    total_duration = db.query(func.sum(VideoContent.duration)).filter(
        VideoContent.duration.isnot(None)
    ).scalar() or 0
    
    avg_duration = db.query(func.avg(VideoContent.duration)).filter(
        VideoContent.duration.isnot(None)
    ).scalar() or 0
    
    # Top sports
    top_sports_data = db.query(
        VideoContent.sport,
        func.count(VideoContent.id).label('count'),
        func.sum(VideoContent.view_count).label('total_views')
    ).group_by(VideoContent.sport).order_by(func.count(VideoContent.id).desc()).limit(10).all()
    
    top_sports = []
    for sport, count, views in top_sports_data:
        top_sports.append({
            "sport": sport,
            "video_count": count,
            "total_views": views or 0,
            "percentage": round((count / total_videos) * 100, 2) if total_videos > 0 else 0
        })
    
    # Top categories
    top_categories_data = db.query(
        VideoContent.category,
        func.count(VideoContent.id).label('count'),
        func.sum(VideoContent.view_count).label('total_views')
    ).group_by(VideoContent.category).order_by(func.count(VideoContent.id).desc()).limit(10).all()
    
    top_categories = []
    for category, count, views in top_categories_data:
        top_categories.append({
            "category": category,
            "video_count": count,
            "total_views": views or 0,
            "percentage": round((count / total_videos) * 100, 2) if total_videos > 0 else 0
        })
    
    # Upload trend (daily for last 30 days)
    upload_trend = []
    for i in range(30):
        date = (end_date - timedelta(days=i)).date()
        count = db.query(VideoContent).filter(
            func.date(VideoContent.created_at) == date
        ).count()
        upload_trend.append({
            "date": date.isoformat(),
            "uploads": count
        })
    upload_trend.reverse()
    
    # Engagement metrics
    engagement_metrics = {
        "average_views_per_video": round(total_views / total_videos, 2) if total_videos > 0 else 0,
        "total_likes": db.query(func.sum(VideoContent.like_count)).scalar() or 0,
        "total_shares": db.query(func.sum(VideoContent.share_count)).scalar() or 0,
        "engagement_rate": 0.0  # Would calculate based on views, likes, shares
    }
    
    return VideoAnalytics(
        total_videos=total_videos,
        approved_videos=approved_videos,
        pending_videos=pending_videos,
        flagged_videos=flagged_videos,
        total_views=total_views,
        total_duration=total_duration,
        average_duration=round(avg_duration, 2),
        top_sports=top_sports,
        top_categories=top_categories,
        upload_trend=upload_trend,
        engagement_metrics=engagement_metrics
    )


def update_video_engagement(
    db: Session,
    video_id: int,
    action: str,
    user_id: Optional[int] = None
) -> bool:
    """Update video engagement metrics"""
    
    video = db.query(VideoContent).filter(VideoContent.id == video_id).first()
    if not video:
        return False
    
    # Update engagement based on action
    if action == "view":
        video.view_count += 1
    elif action == "like":
        video.like_count += 1
    elif action == "dislike":
        video.dislike_count += 1
    elif action == "share":
        video.share_count += 1
    
    video.updated_at = datetime.utcnow()
    
    db.commit()
    return True


def bulk_moderate_videos(
    db: Session,
    video_ids: List[int],
    action: str,
    reason: Optional[str] = None,
    admin_id: int = None
) -> Dict[str, List[int]]:
    """Perform bulk moderation on multiple videos"""
    
    processed = []
    failed = []
    
    for video_id in video_ids:
        try:
            success = moderate_video(
                db=db,
                video_id=video_id,
                action=action,
                reason=reason,
                admin_id=admin_id
            )
            if success:
                processed.append(video_id)
            else:
                failed.append(video_id)
        except Exception:
            failed.append(video_id)
    
    return {
        "processed": processed,
        "failed": failed
    }