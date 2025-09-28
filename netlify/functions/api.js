const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

// Import your Flask app routes (converted to Express)
const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Auth endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Demo credentials for testing
    if (email === 'demo@retailrecommend.com' && password === 'demo123') {
      res.json({
        success: true,
        user: {
          id: 'demo-user-1',
          name: 'Demo User',
          email: 'demo@retailrecommend.com',
          avatar: null
        },
        token: 'demo-jwt-token'
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

app.get('/api/auth/status', (req, res) => {
  res.json({
    authenticated: false,
    user: null
  });
});

// Products endpoints
app.get('/api/products', async (req, res) => {
  try {
    // Sample products data
    const products = [
      {
        id: '1',
        name: 'Premium Wireless Headphones',
        description: 'High-quality noise-canceling headphones with premium sound',
        category: 'Electronics',
        price: 24999,
        rating: 4.8,
        image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        stock_quantity: 50
      },
      {
        id: '2',
        name: 'Smart Fitness Watch',
        description: 'Track your health and fitness with advanced sensors',
        category: 'Electronics',
        price: 16699,
        rating: 4.6,
        image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
        stock_quantity: 30
      },
      {
        id: '3',
        name: 'Designer Backpack',
        description: 'Stylish and functional backpack for everyday use',
        category: 'Fashion',
        price: 7499,
        rating: 4.5,
        image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
        stock_quantity: 25
      },
      {
        id: '4',
        name: 'Organic Coffee Beans',
        description: 'Premium organic coffee beans from sustainable farms',
        category: 'Food',
        price: 2099,
        rating: 4.9,
        image_url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500',
        stock_quantity: 100
      },
      {
        id: '5',
        name: 'Yoga Mat Pro',
        description: 'Professional-grade yoga mat with superior grip',
        category: 'Sports',
        price: 4199,
        rating: 4.7,
        image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500',
        stock_quantity: 40
      },
      {
        id: '6',
        name: 'Smart Home Speaker',
        description: 'Voice-controlled smart speaker with premium audio',
        category: 'Electronics',
        price: 12499,
        rating: 4.4,
        image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
        stock_quantity: 35
      }
    ];

    res.json({
      success: true,
      products: products,
      total: products.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
});

// Recommendations endpoint
app.get('/api/recommendations', async (req, res) => {
  try {
    // Mock AI recommendations
    const recommendations = [
      {
        id: 'rec-1',
        product_id: '1',
        score: 0.95,
        reason: 'Based on your interest in electronics'
      },
      {
        id: 'rec-2',
        product_id: '2',
        score: 0.87,
        reason: 'Popular in your area'
      }
    ];

    res.json({
      success: true,
      recommendations: recommendations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get recommendations',
      error: error.message
    });
  }
});

// Analytics endpoint
app.get('/api/analytics', async (req, res) => {
  try {
    const analytics = {
      total_users: 10543,
      total_products: 500,
      total_orders: 2847,
      revenue: 2847000,
      growth_rate: 15.2,
      popular_categories: [
        { name: 'Electronics', percentage: 35 },
        { name: 'Fashion', percentage: 28 },
        { name: 'Home & Garden', percentage: 20 },
        { name: 'Sports', percentage: 17 }
      ]
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message
    });
  }
});

// Chat endpoint for AI assistant
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Simple response logic (in production, this would use Gemini AI)
    let response = "I'm here to help you find the perfect products! ";
    
    if (message.toLowerCase().includes('headphones')) {
      response += "I recommend our Premium Wireless Headphones - they have excellent noise cancellation and are very popular!";
    } else if (message.toLowerCase().includes('price') || message.toLowerCase().includes('cost')) {
      response += "Our products range from ₹2,099 to ₹24,999. What's your budget?";
    } else if (message.toLowerCase().includes('electronics')) {
      response += "We have great electronics including headphones, fitness watches, and smart speakers!";
    } else {
      response += "You can browse our products or ask me about specific categories like electronics, fashion, or sports items.";
    }

    res.json({
      success: true,
      response: response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Chat service unavailable',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('API Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

module.exports.handler = serverless(app);
