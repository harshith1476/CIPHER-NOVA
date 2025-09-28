#!/usr/bin/env python3
"""
Setup default data to match the screenshots - Mumbai Kirana Store
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from config import config
import mongoengine
from datetime import datetime

# Connect to MongoDB
mongoengine.connect(host=config['development'].MONGODB_URI, db='retailer_recommendations')

# Import models
from backend.models.mongodb_models import Retailer, Product, Purchase

def create_mumbai_kirana_store():
    """Create Mumbai Kirana Store retailer"""
    try:
        # Delete existing demo user
        Retailer.objects(email='demo@retailrecommend.com').delete()
        
        # Create Mumbai Kirana Store
        retailer = Retailer(
            retailer_id='mumbai_kirana_001',
            name='Mumbai Kirana Store',
            email='demo@retailrecommend.com',
            phone='+91-9876543210',
            address='Shop No. 15, Linking Road, Bandra West, Mumbai - 400050',
            location={
                'type': 'Point',
                'coordinates': [72.8261, 19.0596]  # Mumbai coordinates
            },
            rating=4.8,
            store_type='kirana',
            business_size='medium',
            is_active=True,
            created_at=datetime.now()
        )
        retailer.set_password('demo123')
        retailer.save()
        print("✅ Created Mumbai Kirana Store")
        return retailer
    except Exception as e:
        print(f"❌ Error creating retailer: {e}")
        return None

def create_products():
    """Create products exactly as shown in screenshots"""
    
    products_data = [
        # Food & Beverages (as shown in screenshots)
        {
            'name': 'Premium Basmati Rice 25kg',
            'description': 'Premium quality basmati rice, aged for perfect aroma and taste',
            'category': 'Food & Beverages',
            'subcategory': 'Rice & Grains',
            'price': 2450.00,
            'original_price': 2650.00,
            'discount_percentage': 8,
            'rating': 4.5,
            'review_count': 234,
            'image_url': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
            'stock_quantity': 45,
            'brand': 'India Gate',
            'weight': '25kg',
            'tags': ['basmati', 'rice', 'premium', 'organic'],
            'is_hot': True,
            'in_stock': True
        },
        {
            'name': 'Coca Cola 2L Pack of 12',
            'description': 'Refreshing Coca Cola 2L bottles, pack of 12 for family and parties',
            'category': 'Food & Beverages',
            'subcategory': 'Soft Drinks',
            'price': 840.00,
            'original_price': 960.00,
            'discount_percentage': 12,
            'rating': 4.2,
            'review_count': 156,
            'image_url': 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400',
            'stock_quantity': 28,
            'brand': 'Coca Cola',
            'volume': '2L x 12',
            'tags': ['cola', 'soft drink', 'carbonated'],
            'is_hot': True,
            'in_stock': True
        },
        {
            'name': 'Haldiram Namkeen Combo Pack',
            'description': 'Assorted traditional Indian snacks combo pack',
            'category': 'Food & Beverages',
            'subcategory': 'Snacks',
            'price': 650.00,
            'original_price': 750.00,
            'discount_percentage': 13,
            'rating': 4.3,
            'review_count': 89,
            'image_url': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
            'stock_quantity': 35,
            'brand': 'Haldiram',
            'variety': '5 types',
            'tags': ['namkeen', 'snacks', 'indian', 'traditional'],
            'is_hot': False,
            'in_stock': True
        },
        {
            'name': 'Tata Tea Gold 1kg',
            'description': 'Premium blend tea with rich flavor and aroma',
            'category': 'Food & Beverages',
            'subcategory': 'Tea & Coffee',
            'price': 420.00,
            'original_price': 450.00,
            'discount_percentage': 7,
            'rating': 4.4,
            'review_count': 312,
            'image_url': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400',
            'stock_quantity': 67,
            'brand': 'Tata Tea',
            'weight': '1kg',
            'tags': ['tea', 'gold', 'premium', 'indian'],
            'is_hot': False,
            'in_stock': True
        },
        
        # Electronics
        {
            'name': 'Samsung Galaxy Smartphone',
            'description': 'Latest Samsung Galaxy with advanced features',
            'category': 'Electronics',
            'subcategory': 'Mobile Phones',
            'price': 25999.00,
            'original_price': 28999.00,
            'discount_percentage': 10,
            'rating': 4.6,
            'review_count': 445,
            'image_url': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
            'stock_quantity': 12,
            'brand': 'Samsung',
            'storage': '128GB',
            'tags': ['smartphone', 'android', 'samsung'],
            'is_hot': True,
            'in_stock': True
        },
        
        # Home & Kitchen
        {
            'name': 'Prestige Pressure Cooker 5L',
            'description': 'Stainless steel pressure cooker for quick cooking',
            'category': 'Home & Kitchen',
            'subcategory': 'Cookware',
            'price': 1850.00,
            'original_price': 2100.00,
            'discount_percentage': 12,
            'rating': 4.5,
            'review_count': 178,
            'image_url': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
            'stock_quantity': 23,
            'brand': 'Prestige',
            'capacity': '5L',
            'tags': ['pressure cooker', 'kitchen', 'cooking'],
            'is_hot': False,
            'in_stock': True
        }
    ]
    
    try:
        # Clear existing products
        Product.objects.delete()
        
        created_products = []
        for product_data in products_data:
            product = Product(**product_data)
            product.save()
            created_products.append(product)
            print(f"✅ Created: {product.name}")
        
        print(f"✅ Total products created: {len(created_products)}")
        return created_products
        
    except Exception as e:
        print(f"❌ Error creating products: {e}")
        return []

def create_sample_purchases(retailer, products):
    """Create sample purchase data for analytics"""
    try:
        # Clear existing purchases
        Purchase.objects.delete()
        
        sample_purchases = []
        for i, product in enumerate(products[:4]):  # Create purchases for first 4 products
            purchase = Purchase(
                retailer_id=retailer.retailer_id,
                product_id=str(product.id),
                amount=product.price,
                quantity=2 + (i % 3),  # Vary quantities
                purchase_date=datetime.now(),
                rating=4.0 + (i % 2) * 0.5,  # Ratings between 4.0-4.5
                payment_method='upi'
            )
            purchase.save()
            sample_purchases.append(purchase)
        
        print(f"✅ Created {len(sample_purchases)} sample purchases")
        return sample_purchases
        
    except Exception as e:
        print(f"❌ Error creating purchases: {e}")
        return []

def main():
    """Main setup function"""
    print("🚀 Setting up Mumbai Kirana Store default data...")
    
    # Create retailer
    retailer = create_mumbai_kirana_store()
    if not retailer:
        print("❌ Failed to create retailer")
        return
    
    # Create products
    products = create_products()
    if not products:
        print("❌ Failed to create products")
        return
    
    # Create sample purchases
    purchases = create_sample_purchases(retailer, products)
    
    print("\n" + "="*60)
    print("🎉 MUMBAI KIRANA STORE SETUP COMPLETE!")
    print("="*60)
    print(f"✅ Retailer: {retailer.name}")
    print(f"✅ Products: {len(products)} items")
    print(f"✅ Sample Purchases: {len(purchases)} orders")
    print("\n🔐 LOGIN CREDENTIALS:")
    print("Email: demo@retailrecommend.com")
    print("Password: demo123")
    print("\n🌐 ACCESS YOUR SYSTEM:")
    print("Frontend: http://localhost:3002")
    print("Backend: http://localhost:5000")
    print("="*60)

if __name__ == '__main__':
    main()
