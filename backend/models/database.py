"""
Database models for the Retailer Recommendation System
"""

from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import uuid
from sqlalchemy.dialects.postgresql import UUID, JSONB
from backend.app import db

class Retailer(UserMixin, db.Model):
    """Retailer model for authentication and profile management"""
    
    __tablename__ = 'retailers'
    
    retailer_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(255))
    store_type = db.Column(db.String(100))
    business_size = db.Column(db.String(50))
    phone = db.Column(db.String(20))
    address = db.Column(db.Text)
    registration_date = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    is_active = db.Column(db.Boolean, default=True)
    profile_data = db.Column(JSONB)
    
    # Relationships
    purchases = db.relationship('Purchase', backref='retailer', lazy='dynamic', cascade='all, delete-orphan')
    feedback = db.relationship('Feedback', backref='retailer', lazy='dynamic', cascade='all, delete-orphan')
    recommendations = db.relationship('Recommendation', backref='retailer', lazy='dynamic', cascade='all, delete-orphan')
    preferences = db.relationship('RetailerPreference', backref='retailer', lazy='dynamic', cascade='all, delete-orphan')
    
    def get_id(self):
        """Return user ID for Flask-Login"""
        return str(self.retailer_id)
    
    def set_password(self, password):
        """Set password hash"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check password against hash"""
        return check_password_hash(self.password_hash, password)
    
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
            'profile_data': self.profile_data
        }

class Product(db.Model):
    """Product model"""
    
    __tablename__ = 'products'
    
    product_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    subcategory = db.Column(db.String(100))
    brand = db.Column(db.String(100))
    price = db.Column(db.Numeric(10, 2), nullable=False)
    description = db.Column(db.Text)
    sku = db.Column(db.String(100), unique=True)
    supplier = db.Column(db.String(255))
    unit_type = db.Column(db.String(50))
    seasonal = db.Column(db.Boolean, default=False)
    popularity_score = db.Column(db.Numeric(3, 2), default=0.0)
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    updated_date = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    product_attributes = db.Column(JSONB)
    
    # Relationships
    purchases = db.relationship('Purchase', backref='product', lazy='dynamic')
    feedback = db.relationship('Feedback', backref='product', lazy='dynamic')
    recommendations = db.relationship('Recommendation', backref='product', lazy='dynamic')
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
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
            'created_date': self.created_date.isoformat() if self.created_date else None,
            'updated_date': self.updated_date.isoformat() if self.updated_date else None,
            'is_active': self.is_active,
            'product_attributes': self.product_attributes
        }

class Purchase(db.Model):
    """Purchase model"""
    
    __tablename__ = 'purchases'
    
    purchase_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    retailer_id = db.Column(UUID(as_uuid=True), db.ForeignKey('retailers.retailer_id'), nullable=False)
    product_id = db.Column(UUID(as_uuid=True), db.ForeignKey('products.product_id'), nullable=False)
    purchase_date = db.Column(db.DateTime, default=datetime.utcnow)
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Numeric(10, 2), nullable=False)
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    discount_applied = db.Column(db.Numeric(5, 2), default=0.0)
    payment_method = db.Column(db.String(50))
    order_source = db.Column(db.String(50))
    season = db.Column(db.String(20))
    purchase_metadata = db.Column(JSONB)
    
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
            'purchase_metadata': self.purchase_metadata
        }

class Feedback(db.Model):
    """Feedback model for recommendation system"""
    
    __tablename__ = 'feedback'
    
    feedback_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    retailer_id = db.Column(UUID(as_uuid=True), db.ForeignKey('retailers.retailer_id'), nullable=False)
    product_id = db.Column(UUID(as_uuid=True), db.ForeignKey('products.product_id'), nullable=False)
    recommendation_id = db.Column(UUID(as_uuid=True))
    feedback_type = db.Column(db.String(50), nullable=False)
    feedback_value = db.Column(db.Numeric(3, 2))
    feedback_date = db.Column(db.DateTime, default=datetime.utcnow)
    context = db.Column(JSONB)
    
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
            'context': self.context
        }

class Recommendation(db.Model):
    """Recommendation model"""
    
    __tablename__ = 'recommendations'
    
    recommendation_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    retailer_id = db.Column(UUID(as_uuid=True), db.ForeignKey('retailers.retailer_id'), nullable=False)
    product_id = db.Column(UUID(as_uuid=True), db.ForeignKey('products.product_id'), nullable=False)
    recommendation_score = db.Column(db.Numeric(5, 4), nullable=False)
    recommendation_type = db.Column(db.String(50), nullable=False)
    algorithm_version = db.Column(db.String(20))
    recommended_date = db.Column(db.DateTime, default=datetime.utcnow)
    context = db.Column(JSONB)
    was_clicked = db.Column(db.Boolean, default=False)
    was_purchased = db.Column(db.Boolean, default=False)
    
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
            'context': self.context,
            'was_clicked': self.was_clicked,
            'was_purchased': self.was_purchased
        }

class ProductCategory(db.Model):
    """Product category model"""
    
    __tablename__ = 'product_categories'
    
    category_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    category_name = db.Column(db.String(100), nullable=False, unique=True)
    parent_category_id = db.Column(UUID(as_uuid=True), db.ForeignKey('product_categories.category_id'))
    description = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'category_id': str(self.category_id),
            'category_name': self.category_name,
            'parent_category_id': str(self.parent_category_id) if self.parent_category_id else None,
            'description': self.description,
            'is_active': self.is_active
        }

class RetailerPreference(db.Model):
    """Retailer preference model"""
    
    __tablename__ = 'retailer_preferences'
    
    preference_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    retailer_id = db.Column(UUID(as_uuid=True), db.ForeignKey('retailers.retailer_id'), nullable=False)
    category = db.Column(db.String(100))
    brand = db.Column(db.String(100))
    price_range_min = db.Column(db.Numeric(10, 2))
    price_range_max = db.Column(db.Numeric(10, 2))
    preference_score = db.Column(db.Numeric(3, 2))
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    updated_date = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
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
