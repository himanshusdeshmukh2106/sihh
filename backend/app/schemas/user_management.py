"""
User management Pydantic schemas for request/response models
"""

from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr


class UserListResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    is_active: bool
    profile_completed: bool
    primary_sport: Optional[str] = None
    experience_level: Optional[str] = None
    city: Optional[str] = None
    created_at: datetime
    last_activity: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserDetailResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    is_active: bool
    profile_completed: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    # Profile information
    phone: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    gender: Optional[str] = None
    
    # Physical stats
    height: Optional[int] = None
    weight: Optional[int] = None
    
    # Location
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    pincode: Optional[str] = None
    
    # Sports information
    primary_sport: Optional[str] = None
    secondary_sports: Optional[str] = None
    experience_level: Optional[str] = None
    years_of_experience: Optional[int] = None
    current_team: Optional[str] = None
    coach_name: Optional[str] = None
    coach_contact: Optional[str] = None
    
    # Goals and preferences
    training_goals: Optional[str] = None
    preferred_training_time: Optional[str] = None
    availability_days: Optional[str] = None
    
    # Medical information
    medical_conditions: Optional[str] = None
    allergies: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    emergency_contact_relation: Optional[str] = None
    
    # Supabase integration
    supabase_user_id: Optional[str] = None

    class Config:
        from_attributes = True


class UserSearchRequest(BaseModel):
    query: Optional[str] = None
    sports: Optional[List[str]] = None
    experience_levels: Optional[List[str]] = None
    locations: Optional[List[str]] = None
    age_range: Optional[Dict[str, int]] = None  # {"min": 18, "max": 65}
    gender: Optional[str] = None
    is_active: Optional[bool] = None
    profile_completed: Optional[bool] = None
    created_after: Optional[datetime] = None
    created_before: Optional[datetime] = None
    limit: int = 50


class UserStatusUpdate(BaseModel):
    status: str  # 'active', 'inactive', 'suspended'
    reason: Optional[str] = None


class UserActivitySummary(BaseModel):
    user_id: int
    total_sessions: int
    last_activity: Optional[datetime] = None
    profile_completion_percentage: float
    engagement_score: float
    activity_timeline: List[Dict[str, Any]]
    
    # Mock activity data for now
    sessions_this_week: int = 0
    sessions_this_month: int = 0
    average_session_duration: float = 0.0
    features_used: List[str] = []


class PaginatedUserResponse(BaseModel):
    users: List[UserListResponse]
    total: int
    page: int
    limit: int
    total_pages: int
    has_next: bool
    has_prev: bool


class UserBulkAction(BaseModel):
    user_ids: List[int]
    action: str  # 'activate', 'deactivate', 'suspend', 'delete'
    reason: Optional[str] = None


class UserExportRequest(BaseModel):
    format: str = "csv"  # 'csv', 'excel', 'json'
    filters: Optional[UserSearchRequest] = None
    fields: Optional[List[str]] = None  # Specific fields to export