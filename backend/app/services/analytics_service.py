"""
Analytics service functions
"""

from datetime import datetime, timedelta
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_

from app.models.models import User
from app.schemas.analytics import (
    UserAnalytics,
    SportAnalytics,
    EngagementMetrics,
    SystemMetrics,
    TimeSeriesData,
    LocationData,
    SportData,
    ExperienceData
)


def get_user_analytics(
    db: Session,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    sports: Optional[List[str]] = None
) -> UserAnalytics:
    """Get user analytics data"""
    
    # Default date range - last 30 days
    if not end_date:
        end_date = datetime.utcnow()
    if not start_date:
        start_date = end_date - timedelta(days=30)
    
    # Base query
    base_query = db.query(User)
    
    # Apply sport filter if provided
    if sports:
        sport_conditions = []
        for sport in sports:
            sport_conditions.append(User.primary_sport == sport)
            sport_conditions.append(User.secondary_sports.contains(sport))
        base_query = base_query.filter(or_(*sport_conditions))
    
    # Total users
    total_users = base_query.count()
    
    # Active users (users with profile completed)
    active_users = base_query.filter(User.profile_completed.is_(True)).count()
    
    # New users today
    today = datetime.utcnow().date()
    new_users_today = base_query.filter(
        func.date(User.created_at) == today
    ).count()
    
    # New users this week
    week_ago = datetime.utcnow() - timedelta(days=7)
    new_users_this_week = base_query.filter(
        User.created_at >= week_ago
    ).count()
    
    # New users this month
    month_ago = datetime.utcnow() - timedelta(days=30)
    new_users_this_month = base_query.filter(
        User.created_at >= month_ago
    ).count()
    
    # User growth rate (compared to previous month)
    two_months_ago = datetime.utcnow() - timedelta(days=60)
    previous_month_users = base_query.filter(
        and_(User.created_at >= two_months_ago, User.created_at < month_ago)
    ).count()
    
    user_growth_rate = 0.0
    if previous_month_users > 0:
        user_growth_rate = ((new_users_this_month - previous_month_users) / previous_month_users) * 100
    
    # Registration trend (daily for last 30 days)
    registration_trend = []
    for i in range(30):
        date = (end_date - timedelta(days=i)).date()
        count = base_query.filter(func.date(User.created_at) == date).count()
        registration_trend.append(TimeSeriesData(
            date=date.isoformat(),
            value=count
        ))
    registration_trend.reverse()
    
    # Users by location (top 10 cities)
    location_data = db.query(
        User.city,
        func.count(User.id).label('count')
    ).filter(
        User.city.isnot(None)
    ).group_by(User.city).order_by(func.count(User.id).desc()).limit(10).all()
    
    users_by_location = []
    for city, count in location_data:
        percentage = (count / total_users) * 100 if total_users > 0 else 0
        users_by_location.append(LocationData(
            location=city,
            count=count,
            percentage=round(percentage, 2)
        ))
    
    # Users by sport (primary sport)
    sport_data = db.query(
        User.primary_sport,
        func.count(User.id).label('count')
    ).filter(
        User.primary_sport.isnot(None)
    ).group_by(User.primary_sport).order_by(func.count(User.id).desc()).all()
    
    users_by_sport = []
    for sport, count in sport_data:
        percentage = (count / total_users) * 100 if total_users > 0 else 0
        # Mock growth calculation
        growth = round((count / total_users) * 10, 2)  # Simplified growth metric
        users_by_sport.append(SportData(
            sport=sport,
            count=count,
            percentage=round(percentage, 2),
            growth=growth
        ))
    
    # Users by experience level
    experience_data = db.query(
        User.experience_level,
        func.count(User.id).label('count')
    ).filter(
        User.experience_level.isnot(None)
    ).group_by(User.experience_level).order_by(func.count(User.id).desc()).all()
    
    users_by_experience = []
    for level, count in experience_data:
        percentage = (count / total_users) * 100 if total_users > 0 else 0
        users_by_experience.append(ExperienceData(
            level=level,
            count=count,
            percentage=round(percentage, 2)
        ))
    
    return UserAnalytics(
        total_users=total_users,
        active_users=active_users,
        new_users_today=new_users_today,
        new_users_this_week=new_users_this_week,
        new_users_this_month=new_users_this_month,
        user_growth_rate=round(user_growth_rate, 2),
        registration_trend=registration_trend,
        users_by_location=users_by_location,
        users_by_sport=users_by_sport,
        users_by_experience=users_by_experience
    )


def get_sport_analytics(
    db: Session,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None
) -> SportAnalytics:
    """Get sport analytics data"""
    
    # Default date range
    if not end_date:
        end_date = datetime.utcnow()
    if not start_date:
        start_date = end_date - timedelta(days=30)
    
    # Sport popularity (based on primary sport)
    sport_data = db.query(
        User.primary_sport,
        func.count(User.id).label('count')
    ).filter(
        User.primary_sport.isnot(None)
    ).group_by(User.primary_sport).order_by(func.count(User.id).desc()).all()
    
    total_users = db.query(User).count()
    sport_popularity = []
    
    for sport, count in sport_data:
        percentage = (count / total_users) * 100 if total_users > 0 else 0
        # Mock growth calculation
        growth = round((count / total_users) * 15, 2)
        sport_popularity.append(SportData(
            sport=sport,
            count=count,
            percentage=round(percentage, 2),
            growth=growth
        ))
    
    # Sport growth trends (mock data for now)
    sport_growth_trends = []
    for i in range(30):
        date = (end_date - timedelta(days=i)).date()
        # Mock trend data
        value = len(sport_data) + (i % 5)
        sport_growth_trends.append(TimeSeriesData(
            date=date.isoformat(),
            value=value
        ))
    sport_growth_trends.reverse()
    
    # Sport engagement (mock data)
    sport_engagement = [
        {"sport": sport, "engagement_score": count * 0.8}
        for sport, count in sport_data[:10]
    ]
    
    # Top sports (top 5)
    top_sports = sport_popularity[:5]
    
    return SportAnalytics(
        sport_popularity=sport_popularity,
        sport_growth_trends=sport_growth_trends,
        sport_engagement=sport_engagement,
        top_sports=top_sports
    )


def get_engagement_metrics(
    db: Session,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None
) -> EngagementMetrics:
    """Get engagement metrics (mock data for now)"""
    
    # Default date range
    if not end_date:
        end_date = datetime.utcnow()
    if not start_date:
        start_date = end_date - timedelta(days=30)
    
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.profile_completed.is_(True)).count()
    
    # Mock engagement data
    session_trend = []
    for i in range(30):
        date = (end_date - timedelta(days=i)).date()
        # Mock session data
        value = active_users + (i % 10)
        session_trend.append(TimeSeriesData(
            date=date.isoformat(),
            value=value
        ))
    session_trend.reverse()
    
    feature_usage = [
        {"feature": "Profile Setup", "usage_count": active_users},
        {"feature": "Sport Selection", "usage_count": int(active_users * 0.9)},
        {"feature": "Goal Setting", "usage_count": int(active_users * 0.7)},
        {"feature": "Coach Contact", "usage_count": int(active_users * 0.5)},
    ]
    
    return EngagementMetrics(
        total_sessions=total_users * 5,  # Mock: 5 sessions per user
        average_session_duration=12.5,  # Mock: 12.5 minutes
        bounce_rate=25.3,  # Mock: 25.3%
        retention_rate=68.7,  # Mock: 68.7%
        daily_active_users=int(active_users * 0.3),
        weekly_active_users=int(active_users * 0.6),
        monthly_active_users=active_users,
        session_trend=session_trend,
        feature_usage=feature_usage
    )


def get_system_metrics() -> SystemMetrics:
    """Get system metrics (mock data for now)"""
    
    # Mock system metrics
    api_metrics = {
        "total_requests": 125000,
        "average_response_time": 245,  # ms
        "error_rate": 0.8,  # %
        "uptime": 99.9  # %
    }
    
    database_metrics = {
        "connection_count": 15,
        "query_performance": 89.5,  # score
        "storage_used": 2.3,  # GB
        "storage_total": 10.0  # GB
    }
    
    performance_alerts = [
        {
            "id": "alert_1",
            "type": "warning",
            "message": "High memory usage detected",
            "timestamp": datetime.utcnow().isoformat(),
            "resolved": False
        }
    ]
    
    # Mock response time trend
    response_times = []
    for i in range(24):  # Last 24 hours
        hour = datetime.utcnow() - timedelta(hours=i)
        value = 200 + (i % 50)  # Mock response time
        response_times.append(TimeSeriesData(
            date=hour.isoformat(),
            value=value
        ))
    response_times.reverse()
    
    # Mock error rate trend
    error_rates = []
    for i in range(24):  # Last 24 hours
        hour = datetime.utcnow() - timedelta(hours=i)
        value = max(0, 1 + (i % 3) - 1)  # Mock error rate
        error_rates.append(TimeSeriesData(
            date=hour.isoformat(),
            value=value
        ))
    error_rates.reverse()
    
    return SystemMetrics(
        api_metrics=api_metrics,
        database_metrics=database_metrics,
        performance_alerts=performance_alerts,
        uptime=99.9,
        response_times=response_times,
        error_rates=error_rates
    )