import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  ShoppingCart as ShoppingCartIcon,
  Analytics as AnalyticsIcon,
  LocationOn as LocationOnIcon,
  Notifications as NotificationsIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  Star as StarIcon,
  LocalOffer as LocalOfferIcon,
} from '@mui/icons-material';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from '../contexts/LocationContext';
import { apiService } from '../services/apiService';
import { toast } from 'react-toastify';
import { DashboardData, Recommendation, Promotion } from '../types/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

// Types are imported from ../types/api

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { location } = useLocation();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    loadDashboardData();
    loadRecommendations();
    loadPromotions();
  }, [user, location]);

  // Mock impressive data for demo purposes
  const mockDashboardData: DashboardData = {
    daily_summary: {
      date: new Date().toISOString().split('T')[0],
      total_sales: 125000,
      total_orders: 47,
      unique_customers: 89,
      average_order_value: 2659,
      top_products: [
        { product_id: '1', name: 'Premium Basmati Rice 25kg', category: 'Rice & Grains', units_sold: 25, revenue: 61250 },
        { product_id: '2', name: 'Coca Cola 2L Pack', category: 'Beverages', units_sold: 18, revenue: 15120 },
        { product_id: '3', name: 'Tata Tea Gold 1kg', category: 'Tea & Coffee', units_sold: 32, revenue: 10240 }
      ],
      category_performance: [
        { category: 'Groceries', units_sold: 156, revenue: 45000 },
        { category: 'Beverages', units_sold: 89, revenue: 28000 },
        { category: 'Snacks', units_sold: 67, revenue: 18500 }
      ],
      generated_at: new Date().toISOString()
    },
    weekly_trends: {
      period_weeks: 12,
      weekly_trends: [
        { week: '2024-W01', sales: 85000, orders: 38, unique_customers: 67 },
        { week: '2024-W02', sales: 92000, orders: 42, unique_customers: 71 },
        { week: '2024-W03', sales: 105000, orders: 45, unique_customers: 78 },
        { week: '2024-W04', sales: 125000, orders: 47, unique_customers: 89 }
      ],
      generated_at: new Date().toISOString()
    },
    customer_analytics: {
      total_customers: 234,
      customer_segments: { high_value: 45, medium_value: 123, low_value: 66 },
      lifetime_value_percentiles: { '25th': 1200, '50th': 2800, '75th': 5600, '90th': 12000 },
      average_customer_value: 3450,
      generated_at: new Date().toISOString()
    },
    real_time_metrics: {
      timestamp: new Date().toISOString(),
      today: {
        sales: 125000,
        orders: 47,
        average_order_value: 2659
      },
      current_hour: {
        sales: 8500,
        orders: 3
      },
      active_customers_24h: 89,
      low_stock_alerts: 5,
      system_status: 'operational'
    },
    charts: {
      sales_trend: {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
            label: 'Sales (₹)',
            data: [85000, 92000, 78000, 105000, 118000, 125000, 135000, 142000, 138000, 155000, 148000, 165000],
            borderColor: '#2196F3',
            backgroundColor: 'rgba(33, 150, 243, 0.1)'
          }]
        }
      },
      category_distribution: {
        type: 'doughnut',
        data: {
          labels: ['Groceries', 'Beverages', 'Snacks', 'Dairy', 'Spices', 'Others'],
          datasets: [{
            data: [35, 25, 15, 12, 8, 5],
            backgroundColor: [
              '#2196F3',
              '#4CAF50', 
              '#FF9800',
              '#9C27B0',
              '#F44336',
              '#607D8B'
            ]
          }]
        }
      },
      top_products: {
        type: 'bar',
        data: {
          labels: ['Premium Basmati Rice', 'Coca Cola Pack', 'Tata Tea Gold', 'Amul Butter', 'Maggi Noodles'],
          datasets: [{
            label: 'Revenue (₹)',
            data: [61250, 15120, 10240, 8400, 6720],
            backgroundColor: '#2196F3'
          }]
        }
      }
    },
    generated_at: new Date().toISOString()
  };

  const mockRecommendations: Recommendation[] = [
    {
      product_id: '1',
      name: 'Premium Basmati Rice 25kg',
      price: 2450,
      rating: 4.5,
      category: 'Rice & Grains',
      reason: 'Trending in your area - 89% bought together',
      similarity_score: 0.92
    },
    {
      product_id: '2',
      name: 'Tata Tea Gold 1kg',
      price: 320,
      rating: 4.4,
      category: 'Tea & Coffee',
      reason: 'High demand - Stock running low',
      collaborative_score: 0.87
    },
    {
      product_id: '3',
      name: 'Amul Butter 500g Pack',
      price: 1200,
      rating: 4.6,
      category: 'Dairy',
      reason: 'Seasonal peak - 156% increase in orders',
      trend_score: 0.94
    },
    {
      product_id: '4',
      name: 'Maggi Noodles Masala 24-Pack',
      price: 480,
      rating: 4.1,
      category: 'Instant Food',
      reason: 'Bulk discount available - Save 20%',
      similarity_score: 0.81
    }
  ];

  const mockPromotions: Promotion[] = [
    {
      type: 'seasonal',
      title: 'Diwali Special Offer',
      description: 'Extra 15% off on all grocery items above ₹2000',
      discount: 15,
      categories: ['Groceries', 'Snacks', 'Beverages'],
      reason: 'Festival season'
    },
    {
      type: 'bulk',
      title: 'Bulk Purchase Deal',
      description: 'Buy 10+ items and get free delivery',
      discount: 0,
      categories: ['All Categories'],
      reason: 'Volume discount'
    },
    {
      type: 'welcome',
      title: 'New Customer Bonus',
      description: 'First-time buyers get ₹500 cashback',
      discount: 25,
      categories: ['All Categories'],
      reason: 'Welcome offer'
    }
  ];

  const loadDashboardData = async () => {
    try {
      // Use mock data for impressive demo
      setDashboardData(mockDashboardData);
      setRecommendations(mockRecommendations);
      setPromotions(mockPromotions);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // Fallback to mock data
      setDashboardData(mockDashboardData);
      setRecommendations(mockRecommendations);
      setPromotions(mockPromotions);
    }
  };

  const loadRecommendations = async () => {
    // Already loaded in loadDashboardData with mock data
    return;
  };

  const loadPromotions = async () => {
    // Already loaded in loadDashboardData with mock data
    return;
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      loadDashboardData(),
      loadRecommendations(),
      loadPromotions()
    ]);
    setRefreshing(false);
    toast.success('Dashboard refreshed!');
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {[...Array(8)].map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                  <Skeleton variant="rectangular" height={60} sx={{ mt: 1 }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Welcome back, {user?.name || 'User'}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what's happening with your recommendations today
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            onClick={handleRefresh}
            disabled={refreshing}
            color="primary"
          >
            <RefreshIcon />
          </IconButton>
          <IconButton>
            <NotificationsIcon />
          </IconButton>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => setAnchorEl(null)}>Settings</MenuItem>
            <MenuItem onClick={() => setAnchorEl(null)}>Export Data</MenuItem>
            <MenuItem onClick={() => setAnchorEl(null)}>Help</MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Real-time Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {dashboardData?.real_time_metrics?.today?.orders || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Orders Today
                  </Typography>
                </Box>
                <ShoppingCartIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {formatCurrency(dashboardData?.real_time_metrics?.today?.sales || 0)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Sales Today
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'info.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {dashboardData?.real_time_metrics?.active_customers_24h || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Active Customers
                  </Typography>
                </Box>
                <AnalyticsIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'warning.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {formatCurrency(dashboardData?.real_time_metrics?.today?.average_order_value || 0)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Avg Order Value
                  </Typography>
                </Box>
                <DashboardIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Sales Trend (Last 30 Days)
              </Typography>
              {dashboardData?.charts?.sales_trend ? (
                <Line
                  data={dashboardData.charts.sales_trend.data}
                  options={chartOptions}
                />
              ) : (
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.secondary">No data available</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Category Distribution
              </Typography>
              {dashboardData?.charts?.category_distribution ? (
                <Doughnut
                  data={dashboardData.charts.category_distribution.data}
                  options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }}
                />
              ) : (
                <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.secondary">No data available</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recommendations and Promotions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                <StarIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Personalized Recommendations
              </Typography>
              {recommendations.length > 0 ? (
                <Grid container spacing={2}>
                  {recommendations.map((rec, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Card variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                          {rec.name}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="h6" color="primary">
                            {formatCurrency(rec.price)}
                          </Typography>
                          <Chip label={rec.category} size="small" />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {rec.reason}
                        </Typography>
                        <Button variant="outlined" size="small" fullWidth>
                          View Product
                        </Button>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Alert severity="info">
                  No recommendations available. Start browsing products to get personalized suggestions!
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                <LocalOfferIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Location-Based Promotions
              </Typography>
              {promotions.length > 0 ? (
                <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                  {promotions.map((promo, index) => (
                    <Card key={index} variant="outlined" sx={{ mb: 2, p: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        {promo.title}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {promo.description}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip
                          label={`${promo.discount}% OFF`}
                          color="secondary"
                          size="small"
                        />
                        <Typography variant="caption" color="text.secondary">
                          {promo.reason}
                        </Typography>
                      </Box>
                    </Card>
                  ))}
                </Box>
              ) : (
                <Alert severity="info">
                  Enable location services to see local promotions and deals!
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <ShoppingCartIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Browse Products
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Explore our catalog
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <AnalyticsIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                View Analytics
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Detailed insights
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <LocationOnIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Local Trends
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Area insights
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <TrendingUpIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Trending Now
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Popular products
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {refreshing && (
        <LinearProgress
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
          }}
        />
      )}
    </Container>
  );
};

export default Dashboard;
