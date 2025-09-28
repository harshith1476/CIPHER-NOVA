#!/usr/bin/env python3
"""
Simple script to populate the database with products
"""

import os
import sys
import logging
from datetime import datetime

# Add the project root to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from backend.services.product_data_service import product_data_service
    from backend.models.mongodb_models import Retailer
    from config import config
    import mongoengine
except ImportError as e:
    print(f"Import error: {e}")
    print("Please make sure all dependencies are installed: pip install -r requirements.txt")
    sys.exit(1)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main():
    """Main function to populate database"""
    logger.info("🚀 Populating Retailer Recommendation Database...")
    
    try:
        # Connect to MongoDB
        mongoengine.disconnect()
        mongoengine.connect(
            host=config['development'].MONGODB_URI,
            db='retailer_recommendations',
            alias='default'
        )
        logger.info("✅ Connected to MongoDB")
        
        # Create demo retailer if not exists
        demo_retailer = Retailer.objects(email='demo@retailrecommend.com').first()
        if not demo_retailer:
            demo_retailer = Retailer(
                retailer_id='demo_retailer_001',
                name='Demo User',
                email='demo@retailrecommend.com',
                phone='+1234567890',
                address='123 Demo Street, Demo City, DC 12345',
                location={
                    'type': 'Point',
                    'coordinates': [-74.006, 40.7128]  # New York coordinates
                },
                rating=4.5,
                created_at=datetime.now()
            )
            demo_retailer.set_password('demo123')
            demo_retailer.save()
            logger.info("✅ Created demo retailer account")
        else:
            logger.info("✅ Demo retailer already exists")
        
        # Populate products
        logger.info("📦 Populating product catalog...")
        result = product_data_service.populate_database()
        
        if result['success']:
            logger.info(f"✅ Products populated successfully:")
            logger.info(f"   - Created: {result['products_created']} products")
            logger.info(f"   - Updated: {result['products_updated']} products")
            logger.info(f"   - Categories: {result['categories_created']} categories")
            logger.info(f"   - Total: {result['total_products']} products in catalog")
        else:
            logger.error(f"❌ Product population failed: {result.get('error', 'Unknown error')}")
            return False
        
        logger.info("\n" + "="*60)
        logger.info("🎉 DATABASE POPULATION COMPLETE!")
        logger.info("="*60)
        logger.info("\n🔐 DEMO CREDENTIALS:")
        logger.info("Email: demo@retailrecommend.com")
        logger.info("Password: demo123")
        logger.info("\n🚀 TO START THE SYSTEM:")
        logger.info("1. Backend: python run.py")
        logger.info("2. Access: http://localhost:5000")
        logger.info("="*60)
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Database population failed: {e}")
        return False

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
