"""
MongoDB models for the Retailer Recommendation System using MongoEngine
"""

from mongoengine import Document, EmbeddedDocument, fields
from flask_login import UserMixin
import hashlib
import secrets
from datetime import datetime
import uuid

class Retailer(Document, UserMixin):
    """Retailer model for authentication and profile management"""
    
    retailer_id = fields.StringField(primary_key=True, default=lambda: str(uuid.uuid4()))
    name = fields.StringField(required=True, max_length=255)
    email = fields.EmailField(required=True, unique=True)
    password_hash = fields.StringField(required=True)
    location = fields.StringField(max_length=255)
    store_type = fields.StringField(max_length=100)
    business_size = fields.StringField(max_length=50, choices=['small', 'medium', 'large'])
    phone = fields.StringField(max_length=20)
    address = fields.StringField()
    registration_date = fields.DateTimeField(default=datetime.utcnow)
    last_login = fields.DateTimeField()
    is_active = fields.BooleanField(default=True)
    profile_data = fields.DictField()
    
    meta = {
        'collection': 'retailers',
        'indexes': ['email', 'location', 'store_type']
    }
    
    def get_id(self):
        """Return user ID for Flask-Login"""
        return str(self.retailer_id)
    
    def set_password(self, password):
        """Set password hash using PBKDF2"""
        salt = secrets.token_hex(16)
        password_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
        self.password_hash = f"{salt}:{password_hash.hex()}"
    
    def check_password(self, password):
        """Check password against hash"""
        try:
            salt, stored_hash = self.password_hash.split(':')
            password_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
            return password_hash.hex() == stored_hash
        except (ValueError, AttributeError):
            # Fallback for old Werkzeug hashes (if any exist)
            try:
                from werkzeug.security import check_password_hash
                return check_password_hash(self.password_hash, password)
            except:
                return False
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'retailer_id': str(self.retailer_id),
            'name': self.name,
            'email': self.email,
            'location': self.location,
            'store_type': self.store_type,
            'business_size': self.business_size,
            'phone': self.phone,
            'address': self.address,
            'registration_date': self.registration_date.isoformat() if self.registration_date else None,
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'is_active': self.is_active,
            'profile_data': self.profile_data or {}
        }

class Product(Document):
    """Product model"""
    
    product_id = fields.StringField(primary_key=True, default=lambda: str(uuid.uuid4()))
    name = fields.StringField(required=True, max_length=255)
    category = fields.StringField(required=True, max_length=100)
    subcategory = fields.StringField(max_length=100)
    brand = fields.StringField(max_length=100)
    price = fields.DecimalField(required=True, min_value=0, precision=2)
    description = fields.StringField()
    sku = fields.StringField(max_length=100)
    supplier = fields.StringField(max_length=255)
    unit_type = fields.StringField(max_length=50)
    seasonal = fields.BooleanField(default=False)
    popularity_score = fields.DecimalField(default=0.0, min_value=0, max_value=5, precision=2)
    
    # Additional fields for comprehensive product catalog
    rating = fields.DecimalField(default=0.0, min_value=0, max_value=5, precision=2)
    image_url = fields.StringField()
    stock_quantity = fields.IntField(default=0, min_value=0)
    tags = fields.ListField(fields.StringField(max_length=50))
    
    # Timestamps
    created_at = fields.DateTimeField(default=datetime.utcnow)
    updated_at = fields.DateTimeField(default=datetime.utcnow)
    created_date = fields.DateTimeField(default=datetime.utcnow)  # Keep for backward compatibility
    updated_date = fields.DateTimeField(default=datetime.utcnow)  # Keep for backward compatibility
    
    is_active = fields.BooleanField(default=True)
    product_attributes = fields.DictField()
    
    meta = {
        'collection': 'products',
        'indexes': ['category', 'brand', 'price', 'sku', 'popularity_score']
    }
    
    def save(self, *args, **kwargs):
        """Override save to update timestamp"""
        self.updated_date = datetime.utcnow()
        return super().save(*args, **kwargs)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': str(self.product_id),
            'product_id': str(self.product_id),
            'name': self.name,
            'category': self.category,
            'subcategory': self.subcategory,
            'brand': self.brand,
            'price': float(self.price),
            'description': self.description,
            'sku': self.sku,
            'supplier': self.supplier,
            'unit_type': self.unit_type,
            'seasonal': self.seasonal,
            'popularity_score': float(self.popularity_score) if self.popularity_score else 0.0,
            'rating': float(self.rating) if self.rating else 0.0,
            'image_url': self.image_url,
            'stock_quantity': self.stock_quantity if self.stock_quantity else 0,
            'tags': self.tags or [],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'created_date': self.created_date.isoformat() if self.created_date else None,
            'updated_date': self.updated_date.isoformat() if self.updated_date else None,
            'is_active': self.is_active,
            'product_attributes': self.product_attributes or {}
        }

class Purchase(Document):
    """Purchase model"""
    
    purchase_id = fields.StringField(primary_key=True, default=lambda: str(uuid.uuid4()))
    retailer_id = fields.StringField(required=True)
    product_id = fields.StringField(required=True)
    purchase_date = fields.DateTimeField(default=datetime.utcnow)
    quantity = fields.IntField(required=True, min_value=1)
    unit_price = fields.DecimalField(required=True, min_value=0, precision=2)
    total_amount = fields.DecimalField(required=True, min_value=0, precision=2)
    discount_applied = fields.DecimalField(default=0.0, min_value=0, precision=2)
    payment_method = fields.StringField(max_length=50)
    order_source = fields.StringField(max_length=50)
    season = fields.StringField(max_length=20)
    purchase_metadata = fields.DictField()
    
    meta = {
        'collection': 'purchases',
        'indexes': [
            ('retailer_id', 'purchase_date'),
            ('product_id', 'purchase_date'),
            'purchase_date'
        ]
    }
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'purchase_id': str(self.purchase_id),
            'retailer_id': str(self.retailer_id),
            'product_id': str(self.product_id),
            'purchase_date': self.purchase_date.isoformat() if self.purchase_date else None,
            'quantity': self.quantity,
            'unit_price': float(self.unit_price),
            'total_amount': float(self.total_amount),
            'discount_applied': float(self.discount_applied) if self.discount_applied else 0.0,
            'payment_method': self.payment_method,
            'order_source': self.order_source,
            'season': self.season,
            'purchase_metadata': self.purchase_metadata or {}
        }

class Feedback(Document):
    """Feedback model for recommendation system"""
    
    feedback_id = fields.StringField(primary_key=True, default=lambda: str(uuid.uuid4()))
    retailer_id = fields.StringField(required=True)
    product_id = fields.StringField(required=True)
    recommendation_id = fields.StringField()
    feedback_type = fields.StringField(required=True, max_length=50)
    feedback_value = fields.DecimalField(min_value=0, max_value=5, precision=2)
    feedback_date = fields.DateTimeField(default=datetime.utcnow)
    context = fields.DictField()
    
    meta = {
        'collection': 'feedback',
        'indexes': [
            ('retailer_id', 'feedback_date'),
            'feedback_type'
        ]
    }
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'feedback_id': str(self.feedback_id),
            'retailer_id': str(self.retailer_id),
            'product_id': str(self.product_id),
            'recommendation_id': str(self.recommendation_id) if self.recommendation_id else None,
            'feedback_type': self.feedback_type,
            'feedback_value': float(self.feedback_value) if self.feedback_value else None,
            'feedback_date': self.feedback_date.isoformat() if self.feedback_date else None,
            'context': self.context or {}
        }

class Recommendation(Document):
    """Recommendation model"""
    
    recommendation_id = fields.StringField(primary_key=True, default=lambda: str(uuid.uuid4()))
    retailer_id = fields.StringField(required=True)
    product_id = fields.StringField(required=True)
    recommendation_score = fields.DecimalField(required=True, min_value=0, max_value=1, precision=4)
    recommendation_type = fields.StringField(required=True, max_length=50)
    algorithm_version = fields.StringField(max_length=20)
    recommended_date = fields.DateTimeField(default=datetime.utcnow)
    context = fields.DictField()
    was_clicked = fields.BooleanField(default=False)
    was_purchased = fields.BooleanField(default=False)
    
    meta = {
        'collection': 'recommendations',
        'indexes': [
            ('retailer_id', 'recommended_date'),
            'recommendation_type'
        ]
    }
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'recommendation_id': str(self.recommendation_id),
            'retailer_id': str(self.retailer_id),
            'product_id': str(self.product_id),
            'recommendation_score': float(self.recommendation_score),
            'recommendation_type': self.recommendation_type,
            'algorithm_version': self.algorithm_version,
            'recommended_date': self.recommended_date.isoformat() if self.recommended_date else None,
            'context': self.context or {},
            'was_clicked': self.was_clicked,
            'was_purchased': self.was_purchased
        }

class ProductCategory(Document):
    """Product category model"""
    
    category_id = fields.StringField(primary_key=True, default=lambda: str(uuid.uuid4()))
    name = fields.StringField(required=True, unique=True, max_length=100)  # Changed from category_name to name
    category_name = fields.StringField(max_length=100)  # Keep for backward compatibility
    parent_category_id = fields.StringField()
    description = fields.StringField()
    is_active = fields.BooleanField(default=True)
    created_at = fields.DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'product_categories',
        'indexes': ['category_name']
    }
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'category_id': str(self.category_id),
            'category_name': self.category_name,
            'parent_category_id': str(self.parent_category_id) if self.parent_category_id else None,
            'description': self.description,
            'is_active': self.is_active
        }

class RetailerPreference(Document):
    """Retailer preference model"""
    
    preference_id = fields.StringField(primary_key=True, default=lambda: str(uuid.uuid4()))
    retailer_id = fields.StringField(required=True)
    category = fields.StringField(max_length=100)
    brand = fields.StringField(max_length=100)
    price_range_min = fields.DecimalField(min_value=0, precision=2)
    price_range_max = fields.DecimalField(min_value=0, precision=2)
    preference_score = fields.DecimalField(min_value=0, max_value=5, precision=2)
    created_date = fields.DateTimeField(default=datetime.utcnow)
    updated_date = fields.DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'retailer_preferences',
        'indexes': ['retailer_id']
    }
    
    def save(self, *args, **kwargs):
        """Override save to update timestamp"""
        self.updated_date = datetime.utcnow()
        return super().save(*args, **kwargs)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'preference_id': str(self.preference_id),
            'retailer_id': str(self.retailer_id),
            'category': self.category,
            'brand': self.brand,
            'price_range_min': float(self.price_range_min) if self.price_range_min else None,
            'price_range_max': float(self.price_range_max) if self.price_range_max else None,
            'preference_score': float(self.preference_score) if self.preference_score else None,
            'created_date': self.created_date.isoformat() if self.created_date else None,
            'updated_date': self.updated_date.isoformat() if self.updated_date else None
        }

# Aggregation pipeline helpers for analytics
class AnalyticsHelper:
    """Helper class for MongoDB aggregation pipelines"""
    
    @staticmethod
    def get_retailer_purchase_summary(retailer_id: str = None):
        """Get purchase summary for retailers"""
        match_stage = {}
        if retailer_id:
            match_stage['retailer_id'] = retailer_id
        
        pipeline = [
            {'$match': match_stage},
            {'$group': {
                '_id': '$retailer_id',
                'total_purchases': {'$sum': 1},
                'total_spent': {'$sum': '$total_amount'},
                'avg_purchase_amount': {'$avg': '$total_amount'},
                'last_purchase_date': {'$max': '$purchase_date'},
                'unique_products': {'$addToSet': '$product_id'}
            }},
            {'$addFields': {
                'unique_products_count': {'$size': '$unique_products'}
            }},
            {'$project': {
                'unique_products': 0  # Remove the array, keep only count
            }}
        ]
        
        return Purchase.objects.aggregate(pipeline)
    
    @staticmethod
    def get_product_popularity():
        """Get product popularity statistics"""
        pipeline = [
            {'$group': {
                '_id': '$product_id',
                'purchase_count': {'$sum': 1},
                'total_quantity_sold': {'$sum': '$quantity'},
                'total_revenue': {'$sum': '$total_amount'},
                'avg_selling_price': {'$avg': '$unit_price'},
                'unique_retailers': {'$addToSet': '$retailer_id'}
            }},
            {'$addFields': {
                'unique_retailers_count': {'$size': '$unique_retailers'}
            }},
            {'$project': {
                'unique_retailers': 0  # Remove the array, keep only count
            }},
            {'$sort': {'total_revenue': -1}}
        ]
        
        return Purchase.objects.aggregate(pipeline)
    
    @staticmethod
    def get_category_performance(days: int = 30):
        """Get category performance over specified days"""
        from datetime import timedelta
        
        start_date = datetime.utcnow() - timedelta(days=days)
        
        pipeline = [
            {'$match': {'purchase_date': {'$gte': start_date}}},
            {'$lookup': {
                'from': 'products',
                'localField': 'product_id',
                'foreignField': 'product_id',
                'as': 'product'
            }},
            {'$unwind': '$product'},
            {'$group': {
                '_id': '$product.category',
                'purchase_count': {'$sum': 1},
                'total_spent': {'$sum': '$total_amount'},
                'avg_price': {'$avg': '$unit_price'}
            }},
            {'$sort': {'total_spent': -1}}
        ]
        
        return Purchase.objects.aggregate(pipeline)
