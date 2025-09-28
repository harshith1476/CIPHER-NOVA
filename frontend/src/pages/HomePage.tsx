import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  Rating,
  TextField,
  InputAdornment,
  Fab,
  Fade,
  useScrollTrigger,
  IconButton,
  Paper,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  TrendingUp as TrendingUpIcon,
  LocationOn as LocationOnIcon,
  Star as StarIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  Analytics as AnalyticsIcon,
  ShoppingBag as ShoppingBagIcon,
  Remove as RemoveIcon,
  Add as AddIcon,
  LocalFireDepartment as LocalFireDepartmentIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { keyframes } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from '../contexts/LocationContext';
import { apiService } from '../services/apiService';
import { toast } from 'react-toastify';
import Footer from '../components/Footer';
import AnimatedBackground from '../components/AnimatedBackground';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  image_url: string;
  stock_quantity: number;
  brand?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface PredictionData {
  date: string;
  sales: number;
  trend: number;
  category: string;
}

interface FeaturedSection {
  title: string;
  products: Product[];
  icon: React.ReactNode;
}

const ScrollTop: React.FC = () => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Fade in={trigger}>
      <Fab
        onClick={handleClick}
        color="primary"
        size="small"
        aria-label="scroll back to top"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </Fade>
  );
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { location } = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredSections, setFeaturedSections] = useState<FeaturedSection[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Cart functionality
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  
  // Chatbot functionality
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  
  // Live predictions data
  const [predictionData, setPredictionData] = useState<PredictionData[]>([]);
  const [salesTrend, setSalesTrend] = useState<any[]>([]);
  const [categoryTrends, setCategoryTrends] = useState<any[]>([]);
  const [animatedCounters, setAnimatedCounters] = useState<{[key: string]: number}>({});
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (user) {
      // Load full content for logged-in users
      loadFeaturedContent();
    } else {
      // Load sample products for non-logged users
      loadSampleProducts();
    }
    
    loadPredictionData();
    initializeChatbot();
    
    // Auto-refresh predictions every 30 seconds with animation
    const interval = setInterval(() => {
      loadPredictionData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [location, user]);
  
  // Animated counter function
  const animateCounter = (key: string, targetValue: number, duration: number = 2000) => {
    const startValue = animatedCounters[key] || 0;
    const startTime = Date.now();
    
    const updateCounter = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (targetValue - startValue) * easeOut;
      
      setAnimatedCounters(prev => ({ ...prev, [key]: currentValue }));
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };
    
    requestAnimationFrame(updateCounter);
  };
  
  // Load live prediction data with animations
  const loadPredictionData = async () => {
    try {
      setIsAnimating(true);
      
      // Generate mock prediction data for demo with more variation
      const mockSalesTrend = Array.from({ length: 7 }, (_, i) => {
        const baseValue = 800 + Math.sin(i * 0.5) * 200;
        const noise = (Math.random() - 0.5) * 100;
        return {
          date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
          sales: Math.floor(baseValue + noise),
          predictions: Math.floor(baseValue + noise + 50 + Math.random() * 100),
        };
      });
      
      const mockCategoryTrends = [
        { category: 'Electronics', growth: 15.2 + (Math.random() - 0.5) * 2, sales: 2500 + Math.floor(Math.random() * 200) },
        { category: 'Clothing', growth: 8.7 + (Math.random() - 0.5) * 2, sales: 1800 + Math.floor(Math.random() * 200) },
        { category: 'Home & Garden', growth: 12.1 + (Math.random() - 0.5) * 2, sales: 1200 + Math.floor(Math.random() * 200) },
        { category: 'Food & Beverages', growth: 6.3 + (Math.random() - 0.5) * 2, sales: 3200 + Math.floor(Math.random() * 200) },
      ];
      
      // Animate the data loading
      setTimeout(() => {
        setSalesTrend(mockSalesTrend);
        setCategoryTrends(mockCategoryTrends);
        
        // Animate counters for each category
        mockCategoryTrends.forEach((trend, index) => {
          setTimeout(() => {
            animateCounter(`growth-${trend.category}`, trend.growth, 1500);
            animateCounter(`sales-${trend.category}`, trend.sales, 2000);
          }, index * 200);
        });
        
        setIsAnimating(false);
      }, 500);
      
    } catch (error) {
      console.error('Failed to load prediction data:', error);
      setIsAnimating(false);
    }
  };
  
  // Load sample products for non-logged users
  const loadSampleProducts = async () => {
    try {
      const sampleProducts = [
        {
          id: 'sample-1',
          name: 'Premium Wireless Headphones',
          description: 'High-quality noise-canceling headphones with premium sound',
          category: 'Electronics',
          price: 24999,
          rating: 4.8,
          image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
          stock_quantity: 50
        },
        {
          id: 'sample-2',
          name: 'Smart Fitness Watch',
          description: 'Track your health and fitness with advanced sensors',
          category: 'Electronics',
          price: 16699,
          rating: 4.6,
          image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
          stock_quantity: 30
        },
        {
          id: 'sample-3',
          name: 'Designer Backpack',
          description: 'Stylish and functional backpack for everyday use',
          category: 'Fashion',
          price: 7499,
          rating: 4.5,
          image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
          stock_quantity: 25
        },
        {
          id: 'sample-4',
          name: 'Organic Coffee Beans',
          description: 'Premium organic coffee beans from sustainable farms',
          category: 'Food',
          price: 2099,
          rating: 4.9,
          image_url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500',
          stock_quantity: 100
        },
        {
          id: 'sample-5',
          name: 'Yoga Mat Pro',
          description: 'Professional-grade yoga mat with superior grip',
          category: 'Sports',
          price: 4199,
          rating: 4.7,
          image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500',
          stock_quantity: 40
        },
        {
          id: 'sample-6',
          name: 'Smart Home Speaker',
          description: 'Voice-controlled smart speaker with premium audio',
          category: 'Electronics',
          price: 12499,
          rating: 4.4,
          image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
          stock_quantity: 35
        }
      ];
      
      // Create sample featured sections
      const sampleFeaturedSections = [
        {
          title: 'Hot Deals Today',
          products: sampleProducts.slice(0, 3),
          icon: <StarIcon sx={{ color: '#ff4444', fontSize: 30 }} />
        },
        {
          title: 'Trending Electronics',
          products: sampleProducts.filter(p => p.category === 'Electronics'),
          icon: <TrendingUpIcon sx={{ color: '#2196f3', fontSize: 30 }} />
        },
        {
          title: 'Customer Favorites',
          products: sampleProducts.slice(2, 5),
          icon: <StarIcon sx={{ color: '#e91e63', fontSize: 30 }} />
        }
      ];
      
      setFeaturedSections(sampleFeaturedSections);
      
    } catch (error) {
      console.error('Failed to load sample products:', error);
    }
  };
  
  // Initialize chatbot
  const initializeChatbot = () => {
    setChatMessages([{
      id: '1',
      text: 'Hello! I\'m your AI shopping assistant. How can I help you find the perfect products today?',
      sender: 'bot',
      timestamp: new Date()
    }]);
  };
  
  // Cart functions
  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    toast.success(`${product.name} added to cart!`);
  };
  
  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };
  
  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev => 
      prev.map(item => 
        item.product.id === productId 
          ? { ...item, quantity }
          : item
      )
    );
  };
  
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };
  
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };
  
  // Chat functions
  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: chatInput,
      sender: 'user',
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);
    
    try {
      // Call Gemini API through backend
      const response = await apiService.post('/api/chat/gemini', {
        message: chatInput,
        context: 'retail_assistant'
      });
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: (response.data as any)?.response || 'I\'m sorry, I couldn\'t process that request.',
        sender: 'bot',
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'I\'m having trouble connecting right now. Please try again later.',
        sender: 'bot',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setChatLoading(false);
    }
  };
  const loadFeaturedContent = async () => {
    try {
      setLoading(true);
      
      // Load featured products
      const featuredResponse = await apiService.get('/api/products/featured?limit=8');
      const featuredProducts = featuredResponse.success && featuredResponse.data
        ? (featuredResponse.data as any).products || []
        : [];

      // Load trending products
      const trendingResponse = await apiService.get('/api/ai/recommendations/trending?limit=6');
      const trendingProducts = trendingResponse.success && trendingResponse.data 
        ? (trendingResponse.data as any).recommendations || [] 
        : [];
      // Load location-based products if location is available
      let locationProducts: Product[] = [];
      if (location?.latitude && location?.longitude) {
        try {
          const locationResponse = await apiService.post('/api/location/local-trends', {
            latitude: location.latitude,
            longitude: location.longitude,
            radius_km: 20,
            days: 7
          });
          
          const topLocalProducts = locationResponse.success && locationResponse.data 
            ? (locationResponse.data as any).top_products?.slice(0, 6) || []
            : [];
          locationProducts = await Promise.all(
            topLocalProducts.map(async (item: any) => {
              try {
                const productResponse = await apiService.get(`/api/products/${item.product_id}`);
                return productResponse.data;
              } catch {
                return null;
              }
            })
          ).then(products => products.filter(Boolean));
        } catch (error) {
          console.warn('Failed to load location-based products:', error);
        }
      }

      const sections: FeaturedSection[] = [
        {
          title: 'Featured Products',
          products: featuredProducts,
          icon: <StarIcon />
        },
        {
          title: 'Trending Now',
          products: trendingProducts.map((item: any) => ({
            id: item.product_id,
            name: item.name,
            price: item.price,
            rating: item.rating,
            image_url: item.image_url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500',
            description: item.description || 'Trending product',
            category: item.category || 'General',
            stock_quantity: item.stock_quantity || 0
          })),
          icon: <TrendingUpIcon />
        }
      ];

      if (locationProducts.length > 0) {
        sections.push({
          title: 'Popular in Your Area',
          products: locationProducts,
          icon: <LocationOnIcon />
        });
      }

      setFeaturedSections(sections);
    } catch (error) {
      console.error('Failed to load featured content:', error);
      toast.error('Failed to load featured content');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    } catch (error) {
      toast.error('Search failed');
    }
  };

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };
  return (
    <Box>
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 12,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 700,
                  mb: 2,
                  background: 'linear-gradient(45deg, #fff, #f0f0f0)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Smart Retail Recommendations
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  fontWeight: 300,
                }}
              >
                Discover products tailored to your preferences with AI-powered recommendations
                and location-based insights.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {!user ? (
                  <>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/login')}
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.3)',
                        },
                      }}
                    >
                      Get Started
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/products')}
                      sx={{
                        borderColor: 'rgba(255,255,255,0.5)',
                        color: 'white',
                        '&:hover': {
                          borderColor: 'white',
                          bgcolor: 'rgba(255,255,255,0.1)',
                        },
                      }}
                    >
                      Browse Products
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/dashboard')}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.3)',
                      },
                    }}
                  >
                    Go to Dashboard
                  </Button>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  textAlign: 'center',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600"
                  alt="Shopping Experience"
                  style={{
                    width: '100%',
                    maxWidth: '500px',
                    borderRadius: '20px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Search Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h4" gutterBottom>
            Find What You're Looking For
          </Typography>
          <Box sx={{ maxWidth: 600, mx: 'auto', mt: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search for products, brands, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      variant="contained"
                      onClick={handleSearch}
                      sx={{ mr: -1 }}
                    >
                      Search
                    </Button>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  bgcolor: 'background.paper',
                },
              }}
            />
          </Box>
        </Box>

        {/* Live Predictions Dashboard */}
        <Box sx={{ mb: 8 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 3,
            animation: 'fadeInUp 0.6s ease-out'
          }}>
            <AnalyticsIcon sx={{ 
              mr: 1, 
              color: 'primary.main',
              animation: isAnimating ? 'spin 2s linear infinite' : 'none',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              }
            }} />
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Live Market Insights
            </Typography>
            {isAnimating && (
              <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
                <LinearProgress sx={{ width: 100, mr: 1 }} />
                <Typography variant="caption" color="text.secondary">
                  Updating...
                </Typography>
              </Box>
            )}
          </Box>
          
          <Grid container spacing={3}>
            {/* Sales Trend Chart */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ 
                p: 3, 
                height: 400,
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                }
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    📈 Sales Predictions (7 Days)
                  </Typography>
                  <Chip 
                    label="Live" 
                    color="success" 
                    size="small"
                    sx={{ 
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%': { opacity: 1 },
                        '50%': { opacity: 0.5 },
                        '100%': { opacity: 1 }
                      }
                    }}
                  />
                </Box>
                <ResponsiveContainer width="100%" height="85%">
                  <AreaChart data={salesTrend}>
                    <defs>
                      <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1976d2" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#1976d2" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="predictionsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff9800" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ff9800" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      stroke="#666"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      stroke="#666"
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="#1976d2"
                      strokeWidth={3}
                      fill="url(#salesGradient)"
                      name="Actual Sales"
                      dot={{ fill: '#1976d2', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#1976d2', strokeWidth: 2 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="predictions"
                      stroke="#ff9800"
                      strokeWidth={3}
                      strokeDasharray="8 4"
                      fill="url(#predictionsGradient)"
                      name="AI Predictions"
                      dot={{ fill: '#ff9800', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#ff9800', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            
            {/* Category Growth - Redesigned */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ 
                p: 0, 
                height: 400,
                background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                border: '1px solid #e2e8f0',
                borderRadius: 3,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }
              }}>
                {/* Header */}
                <Box sx={{ 
                  p: 3, 
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                  color: 'white'
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                    📊 Category Performance
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                    Real-time growth metrics
                  </Typography>
                </Box>
                
                {/* Content */}
                <Box sx={{ p: 2, height: 'calc(100% - 100px)', overflowY: 'auto' }}>
                  {categoryTrends.map((trend, index) => {
                    const animatedGrowth = animatedCounters[`growth-${trend.category}`] || 0;
                    const animatedSales = animatedCounters[`sales-${trend.category}`] || 0;
                    const isHot = animatedGrowth > 10;
                    
                    return (
                      <Box 
                        key={trend.category} 
                        sx={{ 
                          mb: 2,
                          p: 2.5,
                          backgroundColor: '#ffffff',
                          borderRadius: 2,
                          border: '1px solid #f1f5f9',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                          animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'translateX(4px)',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                            borderColor: isHot ? '#10b981' : '#f59e0b'
                          },
                          '@keyframes slideInUp': {
                            '0%': { opacity: 0, transform: 'translateY(20px)' },
                            '100%': { opacity: 1, transform: 'translateY(0)' }
                          }
                        }}
                      >
                        {/* Category Header */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ 
                              width: 8, 
                              height: 8, 
                              borderRadius: '50%',
                              backgroundColor: isHot ? '#10b981' : '#f59e0b',
                              animation: 'pulse 2s infinite'
                            }} />
                            <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                              {trend.category}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            backgroundColor: isHot ? '#dcfce7' : '#fef3c7',
                            color: isHot ? '#166534' : '#92400e',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2,
                            fontSize: '0.875rem',
                            fontWeight: 700
                          }}>
                            {isHot ? '🔥' : '📈'} +{animatedGrowth.toFixed(1)}%
                          </Box>
                        </Box>
                        
                        {/* Progress Bar */}
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ 
                            height: 8, 
                            backgroundColor: '#f1f5f9',
                            borderRadius: 4,
                            overflow: 'hidden',
                            position: 'relative'
                          }}>
                            <Box sx={{
                              height: '100%',
                              width: `${Math.min(animatedGrowth * 6, 100)}%`,
                              background: isHot 
                                ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)'
                                : 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)',
                              borderRadius: 4,
                              transition: 'width 1s ease-out',
                              position: 'relative',
                              '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                                animation: 'shimmer 2s infinite'
                              },
                              '@keyframes shimmer': {
                                '0%': { transform: 'translateX(-100%)' },
                                '100%': { transform: 'translateX(100%)' }
                              }
                            }} />
                          </Box>
                        </Box>
                        
                        {/* Sales Info */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ 
                            color: '#64748b',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              💰 ₹{(animatedSales * 83).toLocaleString('en-IN')}
                            </Typography>
                            in sales
                          </Typography>
                          
                          <Chip 
                            label={isHot ? "Hot Seller" : "growing"}
                            size="small"
                            sx={{
                              backgroundColor: isHot ? '#10b981' : '#f59e0b',
                              color: 'white',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              height: 24,
                              '& .MuiChip-label': {
                                px: 1
                              }
                            }}
                          />
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Featured Sections */}
        <Box id="featured-products">
          {featuredSections.map((section, sectionIndex) => (
          <Box key={sectionIndex} sx={{ mb: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              {section.icon}
              <Typography variant="h4" sx={{ ml: 1, fontWeight: 600 }}>
                {section.title}
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              {section.products.slice(0, 8).map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                      },
                    }}
                    onClick={() => handleProductClick(product.id)}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.image_url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500'}
                      alt={product.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1, p: 2 }}>
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {product.name}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating
                          value={product.rating || 0}
                          precision={0.1}
                          size="small"
                          readOnly
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          ({product.rating?.toFixed(1) || 'N/A'})
                        </Typography>
                      </Box>

                      <Chip
                        label={product.category}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ mb: 1 }}
                      />

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          mb: 2,
                        }}
                      >
                        {product.description}
                      </Typography>
                    </CardContent>
                    
                    <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
                      <Typography
                        variant="h6"
                        color="primary"
                        sx={{ fontWeight: 700 }}
                      >
                        {formatPrice(product.price)}
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<ShoppingCartIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                      >
                        Add to Cart
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {section.products.length > 8 && (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/products')}
                >
                  View All {section.title}
                </Button>
              </Box>
            )}
          </Box>
        ))}
        </Box>

        {/* Features Section */}
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Why Choose Our Platform?
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 3 }}>
                <TrendingUpIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  AI-Powered Recommendations
                </Typography>
                <Typography color="text.secondary">
                  Get personalized product suggestions based on your preferences and behavior
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 3 }}>
                <LocationOnIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Location-Based Insights
                </Typography>
                <Typography color="text.secondary">
                  Discover trending products and deals in your area with real-time updates
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 3 }}>
                <StarIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Quality Assurance
                </Typography>
                <Typography color="text.secondary">
                  All products are carefully curated and rated by our community
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Floating Action Buttons */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 80, right: 16 }}
        onClick={() => setCartOpen(true)}
      >
        <Badge badgeContent={getTotalItems()} color="error">
          <ShoppingCartIcon />
        </Badge>
      </Fab>
      
      <Fab
        color="secondary"
        sx={{ position: 'fixed', bottom: 140, right: 16 }}
        onClick={() => setChatOpen(true)}
      >
        <ChatIcon />
      </Fab>

      {/* Cart Drawer */}
      <Drawer
        anchor="right"
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        sx={{ '& .MuiDrawer-paper': { width: 400 } }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Shopping Cart ({getTotalItems()})</Typography>
            <IconButton onClick={() => setCartOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          {cartItems.length === 0 ? (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              Your cart is empty
            </Typography>
          ) : (
            <>
              <List>
                {cartItems.map((item) => (
                  <ListItem key={item.product.id} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar
                        src={item.product.image_url}
                        alt={item.product.name}
                        variant="rounded"
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.product.name}
                      secondary={`₹${item.product.price.toLocaleString('en-IN')} x ${item.quantity}`}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton
                        size="small"
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                      <IconButton
                        size="small"
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </ListItem>
                ))}
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6">₹{getTotalPrice().toLocaleString('en-IN')}</Typography>
              </Box>
              
              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<ShoppingBagIcon />}
                onClick={() => {
                  toast.success('Order placed successfully!');
                  setCartItems([]);
                  setCartOpen(false);
                }}
              >
                Checkout
              </Button>
            </>
          )}
        </Box>
      </Drawer>

      {/* Chat Drawer */}
      <Drawer
        anchor="right"
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        sx={{ '& .MuiDrawer-paper': { width: 400 } }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">AI Shopping Assistant</Typography>
              <IconButton onClick={() => setChatOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          
          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            {chatMessages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  mb: 2,
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    maxWidth: '80%',
                    bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.100',
                    color: message.sender === 'user' ? 'white' : 'text.primary'
                  }}
                >
                  <Typography variant="body2">{message.text}</Typography>
                </Paper>
              </Box>
            ))}
            {chatLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
                  <Typography variant="body2">Typing...</Typography>
                </Paper>
              </Box>
            )}
          </Box>
          
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <TextField
              fullWidth
              placeholder="Ask me anything about products..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={sendChatMessage} disabled={chatLoading}>
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Box>
        </Box>
      </Drawer>

      <ScrollTop />
      
      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default HomePage;
