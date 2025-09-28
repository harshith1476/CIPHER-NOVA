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
  Paper,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  ShoppingCart as ShoppingCartIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Refresh as RefreshIcon,
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
  BarChart,
  Bar,
  Legend,
} from 'recharts';

// Mock data for impressive analytics
const salesTrendData = [
  { name: 'Week 1', sales: 85000, orders: 38, customers: 67 },
  { name: 'Week 2', sales: 92000, orders: 42, customers: 71 },
  { name: 'Week 3', sales: 78000, orders: 35, customers: 58 },
  { name: 'Week 4', sales: 105000, orders: 48, customers: 82 },
  { name: 'Week 5', sales: 118000, orders: 52, customers: 89 },
  { name: 'Week 6', sales: 125000, orders: 47, customers: 89 },
  { name: 'Week 7', sales: 135000, orders: 58, customers: 95 },
  { name: 'Week 8', sales: 142000, orders: 62, customers: 102 },
  { name: 'Week 9', sales: 138000, orders: 59, customers: 98 },
  { name: 'Week 10', sales: 155000, orders: 67, customers: 108 },
  { name: 'Week 11', sales: 148000, orders: 64, customers: 105 },
  { name: 'Week 12', sales: 165000, orders: 72, customers: 115 },
];

const categoryData = [
  { name: 'Groceries', value: 35, count: 156, revenue: 45000 },
  { name: 'Beverages', value: 25, count: 89, revenue: 28000 },
  { name: 'Snacks', value: 15, count: 67, revenue: 18500 },
  { name: 'Dairy', value: 12, count: 45, revenue: 15000 },
  { name: 'Spices', value: 8, count: 32, revenue: 8500 },
  { name: 'Others', value: 5, count: 23, revenue: 5000 },
];

const topProductsData = [
  { name: 'Premium Basmati Rice', revenue: 61250, units: 25 },
  { name: 'Coca Cola Pack', revenue: 15120, units: 18 },
  { name: 'Tata Tea Gold', revenue: 10240, units: 32 },
  { name: 'Amul Butter Pack', revenue: 8400, units: 7 },
  { name: 'Maggi Noodles', revenue: 6720, units: 14 },
];

const salesForecastData = [
  { period: 'Next Week', predicted: 172000, confidence: 89 },
  { period: 'Week 2', predicted: 178000, confidence: 85 },
  { period: 'Week 3', predicted: 165000, confidence: 82 },
  { period: 'Week 4', predicted: 185000, confidence: 78 },
];

const COLORS = ['#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#F44336', '#607D8B'];

const AnalyticsPageNew: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30 Days');

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Analytics Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive business insights and performance metrics
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Period:
          </Typography>
          <Button
            variant={selectedPeriod === '30 Days' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setSelectedPeriod('30 Days')}
          >
            30 Days
          </Button>
          <Button
            variant={selectedPeriod === '90 Days' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setSelectedPeriod('90 Days')}
          >
            90 Days
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white', height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    ₹1,65,000
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Today's Sales
                  </Typography>
                  <Chip 
                    label="↗ +12% vs yesterday" 
                    size="small" 
                    sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                </Box>
                <TrendingUpIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'success.main', color: 'white', height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    72
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Orders Today
                  </Typography>
                  <Chip 
                    label="↗ +8% vs yesterday" 
                    size="small" 
                    sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                </Box>
                <ShoppingCartIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'info.main', color: 'white', height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    115
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Customers
                  </Typography>
                  <Chip 
                    label="↗ +15% this month" 
                    size="small" 
                    sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                </Box>
                <PeopleIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'warning.main', color: 'white', height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    ₹2,292
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Avg Customer Value
                  </Typography>
                  <Chip 
                    label="↗ +5% this month" 
                    size="small" 
                    sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                </Box>
                <MoneyIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Row 1 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                📈 Sales Trend (Last 30 Days)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px'
                    }}
                    formatter={(value: any, name: string) => [
                      name === 'sales' ? `₹${value.toLocaleString()}` : value,
                      name === 'sales' ? 'Sales' : name === 'orders' ? 'Orders' : 'Customers'
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#2196F3" 
                    strokeWidth={3}
                    dot={{ fill: '#2196F3', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#1976D2' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#4CAF50" 
                    strokeWidth={2}
                    dot={{ fill: '#4CAF50', strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                🥧 Category Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value}%`, 'Share']} />
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ mt: 1 }}>
                {categoryData.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Box 
                      sx={{ 
                        width: 12, 
                        height: 12, 
                        backgroundColor: COLORS[index % COLORS.length], 
                        borderRadius: '50%', 
                        mr: 1 
                      }} 
                    />
                    <Typography variant="body2" sx={{ flex: 1, fontSize: '0.8rem' }}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                      {item.value}%
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Row 2 */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                📊 Sales Forecast (Next 30 Days)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesForecastData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="period" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      name === 'predicted' ? `₹${value.toLocaleString()}` : `${value}%`,
                      name === 'predicted' ? 'Predicted Sales' : 'Confidence'
                    ]}
                  />
                  <Bar dataKey="predicted" fill="#2196F3" />
                  <Bar dataKey="confidence" fill="#4CAF50" />
                </BarChart>
              </ResponsiveContainer>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  Predicted Total: <strong>₹7,00,000</strong> | Daily Trend: <strong>₹25,000</strong>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                🏆 Top Products (Last 30 Days)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topProductsData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" stroke="#666" />
                  <YAxis dataKey="name" type="category" stroke="#666" width={120} />
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      name === 'revenue' ? `₹${value.toLocaleString()}` : `${value} units`,
                      name === 'revenue' ? 'Revenue' : 'Units Sold'
                    ]}
                  />
                  <Bar dataKey="revenue" fill="#FF9800" />
                </BarChart>
              </ResponsiveContainer>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  No product performance data available
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AnalyticsPageNew;
