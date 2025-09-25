#!/usr/bin/env python3
"""
Test the full authentication and analytics flow
"""

import requests
import json

def test_full_flow():
    """Test login and analytics endpoints"""
    base_url = "http://localhost:8000"
    
    print("🔍 Testing full authentication and analytics flow...")
    
    # Step 1: Login
    print("\n1. Testing login...")
    login_response = requests.post(
        f"{base_url}/api/v1/admin/auth/login",
        json={
            "email": "admin@sportsapp.com",
            "password": "admin123"
        }
    )
    
    if login_response.status_code != 200:
        print(f"❌ Login failed: {login_response.status_code}")
        print(login_response.text)
        return
    
    login_data = login_response.json()
    token = login_data["access_token"]
    print(f"✅ Login successful! Token: {token[:50]}...")
    
    # Step 2: Test analytics endpoints
    headers = {"Authorization": f"Bearer {token}"}
    
    endpoints = [
        "/api/v1/admin/analytics/users",
        "/api/v1/admin/analytics/sports", 
        "/api/v1/admin/analytics/engagement",
        "/api/v1/admin/analytics/system"
    ]
    
    print("\n2. Testing analytics endpoints...")
    for endpoint in endpoints:
        print(f"\nTesting {endpoint}...")
        response = requests.get(f"{base_url}{endpoint}", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ {endpoint}: Success")
            
            # Show some sample data
            if "users" in endpoint:
                print(f"   Total users: {data.get('total_users', 'N/A')}")
                print(f"   Active users: {data.get('active_users', 'N/A')}")
            elif "sports" in endpoint:
                sports = data.get('sport_popularity', [])
                print(f"   Sports count: {len(sports)}")
                if sports:
                    print(f"   Top sport: {sports[0].get('sport', 'N/A')} ({sports[0].get('count', 'N/A')} users)")
            elif "engagement" in endpoint:
                print(f"   Total sessions: {data.get('total_sessions', 'N/A')}")
                print(f"   Daily active users: {data.get('daily_active_users', 'N/A')}")
            elif "system" in endpoint:
                print(f"   API uptime: {data.get('uptime', 'N/A')}%")
        else:
            print(f"❌ {endpoint}: Failed ({response.status_code})")
            print(f"   Error: {response.text[:100]}")
    
    print("\n🎉 Full flow test completed!")

if __name__ == "__main__":
    test_full_flow()