#!/usr/bin/env python3
"""
MongoDB setup script for Retailer Recommendation System
"""

import os
import sys
import argparse
from pathlib import Path
from pymongo import MongoClient
from datetime import datetime, timedelta
import uuid
from decimal import Decimal
import random

# Add project root to Python path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

def create_sample_data(db):
    """Create sample data for testing"""
    
    print("Creating sample data...")
    
    # Sample retailers
    retailers_data = [
        {
            'retailer_id': str(uuid.uuid4()),
            'name': 'Green Valley Grocery',
            'email': 'contact@greenvalley.com',
            'password_hash': '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewf1c1JWBPiuxHgO',  # demo123
            'location': 'California',
            'store_type': 'Grocery Store',
            'business_size': 'small',
            'phone': '+1-555-0101',
            'address': '123 Main St, Green Valley, CA',
            'registration_date': datetime.utcnow(),
            'is_active': True
        },
        {
            'retailer_id': str(uuid.uuid4()),
            'name': 'Tech Hub Electronics',
            'email': 'info@techhub.com',
            'password_hash': '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewf1c1JWBPiuxHgO',
            'location': 'New York',
            'store_type': 'Electronics Store',
            'business_size': 'medium',
            'phone': '+1-555-0102',
            'address': '456 Tech Ave, New York, NY',
            'registration_date': datetime.utcnow(),
            'is_active': True
        },
        {
            'retailer_id': str(uuid.uuid4()),
            'name': 'Fashion Forward',
            'email': 'hello@fashionforward.com',
            'password_hash': '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewf1c1JWBPiuxHgO',
            'location': 'Texas',
            'store_type': 'Clothing Store',
            'business_size': 'small',
            'phone': '+1-555-0103',
            'address': '789 Style Blvd, Austin, TX',
            'registration_date': datetime.utcnow(),
            'is_active': True
        }
    ]
    
    # Insert retailers
    retailers_collection = db.retailers
    retailers_collection.insert_many(retailers_data)
    retailer_ids = [r['retailer_id'] for r in retailers_data]
    
    # Sample product categories
    categories_data = [
        {'category_id': str(uuid.uuid4()), 'category_name': 'Food & Beverages', 'description': 'All food and drink items', 'is_active': True},
        {'category_id': str(uuid.uuid4()), 'category_name': 'Electronics', 'description': 'Electronic devices and accessories', 'is_active': True},
        {'category_id': str(uuid.uuid4()), 'category_name': 'Clothing & Apparel', 'description': 'Clothing and fashion items', 'is_active': True},
        {'category_id': str(uuid.uuid4()), 'category_name': 'Home & Garden', 'description': 'Home improvement and gardening supplies', 'is_active': True},
        {'category_id': str(uuid.uuid4()), 'category_name': 'Health & Beauty', 'description': 'Health, beauty, and personal care products', 'is_active': True}
    ]
    
    categories_collection = db.product_categories
    categories_collection.insert_many(categories_data)
    
    # Sample products
    products_data = [
        # Food & Beverages
        {
            'product_id': str(uuid.uuid4()),
            'name': 'Organic Apples',
            'category': 'Food & Beverages',
            'subcategory': 'Fruits',
            'brand': 'Fresh Farm',
            'price': 3.99,
            'description': 'Fresh organic apples, 2lb bag',
            'sku': 'FF-APP-001',
            'supplier': 'Fresh Farm Co',
            'unit_type': 'bag',
            'popularity_score': 4.2,
            'created_date': datetime.utcnow(),
            'updated_date': datetime.utcnow(),
            'is_active': True
        },
        {
            'product_id': str(uuid.uuid4()),
            'name': 'Premium Coffee Beans',
            'category': 'Food & Beverages',
            'subcategory': 'Beverages',
            'brand': 'Mountain Roast',
            'price': 12.99,
            'description': 'Premium arabica coffee beans, 1lb',
            'sku': 'MR-COF-001',
            'supplier': 'Mountain Roast LLC',
            'unit_type': 'bag',
            'popularity_score': 4.5,
            'created_date': datetime.utcnow(),
            'updated_date': datetime.utcnow(),
            'is_active': True
        },
        # Electronics
        {
            'product_id': str(uuid.uuid4()),
            'name': 'Wireless Headphones',
            'category': 'Electronics',
            'subcategory': 'Audio',
            'brand': 'SoundTech',
            'price': 89.99,
            'description': 'Bluetooth wireless headphones with noise cancellation',
            'sku': 'ST-WHP-001',
            'supplier': 'SoundTech Corp',
            'unit_type': 'piece',
            'popularity_score': 4.3,
            'created_date': datetime.utcnow(),
            'updated_date': datetime.utcnow(),
            'is_active': True
        },
        {
            'product_id': str(uuid.uuid4()),
            'name': 'Smartphone Charger',
            'category': 'Electronics',
            'subcategory': 'Accessories',
            'brand': 'ChargeFast',
            'price': 19.99,
            'description': 'Fast charging USB-C cable',
            'sku': 'CF-CHG-001',
            'supplier': 'ChargeFast Ltd',
            'unit_type': 'piece',
            'popularity_score': 4.0,
            'created_date': datetime.utcnow(),
            'updated_date': datetime.utcnow(),
            'is_active': True
        },
        # Clothing & Apparel
        {
            'product_id': str(uuid.uuid4()),
            'name': 'Cotton T-Shirt',
            'category': 'Clothing & Apparel',
            'subcategory': 'Tops',
            'brand': 'ComfortWear',
            'price': 14.99,
            'description': '100% cotton t-shirt, various colors',
            'sku': 'CW-TSH-001',
            'supplier': 'ComfortWear Inc',
            'unit_type': 'piece',
            'popularity_score': 3.8,
            'created_date': datetime.utcnow(),
            'updated_date': datetime.utcnow(),
            'is_active': True
        }
    ]
    
    products_collection = db.products
    products_collection.insert_many(products_data)
    product_ids = [p['product_id'] for p in products_data]
    
    # Sample purchases (generate random purchases for last 6 months)
    purchases_data = []
    for _ in range(100):  # Generate 100 sample purchases
        purchase_date = datetime.utcnow() - timedelta(days=random.randint(1, 180))
        retailer_id = random.choice(retailer_ids)
        product_id = random.choice(product_ids)
        quantity = random.randint(1, 10)
        unit_price = random.uniform(5.0, 100.0)
        total_amount = quantity * unit_price
        
        purchase = {
            'purchase_id': str(uuid.uuid4()),
            'retailer_id': retailer_id,
            'product_id': product_id,
            'purchase_date': purchase_date,
            'quantity': quantity,
            'unit_price': round(unit_price, 2),
            'total_amount': round(total_amount, 2),
            'discount_applied': 0.0,
            'payment_method': random.choice(['credit_card', 'cash', 'debit_card']),
            'order_source': random.choice(['online', 'in_store']),
            'purchase_metadata': {}
        }
        purchases_data.append(purchase)
    
    purchases_collection = db.purchases
    purchases_collection.insert_many(purchases_data)
    
    # Sample retailer preferences
    preferences_data = []
    for retailer_id in retailer_ids:
        for category in ['Food & Beverages', 'Electronics', 'Clothing & Apparel']:
            preference = {
                'preference_id': str(uuid.uuid4()),
                'retailer_id': retailer_id,
                'category': category,
                'preference_score': round(random.uniform(2.0, 5.0), 1),
                'created_date': datetime.utcnow(),
                'updated_date': datetime.utcnow()
            }
            preferences_data.append(preference)
    
    preferences_collection = db.retailer_preferences
    preferences_collection.insert_many(preferences_data)
    
    print(f"Sample data created:")
    print(f"  - {len(retailers_data)} retailers")
    print(f"  - {len(categories_data)} categories")
    print(f"  - {len(products_data)} products")
    print(f"  - {len(purchases_data)} purchases")
    print(f"  - {len(preferences_data)} preferences")

def create_indexes(db):
    """Create database indexes for better performance"""
    
    print("Creating database indexes...")
    
    # Retailers indexes
    db.retailers.create_index("email", unique=True)
    db.retailers.create_index("location")
    db.retailers.create_index("store_type")
    
    # Products indexes
    db.products.create_index("sku", unique=True)
    db.products.create_index("category")
    db.products.create_index("brand")
    db.products.create_index("price")
    db.products.create_index("popularity_score")
    
    # Purchases indexes
    db.purchases.create_index([("retailer_id", 1), ("purchase_date", -1)])
    db.purchases.create_index([("product_id", 1), ("purchase_date", -1)])
    db.purchases.create_index([("purchase_date", -1)])
    
    # Feedback indexes
    db.feedback.create_index([("retailer_id", 1), ("feedback_date", -1)])
    db.feedback.create_index("feedback_type")
    
    # Recommendations indexes
    db.recommendations.create_index([("retailer_id", 1), ("recommended_date", -1)])
    db.recommendations.create_index("recommendation_type")
    
    # Retailer preferences indexes
    db.retailer_preferences.create_index("retailer_id")
    
    print("Database indexes created successfully")

def main():
    parser = argparse.ArgumentParser(description='Setup MongoDB for Retailer Recommendation System')
    parser.add_argument('--uri', default='mongodb://localhost:27017/', help='MongoDB URI')
    parser.add_argument('--database', default='retailer_recommendations', help='Database name')
    parser.add_argument('--skip-sample-data', action='store_true', help='Skip loading sample data')
    parser.add_argument('--drop-existing', action='store_true', help='Drop existing database before setup')
    
    args = parser.parse_args()
    
    print("Setting up MongoDB for Retailer Recommendation System...")
    print(f"URI: {args.uri}")
    print(f"Database: {args.database}")
    print("-" * 60)
    
    try:
        # Connect to MongoDB
        client = MongoClient(args.uri)
        
        # Test connection
        client.admin.command('ping')
        print("✓ Connected to MongoDB successfully")
        
        # Get database
        db = client[args.database]
        
        # Drop existing database if requested
        if args.drop_existing:
            client.drop_database(args.database)
            print("✓ Existing database dropped")
            db = client[args.database]  # Recreate reference
        
        # Create indexes
        create_indexes(db)
        
        # Load sample data (optional)
        if not args.skip_sample_data:
            create_sample_data(db)
        
        print("-" * 60)
        print("✓ MongoDB setup completed successfully!")
        print(f"You can now connect to the database using:")
        print(f"mongodb://localhost:27017/{args.database}")
        
        # Show collection stats
        print(f"\nDatabase collections:")
        for collection_name in db.list_collection_names():
            count = db[collection_name].count_documents({})
            print(f"  - {collection_name}: {count} documents")
        
    except Exception as e:
        print(f"✗ Error setting up MongoDB: {e}")
        sys.exit(1)
    finally:
        if 'client' in locals():
            client.close()

if __name__ == '__main__':
    main()
