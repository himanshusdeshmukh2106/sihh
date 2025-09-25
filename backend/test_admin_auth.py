"""
Test script for admin authentication
"""

import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

def test_admin_login():
    """Test admin login"""
    login_data = {
        "email": "admin@sportsplatform.com",
        "password": "admin123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/admin/auth/login", json=login_data)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Admin login successful!")
            print(f"Access Token: {data['access_token'][:50]}...")
            print(f"User: {data['user']['full_name']} ({data['user']['email']})")
            print(f"Role: {data['user']['role']}")
            print(f"Permissions: {len(data['user']['permissions'])} permission sets")
            return data['access_token']
        else:
            print(f"❌ Login failed: {response.status_code}")
            print(response.text)
            return None
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server. Make sure the backend is running on port 8000")
        return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_admin_me(token):
    """Test getting current admin user"""
    if not token:
        return
        
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/admin/auth/me", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print("\n✅ Admin profile retrieved successfully!")
            print(f"ID: {data['id']}")
            print(f"Email: {data['email']}")
            print(f"Full Name: {data['full_name']}")
            print(f"Role: {data['role']}")
            print(f"Active: {data['is_active']}")
            print(f"Last Login: {data['last_login']}")
        else:
            print(f"\n❌ Profile retrieval failed: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"\n❌ Error: {e}")

if __name__ == "__main__":
    print("Testing Admin Authentication...")
    print("=" * 50)
    
    # Test login
    token = test_admin_login()
    
    # Test profile retrieval
    test_admin_me(token)
    
    print("\n" + "=" * 50)
    print("Test completed!")