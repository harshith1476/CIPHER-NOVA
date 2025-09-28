# Retailer Recommendation System

A comprehensive AI-powered recommendation system for retailers using SQL, Python, and Machine Learning.

## Project Structure

```
retailer-recommendation-system/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── models/
│   │   ├── __init__.py
│   │   ├── database.py        # Database models and connections
│   │   └── recommendation.py  # ML recommendation engine
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py           # Authentication routes
│   │   └── recommendations.py # Recommendation API routes
│   └── utils/
│       ├── __init__.py
│       └── data_processor.py  # Data processing utilities
├── database/
│   ├── schema.sql            # Database schema
│   ├── sample_data.sql       # Sample data for testing
│   └── migrations/           # Database migrations
├── frontend/
│   ├── static/
│   │   ├── css/
│   │   ├── js/
│   │   └── images/
│   └── templates/
│       ├── base.html
│       ├── dashboard.html
│       └── login.html
├── n8n/
│   └── workflow.json         # n8n workflow import file
├── requirements.txt          # Python dependencies
├── config.py                # Configuration settings
└── run.py                   # Application entry point
```

## Features

- **Database Management**: MongoDB with retailers, products, and purchases collections
- **AI Recommendations**: Collaborative and content-based filtering
- **REST API**: Flask-based backend with authentication
- **Web Dashboard**: Bootstrap-based frontend for retailers
- **Feedback Loop**: Continuous learning from user interactions
- **n8n Integration**: Workflow automation support

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Database Setup**:
   ```bash
   # Install and start MongoDB
   # Windows: Download from https://www.mongodb.com/try/download/community
   # macOS: brew install mongodb-community
   # Ubuntu: sudo apt-get install mongodb
   
   # Setup database with sample data
   python scripts/setup_mongodb.py
   ```

3. **Configuration**:
   - Copy `.env.example` to `.env` and update MongoDB URI
   - Set environment variables for API keys if using external AI services

4. **Run Application**:
   ```bash
   python run.py
   ```

5. **Access Dashboard**:
   - Open http://localhost:5000 in your browser
   - Login with sample retailer credentials

## API Endpoints

- `POST /api/auth/login` - Retailer authentication
- `GET /api/recommendations/{retailer_id}` - Get product recommendations
- `POST /api/feedback` - Submit purchase feedback
- `GET /api/retailers/{retailer_id}/history` - Get purchase history

## n8n Integration

Import the workflow from `n8n/workflow.json` to automate:
- Data synchronization
- Recommendation triggers
- Feedback processing
- Report generation

## Technology Stack

- **Backend**: Python, Flask, MongoEngine
- **Database**: MongoDB
- **ML/AI**: scikit-learn, pandas, numpy
- **Frontend**: HTML5, Bootstrap, JavaScript
- **Automation**: n8n workflows
