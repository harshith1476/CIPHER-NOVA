# 🚀 Enhanced Retailer Recommendation System

A comprehensive AI-powered retailer recommendation system with advanced features including machine learning recommendations, location-based services, real-time analytics, and a modern React frontend.

## 🌟 Features

### 🤖 AI-Powered Recommendations
- **Content-Based Filtering**: Recommendations based on product features and descriptions
- **Collaborative Filtering**: User behavior-based recommendations
- **Trending Analysis**: Real-time trending products detection
- **Location-Based Recommendations**: Products popular in your area

### 📍 Location Services
- **Real-Time Location Tracking**: GPS-based user location detection
- **Nearby Retailers**: Find retailers within specified radius
- **Local Trends**: Discover what's popular in your area
- **Weather-Based Promotions**: Dynamic offers based on weather conditions
- **Delivery Estimation**: Calculate delivery time and costs

### 📊 Advanced Analytics
- **Real-Time Dashboard**: Live business metrics and KPIs
- **Sales Forecasting**: AI-powered sales predictions
- **Customer Segmentation**: Automatic customer categorization
- **Product Performance**: Detailed product analytics
- **Weekly/Monthly Trends**: Historical performance analysis

### 🛍️ Product Catalog
- **100+ Products**: Comprehensive catalog across multiple categories
- **Smart Search**: AI-enhanced product search
- **Category Filtering**: Browse by Electronics, Clothing, Home & Garden, etc.
- **High-Quality Images**: Product images from Unsplash
- **Detailed Information**: Ratings, reviews, stock levels

### 💻 Modern Frontend
- **React + TypeScript**: Modern, type-safe frontend
- **Material-UI**: Beautiful, responsive design
- **Real-Time Updates**: Live data synchronization
- **Mobile Responsive**: Works on all devices
- **Progressive Web App**: Installable on mobile devices

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  Flask Backend  │    │    MongoDB      │
│                 │    │                 │    │                 │
│ • Material-UI   │◄──►│ • AI Services   │◄──►│ • Products      │
│ • TypeScript    │    │ • Location API  │    │ • Users         │
│ • Charts.js     │    │ • Analytics     │    │ • Analytics     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Backend Services
- **AI Recommendation Service**: Machine learning algorithms for personalized recommendations
- **Location Service**: GPS tracking, nearby retailers, local trends
- **Analytics Service**: Business intelligence and reporting
- **Product Data Service**: Comprehensive product management

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- MongoDB (local or cloud)

### 1. Clone and Setup Backend
```bash
# Clone the repository
git clone <repository-url>
cd retailer-recommendation-system

# Install Python dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and other settings
```

### 2. Setup Database
```bash
# Populate database with sample data
python populate_database.py
```

### 3. Start Backend
```bash
# Start Flask backend (runs on port 5000)
python run.py
```

### 4. Setup Frontend
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start React development server (runs on port 3000)
npm start
```

### 5. Access the Application
- **Backend API**: http://localhost:5000
- **Frontend (React Dev)**: http://localhost:3000
- **Full Application**: http://localhost:5000 (serves both backend and frontend)

## 🔐 Demo Credentials
```
Email: demo@retailrecommend.com
Password: demo123
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/status` - Check authentication status

### AI Recommendations
- `POST /api/ai/recommendations/personalized` - Get personalized recommendations
- `GET /api/ai/recommendations/trending` - Get trending products
- `GET /api/ai/recommendations/similar/{product_id}` - Get similar products

### Location Services
- `POST /api/location/nearby-retailers` - Find nearby retailers
- `POST /api/location/local-trends` - Get local trends
- `POST /api/location/promotions` - Get location-based promotions
- `POST /api/location/delivery-estimate` - Calculate delivery estimates

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard analytics
- `GET /api/analytics/sales-forecast` - Get sales forecast
- `GET /api/analytics/product-performance` - Get product performance metrics

### Products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/category/{category}` - Get products by category
- `GET /api/products/search?q={query}` - Search products
- `POST /api/products/populate` - Populate database with products

## 🛠️ Configuration

### Environment Variables (.env)
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/retailer_recommendations

# Flask
FLASK_CONFIG=development
SECRET_KEY=your-secret-key-here
DEBUG=True

# External APIs (Optional)
WEATHER_API_KEY=your-weather-api-key
GEOCODING_API_KEY=your-geocoding-api-key

# Frontend
REACT_APP_API_URL=http://localhost:5000
```

### MongoDB Setup
1. **Local MongoDB**: Install MongoDB locally and start the service
2. **MongoDB Atlas**: Create a free cluster and update MONGODB_URI
3. **Docker**: Use `docker run -d -p 27017:27017 mongo`

## 📊 Dashboard Features

### Real-Time Metrics
- Today's sales and orders
- Active customers
- Average order value
- System health status

### Analytics Charts
- Sales trend (last 30 days)
- Category distribution
- Top performing products
- Customer segmentation

### AI Recommendations
- Personalized product suggestions
- Content-based recommendations
- Collaborative filtering results
- Trending products

### Location Insights
- Nearby retailers map
- Local trends analysis
- Weather-based promotions
- Delivery estimates

## 🔧 Development

### Backend Development
```bash
# Run with auto-reload
python run.py

# Run tests
python -m pytest tests/

# Check code style
flake8 backend/
```

### Frontend Development
```bash
cd frontend

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

### Adding New Features

#### 1. Add New AI Algorithm
```python
# backend/services/ai_recommendation_service.py
def get_custom_recommendations(self, user_id, params):
    # Implement your algorithm
    pass
```

#### 2. Add New API Endpoint
```python
# backend/routes/enhanced_api.py
@enhanced_api_bp.route('/api/custom/endpoint', methods=['POST'])
def custom_endpoint():
    # Your endpoint logic
    pass
```

#### 3. Add New React Component
```typescript
// frontend/src/components/CustomComponent.tsx
import React from 'react';

const CustomComponent: React.FC = () => {
    return <div>Custom Component</div>;
};

export default CustomComponent;
```

## 🚀 Deployment

### Backend Deployment (Heroku)
```bash
# Create Procfile
echo "web: python run.py" > Procfile

# Deploy to Heroku
heroku create your-app-name
git push heroku main
```

### Frontend Deployment (Netlify)
```bash
# Build the frontend
cd frontend
npm run build

# Deploy to Netlify
# Upload the build/ folder to Netlify
```

### Full Stack Deployment (Docker)
```dockerfile
# Dockerfile example
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "run.py"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

#### Backend won't start
- Check MongoDB connection
- Verify Python dependencies: `pip install -r requirements.txt`
- Check port 5000 availability

#### Frontend won't start
- Install Node.js dependencies: `npm install`
- Check port 3000 availability
- Verify API connection to backend

#### Database connection issues
- Ensure MongoDB is running
- Check MONGODB_URI in .env file
- Verify network connectivity

#### AI recommendations not working
- Ensure sufficient product data exists
- Check scikit-learn installation
- Initialize models: `python -c "from backend.services.ai_recommendation_service import ai_recommendation_service; ai_recommendation_service.initialize_models()"`

### Getting Help
- Check the [Issues](https://github.com/your-repo/issues) page
- Review the API documentation
- Check the browser console for frontend errors
- Review backend logs for API errors

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced ML models (Deep Learning)
- [ ] Real-time chat support
- [ ] Multi-language support
- [ ] Advanced analytics (Cohort analysis)
- [ ] Integration with payment gateways
- [ ] Social media integration
- [ ] Voice search capabilities

---

**Built with ❤️ using Flask, React, MongoDB, and AI**
