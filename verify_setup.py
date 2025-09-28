#!/usr/bin/env python3
"""
Quick verification script for MongoDB setup
"""

import sys
import os
from pathlib import Path

# Add project root to Python path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

def verify_mongodb_connection():
    """Test MongoDB connection"""
    try:
        from pymongo import MongoClient
        client = MongoClient('mongodb://localhost:27017/', serverSelectionTimeoutMS=2000)
        client.admin.command('ping')
        print("✅ MongoDB connection: SUCCESS")
        return True
    except Exception as e:
        print(f"❌ MongoDB connection: FAILED - {e}")
        return False

def verify_models():
    """Test model imports"""
    try:
        from backend.models.mongodb_models import (
            Retailer, Product, Purchase, Feedback, 
            Recommendation, ProductCategory, RetailerPreference
        )
        print("✅ MongoDB models: SUCCESS")
        return True
    except Exception as e:
        print(f"❌ MongoDB models: FAILED - {e}")
        return False

def verify_flask_app():
    """Test Flask app creation"""
    try:
        from backend.app import create_app
        app = create_app('development')
        print("✅ Flask app creation: SUCCESS")
        return True
    except Exception as e:
        print(f"❌ Flask app creation: FAILED - {e}")
        return False

def check_sample_data():
    """Check if sample data exists"""
    try:
        from pymongo import MongoClient
        client = MongoClient('mongodb://localhost:27017/')
        db = client.retailer_recommendations
        
        collections = ['retailers', 'products', 'purchases']
        for collection in collections:
            count = db[collection].count_documents({})
            print(f"✅ {collection}: {count} documents")
        
        return True
    except Exception as e:
        print(f"❌ Sample data check: FAILED - {e}")
        return False

def main():
    print("🔍 Verifying Retailer Recommendation System Setup...")
    print("=" * 60)
    
    success_count = 0
    total_tests = 4
    
    # Test 1: MongoDB Connection
    if verify_mongodb_connection():
        success_count += 1
    
    # Test 2: Model Imports
    if verify_models():
        success_count += 1
    
    # Test 3: Flask App
    if verify_flask_app():
        success_count += 1
    
    # Test 4: Sample Data
    if check_sample_data():
        success_count += 1
    
    print("=" * 60)
    print(f"📊 Results: {success_count}/{total_tests} tests passed")
    
    if success_count == total_tests:
        print("🎉 All systems operational! Your MongoDB setup is complete.")
        print("\n🚀 Next steps:")
        print("1. Open http://localhost:5000 in your browser")
        print("2. Login with: contact@greenvalley.com / demo123")
        print("3. Explore the recommendation dashboard")
    else:
        print("⚠️  Some issues detected. Please check the errors above.")
        
        if success_count == 0:
            print("\n💡 Quick fixes:")
            print("1. Make sure MongoDB is installed and running")
            print("2. Run: pip install -r requirements.txt")
            print("3. Run: python scripts/setup_mongodb.py")

if __name__ == '__main__':
    main()
