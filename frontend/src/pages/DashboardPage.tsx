import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  Avatar,
  Chip,
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Mock data for dashboard (matching Image 3)
const orderTrendsData = [
  { name: 'Jan', orders: 20 },
  { name: 'Feb', orders: 25 },
  { name: 'Mar', orders: 30 },
  { name: 'Apr', orders: 35 },
  { name: 'May', orders: 45 },
  { name: 'Jun', orders: 40 },
  { name: 'Jul', orders: 50 },
];

const categoryData = [
  { name: 'Groceries', value: 45, color: '#2196F3' },
  { name: 'Beverages', value: 25, color: '#4CAF50' },
  { name: 'Snacks', value: 15, color: '#FF9800' },
  { name: 'Others', value: 15, color: '#9C27B0' },
];

const recentActivity = [
  {
    id: 1,
    action: 'Ordered Premium Basmati Rice 25kg',
    time: '2 hours ago',
    icon: '🛒',
    color: '#4CAF50'
  },
  {
    id: 2,
    action: 'Viewed Coca Cola 2L Pack',
    time: '4 hours ago',
    icon: '👁️',
    color: '#2196F3'
  },
  {
    id: 3,
    action: 'Added to cart Haldiram Namkeen Combo',
    time: '6 hours ago',
    icon: '🛍️',
    color: '#FF9800'
  },
  {
    id: 4,
    action: 'Searched for organic vegetables',
    time: '1 day ago',
    icon: '🔍',
    color: '#9C27B0'
  },
];

const DashboardPage: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Welcome back, Mumbai Kirana Store! 👋
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Here's what's happening with your business today.
            </Typography>
          </Box>
          <Button
            variant="contained"
            sx={{ 
              backgroundColor: '#2196F3',
              textTransform: 'none',
              fontWeight: 600,
              px: 3
            }}
          >
            View All Recommendations
          </Button>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, textAlign: 'center', border: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: '#E3F2FD', color: '#2196F3', width: 56, height: 56 }}>
                <ShoppingCartIcon />
              </Avatar>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#2196F3', mb: 1 }}>
              45
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Total Orders
            </Typography>
            <Chip 
              label="↗ +15% vs last month" 
              size="small" 
              color="success" 
              sx={{ fontSize: '0.7rem' }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, textAlign: 'center', border: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: '#E8F5E8', color: '#4CAF50', width: 56, height: 56 }}>
                <MoneyIcon />
              </Avatar>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#4CAF50', mb: 1 }}>
              ₹1,25,000
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Total Sales
            </Typography>
            <Chip 
              label="↗ +8% vs last month" 
              size="small" 
              color="success" 
              sx={{ fontSize: '0.7rem' }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, textAlign: 'center', border: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: '#FFF3E0', color: '#FF9800', width: 56, height: 56 }}>
                <PeopleIcon />
              </Avatar>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#FF9800', mb: 1 }}>
              89%
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              AI Recommendations Used
            </Typography>
            <Chip 
              label="↗ +3% vs last month" 
              size="small" 
              color="success" 
              sx={{ fontSize: '0.7rem' }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, textAlign: 'center', border: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: '#FCE4EC', color: '#E91E63', width: 56, height: 56 }}>
                <TrendingUpIcon />
              </Avatar>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#E91E63', mb: 1 }}>
              ₹2,778
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Avg Order Value
            </Typography>
            <Chip 
              label="↘ -3% vs last month" 
              size="small" 
              color="error" 
              sx={{ fontSize: '0.7rem' }}
            />
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, border: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Order Trends
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last 6 months
              </Typography>
            </Box>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={orderTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#2196F3" 
                    strokeWidth={3}
                    dot={{ fill: '#2196F3', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, fill: '#1976D2' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, border: '1px solid #e0e0e0' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Category Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Box sx={{ mt: 2 }}>
              {categoryData.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box 
                    sx={{ 
                      width: 12, 
                      height: 12, 
                      backgroundColor: item.color, 
                      borderRadius: '50%', 
                      mr: 1 
                    }} 
                  />
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {item.value}%
                  </Typography>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Card sx={{ p: 3, border: '1px solid #e0e0e0' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              📋 Recent Activity
            </Typography>
            <Box>
              {recentActivity.map((activity) => (
                <Box 
                  key={activity.id} 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    py: 2, 
                    borderBottom: '1px solid #f0f0f0',
                    '&:last-child': { borderBottom: 'none' }
                  }}
                >
                  <Box 
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%', 
                      backgroundColor: `${activity.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 3,
                      fontSize: '1.2rem'
                    }}
                  >
                    {activity.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {activity.action}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {activity.time}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
