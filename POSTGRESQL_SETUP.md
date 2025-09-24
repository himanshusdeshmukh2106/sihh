# PostgreSQL Setup for SIH Backend

## 🔧 **Setup Instructions**

### **1. Install PostgreSQL**
- **Windows**: Download from [PostgreSQL Official Site](https://www.postgresql.org/download/windows/)
- **macOS**: `brew install postgresql`
- **Linux**: `sudo apt-get install postgresql postgresql-contrib`

### **2. Start PostgreSQL Service**
```bash
# Windows (as Administrator)
net start postgresql-x64-14

# macOS/Linux
sudo service postgresql start
# or
brew services start postgresql
```

### **3. Create Database and User**
```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Create database
CREATE DATABASE sih_database;

-- Create user (optional, for better security)
CREATE USER sih_user WITH PASSWORD 'your_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE sih_database TO sih_user;

-- Exit
\q
```

### **4. Update Environment Variables**
Edit `backend/.env` file:
```env
DATABASE_URL=postgresql://sih_user:your_password_here@localhost:5432/sih_database
```

### **5. Install Python Dependencies**
```bash
cd backend
pip install -r requirements.txt
```

### **6. Run Database Migrations**
```bash
# Generate initial migration
alembic revision --autogenerate -m "Create initial tables"

# Apply migrations
alembic upgrade head
```

### **7. Start the Backend Server**
```bash
python main.py
```

## 🗃️ **Database Schema**

### **Users Table**
- Authentication data linked to Supabase user ID
- Complete athlete profile information
- Sports preferences and experience
- Emergency contacts and medical info

### **Items Table**
- Generic items/products management
- Categories and stock tracking
- Price management (stored in cents)

## 🔄 **Architecture Overview**

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React Native)                 │
│                                                             │
│  ┌─────────────────────┐    ┌─────────────────────────────┐ │
│  │   Authentication    │    │      Data & API Calls      │ │
│  │    (Supabase)       │    │     (FastAPI Backend)      │ │
│  └─────────────────────┘    └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend (FastAPI)                        │
│                                                             │
│  ┌─────────────────────┐    ┌─────────────────────────────┐ │
│  │    API Routes       │    │      Business Logic        │ │
│  │   (endpoints/)      │    │      (services/)           │ │
│  └─────────────────────┘    └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   PostgreSQL Database                      │
│                                                             │
│  ┌─────────────────────┐    ┌─────────────────────────────┐ │
│  │   Users Table       │    │     Items Table            │ │
│  │   (Athletes)        │    │   (Products/Equipment)     │ │
│  └─────────────────────┘    └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 **Key Features**

- **Supabase**: Handles only authentication (Google OAuth)
- **PostgreSQL**: Stores all application data
- **FastAPI**: Modern async API with automatic documentation
- **SQLAlchemy 2.0**: Latest ORM with type safety
- **Alembic**: Database migration management
- **Pydantic v2**: Request/response validation

## 🔍 **Testing the Setup**

1. **Check database connection**: Visit `http://localhost:8000/health`
2. **API Documentation**: Visit `http://localhost:8000/docs`
3. **Test endpoints**: Use the interactive API docs

## 🚨 **Troubleshooting**

### **Connection Issues**
- Ensure PostgreSQL service is running
- Check database credentials in `.env`
- Verify database exists: `psql -U postgres -l`

### **Migration Issues**
- Delete `alembic/versions/*.py` files and regenerate
- Check imports in `alembic/env.py`
- Ensure models are imported correctly

### **Permission Issues**
- Grant proper database privileges to user
- Check PostgreSQL authentication in `pg_hba.conf`