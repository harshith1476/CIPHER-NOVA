import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Skeleton,
  Alert,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Analytics as AnalyticsIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { apiService } from '../services/apiService';
import { toast } from 'react-toastify';

interface AnalyticsData {
  daily_summary: any;
  weekly_trends: any;
  customer_analytics: any;
  real_time_metrics: any;
  charts: any;
}

interface ForecastData {
  forecast_period_days: number;
  historical_average: number;
  trend_per_day: number;
  forecast: Array<{
    date: string;
    predicted_sales: number;
  }>;
  total_forecast: number;
}

const AnalyticsPage: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [productPerformance, setProductPerformance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [forecastDays, setForecastDays] = useState(30);

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedPeriod]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      const [analyticsResponse, forecastResponse, performanceResponse] = await Promise.all([
        apiService.getDashboardAnalytics(),
        apiService.getSalesForecast(forecastDays),
        apiService.getProductPerformance(selectedPeriod)
      ]);

      if (analyticsResponse.success) {
        setAnalyticsData(analyticsResponse.data);
      }

      if (forecastResponse.success) {
        setForecastData(forecastResponse.data);
      }

      if (performanceResponse.success) {
        setProductPerformance(performanceResponse.data);
      }

    } catch (error) {
      console.error('Failed to load analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalyticsData();
    setRefreshing(false);
    toast.success('Analytics refreshed!');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
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

  const forecastChartData = (forecastData && forecastData.forecast) ? {
    labels: forecastData.forecast.map(item => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Predicted Sales',
        data: forecastData.forecast.map(item => item.predicted_sales),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
    ],
  } : null;

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
            Analytics Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive business insights and performance metrics
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Period</InputLabel>
            <Select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as number)}
            >
              <MenuItem value={7}>7 Days</MenuItem>
              <MenuItem value={30}>30 Days</MenuItem>
              <MenuItem value={90}>90 Days</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={refreshing}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {refreshing && (
        <LinearProgress sx={{ mb: 2 }} />
      )}

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {analyticsData?.real_time_metrics?.today?.sales 
                      ? formatCurrency(analyticsData.real_time_metrics.today.sales)
                      : '$0.00'}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Today's Sales
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {analyticsData?.real_time_metrics?.today?.orders || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Orders Today
                  </Typography>
                </Box>
                <AnalyticsIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {analyticsData?.customer_analytics?.total_customers || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Total Customers
                  </Typography>
                </Box>
                <AssessmentIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {analyticsData?.customer_analytics?.average_customer_value 
                      ? formatCurrency(analyticsData.customer_analytics.average_customer_value)
                      : '$0.00'}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Avg Customer Value
                  </Typography>
                </Box>
                <TimelineIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Row 1 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                <TimelineIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Sales Trend (Last {selectedPeriod} Days)
              </Typography>
              {analyticsData?.charts?.sales_trend ? (
                <Line
                  data={analyticsData.charts.sales_trend.data}
                  options={chartOptions}
                />
              ) : (
                <Alert severity="info">No sales trend data available</Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                <PieChartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Category Distribution
              </Typography>
              {analyticsData?.charts?.category_distribution ? (
                <Doughnut
                  data={analyticsData.charts.category_distribution.data}
                  options={{ 
                    responsive: true, 
                    plugins: { legend: { position: 'bottom' } } 
                  }}
                />
              ) : (
                <Alert severity="info">No category data available</Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Row 2 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Sales Forecast (Next {forecastDays} Days)
              </Typography>
              {forecastChartData ? (
                <Line data={forecastChartData} options={chartOptions} />
              ) : (
                <Alert severity="info">No forecast data available</Alert>
              )}
              {forecastData && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Predicted Total: {formatCurrency(forecastData.total_forecast)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Daily Trend: {forecastData.trend_per_day > 0 ? '+' : ''}{formatCurrency(forecastData.trend_per_day)}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                <BarChartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Top Products (Last {selectedPeriod} Days)
              </Typography>
              {analyticsData?.charts?.top_products ? (
                <Bar
                  data={analyticsData.charts.top_products.data}
                  options={{
                    ...chartOptions,
                    indexAxis: 'y' as const,
                  }}
                />
              ) : (
                <Alert severity="info">No product performance data available</Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Customer Segmentation */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Customer Segmentation
              </Typography>
              {analyticsData?.customer_analytics?.customer_segments ? (
                <Box>
                  {Object.entries(analyticsData.customer_analytics.customer_segments).map(([segment, count]) => (
                    <Box key={segment} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                          {segment.replace('_', ' ')} Value Customers
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {count as number}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(count as number) / analyticsData.customer_analytics.total_customers * 100}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Alert severity="info">No customer segmentation data available</Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Weekly Performance Trends
              </Typography>
              {analyticsData?.weekly_trends?.weekly_trends ? (
                <Box>
                  {analyticsData.weekly_trends.weekly_trends.slice(-4).map((week: any, index: number) => (
                    <Box key={week.week} sx={{ mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Week {week.week}
                        </Typography>
                        {week.sales_growth_rate && (
                          <Chip
                            label={`${week.sales_growth_rate > 0 ? '+' : ''}${week.sales_growth_rate.toFixed(1)}%`}
                            color={week.sales_growth_rate > 0 ? 'success' : 'error'}
                            size="small"
                          />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Sales: {formatCurrency(week.sales)} • Orders: {week.orders}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Alert severity="info">No weekly trends data available</Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Product Performance Table */}
      {productPerformance?.product_performance && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Top Performing Products (Last {selectedPeriod} Days)
            </Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Product</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Category</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>Units Sold</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>Revenue</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>Avg Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {productPerformance.product_performance.slice(0, 10).map((product: any, index: number) => (
                    <tr key={index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {product.name}
                        </Typography>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <Chip label={product.category} size="small" variant="outlined" />
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        {product.units_sold}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        {formatCurrency(product.revenue)}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        {product.average_rating.toFixed(1)} ⭐
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default AnalyticsPage;
