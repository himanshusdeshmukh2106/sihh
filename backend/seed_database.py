#!/usr/bin/env python3
"""
Database seeding script to populate the database with dummy data
for testing the admin dashboard functionality.
"""

import asyncio
import json
import random
from datetime import datetime, timedelta
from faker import Faker
from sqlalchemy.orm import Session
from app.models.database import get_db, engine
from app.models.models import User, AdminUser, VideoContent, VideoModerationLog, Item
from app.core.auth import get_password_hash

fake = Faker()

# Sports categories
SPORTS = [
    'Football', 'Basketball', 'Cricket', 'Tennis', 'Badminton', 'Swimming',
    'Athletics', 'Boxing', 'Wrestling', 'Volleyball', 'Hockey', 'Table Tennis',
    'Gymnastics', 'Weightlifting', 'Cycling', 'Running', 'Yoga', 'Martial Arts'
]

# Video categories
VIDEO_CATEGORIES = ['tutorial', 'workout', 'technique', 'match', 'training', 'nutrition', 'recovery']

# Experience levels
EXPERIENCE_LEVELS = ['beginner', 'intermediate', 'advanced', 'professional']

# Indian cities for realistic location data
INDIAN_CITIES = [
    ('Mumbai', 'Maharashtra'), ('Delhi', 'Delhi'), ('Bangalore', 'Karnataka'),
    ('Chennai', 'Tamil Nadu'), ('Kolkata', 'West Bengal'), ('Hyderabad', 'Telangana'),
    ('Pune', 'Maharashtra'), ('Ahmedabad', 'Gujarat'), ('Jaipur', 'Rajasthan'),
    ('Lucknow', 'Uttar Pradesh'), ('Kanpur', 'Uttar Pradesh'), ('Nagpur', 'Maharashtra'),
    ('Indore', 'Madhya Pradesh'), ('Thane', 'Maharashtra'), ('Bhopal', 'Madhya Pradesh'),
    ('Visakhapatnam', 'Andhra Pradesh'), ('Pimpri-Chinchwad', 'Maharashtra'),
    ('Patna', 'Bihar'), ('Vadodara', 'Gujarat'), ('Ghaziabad', 'Uttar Pradesh')
]

def create_users(db: Session, count: int = 500):
    """Create dummy users"""
    print(f"Creating {count} users...")
    
    users = []
    for i in range(count):
        city, state = random.choice(INDIAN_CITIES)
        primary_sport = random.choice(SPORTS)
        secondary_sports = random.sample([s for s in SPORTS if s != primary_sport], k=random.randint(0, 3))
        
        user = User(
            email=fake.unique.email(),
            full_name=fake.name(),
            is_active=random.choice([True, True, True, False]),  # 75% active
            phone=f"+91{random.randint(7000000000, 9999999999)}",
            date_of_birth=fake.date_of_birth(minimum_age=16, maximum_age=45),
            gender=random.choice(['male', 'female', 'other']),
            height=random.randint(150, 200),  # cm
            weight=random.randint(45, 120),   # kg
            address=fake.address(),
            city=city,
            state=state,
            country='India',
            pincode=str(random.randint(100000, 999999)),
            primary_sport=primary_sport,
            secondary_sports=json.dumps(secondary_sports),
            experience_level=random.choice(EXPERIENCE_LEVELS),
            years_of_experience=random.randint(1, 20),
            current_team=fake.company() if random.random() > 0.6 else None,
            coach_name=fake.name() if random.random() > 0.4 else None,
            coach_contact=f"+91{random.randint(7000000000, 9999999999)}" if random.random() > 0.4 else None,
            training_goals=json.dumps(random.sample([
                'Weight Loss', 'Muscle Gain', 'Endurance', 'Strength', 'Flexibility',
                'Competition Prep', 'General Fitness', 'Injury Recovery'
            ], k=random.randint(1, 3))),
            preferred_training_time=random.choice(['morning', 'afternoon', 'evening']),
            availability_days=json.dumps(random.sample([
                'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
            ], k=random.randint(3, 7))),
            medical_conditions=fake.text(max_nb_chars=100) if random.random() > 0.8 else None,
            allergies=fake.text(max_nb_chars=50) if random.random() > 0.9 else None,
            emergency_contact_name=fake.name(),
            emergency_contact_phone=f"+91{random.randint(7000000000, 9999999999)}",
            emergency_contact_relation=random.choice(['Parent', 'Spouse', 'Sibling', 'Friend']),
            profile_completed=random.choice([True, True, False]),  # 66% completed
            created_at=fake.date_time_between(start_date='-2y', end_date='now'),
        )
        users.append(user)
    
    db.add_all(users)
    db.commit()
    print(f"✓ Created {count} users")
    return users

def create_admin_users(db: Session):
    """Create admin users"""
    print("Creating admin users...")
    
    admins = [
        AdminUser(
            email="admin@sportsapp.com",
            full_name="Super Admin",
            hashed_password=get_password_hash("admin123"),
            role="super_admin",
            is_active=True,
            permissions=json.dumps({
                "users": ["read", "write", "delete"],
                "videos": ["read", "write", "delete", "moderate"],
                "analytics": ["read"],
                "system": ["read", "write"]
            }),
            last_login=datetime.now() - timedelta(hours=2),
            created_at=datetime.now() - timedelta(days=30)
        ),
        AdminUser(
            email="moderator@sportsapp.com",
            full_name="Content Moderator",
            hashed_password=get_password_hash("moderator123"),
            role="moderator",
            is_active=True,
            permissions=json.dumps({
                "users": ["read"],
                "videos": ["read", "moderate"],
                "analytics": ["read"]
            }),
            last_login=datetime.now() - timedelta(hours=5),
            created_at=datetime.now() - timedelta(days=20)
        ),
        AdminUser(
            email="analyst@sportsapp.com",
            full_name="Data Analyst",
            hashed_password=get_password_hash("analyst123"),
            role="admin",
            is_active=True,
            permissions=json.dumps({
                "users": ["read"],
                "videos": ["read"],
                "analytics": ["read", "export"]
            }),
            last_login=datetime.now() - timedelta(days=1),
            created_at=datetime.now() - timedelta(days=15)
        )
    ]
    
    db.add_all(admins)
    db.commit()
    print("✓ Created admin users")
    return admins

def create_video_content(db: Session, users: list, admins: list, count: int = 200):
    """Create dummy video content"""
    print(f"Creating {count} video content entries...")
    
    videos = []
    for i in range(count):
        sport = random.choice(SPORTS)
        category = random.choice(VIDEO_CATEGORIES)
        status = random.choices(
            ['approved', 'pending', 'rejected', 'flagged'],
            weights=[70, 15, 10, 5]
        )[0]
        
        # Generate realistic video titles
        title_templates = [
            f"{sport} {category.title()} for {random.choice(EXPERIENCE_LEVELS).title()}s",
            f"Master {sport} {category.title()} Techniques",
            f"{sport} {category.title()}: Complete Guide",
            f"Advanced {sport} {category.title()} Tips",
            f"{sport} {category.title()} - Step by Step"
        ]
        
        created_date = fake.date_time_between(start_date='-1y', end_date='now')
        
        video = VideoContent(
            title=random.choice(title_templates),
            description=fake.text(max_nb_chars=300),
            file_url=f"https://storage.sportsapp.com/videos/{fake.uuid4()}.mp4",
            thumbnail_url=f"https://storage.sportsapp.com/thumbnails/{fake.uuid4()}.jpg",
            duration=random.randint(300, 3600),  # 5 minutes to 1 hour
            file_size=random.randint(50000000, 500000000),  # 50MB to 500MB
            sport=sport,
            category=category,
            difficulty_level=random.choice(EXPERIENCE_LEVELS),
            tags=json.dumps(random.sample([
                'fitness', 'training', 'technique', 'beginner', 'advanced',
                'workout', 'exercise', 'sports', 'health', 'performance'
            ], k=random.randint(2, 5))),
            status=status,
            moderation_status='approved' if status == 'approved' else random.choice(['unreviewed', 'approved', 'rejected']),
            moderation_reason=fake.sentence() if status in ['rejected', 'flagged'] else None,
            moderated_by=random.choice(admins).id if status != 'pending' else None,
            moderated_at=created_date + timedelta(hours=random.randint(1, 48)) if status != 'pending' else None,
            uploaded_by=random.choice(users).id if random.random() > 0.3 else None,
            upload_source=random.choice(['admin', 'user', 'api']),
            view_count=random.randint(0, 10000),
            like_count=random.randint(0, 1000),
            dislike_count=random.randint(0, 100),
            share_count=random.randint(0, 500),
            created_at=created_date,
            published_at=created_date + timedelta(hours=random.randint(1, 24)) if status == 'approved' else None
        )
        videos.append(video)
    
    db.add_all(videos)
    db.commit()
    print(f"✓ Created {count} video content entries")
    return videos

def create_moderation_logs(db: Session, videos: list, admins: list, count: int = 150):
    """Create video moderation logs"""
    print(f"Creating {count} moderation log entries...")
    
    logs = []
    for i in range(count):
        video = random.choice(videos)
        admin = random.choice(admins)
        action = random.choice(['approve', 'reject', 'flag', 'unflag'])
        
        log = VideoModerationLog(
            video_id=video.id,
            admin_id=admin.id,
            action=action,
            reason=fake.sentence() if action in ['reject', 'flag'] else None,
            previous_status=random.choice(['pending', 'approved', 'flagged']),
            new_status='approved' if action == 'approve' else 'rejected' if action == 'reject' else 'flagged',
            created_at=fake.date_time_between(start_date='-6m', end_date='now')
        )
        logs.append(log)
    
    db.add_all(logs)
    db.commit()
    print(f"✓ Created {count} moderation log entries")

def create_items(db: Session, count: int = 100):
    """Create dummy items/products"""
    print(f"Creating {count} items...")
    
    item_categories = ['Equipment', 'Apparel', 'Nutrition', 'Accessories', 'Books', 'Technology']
    
    items = []
    for i in range(count):
        category = random.choice(item_categories)
        
        # Generate category-specific names
        if category == 'Equipment':
            name = f"{random.choice(SPORTS)} {random.choice(['Ball', 'Racket', 'Bat', 'Gloves', 'Shoes'])}"
        elif category == 'Apparel':
            name = f"{random.choice(['Training', 'Competition', 'Casual'])} {random.choice(['Jersey', 'Shorts', 'T-Shirt', 'Tracksuit'])}"
        elif category == 'Nutrition':
            name = f"{random.choice(['Protein', 'Energy', 'Recovery'])} {random.choice(['Powder', 'Bar', 'Drink', 'Supplement'])}"
        else:
            name = fake.catch_phrase()
        
        item = Item(
            name=name,
            description=fake.text(max_nb_chars=200),
            price=random.randint(500, 50000),  # ₹5 to ₹500 in paise
            category=category,
            in_stock=random.choice([True, True, True, False]),  # 75% in stock
            created_at=fake.date_time_between(start_date='-1y', end_date='now')
        )
        items.append(item)
    
    db.add_all(items)
    db.commit()
    print(f"✓ Created {count} items")

def main():
    """Main seeding function"""
    print("🌱 Starting database seeding...")
    
    # Get database session
    db = next(get_db())
    
    try:
        # Create data in order (respecting foreign key constraints)
        users = create_users(db, count=500)
        admins = create_admin_users(db)
        videos = create_video_content(db, users, admins, count=200)
        create_moderation_logs(db, videos, admins, count=150)
        create_items(db, count=100)
        
        print("\n🎉 Database seeding completed successfully!")
        print("\nAdmin Login Credentials:")
        print("Email: admin@sportsapp.com | Password: admin123 (Super Admin)")
        print("Email: moderator@sportsapp.com | Password: moderator123 (Moderator)")
        print("Email: analyst@sportsapp.com | Password: analyst123 (Analyst)")
        
        print(f"\nData Summary:")
        print(f"- Users: {len(users)}")
        print(f"- Admin Users: {len(admins)}")
        print(f"- Video Content: {len(videos)}")
        print(f"- Moderation Logs: 150")
        print(f"- Items: 100")
        
    except Exception as e:
        print(f"❌ Error during seeding: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    main()