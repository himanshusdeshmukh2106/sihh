#!/usr/bin/env python3
"""
Debug script to test admin login functionality
"""

import sys
import traceback
from datetime import datetime, timedelta

# Add the backend directory to Python path
sys.path.append('.')

from app.models.database import get_db
from app.core.auth import authenticate_admin_user, create_access_token, parse_permissions
from app.schemas.admin import AdminUserResponse

def test_login():
    """Test the login process step by step"""
    try:
        print("🔍 Testing admin login process...")
        
        # Get database session
        db = next(get_db())
        
        # Step 1: Authenticate user
        print("Step 1: Authenticating user...")
        user = authenticate_admin_user(db, 'admin@sportsapp.com', 'admin123')
        if not user:
            print("❌ Authentication failed")
            return
        print(f"✅ User authenticated: {user.email}")
        
        # Step 2: Parse permissions
        print("Step 2: Parsing permissions...")
        permissions = parse_permissions(user.permissions)
        print(f"✅ Permissions parsed: {len(permissions)} permissions")
        for p in permissions:
            print(f"   - {p.resource}: {p.actions}")
        
        # Step 3: Create access token
        print("Step 3: Creating access token...")
        access_token_expires = timedelta(minutes=30)
        token_data = {
            "sub": user.email,
            "user_id": user.id,
            "role": user.role,
            "permissions": [
                {"resource": p.resource, "actions": p.actions}
                for p in permissions
            ]
        }
        print(f"Token data: {token_data}")
        
        access_token = create_access_token(
            data=token_data,
            expires_delta=access_token_expires
        )
        print(f"✅ Access token created: {access_token[:50]}...")
        
        # Step 4: Create user response
        print("Step 4: Creating user response...")
        user_response = AdminUserResponse(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            role=user.role,
            is_active=user.is_active,
            permissions=permissions,
            last_login=user.last_login,
            created_at=user.created_at,
            updated_at=user.updated_at
        )
        print(f"✅ User response created: {user_response.email}")
        
        print("\n🎉 Login process completed successfully!")
        print(f"Token: {access_token}")
        
        db.close()
        
    except Exception as e:
        print(f"❌ Error during login test: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    test_login()