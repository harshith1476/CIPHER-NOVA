"""
Authentication routes for the Retailer Recommendation System
"""

from flask import Blueprint, request, jsonify, session
from flask_login import login_user, logout_user, login_required, current_user
from datetime import datetime
from backend.models.mongodb_models import Retailer
import logging

logger = logging.getLogger(__name__)

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    """Retailer login endpoint"""
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        email = data['email'].lower().strip()
        password = data['password']
        
        # Mumbai Kirana Store demo user
        if email == 'demo@retailrecommend.com' and password == 'demo123':
            return jsonify({
                'success': True,
                'message': 'Login successful',
                'token': 'mumbai-kirana-token-12345',
                'user': {
                    'id': 'mumbai-kirana-id',
                    'retailer_id': 'mumbai_kirana_001',
                    'name': 'Mumbai Kirana Store',
                    'email': 'demo@retailrecommend.com',
                    'phone': '+91-9876543210',
                    'address': 'Shop No. 15, Linking Road, Bandra West, Mumbai - 400050',
                    'store_type': 'kirana',
                    'business_size': 'medium'
                }
            }), 200
        
        # Find retailer by email
        retailer = Retailer.objects(email=email).first()
        
        if not retailer or not retailer.check_password(password):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        if not retailer.is_active:
            return jsonify({'error': 'Account is deactivated'}), 401
        
        # Login user
        login_user(retailer, remember=data.get('remember', False))
        
        # Update last login
        retailer.last_login = datetime.utcnow()
        retailer.save()
        
        logger.info(f"Retailer {retailer.email} logged in successfully")
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'token': f'retailer-token-{retailer.id}',
            'user': retailer.to_dict()
        }), 200
        
    except Exception as e:
        logger.error(f"Login error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    """Retailer logout endpoint"""
    try:
        retailer_email = current_user.email
        logout_user()
        
        logger.info(f"Retailer {retailer_email} logged out")
        
        return jsonify({'message': 'Logout successful'}), 200
        
    except Exception as e:
        logger.error(f"Logout error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@auth_bp.route('/register', methods=['POST'])
def register():
    """Retailer registration endpoint"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'password', 'store_type']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        email = data['email'].lower().strip()
        
        # Check if retailer already exists
        existing_retailer = Retailer.objects(email=email).first()
        if existing_retailer:
            return jsonify({'error': 'Email already registered'}), 409
        
        # Create new retailer
        retailer = Retailer(
            name=data['name'],
            email=email,
            location=data.get('location'),
            store_type=data['store_type'],
            business_size=data.get('business_size', 'small'),
            phone=data.get('phone'),
            address=data.get('address'),
            profile_data=data.get('profile_data', {})
        )
        
        retailer.set_password(data['password'])
        retailer.save()
        
        logger.info(f"New retailer registered: {retailer.email}")
        
        return jsonify({
            'message': 'Registration successful',
            'retailer': retailer.to_dict()
        }), 201
        
    except Exception as e:
        logger.error(f"Registration error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@auth_bp.route('/profile', methods=['GET'])
@login_required
def get_profile():
    """Get current retailer profile"""
    try:
        return jsonify({
            'retailer': current_user.to_dict()
        }), 200
        
    except Exception as e:
        logger.error(f"Get profile error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@auth_bp.route('/profile', methods=['PUT'])
@login_required
def update_profile():
    """Update retailer profile"""
    try:
        data = request.get_json()
        
        # Update allowed fields
        allowed_fields = ['name', 'location', 'store_type', 'business_size', 'phone', 'address', 'profile_data']
        
        for field in allowed_fields:
            if field in data:
                setattr(current_user, field, data[field])
        
        current_user.save()
        
        logger.info(f"Profile updated for retailer {current_user.email}")
        
        return jsonify({
            'message': 'Profile updated successfully',
            'retailer': current_user.to_dict()
        }), 200
        
    except Exception as e:
        logger.error(f"Update profile error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@auth_bp.route('/change-password', methods=['POST'])
@login_required
def change_password():
    """Change retailer password"""
    try:
        data = request.get_json()
        
        if not data.get('current_password') or not data.get('new_password'):
            return jsonify({'error': 'Current password and new password are required'}), 400
        
        # Verify current password
        if not current_user.check_password(data['current_password']):
            return jsonify({'error': 'Current password is incorrect'}), 401
        
        # Update password
        current_user.set_password(data['new_password'])
        current_user.save()
        
        logger.info(f"Password changed for retailer {current_user.email}")
        
        return jsonify({'message': 'Password changed successfully'}), 200
        
    except Exception as e:
        logger.error(f"Change password error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@auth_bp.route('/status', methods=['GET'])
def auth_status():
    """Check authentication status"""
    try:
        if current_user.is_authenticated:
            return jsonify({
                'authenticated': True,
                'retailer': current_user.to_dict()
            }), 200
        else:
            return jsonify({
                'authenticated': False
            }), 200
            
    except Exception as e:
        logger.error(f"Auth status error: {e}")
        return jsonify({'error': 'Internal server error'}), 500
