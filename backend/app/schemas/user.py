"""
User Pydantic schemas for request/response models
"""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    is_active: bool = True


class UserCreate(UserBase):
    supabase_user_id: Optional[str] = None
    phone: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    gender: Optional[str] = None
    height: Optional[int] = None
    weight: Optional[int] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    pincode: Optional[str] = None


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = None
    phone: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    gender: Optional[str] = None
    height: Optional[int] = None
    weight: Optional[int] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    pincode: Optional[str] = None
    primary_sport: Optional[str] = None
    secondary_sports: Optional[str] = None
    experience_level: Optional[str] = None
    years_of_experience: Optional[int] = None
    current_team: Optional[str] = None
    coach_name: Optional[str] = None
    coach_contact: Optional[str] = None
    training_goals: Optional[str] = None
    preferred_training_time: Optional[str] = None
    availability_days: Optional[str] = None
    medical_conditions: Optional[str] = None
    allergies: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    emergency_contact_relation: Optional[str] = None
    profile_completed: Optional[bool] = None


class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    supabase_user_id: Optional[str] = None
    phone: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    gender: Optional[str] = None
    height: Optional[int] = None
    weight: Optional[int] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    pincode: Optional[str] = None
    primary_sport: Optional[str] = None
    secondary_sports: Optional[str] = None
    experience_level: Optional[str] = None
    years_of_experience: Optional[int] = None
    current_team: Optional[str] = None
    coach_name: Optional[str] = None
    coach_contact: Optional[str] = None
    training_goals: Optional[str] = None
    preferred_training_time: Optional[str] = None
    availability_days: Optional[str] = None
    medical_conditions: Optional[str] = None
    allergies: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    emergency_contact_relation: Optional[str] = None
    profile_completed: bool = False

    class Config:
        from_attributes = True