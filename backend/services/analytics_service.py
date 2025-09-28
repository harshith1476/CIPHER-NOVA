"""
Advanced analytics service for daily updates and business intelligence
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import logging
from typing import Dict, List, Any, Optional
from collections import defaultdict
from backend.models.mongodb_models import Product, Purchase, Retailer, Feedback
import plotly.graph_objects as go
import plotly.express as px
from plotly.utils import PlotlyJSONEncoder
import json

logger = logging.getLogger(__name__)

class AnalyticsService:
    """Comprehensive analytics and reporting service"""
    
    def __init__(self):
        self.cache = {}
        self.cache_expiry = timedelta(hours=1)
    
    def get_daily_summary(self, date: datetime = None) -> Dict[str, Any]:
        """Generate daily business summary"""
        try:
            if not date:
                date = datetime.now().date()
            
            start_date = datetime.combine(date, datetime.min.time())
            end_date = start_date + timedelta(days=1)
            
            # Get daily purchases
            daily_purchases = Purchase.objects(
                purchase_date__gte=start_date,
                purchase_date__lt=end_date
            )
            
            # Calculate metrics
            total_sales = sum([p.amount for p in daily_purchases])
            total_orders = len(daily_purchases)
            unique_customers = len(set([p.retailer_id for p in daily_purchases]))
            
            # Average order value
            avg_order_value = total_sales / total_orders if total_orders > 0 else 0
            
            # Top products
            product_sales = defaultdict(lambda: {'count': 0, 'revenue': 0})
            for purchase in daily_purchases:
                product_id = str(purchase.product_id)
                product_sales[product_id]['count'] += 1
                product_sales[product_id]['revenue'] += purchase.amount
            
            top_products = []
            for product_id, data in sorted(product_sales.items(), 
                                         key=lambda x: x[1]['revenue'], reverse=True)[:5]:
                product = Product.objects(id=product_id).first()
                if product:
                    top_products.append({
                        'product_id': product_id,
                        'name': product.name,
                        'category': product.category,
                        'units_sold': data['count'],
                        'revenue': data['revenue']
                    })
            
            # Category performance
            category_performance = defaultdict(lambda: {'count': 0, 'revenue': 0})
            for purchase in daily_purchases:
                product = Product.objects(id=purchase.product_id).first()
                if product:
                    category_performance[product.category]['count'] += 1
                    category_performance[product.category]['revenue'] += purchase.amount
            
            category_data = [
                {
                    'category': category,
                    'units_sold': data['count'],
                    'revenue': data['revenue']
                }
                for category, data in category_performance.items()
            ]
            
            return {
                'date': date.isoformat(),
                'total_sales': round(total_sales, 2),
                'total_orders': total_orders,
                'unique_customers': unique_customers,
                'average_order_value': round(avg_order_value, 2),
                'top_products': top_products,
                'category_performance': category_data,
                'generated_at': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Daily summary generation failed: {e}")
            return {}
    
    def get_weekly_trends(self, weeks: int = 4) -> Dict[str, Any]:
        """Generate weekly trend analysis"""
        try:
            end_date = datetime.now()
            start_date = end_date - timedelta(weeks=weeks)
            
            purchases = Purchase.objects(purchase_date__gte=start_date)
            
            # Group by week
            weekly_data = defaultdict(lambda: {
                'sales': 0, 'orders': 0, 'customers': set()
            })
            
            for purchase in purchases:
                week_start = purchase.purchase_date - timedelta(
                    days=purchase.purchase_date.weekday()
                )
                week_key = week_start.strftime('%Y-%W')
                
                weekly_data[week_key]['sales'] += purchase.amount
                weekly_data[week_key]['orders'] += 1
                weekly_data[week_key]['customers'].add(purchase.retailer_id)
            
            # Convert to list format
            trends = []
            for week_key in sorted(weekly_data.keys()):
                data = weekly_data[week_key]
                trends.append({
                    'week': week_key,
                    'sales': round(data['sales'], 2),
                    'orders': data['orders'],
                    'unique_customers': len(data['customers'])
                })
            
            # Calculate growth rates
            for i in range(1, len(trends)):
                prev_sales = trends[i-1]['sales']
                curr_sales = trends[i]['sales']
                growth_rate = ((curr_sales - prev_sales) / prev_sales * 100) if prev_sales > 0 else 0
                trends[i]['sales_growth_rate'] = round(growth_rate, 2)
            
            return {
                'period_weeks': weeks,
                'weekly_trends': trends,
                'generated_at': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Weekly trends analysis failed: {e}")
            return {}
    
    def get_customer_analytics(self) -> Dict[str, Any]:
        """Analyze customer behavior and segmentation"""
        try:
            # Get all purchases from last 90 days
            recent_date = datetime.now() - timedelta(days=90)
            purchases = Purchase.objects(purchase_date__gte=recent_date)
            
            # Customer metrics
            customer_data = defaultdict(lambda: {
                'total_spent': 0,
                'order_count': 0,
                'last_purchase': None,
                'categories': set(),
                'avg_order_value': 0
            })
            
            for purchase in purchases:
                customer_id = purchase.retailer_id
                customer_data[customer_id]['total_spent'] += purchase.amount
                customer_data[customer_id]['order_count'] += 1
                
                if (not customer_data[customer_id]['last_purchase'] or 
                    purchase.purchase_date > customer_data[customer_id]['last_purchase']):
                    customer_data[customer_id]['last_purchase'] = purchase.purchase_date
                
                product = Product.objects(id=purchase.product_id).first()
                if product:
                    customer_data[customer_id]['categories'].add(product.category)
            
            # Calculate average order value and segment customers
            segments = {'high_value': 0, 'medium_value': 0, 'low_value': 0}
            customer_lifetime_values = []
            
            for customer_id, data in customer_data.items():
                data['avg_order_value'] = data['total_spent'] / data['order_count']
                customer_lifetime_values.append(data['total_spent'])
                
                # Simple segmentation
                if data['total_spent'] > 500:
                    segments['high_value'] += 1
                elif data['total_spent'] > 100:
                    segments['medium_value'] += 1
                else:
                    segments['low_value'] += 1
            
            # Calculate percentiles
            if customer_lifetime_values:
                percentiles = {
                    '25th': np.percentile(customer_lifetime_values, 25),
                    '50th': np.percentile(customer_lifetime_values, 50),
                    '75th': np.percentile(customer_lifetime_values, 75),
                    '90th': np.percentile(customer_lifetime_values, 90)
                }
            else:
                percentiles = {}
            
            return {
                'total_customers': len(customer_data),
                'customer_segments': segments,
                'lifetime_value_percentiles': percentiles,
                'average_customer_value': round(np.mean(customer_lifetime_values), 2) if customer_lifetime_values else 0,
                'generated_at': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Customer analytics failed: {e}")
            return {}
    
    def get_product_performance(self, days: int = 30) -> Dict[str, Any]:
        """Analyze product performance metrics"""
        try:
            recent_date = datetime.now() - timedelta(days=days)
            purchases = Purchase.objects(purchase_date__gte=recent_date)
            
            product_metrics = defaultdict(lambda: {
                'units_sold': 0,
                'revenue': 0,
                'unique_customers': set(),
                'ratings': [],
                'returns': 0
            })
            
            for purchase in purchases:
                product_id = str(purchase.product_id)
                product_metrics[product_id]['units_sold'] += 1
                product_metrics[product_id]['revenue'] += purchase.amount
                product_metrics[product_id]['unique_customers'].add(purchase.retailer_id)
                
                if purchase.rating:
                    product_metrics[product_id]['ratings'].append(purchase.rating)
            
            # Get product details and calculate final metrics
            performance_data = []
            for product_id, metrics in product_metrics.items():
                product = Product.objects(id=product_id).first()
                if product:
                    avg_rating = (sum(metrics['ratings']) / len(metrics['ratings']) 
                                if metrics['ratings'] else 0)
                    
                    performance_data.append({
                        'product_id': product_id,
                        'name': product.name,
                        'category': product.category,
                        'units_sold': metrics['units_sold'],
                        'revenue': round(metrics['revenue'], 2),
                        'unique_customers': len(metrics['unique_customers']),
                        'average_rating': round(avg_rating, 2),
                        'rating_count': len(metrics['ratings']),
                        'revenue_per_unit': round(metrics['revenue'] / metrics['units_sold'], 2)
                    })
            
            # Sort by revenue
            performance_data.sort(key=lambda x: x['revenue'], reverse=True)
            
            return {
                'period_days': days,
                'total_products_sold': len(performance_data),
                'product_performance': performance_data,
                'generated_at': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Product performance analysis failed: {e}")
            return {}
    
    def generate_sales_forecast(self, days_ahead: int = 30) -> Dict[str, Any]:
        """Generate sales forecast using simple trend analysis"""
        try:
            # Get historical data (last 90 days)
            end_date = datetime.now()
            start_date = end_date - timedelta(days=90)
            
            purchases = Purchase.objects(purchase_date__gte=start_date)
            
            # Group by day
            daily_sales = defaultdict(float)
            for purchase in purchases:
                day_key = purchase.purchase_date.date()
                daily_sales[day_key] += purchase.amount
            
            # Convert to time series
            dates = sorted(daily_sales.keys())
            sales_values = [daily_sales[date] for date in dates]
            
            if len(sales_values) < 7:
                return {'error': 'Insufficient data for forecasting'}
            
            # Simple moving average forecast
            window_size = 7
            recent_avg = sum(sales_values[-window_size:]) / window_size
            
            # Calculate trend
            if len(sales_values) >= 14:
                recent_trend = (sum(sales_values[-7:]) - sum(sales_values[-14:-7])) / 7
            else:
                recent_trend = 0
            
            # Generate forecast
            forecast_dates = []
            forecast_values = []
            
            for i in range(days_ahead):
                forecast_date = end_date.date() + timedelta(days=i+1)
                forecast_value = max(0, recent_avg + (recent_trend * i))
                
                forecast_dates.append(forecast_date.isoformat())
                forecast_values.append(round(forecast_value, 2))
            
            return {
                'forecast_period_days': days_ahead,
                'historical_average': round(recent_avg, 2),
                'trend_per_day': round(recent_trend, 2),
                'forecast': [
                    {'date': date, 'predicted_sales': value}
                    for date, value in zip(forecast_dates, forecast_values)
                ],
                'total_forecast': round(sum(forecast_values), 2),
                'generated_at': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Sales forecasting failed: {e}")
            return {}
    
    def create_dashboard_charts(self) -> Dict[str, Any]:
        """Generate chart data for dashboard visualization"""
        try:
            charts = {}
            
            # Sales trend chart (last 30 days)
            end_date = datetime.now()
            start_date = end_date - timedelta(days=30)
            purchases = Purchase.objects(purchase_date__gte=start_date)
            
            daily_sales = defaultdict(float)
            for purchase in purchases:
                day_key = purchase.purchase_date.date().isoformat()
                daily_sales[day_key] += purchase.amount
            
            # Sales trend
            dates = sorted(daily_sales.keys())
            sales_values = [daily_sales[date] for date in dates]
            
            charts['sales_trend'] = {
                'type': 'line',
                'data': {
                    'labels': dates,
                    'datasets': [{
                        'label': 'Daily Sales',
                        'data': sales_values,
                        'borderColor': 'rgb(75, 192, 192)',
                        'backgroundColor': 'rgba(75, 192, 192, 0.2)'
                    }]
                }
            }
            
            # Category distribution
            category_sales = defaultdict(float)
            for purchase in purchases:
                product = Product.objects(id=purchase.product_id).first()
                if product:
                    category_sales[product.category] += purchase.amount
            
            charts['category_distribution'] = {
                'type': 'doughnut',
                'data': {
                    'labels': list(category_sales.keys()),
                    'datasets': [{
                        'data': list(category_sales.values()),
                        'backgroundColor': [
                            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                            '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
                        ]
                    }]
                }
            }
            
            # Top products
            product_sales = defaultdict(float)
            for purchase in purchases:
                product = Product.objects(id=purchase.product_id).first()
                if product:
                    product_sales[product.name] += purchase.amount
            
            top_products = sorted(product_sales.items(), key=lambda x: x[1], reverse=True)[:10]
            
            charts['top_products'] = {
                'type': 'bar',
                'data': {
                    'labels': [item[0] for item in top_products],
                    'datasets': [{
                        'label': 'Revenue',
                        'data': [item[1] for item in top_products],
                        'backgroundColor': 'rgba(54, 162, 235, 0.8)'
                    }]
                }
            }
            
            return {
                'charts': charts,
                'generated_at': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Chart generation failed: {e}")
            return {}
    
    def get_real_time_metrics(self) -> Dict[str, Any]:
        """Get real-time business metrics"""
        try:
            now = datetime.now()
            today_start = datetime.combine(now.date(), datetime.min.time())
            
            # Today's metrics
            today_purchases = Purchase.objects(purchase_date__gte=today_start)
            today_sales = sum([p.amount for p in today_purchases])
            today_orders = len(today_purchases)
            
            # This hour's metrics
            hour_start = now.replace(minute=0, second=0, microsecond=0)
            hour_purchases = Purchase.objects(purchase_date__gte=hour_start)
            hour_sales = sum([p.amount for p in hour_purchases])
            hour_orders = len(hour_purchases)
            
            # Active customers (purchased in last 24 hours)
            day_ago = now - timedelta(days=1)
            active_customers = len(set([
                p.retailer_id for p in Purchase.objects(purchase_date__gte=day_ago)
            ]))
            
            # Inventory alerts (products with low stock)
            low_stock_products = Product.objects(stock_quantity__lt=10)
            
            return {
                'timestamp': now.isoformat(),
                'today': {
                    'sales': round(today_sales, 2),
                    'orders': today_orders,
                    'average_order_value': round(today_sales / today_orders, 2) if today_orders > 0 else 0
                },
                'current_hour': {
                    'sales': round(hour_sales, 2),
                    'orders': hour_orders
                },
                'active_customers_24h': active_customers,
                'low_stock_alerts': len(low_stock_products),
                'system_status': 'operational'
            }
            
        except Exception as e:
            logger.error(f"Real-time metrics failed: {e}")
            return {'error': str(e), 'timestamp': datetime.now().isoformat()}

# Global instance
analytics_service = AnalyticsService()
