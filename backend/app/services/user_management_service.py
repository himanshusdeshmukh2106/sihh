"""
User management service functions
"""

from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import or_, func, desc, asc

from app.models.models import User
from app.schemas.user_management import (
    UserListResponse,
    UserDetailResponse,
    UserSearchRequest,
    UserActivitySummary,
    PaginatedUserResponse
)


def get_users_with_filters(
    db: Session,
    page: int = 1,
    limit: int = 20,
    search: Optional[str] = None,
    sport: Optional[str] = None,
    status: Optional[str] = None,
    experience_level: Optional[str] = None,
    location: Optional[str] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc"
) -> PaginatedUserResponse:
    """Get paginated list of users with filtering"""
    
    # Base query
    query = db.query(User)
    
    # Apply filters
    if search:
        search_filter = or_(
            User.full_name.ilike(f"%{search}%"),
            User.email.ilike(f"%{search}%"),
            User.primary_sport.ilike(f"%{search}%")
        )
        query = query.filter(search_filter)
    
    if sport:
        query = query.filter(
            or_(
                User.primary_sport == sport,
                User.secondary_sports.contains(sport)
            )
        )
    
    if status:
        if status == "active":
            query = query.filter(User.is_active.is_(True))
        elif status == "inactive":
            query = query.filter(User.is_active.is_(False))
    
    if experience_level:
        query = query.filter(User.experience_level == experience_level)
    
    if location:
        query = query.filter(User.city.ilike(f"%{location}%"))
    
    # Apply sorting
    sort_column = getattr(User, sort_by, User.created_at)
    if sort_order.lower() == "desc":
        query = query.order_by(desc(sort_column))
    else:
        query = query.order_by(asc(sort_column))
    
    # Get total count
    total = query.count()
    
    # Apply pagination
    offset = (page - 1) * limit
    users = query.offset(offset).limit(limit).all()
    
    # Convert to response format
    user_responses = []
    for user in users:
        user_responses.append(UserListResponse(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            is_active=user.is_active,
            profile_completed=user.profile_completed,
            primary_sport=user.primary_sport,
            experience_level=user.experience_level,
            city=user.city,
            created_at=user.created_at,
            last_activity=user.updated_at  # Mock last activity
        ))
    
    total_pages = (total + limit - 1) // limit
    
    return PaginatedUserResponse(
        users=user_responses,
        total=total,
        page=page,
        limit=limit,
        total_pages=total_pages,
        has_next=page < total_pages,
        has_prev=page > 1
    )


def get_user_detail(db: Session, user_id: int) -> Optional[UserDetailResponse]:
    """Get detailed information about a specific user"""
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None
    
    return UserDetailResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        is_active=user.is_active,
        profile_completed=user.profile_completed,
        created_at=user.created_at,
        updated_at=user.updated_at,
        phone=user.phone,
        date_of_birth=user.date_of_birth,
        gender=user.gender,
        height=user.height,
        weight=user.weight,
        address=user.address,
        city=user.city,
        state=user.state,
        country=user.country,
        pincode=user.pincode,
        primary_sport=user.primary_sport,
        secondary_sports=user.secondary_sports,
        experience_level=user.experience_level,
        years_of_experience=user.years_of_experience,
        current_team=user.current_team,
        coach_name=user.coach_name,
        coach_contact=user.coach_contact,
        training_goals=user.training_goals,
        preferred_training_time=user.preferred_training_time,
        availability_days=user.availability_days,
        medical_conditions=user.medical_conditions,
        allergies=user.allergies,
        emergency_contact_name=user.emergency_contact_name,
        emergency_contact_phone=user.emergency_contact_phone,
        emergency_contact_relation=user.emergency_contact_relation,
        supabase_user_id=user.supabase_user_id
    )


def update_user_status(
    db: Session,
    user_id: int,
    new_status: str,
    reason: Optional[str] = None,
    admin_id: Optional[int] = None
) -> Optional[UserDetailResponse]:
    """Update user status"""
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None
    
    # Update status
    if new_status == "active":
        user.is_active = True
    elif new_status in ["inactive", "suspended"]:
        user.is_active = False
    
    user.updated_at = datetime.utcnow()
    
    # TODO: Log the status change with reason and admin_id
    # This would typically go to an audit log table
    
    db.commit()
    db.refresh(user)
    
    return get_user_detail(db, user_id)


def get_user_activity_summary(
    db: Session,
    user_id: int,
    days: int = 30
) -> Optional[UserActivitySummary]:
    """Get user activity summary and engagement metrics"""
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None
    
    # Calculate profile completion percentage
    profile_fields = [
        user.full_name, user.phone, user.date_of_birth, user.gender,
        user.height, user.weight, user.city, user.primary_sport,
        user.experience_level, user.training_goals
    ]
    completed_fields = sum(1 for field in profile_fields if field is not None)
    profile_completion = (completed_fields / len(profile_fields)) * 100
    
    # Mock activity data (in a real app, this would come from activity logs)
    activity_timeline = [
        {
            "date": (datetime.utcnow() - timedelta(days=i)).isoformat(),
            "activity": "Profile Update" if i % 7 == 0 else "Login",
            "details": f"Updated {['profile', 'sports info', 'goals'][i % 3]}" if i % 7 == 0 else "User logged in"
        }
        for i in range(min(days, 10))  # Last 10 activities
    ]
    
    # Mock engagement score based on profile completion and activity
    engagement_score = min(100, profile_completion * 0.7 + (len(activity_timeline) * 3))
    
    return UserActivitySummary(
        user_id=user_id,
        total_sessions=len(activity_timeline),
        last_activity=user.updated_at,
        profile_completion_percentage=round(profile_completion, 2),
        engagement_score=round(engagement_score, 2),
        activity_timeline=activity_timeline,
        sessions_this_week=min(7, len(activity_timeline)),
        sessions_this_month=len(activity_timeline),
        average_session_duration=12.5,  # Mock: 12.5 minutes
        features_used=["Profile Setup", "Sport Selection", "Goal Setting"]
    )


def search_users(
    db: Session,
    search_request: UserSearchRequest
) -> List[UserListResponse]:
    """Advanced user search with multiple criteria"""
    
    query = db.query(User)
    
    # Text search
    if search_request.query:
        text_filter = or_(
            User.full_name.ilike(f"%{search_request.query}%"),
            User.email.ilike(f"%{search_request.query}%"),
            User.primary_sport.ilike(f"%{search_request.query}%"),
            User.city.ilike(f"%{search_request.query}%")
        )
        query = query.filter(text_filter)
    
    # Sports filter
    if search_request.sports:
        sport_filters = []
        for sport in search_request.sports:
            sport_filters.append(User.primary_sport == sport)
            sport_filters.append(User.secondary_sports.contains(sport))
        query = query.filter(or_(*sport_filters))
    
    # Experience levels filter
    if search_request.experience_levels:
        query = query.filter(User.experience_level.in_(search_request.experience_levels))
    
    # Locations filter
    if search_request.locations:
        location_filters = [User.city.ilike(f"%{loc}%") for loc in search_request.locations]
        query = query.filter(or_(*location_filters))
    
    # Age range filter
    if search_request.age_range:
        today = datetime.utcnow()
        if "min" in search_request.age_range:
            min_birth_date = today - timedelta(days=search_request.age_range["min"] * 365)
            query = query.filter(User.date_of_birth <= min_birth_date)
        if "max" in search_request.age_range:
            max_birth_date = today - timedelta(days=search_request.age_range["max"] * 365)
            query = query.filter(User.date_of_birth >= max_birth_date)
    
    # Gender filter
    if search_request.gender:
        query = query.filter(User.gender == search_request.gender)
    
    # Active status filter
    if search_request.is_active is not None:
        query = query.filter(User.is_active == search_request.is_active)
    
    # Profile completion filter
    if search_request.profile_completed is not None:
        query = query.filter(User.profile_completed == search_request.profile_completed)
    
    # Date range filters
    if search_request.created_after:
        query = query.filter(User.created_at >= search_request.created_after)
    
    if search_request.created_before:
        query = query.filter(User.created_at <= search_request.created_before)
    
    # Apply limit and get results
    users = query.limit(search_request.limit).all()
    
    # Convert to response format
    user_responses = []
    for user in users:
        user_responses.append(UserListResponse(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            is_active=user.is_active,
            profile_completed=user.profile_completed,
            primary_sport=user.primary_sport,
            experience_level=user.experience_level,
            city=user.city,
            created_at=user.created_at,
            last_activity=user.updated_at
        ))
    
    return user_responses


def get_user_statistics(db: Session) -> Dict[str, Any]:
    """Get comprehensive user statistics"""
    
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
    ).group_by(User.primary_sport).order_by(func.count(User.id).desc()).all()
    
    # Users by experience level
    experience_stats = db.query(
        User.experience_level,
        func.count(User.id).label('count')
    ).filter(
        User.experience_level.isnot(None)
    ).group_by(User.experience_level).order_by(func.count(User.id).desc()).all()
    
    return {
        "total_users": total_users,
        "active_users": active_users,
        "inactive_users": total_users - active_users,
        "completed_profiles": completed_profiles,
        "new_users_this_month": new_users_this_month,
        "completion_rate": round((completed_profiles / total_users) * 100, 2) if total_users > 0 else 0,
        "sport_distribution": [{"sport": sport, "count": count} for sport, count in sport_stats],
        "experience_distribution": [{"level": level, "count": count} for level, count in experience_stats]
    }