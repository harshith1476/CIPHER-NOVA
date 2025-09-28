"""
AI-powered recommendation service using machine learning algorithms
"""

import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.cluster import KMeans
from datetime import datetime, timedelta
import logging
import requests
import json
from typing import List, Dict, Any, Optional
from backend.models.mongodb_models import Product, Purchase, Retailer, Recommendation

logger = logging.getLogger(__name__)

class AIRecommendationService:
    """Advanced AI recommendation system with multiple algorithms"""
    
    def __init__(self):
        self.tfidf_vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
        self.kmeans_model = None
        self.product_features = None
        self.similarity_matrix = None
        
    def initialize_models(self):
        """Initialize and train ML models with current data"""
        try:
            products = Product.objects.all()
            if not products:
                logger.warning("No products found for model training")
                return False
                
            # Create feature matrix
            product_data = []
            for product in products:
                features = f"{product.name} {product.description} {product.category} {' '.join(product.tags or [])}"
                product_data.append({
                    'id': str(product.id),
                    'features': features,
                    'price': product.price,
                    'rating': product.rating or 0,
                    'category': product.category
                })
            
            df = pd.DataFrame(product_data)
            
            # TF-IDF vectorization
            tfidf_matrix = self.tfidf_vectorizer.fit_transform(df['features'])
            self.similarity_matrix = cosine_similarity(tfidf_matrix)
            
            # K-means clustering for product grouping
            self.kmeans_model = KMeans(n_clusters=min(10, len(products)//5 + 1), random_state=42)
            self.kmeans_model.fit(tfidf_matrix.toarray())
            
            self.product_features = df
            logger.info("AI models initialized successfully")
            return True
            
        except Exception as e:
            logger.error(f"Model initialization failed: {e}")
            return False
    
    def get_content_based_recommendations(self, product_id: str, limit: int = 5) -> List[Dict]:
        """Get recommendations based on product content similarity"""
        try:
            if self.similarity_matrix is None:
                self.initialize_models()
            
            product_idx = self.product_features[self.product_features['id'] == product_id].index
            if len(product_idx) == 0:
                return []
            
            product_idx = product_idx[0]
            similarity_scores = list(enumerate(self.similarity_matrix[product_idx]))
            similarity_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)
            
            recommendations = []
            for i, score in similarity_scores[1:limit+1]:  # Skip the product itself
                product_id_rec = self.product_features.iloc[i]['id']
                product = Product.objects(id=product_id_rec).first()
                if product:
                    recommendations.append({
                        'product_id': str(product.id),
                        'name': product.name,
                        'price': product.price,
                        'rating': product.rating,
                        'similarity_score': float(score),
                        'reason': 'Content similarity'
                    })
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Content-based recommendation failed: {e}")
            return []
    
    def get_collaborative_recommendations(self, retailer_id: str, limit: int = 5) -> List[Dict]:
        """Get recommendations based on collaborative filtering"""
        try:
            # Get user's purchase history
            purchases = Purchase.objects(retailer_id=retailer_id).order_by('-purchase_date')[:50]
            if not purchases:
                return self.get_popular_recommendations(limit)
            
            # Find similar users based on purchase patterns
            user_products = set([str(p.product_id) for p in purchases])
            
            # Get other users who bought similar products
            similar_users = []
            all_purchases = Purchase.objects.all()
            
            user_similarity = {}
            for purchase in all_purchases:
                other_retailer = purchase.retailer_id
                if other_retailer != retailer_id:
                    if other_retailer not in user_similarity:
                        other_purchases = Purchase.objects(retailer_id=other_retailer)
                        other_products = set([str(p.product_id) for p in other_purchases])
                        
                        # Calculate Jaccard similarity
                        intersection = len(user_products.intersection(other_products))
                        union = len(user_products.union(other_products))
                        similarity = intersection / union if union > 0 else 0
                        
                        user_similarity[other_retailer] = similarity
            
            # Get top similar users
            similar_users = sorted(user_similarity.items(), key=lambda x: x[1], reverse=True)[:10]
            
            # Get products bought by similar users but not by current user
            recommended_products = {}
            for similar_user_id, similarity_score in similar_users:
                similar_purchases = Purchase.objects(retailer_id=similar_user_id)
                for purchase in similar_purchases:
                    product_id = str(purchase.product_id)
                    if product_id not in user_products:
                        if product_id not in recommended_products:
                            recommended_products[product_id] = 0
                        recommended_products[product_id] += similarity_score
            
            # Sort and get top recommendations
            sorted_recommendations = sorted(recommended_products.items(), 
                                          key=lambda x: x[1], reverse=True)[:limit]
            
            recommendations = []
            for product_id, score in sorted_recommendations:
                product = Product.objects(id=product_id).first()
                if product:
                    recommendations.append({
                        'product_id': product_id,
                        'name': product.name,
                        'price': product.price,
                        'rating': product.rating,
                        'collaborative_score': float(score),
                        'reason': 'Users with similar preferences also bought this'
                    })
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Collaborative filtering failed: {e}")
            return self.get_popular_recommendations(limit)
    
    def get_location_based_recommendations(self, latitude: float, longitude: float, 
                                         radius_km: float = 10, limit: int = 5) -> List[Dict]:
        """Get recommendations based on location and local trends"""
        try:
            # Find products popular in the area
            # This is a simplified version - in production, you'd use geospatial queries
            recent_purchases = Purchase.objects(
                purchase_date__gte=datetime.now() - timedelta(days=30)
            )
            
            location_products = {}
            for purchase in recent_purchases:
                # In a real implementation, you'd calculate distance from user location
                # For now, we'll use a simplified approach
                product_id = str(purchase.product_id)
                if product_id not in location_products:
                    location_products[product_id] = 0
                location_products[product_id] += 1
            
            # Sort by popularity in area
            sorted_products = sorted(location_products.items(), 
                                   key=lambda x: x[1], reverse=True)[:limit]
            
            recommendations = []
            for product_id, popularity in sorted_products:
                product = Product.objects(id=product_id).first()
                if product:
                    recommendations.append({
                        'product_id': product_id,
                        'name': product.name,
                        'price': product.price,
                        'rating': product.rating,
                        'local_popularity': popularity,
                        'reason': f'Popular in your area ({radius_km}km radius)'
                    })
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Location-based recommendation failed: {e}")
            return []
    
    def get_trending_recommendations(self, limit: int = 5) -> List[Dict]:
        """Get trending products based on recent activity"""
        try:
            # Get products with high recent activity
            recent_date = datetime.now() - timedelta(days=7)
            recent_purchases = Purchase.objects(purchase_date__gte=recent_date)
            
            product_trends = {}
            for purchase in recent_purchases:
                product_id = str(purchase.product_id)
                if product_id not in product_trends:
                    product_trends[product_id] = {'count': 0, 'total_rating': 0, 'ratings': 0}
                
                product_trends[product_id]['count'] += 1
                if purchase.rating:
                    product_trends[product_id]['total_rating'] += purchase.rating
                    product_trends[product_id]['ratings'] += 1
            
            # Calculate trend score (purchases + average rating)
            for product_id in product_trends:
                trend_data = product_trends[product_id]
                avg_rating = (trend_data['total_rating'] / trend_data['ratings'] 
                            if trend_data['ratings'] > 0 else 0)
                trend_data['trend_score'] = trend_data['count'] * 0.7 + avg_rating * 0.3
            
            # Sort by trend score
            sorted_trends = sorted(product_trends.items(), 
                                 key=lambda x: x[1]['trend_score'], reverse=True)[:limit]
            
            recommendations = []
            for product_id, trend_data in sorted_trends:
                product = Product.objects(id=product_id).first()
                if product:
                    recommendations.append({
                        'product_id': product_id,
                        'name': product.name,
                        'price': product.price,
                        'rating': product.rating,
                        'trend_score': trend_data['trend_score'],
                        'recent_purchases': trend_data['count'],
                        'reason': 'Trending this week'
                    })
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Trending recommendation failed: {e}")
            return []
    
    def get_popular_recommendations(self, limit: int = 5) -> List[Dict]:
        """Get popular products as fallback recommendations"""
        try:
            # Get products sorted by rating and purchase count
            products = Product.objects.all().order_by('-rating', '-purchase_count')[:limit]
            
            recommendations = []
            for product in products:
                recommendations.append({
                    'product_id': str(product.id),
                    'name': product.name,
                    'price': product.price,
                    'rating': product.rating,
                    'purchase_count': product.purchase_count or 0,
                    'reason': 'Popular choice'
                })
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Popular recommendation failed: {e}")
            return []
    
    def get_personalized_recommendations(self, retailer_id: str, latitude: float = None, 
                                       longitude: float = None, limit: int = 10) -> Dict[str, Any]:
        """Get comprehensive personalized recommendations using multiple algorithms"""
        try:
            recommendations = {
                'collaborative': self.get_collaborative_recommendations(retailer_id, limit//2),
                'trending': self.get_trending_recommendations(limit//4),
                'popular': self.get_popular_recommendations(limit//4)
            }
            
            if latitude and longitude:
                recommendations['location_based'] = self.get_location_based_recommendations(
                    latitude, longitude, limit=limit//4
                )
            
            # Combine and deduplicate recommendations
            all_recommendations = []
            seen_products = set()
            
            for category, recs in recommendations.items():
                for rec in recs:
                    if rec['product_id'] not in seen_products:
                        rec['category'] = category
                        all_recommendations.append(rec)
                        seen_products.add(rec['product_id'])
            
            return {
                'recommendations': all_recommendations[:limit],
                'total_count': len(all_recommendations),
                'categories': list(recommendations.keys()),
                'generated_at': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Personalized recommendation failed: {e}")
            return {
                'recommendations': self.get_popular_recommendations(limit),
                'total_count': 0,
                'categories': ['popular'],
                'generated_at': datetime.now().isoformat(),
                'error': str(e)
            }
    
    def save_recommendation(self, retailer_id: str, recommendations: List[Dict], 
                          recommendation_type: str = 'personalized'):
        """Save recommendations to database for tracking"""
        try:
            recommendation_doc = Recommendation(
                retailer_id=retailer_id,
                recommendations=recommendations,
                recommendation_type=recommendation_type,
                generated_at=datetime.now(),
                is_active=True
            )
            recommendation_doc.save()
            logger.info(f"Saved {len(recommendations)} recommendations for retailer {retailer_id}")
            
        except Exception as e:
            logger.error(f"Failed to save recommendations: {e}")

# Global instance
ai_recommendation_service = AIRecommendationService()
