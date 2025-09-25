#!/usr/bin/env python3
"""
Simple script to run database seeding
"""

import sys
import os

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import and run the seeding
from seed_database import main

if __name__ == "__main__":
    main()