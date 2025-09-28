"""
Recommendation API routes for the Retailer Recommendation System
"""

from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from datetime import datetime, timedelta
from backend.models.mongodb_models import Retailer, Product, Purchase, Feedback, Recommendation
from backend.models.recommendation import recommendation_engine
import logging

logger = logging.getLogger(__name__)

recommendations_bp = Blueprint('recommendations', __name__)

@recommendations_bp.route('/recommendations/<retailer_id>', methods=['GET'])
@login_required
def get_recommendations(retailer_id):
    """Get product recommendations for a retailer"""
    try:
        # Check if current user can access this retailer's data
        if str(current_user.retailer_id) != retailer_id:
            return jsonify({'error': 'Access denied'}), 403
        
        # Get query parameters
        num_recommendations = request.args.get('count', 10, type=int)
        num_recommendations = min(max(num_recommendations, 1), 50)  # Limit between 1-50
        
        # Get recommendations from the engine
        recommendations = recommendation_engine.get_recommendations(retailer_id, num_recommendations)
        
        if not recommendations:
            return jsonify({
                'message': 'No recommendations available',
                'recommendations': []
            }), 200
        
        return jsonify({
            'retailer_id': retailer_id,
            'recommendations': recommendations,
            'count': len(recommendations),
            'generated_at': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting recommendations for retailer {retailer_id}: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@recommendations_bp.route('/recommendations/train', methods=['POST'])
@login_required
def train_models():
    """Manually trigger model training (admin only)"""
    try:
        # In a real application, you'd check for admin privileges here
        recommendation_engine.train_models()
        
        return jsonify({
            'message': 'Model training initiated successfully',
            'timestamp': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        logger.error(f"Error training models: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@recommendations_bp.route('/feedback', methods=['POST'])
@login_required
def submit_feedback():
    """Submit feedback for a recommendation"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['product_id', 'feedback_type']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        retailer_id = str(current_user.retailer_id)
        product_id = data['product_id']
        feedback_type = data['feedback_type']
        feedback_value = data.get('feedback_value')
        recommendation_id = data.get('recommendation_id')
        
        # Validate feedback type
        valid_feedback_types = ['view', 'click', 'purchase', 'like', 'dislike', 'ignore']
        if feedback_type not in valid_feedback_types:
            return jsonify({'error': f'Invalid feedback type. Must be one of: {valid_feedback_types}'}), 400
        
        # Validate product exists
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        # Record feedback
        recommendation_engine.record_feedback(
            retailer_id=retailer_id,
            product_id=product_id,
            feedback_type=feedback_type,
            feedback_value=feedback_value,
            recommendation_id=recommendation_id
        )
        
        return jsonify({
            'message': 'Feedback recorded successfully',
            'feedback_type': feedback_type,
            'product_id': product_id
        }), 200
        
    except Exception as e:
        logger.error(f"Error submitting feedback: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@recommendations_bp.route('/retailers/<retailer_id>/history', methods=['GET'])
@login_required
def get_purchase_history(retailer_id):
    """Get purchase history for a retailer"""
    try:
        # Check access permissions
        if str(current_user.retailer_id) != retailer_id:
            return jsonify({'error': 'Access denied'}), 403
        
        # Get query parameters
        limit = request.args.get('limit', 50, type=int)
        offset = request.args.get('offset', 0, type=int)
        days = request.args.get('days', 90, type=int)  # Default last 90 days
        
        # Calculate date filter
        start_date = datetime.utcnow() - timedelta(days=days)
        
        # Query purchases
        purchases_query = db.session.query(
            Purchase, Product
        ).join(
            Product, Purchase.product_id == Product.product_id
        ).filter(
            Purchase.retailer_id == retailer_id,
            Purchase.purchase_date >= start_date
        ).order_by(
            Purchase.purchase_date.desc()
        )
        
        total_count = purchases_query.count()
        purchases = purchases_query.offset(offset).limit(limit).all()
        
        # Format response
        purchase_history = []
        for purchase, product in purchases:
            purchase_data = purchase.to_dict()
            purchase_data['product'] = product.to_dict()
            purchase_history.append(purchase_data)
        
        # Calculate summary statistics
        summary_query = db.session.query(
            db.func.count(Purchase.purchase_id).label('total_purchases'),
            db.func.sum(Purchase.total_amount).label('total_spent'),
            db.func.avg(Purchase.total_amount).label('avg_purchase'),
            db.func.count(db.distinct(Purchase.product_id)).label('unique_products')
        ).filter(
            Purchase.retailer_id == retailer_id,
            Purchase.purchase_date >= start_date
        ).first()
        
        summary = {
            'total_purchases': summary_query.total_purchases or 0,
            'total_spent': float(summary_query.total_spent or 0),
            'avg_purchase': float(summary_query.avg_purchase or 0),
            'unique_products': summary_query.unique_products or 0
        }
        
        return jsonify({
            'retailer_id': retailer_id,
            'purchase_history': purchase_history,
            'summary': summary,
            'pagination': {
                'total_count': total_count,
                'limit': limit,
                'offset': offset,
                'has_more': offset + limit < total_count
            },
            'period_days': days
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting purchase history for retailer {retailer_id}: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@recommendations_bp.route('/products', methods=['GET'])
def get_products():
    """Get products with filtering and search"""
    try:
        # Get query parameters
        category = request.args.get('category')
        brand = request.args.get('brand')
        search = request.args.get('search')
        min_price = request.args.get('min_price', type=float)
        max_price = request.args.get('max_price', type=float)
        limit = request.args.get('limit', 20, type=int)
        offset = request.args.get('offset', 0, type=int)
        
        # Build query
        query = Product.query.filter(Product.is_active == True)
        
        if category:
            query = query.filter(Product.category.ilike(f'%{category}%'))
        
        if brand:
            query = query.filter(Product.brand.ilike(f'%{brand}%'))
        
        if search:
            search_filter = db.or_(
                Product.name.ilike(f'%{search}%'),
                Product.description.ilike(f'%{search}%'),
                Product.category.ilike(f'%{search}%'),
                Product.brand.ilike(f'%{search}%')
            )
            query = query.filter(search_filter)
        
        if min_price is not None:
            query = query.filter(Product.price >= min_price)
        
        if max_price is not None:
            query = query.filter(Product.price <= max_price)
        
        # Get total count
        total_count = query.count()
        
        # Apply pagination and ordering
        products = query.order_by(
            Product.popularity_score.desc(),
            Product.name
        ).offset(offset).limit(limit).all()
        
        # Format response
        products_data = [product.to_dict() for product in products]
        
        return jsonify({
            'products': products_data,
            'pagination': {
                'total_count': total_count,
                'limit': limit,
                'offset': offset,
                'has_more': offset + limit < total_count
            },
            'filters': {
                'category': category,
                'brand': brand,
                'search': search,
                'min_price': min_price,
                'max_price': max_price
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting products: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@recommendations_bp.route('/products/<product_id>', methods=['GET'])
def get_product(product_id):
    """Get detailed product information"""
    try:
        product = Product.query.get(product_id)
        
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        # Get related products (same category)
        related_products = Product.query.filter(
            Product.category == product.category,
            Product.product_id != product.product_id,
            Product.is_active == True
        ).order_by(Product.popularity_score.desc()).limit(5).all()
        
        return jsonify({
            'product': product.to_dict(),
            'related_products': [p.to_dict() for p in related_products]
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting product {product_id}: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@recommendations_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all product categories"""
    try:
        categories = db.session.query(
            Product.category,
            db.func.count(Product.product_id).label('product_count')
        ).filter(
            Product.is_active == True
        ).group_by(
            Product.category
        ).order_by(
            Product.category
        ).all()
        
        categories_data = [
            {
                'category': category,
                'product_count': count
            }
            for category, count in categories
        ]
        
        return jsonify({
            'categories': categories_data
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting categories: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@recommendations_bp.route('/brands', methods=['GET'])
def get_brands():
    """Get all product brands"""
    try:
        brands = db.session.query(
            Product.brand,
            db.func.count(Product.product_id).label('product_count')
        ).filter(
            Product.is_active == True,
            Product.brand.isnot(None)
        ).group_by(
            Product.brand
        ).order_by(
            Product.brand
        ).all()
        
        brands_data = [
            {
                'brand': brand,
                'product_count': count
            }
            for brand, count in brands
        ]
        
        return jsonify({
            'brands': brands_data
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting brands: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@recommendations_bp.route('/analytics/dashboard', methods=['GET'])
@login_required
def get_analytics_dashboard():
    """Get analytics dashboard data for the current retailer"""
    try:
        retailer_id = str(current_user.retailer_id)
        
        # Get date range (default last 30 days)
        days = request.args.get('days', 30, type=int)
        start_date = datetime.utcnow() - timedelta(days=days)
        
        # Purchase analytics
        purchase_stats = db.session.query(
            db.func.count(Purchase.purchase_id).label('total_purchases'),
            db.func.sum(Purchase.total_amount).label('total_spent'),
            db.func.avg(Purchase.total_amount).label('avg_purchase'),
            db.func.count(db.distinct(Purchase.product_id)).label('unique_products')
        ).filter(
            Purchase.retailer_id == retailer_id,
            Purchase.purchase_date >= start_date
        ).first()
        
        # Top categories
        top_categories = db.session.query(
            Product.category,
            db.func.count(Purchase.purchase_id).label('purchase_count'),
            db.func.sum(Purchase.total_amount).label('total_spent')
        ).join(
            Purchase, Product.product_id == Purchase.product_id
        ).filter(
            Purchase.retailer_id == retailer_id,
            Purchase.purchase_date >= start_date
        ).group_by(
            Product.category
        ).order_by(
            db.desc('total_spent')
        ).limit(5).all()
        
        # Recommendation performance
        rec_stats = db.session.query(
            db.func.count(Recommendation.recommendation_id).label('total_recommendations'),
            db.func.sum(db.case([(Recommendation.was_clicked, 1)], else_=0)).label('total_clicks'),
            db.func.sum(db.case([(Recommendation.was_purchased, 1)], else_=0)).label('total_purchases')
        ).filter(
            Recommendation.retailer_id == retailer_id,
            Recommendation.recommended_date >= start_date
        ).first()
        
        # Calculate rates
        click_rate = 0
        purchase_rate = 0
        if rec_stats.total_recommendations and rec_stats.total_recommendations > 0:
            click_rate = (rec_stats.total_clicks or 0) / rec_stats.total_recommendations
            purchase_rate = (rec_stats.total_purchases or 0) / rec_stats.total_recommendations
        
        return jsonify({
            'retailer_id': retailer_id,
            'period_days': days,
            'purchase_analytics': {
                'total_purchases': purchase_stats.total_purchases or 0,
                'total_spent': float(purchase_stats.total_spent or 0),
                'avg_purchase': float(purchase_stats.avg_purchase or 0),
                'unique_products': purchase_stats.unique_products or 0
            },
            'top_categories': [
                {
                    'category': cat,
                    'purchase_count': count,
                    'total_spent': float(spent)
                }
                for cat, count, spent in top_categories
            ],
            'recommendation_performance': {
                'total_recommendations': rec_stats.total_recommendations or 0,
                'total_clicks': rec_stats.total_clicks or 0,
                'total_purchases': rec_stats.total_purchases or 0,
                'click_rate': round(click_rate * 100, 2),
                'purchase_rate': round(purchase_rate * 100, 2)
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting analytics dashboard: {e}")
        return jsonify({'error': 'Internal server error'}), 500
