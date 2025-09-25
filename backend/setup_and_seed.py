#!/usr/bin/env python3
"""
Setup script to install dependencies and seed the database
"""

import subprocess
import sys
import os

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed:")
        print(f"Error: {e.stderr}")
        return False

def main():
    """Main setup function"""
    print("🚀 Setting up database with dummy data...")
    
    # Change to backend directory
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(backend_dir)
    
    # Install faker if not already installed
    if not run_command("pip install faker==33.1.0", "Installing Faker dependency"):
        return False
    
    # Run the seeding script
    if not run_command("python run_seed.py", "Seeding database with dummy data"):
        return False
    
    print("\n🎉 Setup completed! Your database now has dummy data for testing the admin panel.")
    print("\n📋 Next steps:")
    print("1. Start the backend server: python -m uvicorn app.main:app --reload")
    print("2. Start the frontend admin dashboard")
    print("3. Login with admin credentials shown above")

if __name__ == "__main__":
    main()