"""
User model for PostgreSQL database
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from app.models.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Supabase user ID for linking authentication
    supabase_user_id = Column(String, unique=True, index=True, nullable=True)
    
    # Profile information
    phone = Column(String, nullable=True)
    date_of_birth = Column(DateTime, nullable=True)
    gender = Column(String, nullable=True)  # 'male', 'female', 'other'
    
    # Physical stats
    height = Column(Integer, nullable=True)  # in cm
    weight = Column(Integer, nullable=True)  # in kg
    
    # Location
    address = Column(Text, nullable=True)
    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    country = Column(String, nullable=True)
    pincode = Column(String, nullable=True)
    
    # Sports information
    primary_sport = Column(String, nullable=True)
    secondary_sports = Column(Text, nullable=True)  # JSON string
    experience_level = Column(String, nullable=True)  # 'beginner', 'intermediate', 'advanced', 'professional'
    years_of_experience = Column(Integer, nullable=True)
    current_team = Column(String, nullable=True)
    coach_name = Column(String, nullable=True)
    coach_contact = Column(String, nullable=True)
    
    # Goals and preferences
    training_goals = Column(Text, nullable=True)  # JSON string
    preferred_training_time = Column(String, nullable=True)  # 'morning', 'afternoon', 'evening'
    availability_days = Column(Text, nullable=True)  # JSON string
    
    # Medical information
    medical_conditions = Column(Text, nullable=True)
    allergies = Column(Text, nullable=True)
    emergency_contact_name = Column(String, nullable=True)
    emergency_contact_phone = Column(String, nullable=True)
    emergency_contact_relation = Column(String, nullable=True)
    
    # Profile completion status
    profile_completed = Column(Boolean, default=False)


class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Integer, nullable=False)  # in cents to avoid floating point issues
    category = Column(String, nullable=False)
    in_stock = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())