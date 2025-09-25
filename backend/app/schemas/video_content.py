"""
Video Content Pydantic schemas for request/response models
"""

from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, HttpUrl


class VideoContentBase(BaseModel):
    title: str
    description: Optional[str] = None
    sport: str
    category: str  # 'tutorial', 'workout', 'technique', 'match', 'training'
    difficulty_level: Optional[str] = None  # 'beginner', 'intermediate', 'advanced'
    tags: Optional[List[str]] = None


class VideoContentCreate(VideoContentBase):
    file_url: str
    thumbnail_url: Optional[str] = None
    duration: Optional[int] = None  # in seconds
    file_size: Optional[int] = None  # in bytes
    upload_source: str = "admin"  # 'admin', 'user', 'api'


class VideoContentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    sport: Optional[str] = None
    category: Optional[str] = None
    difficulty_level: Optional[str] = None
    tags: Optional[List[str]] = None
    thumbnail_url: Optional[str] = None


class VideoContentResponse(VideoContentBase):
    id: int
    file_url: str
    thumbnail_url: Optional[str] = None
    duration: Optional[int] = None
    file_size: Optional[int] = None
    
    # Status and moderation
    status: str
    moderation_status: str
    moderation_reason: Optional[str] = None
    moderated_by: Optional[int] = None
    moderated_at: Optional[datetime] = None
    
    # Upload information
    uploaded_by: Optional[int] = None
    upload_source: Optional[str] = None
    
    # Engagement metrics
    view_count: int = 0
    like_count: int = 0
    dislike_count: int = 0
    share_count: int = 0
    
    # Timestamps
    created_at: datetime
    updated_at: Optional[datetime] = None
    published_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class VideoContentListResponse(BaseModel):
    id: int
    title: str
    sport: str
    category: str
    status: str
    moderation_status: str
    view_count: int
    duration: Optional[int] = None
    thumbnail_url: Optional[str] = None
    created_at: datetime
    published_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class VideoModerationRequest(BaseModel):
    action: str  # 'approve', 'reject', 'flag', 'unflag'
    reason: Optional[str] = None


class VideoModerationResponse(BaseModel):
    id: int
    video_id: int
    admin_id: int
    action: str
    reason: Optional[str] = None
    previous_status: Optional[str] = None
    new_status: str
    created_at: datetime

    class Config:
        from_attributes = True


class VideoSearchRequest(BaseModel):
    query: Optional[str] = None
    sports: Optional[List[str]] = None
    categories: Optional[List[str]] = None
    difficulty_levels: Optional[List[str]] = None
    status: Optional[List[str]] = None
    moderation_status: Optional[List[str]] = None
    uploaded_after: Optional[datetime] = None
    uploaded_before: Optional[datetime] = None
    min_duration: Optional[int] = None
    max_duration: Optional[int] = None
    min_views: Optional[int] = None
    tags: Optional[List[str]] = None
    limit: int = 50


class PaginatedVideoResponse(BaseModel):
    videos: List[VideoContentListResponse]
    total: int
    page: int
    limit: int
    total_pages: int
    has_next: bool
    has_prev: bool


class VideoAnalytics(BaseModel):
    total_videos: int
    approved_videos: int
    pending_videos: int
    flagged_videos: int
    total_views: int
    total_duration: int  # in seconds
    average_duration: float
    top_sports: List[Dict[str, Any]]
    top_categories: List[Dict[str, Any]]
    upload_trend: List[Dict[str, Any]]
    engagement_metrics: Dict[str, Any]


class VideoEngagementUpdate(BaseModel):
    action: str  # 'view', 'like', 'dislike', 'share'
    user_id: Optional[int] = None


class VideoBulkAction(BaseModel):
    video_ids: List[int]
    action: str  # 'approve', 'reject', 'delete', 'flag', 'unflag'
    reason: Optional[str] = None


class VideoUploadRequest(BaseModel):
    title: str
    description: Optional[str] = None
    sport: str
    category: str
    difficulty_level: Optional[str] = None
    tags: Optional[List[str]] = None
    # File upload would be handled separately via multipart/form-data


class VideoExportRequest(BaseModel):
    format: str = "csv"  # 'csv', 'excel', 'json'
    filters: Optional[VideoSearchRequest] = None
    fields: Optional[List[str]] = None
    include_analytics: bool = False