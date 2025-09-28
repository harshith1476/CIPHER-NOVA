"""
Flask application factory and configuration
"""

from flask import Flask, render_template, jsonify
from flask_login import LoginManager
from flask_cors import CORS
from flask_pymongo import PyMongo
import mongoengine
import logging
from config import config

# Initialize extensions
mongo = PyMongo()
login_manager = LoginManager()

def create_app(config_name='default'):
    """Create and configure Flask application"""
    
    app = Flask(__name__, 
                template_folder='../frontend/templates',
                static_folder='../frontend/static')
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Initialize MongoDB with error handling
    try:
        # Disconnect any existing connections first
        mongoengine.disconnect()
        
        # Connect with a specific alias to avoid conflicts
        mongoengine.connect(
            host=app.config['MONGODB_URI'],
            db=app.config.get('MONGODB_DB', 'retailer_recommendations'),
            alias='default',
            serverSelectionTimeoutMS=5000  # 5 second timeout
        )
        app.logger.info("MongoDB connected successfully")
    except Exception as e:
        app.logger.warning(f"MongoDB connection failed: {e}")
        app.logger.warning("Application will start but database features may not work")
    
    # Initialize extensions
    mongo.init_app(app)
    login_manager.init_app(app)
    CORS(app)
    
    # Configure login manager
    login_manager.login_view = 'auth.login'
    login_manager.login_message = 'Please log in to access this page.'
    login_manager.login_message_category = 'info'
    
    # Configure logging
    if not app.debug:
        logging.basicConfig(level=logging.INFO)
    
    # Register blueprints
    from backend.routes.auth import auth_bp
    from backend.routes.recommendations import recommendations_bp
    from backend.routes.enhanced_api import enhanced_api_bp
    from backend.routes.chat import chat_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(recommendations_bp, url_prefix='/api')
    app.register_blueprint(enhanced_api_bp, url_prefix='/api')
    app.register_blueprint(chat_bp, url_prefix='/api/chat')
    
    # Main routes
    @app.route('/')
    def index():
        """Main dashboard page"""
        return render_template('dashboard.html')
    
    @app.route('/login')
    def login_page():
        """Login page"""
        return render_template('login.html')
    
    @app.route('/test-login')
    def test_login_page():
        """Test login page"""
        with open('test_login.html', 'r') as f:
            return f.read()
    
    @app.route('/health')
    def health_check():
        """Health check endpoint"""
        return jsonify({
            'status': 'healthy',
            'service': 'retailer-recommendation-system',
            'version': '1.0.0'
        })
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    # Initialize database collections and indexes
    with app.app_context():
        try:
            from backend.models.mongodb_models import (
                Retailer, Product, Purchase, Feedback, 
                Recommendation, ProductCategory, RetailerPreference
            )
            # MongoDB collections are created automatically when first document is inserted
            app.logger.info("MongoDB models loaded successfully")
        except Exception as e:
            app.logger.error(f"Database initialization error: {e}")
    
    return app

@login_manager.user_loader
def load_user(user_id):
    """Load user for Flask-Login"""
    from backend.models.mongodb_models import Retailer
    try:
        return Retailer.objects(retailer_id=user_id).first()
    except:
        return None
