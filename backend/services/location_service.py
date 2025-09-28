"""
Location-based services for real-time updates and geo-targeting
"""

import requests
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple
from geopy.distance import geodesic
from backend.models.mongodb_models import Product, Purchase, Retailer
import asyncio
import aiohttp

logger = logging.getLogger(__name__)

class LocationService:
    """Advanced location-based services with real-time updates"""
    
    def __init__(self):
        self.geocoding_api_key = None  # Set from environment
        self.weather_api_key = None    # Set from environment
        self.cache = {}
        self.cache_expiry = timedelta(hours=1)
    
    def get_location_from_ip(self, ip_address: str) -> Dict[str, Any]:
        """Get location information from IP address"""
        try:
            # Using a free IP geolocation service
            response = requests.get(f"http://ip-api.com/json/{ip_address}")
            if response.status_code == 200:
                data = response.json()
                return {
                    'latitude': data.get('lat'),
                    'longitude': data.get('lon'),
                    'city': data.get('city'),
                    'region': data.get('regionName'),
                    'country': data.get('country'),
                    'timezone': data.get('timezone'),
                    'isp': data.get('isp')
                }
        except Exception as e:
            logger.error(f"IP geolocation failed: {e}")
        
        return {}
    
    def get_weather_data(self, latitude: float, longitude: float) -> Dict[str, Any]:
        """Get current weather data for location"""
        try:
            # Using OpenWeatherMap API (free tier)
            if not self.weather_api_key:
                # Fallback to a free weather service
                response = requests.get(
                    f"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&current_weather=true"
                )
                if response.status_code == 200:
                    data = response.json()
                    current = data.get('current_weather', {})
                    return {
                        'temperature': current.get('temperature'),
                        'weather_code': current.get('weathercode'),
                        'wind_speed': current.get('windspeed'),
                        'wind_direction': current.get('winddirection'),
                        'time': current.get('time')
                    }
        except Exception as e:
            logger.error(f"Weather data fetch failed: {e}")
        
        return {}
    
    def get_nearby_retailers(self, latitude: float, longitude: float, 
                           radius_km: float = 10) -> List[Dict[str, Any]]:
        """Find retailers within specified radius"""
        try:
            retailers = Retailer.objects.all()
            nearby_retailers = []
            
            user_location = (latitude, longitude)
            
            for retailer in retailers:
                if retailer.location and 'coordinates' in retailer.location:
                    retailer_coords = retailer.location['coordinates']
                    retailer_location = (retailer_coords[1], retailer_coords[0])  # lat, lon
                    
                    distance = geodesic(user_location, retailer_location).kilometers
                    
                    if distance <= radius_km:
                        nearby_retailers.append({
                            'retailer_id': str(retailer.id),
                            'name': retailer.name,
                            'distance_km': round(distance, 2),
                            'address': retailer.address,
                            'phone': retailer.phone,
                            'rating': retailer.rating,
                            'coordinates': retailer_coords
                        })
            
            # Sort by distance
            nearby_retailers.sort(key=lambda x: x['distance_km'])
            return nearby_retailers
            
        except Exception as e:
            logger.error(f"Nearby retailers search failed: {e}")
            return []
    
    def get_local_trends(self, latitude: float, longitude: float, 
                        radius_km: float = 20, days: int = 30) -> Dict[str, Any]:
        """Get trending products and categories in the local area"""
        try:
            # Get recent purchases in the area
            recent_date = datetime.now() - timedelta(days=days)
            recent_purchases = Purchase.objects(purchase_date__gte=recent_date)
            
            # Filter purchases by location (simplified - in production use geospatial queries)
            local_purchases = []
            user_location = (latitude, longitude)
            
            for purchase in recent_purchases:
                retailer = Retailer.objects(retailer_id=purchase.retailer_id).first()
                if retailer and retailer.location and 'coordinates' in retailer.location:
                    retailer_coords = retailer.location['coordinates']
                    retailer_location = (retailer_coords[1], retailer_coords[0])
                    
                    distance = geodesic(user_location, retailer_location).kilometers
                    if distance <= radius_km:
                        local_purchases.append(purchase)
            
            # Analyze trends
            product_trends = {}
            category_trends = {}
            
            for purchase in local_purchases:
                product = Product.objects(id=purchase.product_id).first()
                if product:
                    # Product trends
                    product_id = str(product.id)
                    if product_id not in product_trends:
                        product_trends[product_id] = {
                            'name': product.name,
                            'category': product.category,
                            'count': 0,
                            'total_spent': 0
                        }
                    product_trends[product_id]['count'] += 1
                    product_trends[product_id]['total_spent'] += purchase.amount
                    
                    # Category trends
                    category = product.category
                    if category not in category_trends:
                        category_trends[category] = {
                            'count': 0,
                            'total_spent': 0,
                            'unique_products': set()
                        }
                    category_trends[category]['count'] += 1
                    category_trends[category]['total_spent'] += purchase.amount
                    category_trends[category]['unique_products'].add(product_id)
            
            # Convert sets to counts for JSON serialization
            for category in category_trends:
                category_trends[category]['unique_products'] = len(category_trends[category]['unique_products'])
            
            # Sort trends
            top_products = sorted(product_trends.items(), 
                                key=lambda x: x[1]['count'], reverse=True)[:10]
            top_categories = sorted(category_trends.items(), 
                                  key=lambda x: x[1]['count'], reverse=True)[:5]
            
            return {
                'location': {'latitude': latitude, 'longitude': longitude, 'radius_km': radius_km},
                'period_days': days,
                'total_local_purchases': len(local_purchases),
                'top_products': [{'product_id': pid, **data} for pid, data in top_products],
                'top_categories': [{'category': cat, **data} for cat, data in top_categories],
                'generated_at': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Local trends analysis failed: {e}")
            return {}
    
    def get_location_based_promotions(self, latitude: float, longitude: float) -> List[Dict[str, Any]]:
        """Get location-specific promotions and deals"""
        try:
            # Get weather data to suggest weather-appropriate products
            weather = self.get_weather_data(latitude, longitude)
            promotions = []
            
            # Weather-based promotions
            if weather.get('temperature'):
                temp = weather['temperature']
                if temp > 25:  # Hot weather
                    promotions.extend([
                        {
                            'type': 'weather_based',
                            'title': 'Beat the Heat!',
                            'description': 'Special discounts on cooling products',
                            'categories': ['beverages', 'ice_cream', 'fans', 'air_conditioners'],
                            'discount': 15,
                            'reason': f'Current temperature: {temp}°C'
                        }
                    ])
                elif temp < 10:  # Cold weather
                    promotions.extend([
                        {
                            'type': 'weather_based',
                            'title': 'Stay Warm!',
                            'description': 'Winter essentials at great prices',
                            'categories': ['clothing', 'heaters', 'hot_beverages'],
                            'discount': 20,
                            'reason': f'Current temperature: {temp}°C'
                        }
                    ])
            
            # Time-based promotions
            current_hour = datetime.now().hour
            if 11 <= current_hour <= 14:  # Lunch time
                promotions.append({
                    'type': 'time_based',
                    'title': 'Lunch Special',
                    'description': 'Quick lunch options with express delivery',
                    'categories': ['food', 'beverages'],
                    'discount': 10,
                    'reason': 'Lunch time promotion'
                })
            elif 17 <= current_hour <= 20:  # Evening
                promotions.append({
                    'type': 'time_based',
                    'title': 'Evening Deals',
                    'description': 'Dinner and entertainment specials',
                    'categories': ['food', 'entertainment', 'groceries'],
                    'discount': 12,
                    'reason': 'Evening promotion'
                })
            
            # Weekend promotions
            if datetime.now().weekday() >= 5:  # Saturday or Sunday
                promotions.append({
                    'type': 'weekend_special',
                    'title': 'Weekend Bonanza',
                    'description': 'Special weekend deals on family products',
                    'categories': ['family', 'entertainment', 'groceries'],
                    'discount': 18,
                    'reason': 'Weekend special offer'
                })
            
            return promotions
            
        except Exception as e:
            logger.error(f"Location-based promotions failed: {e}")
            return []
    
    def track_user_location_history(self, retailer_id: str, latitude: float, 
                                  longitude: float, activity: str = 'browse'):
        """Track user location for better recommendations"""
        try:
            retailer = Retailer.objects(retailer_id=retailer_id).first()
            if retailer:
                if not hasattr(retailer, 'location_history'):
                    retailer.location_history = []
                
                location_entry = {
                    'latitude': latitude,
                    'longitude': longitude,
                    'timestamp': datetime.now(),
                    'activity': activity
                }
                
                retailer.location_history.append(location_entry)
                
                # Keep only last 100 entries
                if len(retailer.location_history) > 100:
                    retailer.location_history = retailer.location_history[-100:]
                
                retailer.save()
                logger.info(f"Location tracked for retailer {retailer_id}")
                
        except Exception as e:
            logger.error(f"Location tracking failed: {e}")
    
    def get_delivery_estimates(self, retailer_latitude: float, retailer_longitude: float,
                             customer_latitude: float, customer_longitude: float) -> Dict[str, Any]:
        """Calculate delivery time and cost estimates"""
        try:
            retailer_location = (retailer_latitude, retailer_longitude)
            customer_location = (customer_latitude, customer_longitude)
            
            distance_km = geodesic(retailer_location, customer_location).kilometers
            
            # Simple delivery estimation (in production, use routing APIs)
            base_time = 30  # 30 minutes base time
            travel_time = distance_km * 3  # 3 minutes per km
            total_time = base_time + travel_time
            
            # Delivery cost calculation
            base_cost = 5.0  # Base delivery fee
            distance_cost = distance_km * 0.5  # $0.5 per km
            total_cost = base_cost + distance_cost
            
            # Free delivery for orders above certain amount or distance
            free_delivery_threshold = 50.0
            if distance_km <= 5:
                total_cost = max(0, total_cost - 2)  # Discount for nearby delivery
            
            return {
                'distance_km': round(distance_km, 2),
                'estimated_time_minutes': round(total_time),
                'delivery_cost': round(total_cost, 2),
                'free_delivery_threshold': free_delivery_threshold,
                'express_available': distance_km <= 10,
                'express_time_minutes': round(total_time * 0.7) if distance_km <= 10 else None,
                'express_cost': round(total_cost * 1.5, 2) if distance_km <= 10 else None
            }
            
        except Exception as e:
            logger.error(f"Delivery estimation failed: {e}")
            return {}
    
    async def get_real_time_updates(self, latitude: float, longitude: float) -> Dict[str, Any]:
        """Get real-time updates for location including traffic, events, etc."""
        try:
            updates = {
                'timestamp': datetime.now().isoformat(),
                'location': {'latitude': latitude, 'longitude': longitude}
            }
            
            # Get weather updates
            weather = self.get_weather_data(latitude, longitude)
            if weather:
                updates['weather'] = weather
            
            # Get local trends (cached for performance)
            cache_key = f"trends_{latitude}_{longitude}"
            if cache_key in self.cache:
                cache_entry = self.cache[cache_key]
                if datetime.now() - cache_entry['timestamp'] < self.cache_expiry:
                    updates['local_trends'] = cache_entry['data']
                else:
                    trends = self.get_local_trends(latitude, longitude, radius_km=15, days=7)
                    self.cache[cache_key] = {'data': trends, 'timestamp': datetime.now()}
                    updates['local_trends'] = trends
            else:
                trends = self.get_local_trends(latitude, longitude, radius_km=15, days=7)
                self.cache[cache_key] = {'data': trends, 'timestamp': datetime.now()}
                updates['local_trends'] = trends
            
            # Get promotions
            promotions = self.get_location_based_promotions(latitude, longitude)
            updates['promotions'] = promotions
            
            # Get nearby retailers
            nearby = self.get_nearby_retailers(latitude, longitude, radius_km=20)
            updates['nearby_retailers'] = nearby[:5]  # Top 5 closest
            
            return updates
            
        except Exception as e:
            logger.error(f"Real-time updates failed: {e}")
            return {'error': str(e), 'timestamp': datetime.now().isoformat()}

# Global instance
location_service = LocationService()
