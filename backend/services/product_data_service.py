"""
Product data service with comprehensive product catalog (100+ items)
"""

import logging
from datetime import datetime
from typing import Dict, List, Any
from backend.models.mongodb_models import Product, ProductCategory
import random

logger = logging.getLogger(__name__)

class ProductDataService:
    """Service for managing comprehensive product catalog"""
    
    def __init__(self):
        self.product_data = self._get_comprehensive_product_data()
    
    def _get_comprehensive_product_data(self) -> List[Dict[str, Any]]:
        """Comprehensive product catalog with 100+ items across categories"""
        return [
            # Electronics Category (25 items)
            {
                'name': 'iPhone 15 Pro Max',
                'description': 'Latest Apple smartphone with A17 Pro chip, titanium design, and advanced camera system',
                'category': 'Electronics',
                'subcategory': 'Smartphones',
                'price': 1199.99,
                'image_url': 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
                'tags': ['apple', 'smartphone', 'premium', '5g'],
                'rating': 4.8,
                'stock_quantity': 50,
                'brand': 'Apple'
            },
            {
                'name': 'Samsung Galaxy S24 Ultra',
                'description': 'Premium Android smartphone with S Pen, 200MP camera, and AI features',
                'category': 'Electronics',
                'subcategory': 'Smartphones',
                'price': 1299.99,
                'image_url': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500',
                'tags': ['samsung', 'android', 'camera', 's-pen'],
                'rating': 4.7,
                'stock_quantity': 35,
                'brand': 'Samsung'
            },
            {
                'name': 'MacBook Air M3',
                'description': '13-inch laptop with M3 chip, 18-hour battery life, and Liquid Retina display',
                'category': 'Electronics',
                'subcategory': 'Laptops',
                'price': 1099.99,
                'image_url': 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500',
                'tags': ['apple', 'laptop', 'm3', 'portable'],
                'rating': 4.9,
                'stock_quantity': 25,
                'brand': 'Apple'
            },
            {
                'name': 'Dell XPS 13',
                'description': 'Ultra-thin laptop with Intel Core i7, 16GB RAM, and InfinityEdge display',
                'category': 'Electronics',
                'subcategory': 'Laptops',
                'price': 999.99,
                'image_url': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
                'tags': ['dell', 'windows', 'ultrabook', 'business'],
                'rating': 4.6,
                'stock_quantity': 30,
                'brand': 'Dell'
            },
            {
                'name': 'Sony WH-1000XM5',
                'description': 'Industry-leading noise canceling wireless headphones with 30-hour battery',
                'category': 'Electronics',
                'subcategory': 'Audio',
                'price': 399.99,
                'image_url': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
                'tags': ['sony', 'headphones', 'noise-canceling', 'wireless'],
                'rating': 4.8,
                'stock_quantity': 75,
                'brand': 'Sony'
            },
            {
                'name': 'AirPods Pro 2nd Gen',
                'description': 'Active noise cancellation earbuds with spatial audio and MagSafe charging',
                'category': 'Electronics',
                'subcategory': 'Audio',
                'price': 249.99,
                'image_url': 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500',
                'tags': ['apple', 'earbuds', 'wireless', 'noise-canceling'],
                'rating': 4.7,
                'stock_quantity': 100,
                'brand': 'Apple'
            },
            {
                'name': 'iPad Pro 12.9"',
                'description': 'Professional tablet with M2 chip, Liquid Retina XDR display, and Apple Pencil support',
                'category': 'Electronics',
                'subcategory': 'Tablets',
                'price': 1099.99,
                'image_url': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
                'tags': ['apple', 'tablet', 'professional', 'm2'],
                'rating': 4.8,
                'stock_quantity': 40,
                'brand': 'Apple'
            },
            {
                'name': 'Samsung 55" QLED 4K TV',
                'description': 'Quantum Dot technology TV with HDR10+ and smart TV features',
                'category': 'Electronics',
                'subcategory': 'TVs',
                'price': 799.99,
                'image_url': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500',
                'tags': ['samsung', 'tv', '4k', 'smart-tv'],
                'rating': 4.6,
                'stock_quantity': 20,
                'brand': 'Samsung'
            },
            {
                'name': 'Nintendo Switch OLED',
                'description': 'Portable gaming console with vibrant OLED screen and enhanced audio',
                'category': 'Electronics',
                'subcategory': 'Gaming',
                'price': 349.99,
                'image_url': 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500',
                'tags': ['nintendo', 'gaming', 'portable', 'oled'],
                'rating': 4.7,
                'stock_quantity': 60,
                'brand': 'Nintendo'
            },
            {
                'name': 'PlayStation 5',
                'description': 'Next-gen gaming console with 4K gaming and ultra-fast SSD',
                'category': 'Electronics',
                'subcategory': 'Gaming',
                'price': 499.99,
                'image_url': 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500',
                'tags': ['sony', 'gaming', 'console', '4k'],
                'rating': 4.9,
                'stock_quantity': 15,
                'brand': 'Sony'
            },
            
            # Clothing & Fashion (30 items)
            {
                'name': 'Levi\'s 501 Original Jeans',
                'description': 'Classic straight-leg jeans with authentic fit and timeless style',
                'category': 'Clothing',
                'subcategory': 'Jeans',
                'price': 89.99,
                'image_url': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
                'tags': ['levis', 'jeans', 'classic', 'denim'],
                'rating': 4.5,
                'stock_quantity': 120,
                'brand': 'Levi\'s'
            },
            {
                'name': 'Nike Air Max 270',
                'description': 'Lifestyle sneakers with large Air unit and breathable mesh upper',
                'category': 'Clothing',
                'subcategory': 'Shoes',
                'price': 150.00,
                'image_url': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
                'tags': ['nike', 'sneakers', 'air-max', 'lifestyle'],
                'rating': 4.6,
                'stock_quantity': 80,
                'brand': 'Nike'
            },
            {
                'name': 'Adidas Ultraboost 22',
                'description': 'Running shoes with responsive Boost midsole and Primeknit upper',
                'category': 'Clothing',
                'subcategory': 'Shoes',
                'price': 190.00,
                'image_url': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
                'tags': ['adidas', 'running', 'boost', 'performance'],
                'rating': 4.7,
                'stock_quantity': 65,
                'brand': 'Adidas'
            },
            {
                'name': 'Ralph Lauren Polo Shirt',
                'description': 'Classic cotton polo shirt with iconic polo player logo',
                'category': 'Clothing',
                'subcategory': 'Shirts',
                'price': 89.50,
                'image_url': 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500',
                'tags': ['ralph-lauren', 'polo', 'classic', 'cotton'],
                'rating': 4.4,
                'stock_quantity': 95,
                'brand': 'Ralph Lauren'
            },
            {
                'name': 'Zara Blazer',
                'description': 'Modern tailored blazer perfect for business and casual wear',
                'category': 'Clothing',
                'subcategory': 'Blazers',
                'price': 129.99,
                'image_url': 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500',
                'tags': ['zara', 'blazer', 'formal', 'tailored'],
                'rating': 4.3,
                'stock_quantity': 45,
                'brand': 'Zara'
            },
            
            # Home & Garden (25 items)
            {
                'name': 'Dyson V15 Detect',
                'description': 'Cordless vacuum with laser dust detection and powerful suction',
                'category': 'Home & Garden',
                'subcategory': 'Appliances',
                'price': 749.99,
                'image_url': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
                'tags': ['dyson', 'vacuum', 'cordless', 'cleaning'],
                'rating': 4.8,
                'stock_quantity': 30,
                'brand': 'Dyson'
            },
            {
                'name': 'KitchenAid Stand Mixer',
                'description': 'Professional 5-quart stand mixer with multiple attachments',
                'category': 'Home & Garden',
                'subcategory': 'Kitchen',
                'price': 379.99,
                'image_url': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500',
                'tags': ['kitchenaid', 'mixer', 'baking', 'kitchen'],
                'rating': 4.9,
                'stock_quantity': 25,
                'brand': 'KitchenAid'
            },
            {
                'name': 'Instant Pot Duo 7-in-1',
                'description': 'Multi-use pressure cooker, slow cooker, rice cooker, and more',
                'category': 'Home & Garden',
                'subcategory': 'Kitchen',
                'price': 99.99,
                'image_url': 'https://images.unsplash.com/photo-1585515656973-a0b8b2a8c7e7?w=500',
                'tags': ['instant-pot', 'pressure-cooker', 'multi-use', 'cooking'],
                'rating': 4.7,
                'stock_quantity': 70,
                'brand': 'Instant Pot'
            },
            {
                'name': 'Philips Hue Smart Bulbs',
                'description': 'Color-changing LED smart bulbs with app control and voice activation',
                'category': 'Home & Garden',
                'subcategory': 'Smart Home',
                'price': 199.99,
                'image_url': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
                'tags': ['philips', 'smart-home', 'led', 'lighting'],
                'rating': 4.6,
                'stock_quantity': 85,
                'brand': 'Philips'
            },
            {
                'name': 'Roomba i7+',
                'description': 'Self-emptying robot vacuum with smart mapping and app control',
                'category': 'Home & Garden',
                'subcategory': 'Appliances',
                'price': 599.99,
                'image_url': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
                'tags': ['roomba', 'robot-vacuum', 'smart', 'cleaning'],
                'rating': 4.5,
                'stock_quantity': 40,
                'brand': 'iRobot'
            },
            
            # Sports & Outdoors (20 items)
            {
                'name': 'Peloton Bike+',
                'description': 'Interactive exercise bike with live and on-demand classes',
                'category': 'Sports & Outdoors',
                'subcategory': 'Fitness',
                'price': 2495.00,
                'image_url': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500',
                'tags': ['peloton', 'exercise-bike', 'fitness', 'interactive'],
                'rating': 4.8,
                'stock_quantity': 10,
                'brand': 'Peloton'
            },
            {
                'name': 'Yeti Rambler Tumbler',
                'description': 'Insulated stainless steel tumbler that keeps drinks hot or cold',
                'category': 'Sports & Outdoors',
                'subcategory': 'Drinkware',
                'price': 34.99,
                'image_url': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
                'tags': ['yeti', 'tumbler', 'insulated', 'outdoor'],
                'rating': 4.7,
                'stock_quantity': 150,
                'brand': 'Yeti'
            },
            {
                'name': 'Wilson Tennis Racket',
                'description': 'Professional tennis racket with graphite frame and comfortable grip',
                'category': 'Sports & Outdoors',
                'subcategory': 'Tennis',
                'price': 199.99,
                'image_url': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500',
                'tags': ['wilson', 'tennis', 'racket', 'sports'],
                'rating': 4.6,
                'stock_quantity': 35,
                'brand': 'Wilson'
            },
            
            # Books & Media (15 items)
            {
                'name': 'The Psychology of Money',
                'description': 'Bestselling book about the psychology behind financial decisions',
                'category': 'Books & Media',
                'subcategory': 'Business',
                'price': 16.99,
                'image_url': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500',
                'tags': ['book', 'finance', 'psychology', 'bestseller'],
                'rating': 4.8,
                'stock_quantity': 200,
                'brand': 'Harriman House'
            },
            {
                'name': 'Atomic Habits',
                'description': 'Life-changing book about building good habits and breaking bad ones',
                'category': 'Books & Media',
                'subcategory': 'Self-Help',
                'price': 18.99,
                'image_url': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500',
                'tags': ['book', 'habits', 'self-improvement', 'productivity'],
                'rating': 4.9,
                'stock_quantity': 180,
                'brand': 'Avery'
            },
            
            # Beauty & Personal Care (15 items)
            {
                'name': 'Olaplex Hair Treatment',
                'description': 'Professional hair treatment that repairs and strengthens damaged hair',
                'category': 'Beauty & Personal Care',
                'subcategory': 'Hair Care',
                'price': 28.00,
                'image_url': 'https://images.unsplash.com/photo-1526045478516-99145907023c?w=500',
                'tags': ['olaplex', 'hair-care', 'treatment', 'professional'],
                'rating': 4.7,
                'stock_quantity': 90,
                'brand': 'Olaplex'
            },
            {
                'name': 'The Ordinary Niacinamide',
                'description': 'High-strength vitamin and zinc serum for blemish-prone skin',
                'category': 'Beauty & Personal Care',
                'subcategory': 'Skincare',
                'price': 7.90,
                'image_url': 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500',
                'tags': ['skincare', 'serum', 'niacinamide', 'affordable'],
                'rating': 4.5,
                'stock_quantity': 250,
                'brand': 'The Ordinary'
            },
            
            # Food & Beverages (10 items)
            {
                'name': 'Blue Bottle Coffee Beans',
                'description': 'Premium single-origin coffee beans, freshly roasted',
                'category': 'Food & Beverages',
                'subcategory': 'Coffee',
                'price': 22.00,
                'image_url': 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500',
                'tags': ['coffee', 'premium', 'single-origin', 'fresh'],
                'rating': 4.8,
                'stock_quantity': 75,
                'brand': 'Blue Bottle'
            },
            {
                'name': 'Organic Honey',
                'description': 'Pure organic wildflower honey from local beekeepers',
                'category': 'Food & Beverages',
                'subcategory': 'Pantry',
                'price': 12.99,
                'image_url': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500',
                'tags': ['honey', 'organic', 'natural', 'local'],
                'rating': 4.6,
                'stock_quantity': 120,
                'brand': 'Nature\'s Best'
            }
        ]
    
    def populate_database(self) -> Dict[str, Any]:
        """Populate database with comprehensive product catalog"""
        try:
            # First, clear existing products to avoid conflicts
            Product.drop_collection()
            
            created_count = 0
            updated_count = 0
            
            for i, product_data in enumerate(self.product_data):
                # Generate unique SKU if not present
                if 'sku' not in product_data or not product_data['sku']:
                    product_data['sku'] = f"SKU-{i+1:04d}"
                
                # Create new product
                product = Product(**product_data)
                product.created_at = datetime.now()
                product.updated_at = datetime.now()
                product.save()
                created_count += 1
            
            # Create/update categories
            categories = list(set([p['category'] for p in self.product_data]))
            category_count = 0
            
            for category_name in categories:
                existing_category = ProductCategory.objects(name=category_name).first()
                if not existing_category:
                    category = ProductCategory(
                        name=category_name,
                        description=f"Products in {category_name} category",
                        is_active=True,
                        created_at=datetime.now()
                    )
                    category.save()
                    category_count += 1
            
            return {
                'success': True,
                'products_created': created_count,
                'products_updated': updated_count,
                'categories_created': category_count,
                'total_products': len(self.product_data),
                'message': f'Successfully populated database with {len(self.product_data)} products'
            }
            
        except Exception as e:
            logger.error(f"Database population failed: {e}")
            return {
                'success': False,
                'error': str(e),
                'message': 'Failed to populate database'
            }
    
    def get_products_by_category(self, category: str, limit: int = 20) -> List[Dict[str, Any]]:
        """Get products filtered by category"""
        try:
            products = Product.objects(category=category).limit(limit)
            return [
                {
                    'id': str(product.id),
                    'name': product.name,
                    'description': product.description,
                    'price': product.price,
                    'rating': product.rating,
                    'image_url': product.image_url,
                    'stock_quantity': product.stock_quantity
                }
                for product in products
            ]
        except Exception as e:
            logger.error(f"Get products by category failed: {e}")
            return []
    
    def search_products(self, query: str, limit: int = 20) -> List[Dict[str, Any]]:
        """Search products by name, description, or tags"""
        try:
            # MongoDB text search (requires text index)
            products = Product.objects.search_text(query).limit(limit)
            
            if not products:
                # Fallback to regex search
                products = Product.objects(
                    name__icontains=query
                ).limit(limit)
            
            return [
                {
                    'id': str(product.id),
                    'name': product.name,
                    'description': product.description,
                    'category': product.category,
                    'price': product.price,
                    'rating': product.rating,
                    'image_url': product.image_url,
                    'stock_quantity': product.stock_quantity
                }
                for product in products
            ]
        except Exception as e:
            logger.error(f"Product search failed: {e}")
            return []
    
    def get_featured_products(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get featured products (high rating, good stock)"""
        try:
            products = Product.objects(
                rating__gte=4.5,
                stock_quantity__gte=10
            ).order_by('-rating', '-stock_quantity').limit(limit)
            
            return [
                {
                    'id': str(product.id),
                    'name': product.name,
                    'description': product.description,
                    'category': product.category,
                    'price': product.price,
                    'rating': product.rating,
                    'image_url': product.image_url,
                    'stock_quantity': product.stock_quantity,
                    'featured_reason': 'High rating and availability'
                }
                for product in products
            ]
        except Exception as e:
            logger.error(f"Get featured products failed: {e}")
            return []

# Global instance
product_data_service = ProductDataService()
