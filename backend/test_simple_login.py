#!/usr/bin/env python3
"""
Test script to create a simple login endpoint
"""

import sys
sys.path.append('.')

from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.core.auth import authenticate_admin_user
from app.schemas.admin import AdminLoginRequest

app = FastAPI()

@app.post("/test-login")
async def test_login(
    login_data: AdminLoginRequest,
    db: Session = Depends(get_db)
):
    """Simple test login endpoint"""
    try:
        user = authenticate_admin_user(db, login_data.email, login_data.password)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        return {
            "message": "Login successful",
            "user_id": user.id,
            "email": user.email,
            "role": user.role
        }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)