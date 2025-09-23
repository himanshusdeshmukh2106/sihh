# SIH Backend - FastAPI

A modern FastAPI backend built with Python and the latest 2024 best practices.

## 🚀 Features

- **FastAPI 0.115.6** - Latest stable version
- **Python 3.12** support
- **Pydantic v2** for data validation
- **SQLAlchemy 2.0** for database ORM
- **JWT Authentication** with python-jose
- **Automatic API documentation** (Swagger/ReDoc)
- **CORS** enabled for React Native frontend

## 📁 Project Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── endpoints/      # API endpoint files
│   │   └── routes.py       # Route configuration
│   ├── core/
│   │   └── config.py       # Application configuration
│   ├── models/             # Database models
│   ├── schemas/            # Pydantic schemas
│   └── services/           # Business logic
├── main.py                 # FastAPI application
├── requirements.txt        # Python dependencies
└── .env.example           # Environment variables template
```

## 🛠️ Setup

### Prerequisites
- Python 3.8+
- pip

### Installation
```bash
# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Start development server
python main.py
```

### Environment Variables
Create a `.env` file:
```env
PROJECT_NAME="SIH Project API"
VERSION="1.0.0"
ENVIRONMENT="development"
DEBUG=true
DATABASE_URL="sqlite:///./sih_app.db"
SECRET_KEY="your-secret-key-here"
```

## 📊 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user

### Users Management
- `GET /api/v1/users` - List users (with pagination)
- `GET /api/v1/users/{id}` - Get user by ID
- `POST /api/v1/users` - Create user
- `PUT /api/v1/users/{id}` - Update user
- `DELETE /api/v1/users/{id}` - Delete user

### Items Management
- `GET /api/v1/items` - List items (with filters)
- `GET /api/v1/items/{id}` - Get item by ID
- `POST /api/v1/items` - Create item
- `PUT /api/v1/items/{id}` - Update item
- `DELETE /api/v1/items/{id}` - Delete item
- `GET /api/v1/items/categories` - Get item categories

## 📚 API Documentation

### Interactive Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Health Check
- **Health endpoint**: http://localhost:8000/health

## 🔐 Authentication

JWT-based authentication system:
- Token generation on login
- Token validation on protected routes
- Token expiration handling
- Secure password hashing with bcrypt

## 💾 Database

Currently using SQLite for development:
- SQLAlchemy 2.0 ORM
- Alembic for migrations
- Pydantic for data validation

### Database Migration
```bash
# Generate migration
alembic revision --autogenerate -m "Description"

# Apply migration
alembic upgrade head
```

## 🧪 Testing

Run tests with pytest:
```bash
pytest
```

### Test Coverage
```bash
pytest --cov=app
```

## 🔧 Development

### Code Quality
```bash
# Format code
black .

# Sort imports
isort .

# Lint code
flake8 .
```

### Development Server
```bash
# With auto-reload
python main.py

# Or with uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 🚀 Production Deployment

### Using Gunicorn
```bash
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Docker Deployment
```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker"]
```

### Environment Setup
For production, update:
- `DATABASE_URL` to PostgreSQL
- `SECRET_KEY` to a secure random key
- `ENVIRONMENT` to "production"
- `DEBUG` to false
- Configure proper CORS origins

## 📋 Security Considerations

- JWT secret key rotation
- Rate limiting implementation
- Input validation with Pydantic
- SQL injection prevention with SQLAlchemy
- Password hashing with bcrypt
- CORS configuration
- Environment variable security

## 📊 Monitoring

### Logging
FastAPI includes built-in logging. For production:
- Configure structured logging
- Set up log aggregation
- Monitor API performance
- Track error rates

### Health Checks
- `/health` endpoint for load balancer checks
- Database connectivity checks
- External service dependency checks

## 🔄 API Versioning

Current version: v1
- URL versioning: `/api/v1/`
- Backward compatibility maintained
- Clear deprecation policies

## 📚 Dependencies

### Core Dependencies
- `fastapi[standard]==0.115.6` - Web framework
- `uvicorn[standard]==0.32.1` - ASGI server
- `pydantic==2.10.3` - Data validation
- `sqlalchemy==2.0.36` - Database ORM
- `python-jose[cryptography]==3.3.0` - JWT handling
- `passlib[bcrypt]==1.7.4` - Password hashing

### Development Dependencies
- `pytest==8.3.4` - Testing framework
- `black==24.10.0` - Code formatter
- `isort==5.13.2` - Import sorter
- `flake8==7.1.1` - Code linter

## 📈 Performance

### Optimization Tips
- Use async/await for I/O operations
- Implement database connection pooling
- Add caching with Redis
- Use background tasks for heavy operations
- Monitor with APM tools

### Scaling
- Horizontal scaling with load balancers
- Database read replicas
- Caching layers
- CDN for static assets