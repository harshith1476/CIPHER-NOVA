import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Database Configuration
    MONGODB_URI = os.environ.get('MONGODB_URI') or 'mongodb://localhost:27017/retailer_recommendations'
    MONGO_URI = MONGODB_URI  # Flask-PyMongo expects MONGO_URI
    MONGODB_DB = 'retailer_recommendations'
    
    # Flask Configuration
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key-change-this'
    DEBUG = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    
    # ML Model Configuration
    MODEL_UPDATE_INTERVAL = 24  # hours
    MIN_INTERACTIONS_FOR_RECOMMENDATION = 5
    RECOMMENDATION_COUNT = 10
    
    # API Configuration
    API_RATE_LIMIT = "100 per hour"
    
    # External AI Services (Optional)
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
    GOOGLE_CLOUD_PROJECT = os.environ.get('GOOGLE_CLOUD_PROJECT')
    
    # Logging
    LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO')
    
class DevelopmentConfig(Config):
    DEBUG = True
    MONGODB_URI = 'mongodb://localhost:27017/retailer_recommendations_dev'
    MONGO_URI = MONGODB_URI

class ProductionConfig(Config):
    DEBUG = False
    
class TestingConfig(Config):
    TESTING = True
    MONGODB_URI = 'mongodb://localhost:27017/retailer_recommendations_test'
    MONGO_URI = MONGODB_URI

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
