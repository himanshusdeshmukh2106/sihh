"""
Analytics Pydantic schemas for request/response models
"""

from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel


class TimeSeriesData(BaseModel):
    date: str
    value: int
    label: Optional[str] = None


class LocationData(BaseModel):
    location: str
    count: int
    percentage: float


class SportData(BaseModel):
    sport: str
    count: int
    percentage: float
    growth: float


class ExperienceData(BaseModel):
    level: str
    count: int
    percentage: float


class UserAnalytics(BaseModel):
    total_users: int
    active_users: int
    new_users_today: int
    new_users_this_week: int
    new_users_this_month: int
    user_growth_rate: float
    registration_trend: List[TimeSeriesData]
    users_by_location: List[LocationData]
    users_by_sport: List[SportData]
    users_by_experience: List[ExperienceData]


class SportAnalytics(BaseModel):
    sport_popularity: List[SportData]
    sport_growth_trends: List[TimeSeriesData]
    sport_engagement: List[Dict[str, Any]]
    top_sports: List[SportData]


class EngagementMetrics(BaseModel):
    total_sessions: int
    average_session_duration: float
    bounce_rate: float
    retention_rate: float
    daily_active_users: int
    weekly_active_users: int
    monthly_active_users: int
    session_trend: List[TimeSeriesData]
    feature_usage: List[Dict[str, Any]]


class SystemMetrics(BaseModel):
    api_metrics: Dict[str, Any]
    database_metrics: Dict[str, Any]
    performance_alerts: List[Dict[str, Any]]
    uptime: float
    response_times: List[TimeSeriesData]
    error_rates: List[TimeSeriesData]


class AnalyticsRequest(BaseModel):
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    sports: Optional[List[str]] = None
    locations: Optional[List[str]] = None
    experience_levels: Optional[List[str]] = None


class AnalyticsSummary(BaseModel):
    user_analytics: UserAnalytics
    sport_analytics: SportAnalytics
    engagement_metrics: EngagementMetrics
    system_metrics: SystemMetrics
    generated_at: datetime