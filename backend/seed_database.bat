@echo off
echo 🌱 Setting up database with dummy data...
echo.

REM Install faker dependency
echo Installing Faker dependency...
pip install faker==33.1.0

REM Run the seeding script
echo.
echo Seeding database...
python run_seed.py

echo.
echo 🎉 Database seeding completed!
echo.
echo Admin Login Credentials:
echo Email: admin@sportsapp.com ^| Password: admin123 (Super Admin)
echo Email: moderator@sportsapp.com ^| Password: moderator123 (Moderator)
echo Email: analyst@sportsapp.com ^| Password: analyst123 (Analyst)
echo.
echo Next steps:
echo 1. Start the backend server: python -m uvicorn app.main:app --reload
echo 2. Start the frontend admin dashboard
echo 3. Login with admin credentials above
echo.
pause