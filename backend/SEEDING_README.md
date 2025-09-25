# Database Seeding Guide

This guide explains how to populate your database with dummy data for testing the admin dashboard.

## Quick Start

### Windows
```bash
cd backend
seed_database.bat
```

### Linux/Mac
```bash
cd backend
python setup_and_seed.py
```

### Manual Method
```bash
cd backend
pip install faker==33.1.0
python run_seed.py
```

## What Gets Created

The seeding script creates realistic dummy data including:

### Users (500 entries)
- Complete user profiles with Indian names and locations
- Sports preferences and experience levels
- Physical stats, contact information
- Training goals and availability
- Medical information and emergency contacts

### Admin Users (3 entries)
- **Super Admin**: admin@sportsapp.com / admin123
- **Moderator**: moderator@sportsapp.com / moderator123
- **Analyst**: analyst@sportsapp.com / analyst123

### Video Content (200 entries)
- Sports tutorial and training videos
- Various categories: tutorial, workout, technique, match, training
- Different approval statuses for testing moderation
- Realistic engagement metrics (views, likes, shares)

### Moderation Logs (150 entries)
- Video approval/rejection history
- Admin actions and reasons
- Status change tracking

### Items/Products (100 entries)
- Sports equipment and apparel
- Nutrition and accessories
- Realistic pricing in Indian Rupees

## Data Distribution

- **Sports**: 18 different sports including Cricket, Football, Basketball, Tennis, etc.
- **Locations**: 20 major Indian cities across different states
- **Experience Levels**: Beginner, Intermediate, Advanced, Professional
- **User Status**: 75% active users, 25% inactive
- **Video Status**: 70% approved, 15% pending, 10% rejected, 5% flagged

## Admin Dashboard Features You Can Test

With this dummy data, you can test:

1. **User Management**
   - Browse and search users
   - Filter by location, sport, experience
   - View user profiles and activity

2. **Video Content Management**
   - Review pending videos
   - Moderate content (approve/reject/flag)
   - View engagement metrics

3. **Analytics Dashboard**
   - User growth trends
   - Sport popularity statistics
   - Engagement metrics
   - Geographic distribution

4. **System Monitoring**
   - Admin activity logs
   - Content moderation history

## Customization

You can modify the seeding script to:
- Change the number of records created
- Add more sports or categories
- Adjust data distributions
- Add custom fields or relationships

## Troubleshooting

If seeding fails:
1. Ensure your database is running and accessible
2. Check that all required dependencies are installed
3. Verify your database connection settings in `.env`
4. Make sure you have proper database permissions

## Resetting Data

To clear and reseed the database:
```bash
# Drop all tables (be careful!)
python -c "from app.models.database import engine; from app.models.models import Base; Base.metadata.drop_all(engine)"

# Recreate tables
python -c "from app.models.database import engine; from app.models.models import Base; Base.metadata.create_all(engine)"

# Reseed
python run_seed.py
```