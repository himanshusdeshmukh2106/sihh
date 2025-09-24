"""
FastAPI Main Application
Modern FastAPI setup with PostgreSQL database (2024)
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from app.api.routes import api_router
from app.core.config import settings
from app.models.database import engine
from app.models.models import Base


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    print("🚀 Starting up FastAPI application...")
    print(f"📊 Database URL: {settings.DATABASE_URL[:50]}...")
    
    # Create database tables
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully")
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        print("💡 Please check your PostgreSQL connection and credentials")
    
    yield
    
    # Shutdown
    print("🛑 Shutting down FastAPI application...")


# Create FastAPI app with modern configuration
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="SIH Project Backend API",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Configure CORS for React Native frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to SIH Project API",
        "version": settings.VERSION,
        "docs": "/docs",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "version": settings.VERSION}


if __name__ == "__main__":
    # Run on all interfaces (0.0.0.0) to accept connections from mobile devices
    # This allows Expo Go on your phone to connect to the backend
    uvicorn.run(
        "main:app",
        host="0.0.0.0",  # Accept connections from any device on your network
        port=8000,
        reload=True,
        log_level="info"
    )