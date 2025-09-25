"""
Test script for analytics endpoints
"""

import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

def get_admin_token():
    """Get admin authentication token"""
    login_data = {
        "email": "admin@sportsplatform.com",
        "password": "admin123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/admin/auth/login", json=login_data)
        if response.status_code == 200:
            return response.json()['access_token']
        else:
            print(f"❌ Login failed: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Error getting token: {e}")
        return None

def test_analytics_endpoints(token):
    """Test all analytics endpoints"""
    if not token:
        return
        
    headers = {"Authorization": f"Bearer {token}"}
    
    endpoints = [
        "/admin/analytics/users",
        "/admin/analytics/sports", 
        "/admin/analytics/engagement",
        "/admin/analytics/system",
        "/admin/analytics/summary"
    ]
    
    for endpoint in endpoints:
        try:
            response = requests.get(f"{BASE_URL}{endpoint}", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ {endpoint}: Success")
                
                # Print some key metrics
                if "total_users" in data:
                    print(f"   Total Users: {data['total_users']}")
                elif "sport_popularity" in data:
                    print(f"   Sports: {len(data['sport_popularity'])}")
                elif "total_sessions" in data:
                    print(f"   Total Sessions: {data['total_sessions']}")
                elif "uptime" in data:
                    print(f"   System Uptime: {data['uptime']}%")
                elif "user_analytics" in data:
                    print(f"   Summary Generated: {data['generated_at']}")
                    
            else:
                print(f"❌ {endpoint}: Failed ({response.status_code})")
                print(f"   Error: {response.text}")
                
        except Exception as e:
            print(f"❌ {endpoint}: Error - {e}")

if __name__ == "__main__":
    print("Testing Analytics Endpoints...")
    print("=" * 50)
    
    # Get admin token
    token = get_admin_token()
    
    # Test analytics endpoints
    test_analytics_endpoints(token)
    
    print("\n" + "=" * 50)
    print("Test completed!")