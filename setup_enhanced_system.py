#!/usr/bin/env python3
"""
Enhanced Retailer Recommendation System Setup Script
This script sets up the complete system with all enhanced features
"""

import os
import sys
import subprocess
import logging
from datetime import datetime

# Add the project root to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.services.product_data_service import product_data_service
from backend.services.ai_recommendation_service import ai_recommendation_service
from backend.models.mongodb_models import Retailer, Product, Purchase
from config import config
import mongoengine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def check_dependencies():
    """Check if all required dependencies are installed"""
    logger.info("Checking dependencies...")
    
    required_packages = [
        'flask', 'mongoengine', 'scikit-learn', 'pandas', 
        'numpy', 'geopy', 'plotly', 'aiohttp'
    ]
    
    missing_packages = []
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        logger.error(f"Missing packages: {missing_packages}")
        logger.info("Please install missing packages using: pip install -r requirements.txt")
        return False
    
    logger.info("All dependencies are installed ✓")
    return True

def setup_database():
    """Setup MongoDB connection and create initial data"""
    logger.info("Setting up database...")
    
    try:
        # Connect to MongoDB
        mongoengine.disconnect()
        mongoengine.connect(
            host=config['development'].MONGODB_URI,
            db='retailer_recommendations',
            alias='default'
        )
        logger.info("Connected to MongoDB ✓")
        
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
            logger.info("Created demo retailer account ✓")
        
        return True
        
    except Exception as e:
        logger.error(f"Database setup failed: {e}")
        return False

def populate_products():
    """Populate database with comprehensive product catalog"""
    logger.info("Populating product catalog...")
    
    try:
        result = product_data_service.populate_database()
        
        if result['success']:
            logger.info(f"✓ Products populated successfully:")
            logger.info(f"  - Created: {result['products_created']} products")
            logger.info(f"  - Updated: {result['products_updated']} products")
            logger.info(f"  - Categories: {result['categories_created']} categories")
            logger.info(f"  - Total: {result['total_products']} products in catalog")
            return True
        else:
            logger.error(f"Product population failed: {result.get('error', 'Unknown error')}")
            return False
            
    except Exception as e:
        logger.error(f"Product population failed: {e}")
        return False

def initialize_ai_models():
    """Initialize AI recommendation models"""
    logger.info("Initializing AI recommendation models...")
    
    try:
        success = ai_recommendation_service.initialize_models()
        if success:
            logger.info("AI models initialized successfully ✓")
            return True
        else:
            logger.warning("AI models initialization failed - will initialize on first use")
            return True  # Not critical for setup
            
    except Exception as e:
        logger.error(f"AI models initialization failed: {e}")
        return True  # Not critical for setup

def create_sample_data():
    """Create sample purchases and interactions for demo purposes"""
    logger.info("Creating sample data...")
    
    try:
        demo_retailer = Retailer.objects(email='demo@retailrecommend.com').first()
        if not demo_retailer:
            logger.warning("Demo retailer not found, skipping sample data creation")
            return True
        
        # Get some products for sample purchases
        products = Product.objects.limit(10)
        if not products:
            logger.warning("No products found, skipping sample data creation")
            return True
        
        # Create sample purchases
        sample_purchases = []
        for i, product in enumerate(products[:5]):
            purchase = Purchase(
                retailer_id=demo_retailer.retailer_id,
                product_id=product.id,
                amount=product.price,
                quantity=1,
                purchase_date=datetime.now(),
                rating=4.0 + (i % 2),  # Alternate between 4.0 and 5.0
                payment_method='credit_card'
            )
            sample_purchases.append(purchase)
        
        # Save sample purchases
        for purchase in sample_purchases:
            purchase.save()
        
        logger.info(f"Created {len(sample_purchases)} sample purchases ✓")
        return True
        
    except Exception as e:
        logger.error(f"Sample data creation failed: {e}")
        return True  # Not critical for setup

def setup_frontend():
    """Setup frontend dependencies"""
    logger.info("Setting up frontend...")
    
    frontend_path = os.path.join(os.path.dirname(__file__), 'frontend')
    
    if not os.path.exists(frontend_path):
        logger.warning("Frontend directory not found, skipping frontend setup")
        return True
    
    try:
        # Check if node_modules exists
        node_modules_path = os.path.join(frontend_path, 'node_modules')
        if not os.path.exists(node_modules_path):
            logger.info("Installing frontend dependencies...")
            result = subprocess.run(['npm', 'install'], cwd=frontend_path, capture_output=True, text=True)
            if result.returncode == 0:
                logger.info("Frontend dependencies installed ✓")
            else:
                logger.warning(f"Frontend dependency installation failed: {result.stderr}")
                return True  # Not critical for backend functionality
        else:
            logger.info("Frontend dependencies already installed ✓")
        
        return True
        
    except FileNotFoundError:
        logger.warning("npm not found, skipping frontend setup")
        return True
    except Exception as e:
        logger.error(f"Frontend setup failed: {e}")
        return True

def run_health_checks():
    """Run system health checks"""
    logger.info("Running health checks...")
    
    try:
        # Check database connection
        product_count = Product.objects.count()
        retailer_count = Retailer.objects.count()
        
        logger.info(f"✓ Database health check passed:")
        logger.info(f"  - Products: {product_count}")
        logger.info(f"  - Retailers: {retailer_count}")
        
        # Test AI service
        try:
            popular_recs = ai_recommendation_service.get_popular_recommendations(3)
            logger.info(f"✓ AI service health check passed: {len(popular_recs)} recommendations")
        except Exception as e:
            logger.warning(f"AI service health check failed: {e}")
        
        return True
        
    except Exception as e:
        logger.error(f"Health checks failed: {e}")
        return False

def print_setup_summary():
    """Print setup summary and next steps"""
    logger.info("\n" + "="*60)
    logger.info("🎉 ENHANCED RETAILER RECOMMENDATION SYSTEM SETUP COMPLETE!")
    logger.info("="*60)
    logger.info("\n📋 SYSTEM FEATURES:")
    logger.info("✓ AI-Powered Recommendations (Content-based, Collaborative)")
    logger.info("✓ Location-Based Services & Real-time Updates")
    logger.info("✓ Advanced Analytics & Business Intelligence")
    logger.info("✓ 100+ Products Across Multiple Categories")
    logger.info("✓ Modern React Frontend with Material-UI")
    logger.info("✓ Comprehensive Dashboard & Reporting")
    
    logger.info("\n🚀 TO START THE SYSTEM:")
    logger.info("1. Backend: python run.py")
    logger.info("2. Frontend: cd frontend && npm start")
    logger.info("3. Access: http://localhost:5000 (Backend + Frontend)")
    logger.info("4. React Dev: http://localhost:3000 (Frontend only)")
    
    logger.info("\n🔐 DEMO CREDENTIALS:")
    logger.info("Email: demo@retailrecommend.com")
    logger.info("Password: demo123")
    
    logger.info("\n📊 API ENDPOINTS:")
    logger.info("• Health Check: GET /health")
    logger.info("• AI Recommendations: POST /api/ai/recommendations/personalized")
    logger.info("• Location Services: POST /api/location/nearby-retailers")
    logger.info("• Analytics: GET /api/analytics/dashboard")
    logger.info("• Products: GET /api/products/featured")
    
    logger.info("\n💡 NEXT STEPS:")
    logger.info("• Customize product catalog in backend/services/product_data_service.py")
    logger.info("• Configure location services with API keys in .env")
    logger.info("• Set up production database and deployment")
    logger.info("• Explore AI recommendation algorithms")
    
    logger.info("\n" + "="*60)

def main():
    """Main setup function"""
    logger.info("🚀 Starting Enhanced Retailer Recommendation System Setup...")
    logger.info("This will set up AI recommendations, location services, and analytics")
    
    setup_steps = [
        ("Checking Dependencies", check_dependencies),
        ("Setting up Database", setup_database),
        ("Populating Products", populate_products),
        ("Initializing AI Models", initialize_ai_models),
        ("Creating Sample Data", create_sample_data),
        ("Setting up Frontend", setup_frontend),
        ("Running Health Checks", run_health_checks),
    ]
    
    failed_steps = []
    
    for step_name, step_function in setup_steps:
        logger.info(f"\n📦 {step_name}...")
        try:
            if not step_function():
                failed_steps.append(step_name)
                logger.error(f"❌ {step_name} failed")
            else:
                logger.info(f"✅ {step_name} completed")
        except Exception as e:
            failed_steps.append(step_name)
            logger.error(f"❌ {step_name} failed with exception: {e}")
    
    if failed_steps:
        logger.warning(f"\n⚠️  Some steps failed: {', '.join(failed_steps)}")
        logger.info("The system may still work, but some features might be limited.")
    
    print_setup_summary()
    
    if not failed_steps:
        logger.info("🎉 Setup completed successfully!")
        return 0
    else:
        logger.warning("⚠️  Setup completed with warnings.")
        return 1

if __name__ == '__main__':
    exit_code = main()
    sys.exit(exit_code)
