"""
AI/ML Recommendation Engine for Retailer Recommendation System
"""

import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from sklearn.preprocessing import StandardScaler
from datetime import datetime, timedelta
import logging
from typing import List, Dict, Tuple, Optional
from backend.models.mongodb_models import Retailer, Product, Purchase, Feedback

logger = logging.getLogger(__name__)

class RecommendationEngine:
    """Main recommendation engine class"""
    
    def __init__(self):
        self.collaborative_model = None
        self.content_model = None
        self.scaler = StandardScaler()
        self.tfidf_vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
        self.last_training_time = None
        self.min_interactions = 5
        
    def get_recommendations(self, retailer_id: str, num_recommendations: int = 10) -> List[Dict]:
        """
        Get product recommendations for a retailer
        
        Args:
            retailer_id: UUID of the retailer
            num_recommendations: Number of recommendations to return
            
        Returns:
            List of recommended products with scores
        """
        try:
            # Get retailer
            retailer = Retailer.query.get(retailer_id)
            if not retailer:
                logger.error(f"Retailer {retailer_id} not found")
                return []
            
            # Check if models need training
            if self._should_retrain_models():
                self.train_models()
            
            # Get collaborative filtering recommendations
            collaborative_recs = self._get_collaborative_recommendations(retailer_id, num_recommendations * 2)
            
            # Get content-based recommendations
            content_recs = self._get_content_based_recommendations(retailer_id, num_recommendations * 2)
            
            # Combine recommendations using hybrid approach
            hybrid_recs = self._combine_recommendations(
                collaborative_recs, content_recs, retailer_id, num_recommendations
            )
            
            # Filter out already purchased products
            filtered_recs = self._filter_purchased_products(retailer_id, hybrid_recs)
            
            # Apply business rules
            final_recs = self._apply_business_rules(retailer_id, filtered_recs[:num_recommendations])
            
            # Store recommendations in database
            self._store_recommendations(retailer_id, final_recs)
            
            return final_recs
            
        except Exception as e:
            logger.error(f"Error generating recommendations for retailer {retailer_id}: {e}")
            return self._get_fallback_recommendations(retailer_id, num_recommendations)
    
    def train_models(self):
        """Train both collaborative and content-based models"""
        try:
            logger.info("Starting model training...")
            
            # Load data
            purchase_data = self._load_purchase_data()
            product_data = self._load_product_data()
            
            if purchase_data.empty or product_data.empty:
                logger.warning("Insufficient data for model training")
                return
            
            # Train collaborative filtering model
            self._train_collaborative_model(purchase_data)
            
            # Train content-based model
            self._train_content_model(product_data)
            
            self.last_training_time = datetime.utcnow()
            logger.info("Model training completed successfully")
            
        except Exception as e:
            logger.error(f"Error during model training: {e}")
    
    def _should_retrain_models(self) -> bool:
        """Check if models should be retrained"""
        if self.last_training_time is None:
            return True
        
        # Retrain every 24 hours
        time_since_training = datetime.utcnow() - self.last_training_time
        return time_since_training > timedelta(hours=24)
    
    def _load_purchase_data(self) -> pd.DataFrame:
        """Load purchase data for training"""
        try:
            # Get purchases from last 6 months
            six_months_ago = datetime.utcnow() - timedelta(days=180)
            
            purchases = db.session.query(
                Purchase.retailer_id,
                Purchase.product_id,
                Purchase.quantity,
                Purchase.total_amount,
                Purchase.purchase_date
            ).filter(
                Purchase.purchase_date >= six_months_ago
            ).all()
            
            if not purchases:
                return pd.DataFrame()
            
            df = pd.DataFrame(purchases, columns=[
                'retailer_id', 'product_id', 'quantity', 'total_amount', 'purchase_date'
            ])
            
            # Convert UUIDs to strings
            df['retailer_id'] = df['retailer_id'].astype(str)
            df['product_id'] = df['product_id'].astype(str)
            
            # Create implicit rating based on quantity and amount
            df['rating'] = np.log1p(df['quantity']) + np.log1p(df['total_amount']) / 10
            df['rating'] = np.clip(df['rating'], 1, 5)
            
            return df
            
        except Exception as e:
            logger.error(f"Error loading purchase data: {e}")
            return pd.DataFrame()
    
    def _load_product_data(self) -> pd.DataFrame:
        """Load product data for content-based filtering"""
        try:
            products = db.session.query(
                Product.product_id,
                Product.name,
                Product.category,
                Product.subcategory,
                Product.brand,
                Product.price,
                Product.description,
                Product.popularity_score
            ).filter(Product.is_active == True).all()
            
            if not products:
                return pd.DataFrame()
            
            df = pd.DataFrame(products, columns=[
                'product_id', 'name', 'category', 'subcategory', 'brand', 
                'price', 'description', 'popularity_score'
            ])
            
            df['product_id'] = df['product_id'].astype(str)
            
            # Create content features
            df['content'] = (
                df['name'].fillna('') + ' ' +
                df['category'].fillna('') + ' ' +
                df['subcategory'].fillna('') + ' ' +
                df['brand'].fillna('') + ' ' +
                df['description'].fillna('')
            )
            
            return df
            
        except Exception as e:
            logger.error(f"Error loading product data: {e}")
            return pd.DataFrame()
    
    def _train_collaborative_model(self, purchase_data: pd.DataFrame):
        """Train collaborative filtering model using matrix factorization"""
        try:
            if purchase_data.empty:
                return
            
            # Create user-item matrix
            user_item_matrix = purchase_data.pivot_table(
                index='retailer_id',
                columns='product_id',
                values='rating',
                fill_value=0
            )
            
            # Apply SVD for matrix factorization
            n_components = min(50, min(user_item_matrix.shape) - 1)
            if n_components > 0:
                self.collaborative_model = TruncatedSVD(n_components=n_components, random_state=42)
                self.collaborative_model.fit(user_item_matrix)
                
                # Store the user-item matrix for predictions
                self.user_item_matrix = user_item_matrix
                
                logger.info(f"Collaborative model trained with {n_components} components")
            
        except Exception as e:
            logger.error(f"Error training collaborative model: {e}")
    
    def _train_content_model(self, product_data: pd.DataFrame):
        """Train content-based model using TF-IDF"""
        try:
            if product_data.empty:
                return
            
            # Fit TF-IDF vectorizer
            content_features = self.tfidf_vectorizer.fit_transform(product_data['content'])
            
            # Calculate product similarity matrix
            self.content_similarity = cosine_similarity(content_features)
            self.product_indices = dict(zip(product_data['product_id'], range(len(product_data))))
            self.products_df = product_data
            
            logger.info("Content-based model trained successfully")
            
        except Exception as e:
            logger.error(f"Error training content model: {e}")
    
    def _get_collaborative_recommendations(self, retailer_id: str, num_recs: int) -> List[Tuple[str, float]]:
        """Get recommendations using collaborative filtering"""
        try:
            if self.collaborative_model is None or not hasattr(self, 'user_item_matrix'):
                return []
            
            if retailer_id not in self.user_item_matrix.index:
                return []
            
            # Get user vector
            user_vector = self.user_item_matrix.loc[retailer_id].values.reshape(1, -1)
            
            # Transform using SVD
            user_factors = self.collaborative_model.transform(user_vector)
            
            # Reconstruct ratings
            reconstructed = self.collaborative_model.inverse_transform(user_factors)
            
            # Get product recommendations
            product_scores = list(zip(self.user_item_matrix.columns, reconstructed[0]))
            
            # Sort by score and filter out already rated items
            user_rated_items = set(self.user_item_matrix.loc[retailer_id][
                self.user_item_matrix.loc[retailer_id] > 0
            ].index)
            
            recommendations = [
                (product_id, score) for product_id, score in product_scores
                if product_id not in user_rated_items and score > 0
            ]
            
            recommendations.sort(key=lambda x: x[1], reverse=True)
            return recommendations[:num_recs]
            
        except Exception as e:
            logger.error(f"Error in collaborative filtering: {e}")
            return []
    
    def _get_content_based_recommendations(self, retailer_id: str, num_recs: int) -> List[Tuple[str, float]]:
        """Get recommendations using content-based filtering"""
        try:
            if not hasattr(self, 'content_similarity') or not hasattr(self, 'products_df'):
                return []
            
            # Get retailer's purchase history
            retailer_purchases = Purchase.query.filter_by(retailer_id=retailer_id).all()
            
            if not retailer_purchases:
                return self._get_popular_products(num_recs)
            
            # Get purchased product IDs
            purchased_products = [str(p.product_id) for p in retailer_purchases]
            
            # Calculate content-based scores
            content_scores = {}
            
            for product_id in purchased_products:
                if product_id in self.product_indices:
                    product_idx = self.product_indices[product_id]
                    similar_products = list(enumerate(self.content_similarity[product_idx]))
                    
                    for idx, similarity in similar_products:
                        target_product_id = self.products_df.iloc[idx]['product_id']
                        
                        if target_product_id not in purchased_products:
                            if target_product_id not in content_scores:
                                content_scores[target_product_id] = 0
                            content_scores[target_product_id] += similarity
            
            # Sort and return top recommendations
            recommendations = sorted(content_scores.items(), key=lambda x: x[1], reverse=True)
            return recommendations[:num_recs]
            
        except Exception as e:
            logger.error(f"Error in content-based filtering: {e}")
            return []
    
    def _get_popular_products(self, num_recs: int) -> List[Tuple[str, float]]:
        """Get popular products as fallback"""
        try:
            popular_products = Product.query.filter(
                Product.is_active == True
            ).order_by(
                Product.popularity_score.desc()
            ).limit(num_recs).all()
            
            return [(str(p.product_id), float(p.popularity_score)) for p in popular_products]
            
        except Exception as e:
            logger.error(f"Error getting popular products: {e}")
            return []
    
    def _combine_recommendations(self, collaborative_recs: List[Tuple[str, float]], 
                               content_recs: List[Tuple[str, float]], 
                               retailer_id: str, num_recs: int) -> List[Dict]:
        """Combine collaborative and content-based recommendations"""
        try:
            # Convert to dictionaries for easier manipulation
            collab_dict = dict(collaborative_recs)
            content_dict = dict(content_recs)
            
            # Get all unique product IDs
            all_products = set(collab_dict.keys()) | set(content_dict.keys())
            
            # Calculate hybrid scores
            hybrid_scores = []
            
            for product_id in all_products:
                collab_score = collab_dict.get(product_id, 0)
                content_score = content_dict.get(product_id, 0)
                
                # Weighted combination (60% collaborative, 40% content-based)
                hybrid_score = 0.6 * collab_score + 0.4 * content_score
                
                # Get product details
                product = Product.query.get(product_id)
                if product:
                    hybrid_scores.append({
                        'product_id': product_id,
                        'product': product.to_dict(),
                        'score': hybrid_score,
                        'collaborative_score': collab_score,
                        'content_score': content_score,
                        'recommendation_type': 'hybrid'
                    })
            
            # Sort by hybrid score
            hybrid_scores.sort(key=lambda x: x['score'], reverse=True)
            
            return hybrid_scores[:num_recs]
            
        except Exception as e:
            logger.error(f"Error combining recommendations: {e}")
            return []
    
    def _filter_purchased_products(self, retailer_id: str, recommendations: List[Dict]) -> List[Dict]:
        """Filter out products already purchased by the retailer"""
        try:
            # Get recently purchased products (last 30 days)
            thirty_days_ago = datetime.utcnow() - timedelta(days=30)
            
            recent_purchases = db.session.query(Purchase.product_id).filter(
                Purchase.retailer_id == retailer_id,
                Purchase.purchase_date >= thirty_days_ago
            ).all()
            
            purchased_product_ids = {str(p.product_id) for p in recent_purchases}
            
            # Filter recommendations
            filtered = [
                rec for rec in recommendations
                if rec['product_id'] not in purchased_product_ids
            ]
            
            return filtered
            
        except Exception as e:
            logger.error(f"Error filtering purchased products: {e}")
            return recommendations
    
    def _apply_business_rules(self, retailer_id: str, recommendations: List[Dict]) -> List[Dict]:
        """Apply business rules to recommendations"""
        try:
            # Get retailer preferences
            preferences = RetailerPreference.query.filter_by(retailer_id=retailer_id).all()
            
            if not preferences:
                return recommendations
            
            # Create preference lookup
            category_preferences = {}
            brand_preferences = {}
            
            for pref in preferences:
                if pref.category:
                    category_preferences[pref.category] = float(pref.preference_score)
                if pref.brand:
                    brand_preferences[pref.brand] = float(pref.preference_score)
            
            # Adjust scores based on preferences
            for rec in recommendations:
                product = rec['product']
                
                # Category preference boost
                if product['category'] in category_preferences:
                    boost = category_preferences[product['category']] / 5.0  # Normalize to 0-1
                    rec['score'] *= (1 + boost * 0.2)  # Up to 20% boost
                
                # Brand preference boost
                if product['brand'] in brand_preferences:
                    boost = brand_preferences[product['brand']] / 5.0
                    rec['score'] *= (1 + boost * 0.15)  # Up to 15% boost
            
            # Re-sort by adjusted scores
            recommendations.sort(key=lambda x: x['score'], reverse=True)
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Error applying business rules: {e}")
            return recommendations
    
    def _store_recommendations(self, retailer_id: str, recommendations: List[Dict]):
        """Store recommendations in database for tracking"""
        try:
            from backend.models.database import Recommendation
            
            for rec in recommendations:
                recommendation = Recommendation(
                    retailer_id=retailer_id,
                    product_id=rec['product_id'],
                    recommendation_score=rec['score'],
                    recommendation_type=rec['recommendation_type'],
                    algorithm_version='v1.0',
                    context={
                        'collaborative_score': rec.get('collaborative_score', 0),
                        'content_score': rec.get('content_score', 0)
                    }
                )
                db.session.add(recommendation)
            
            db.session.commit()
            
        except Exception as e:
            logger.error(f"Error storing recommendations: {e}")
            db.session.rollback()
    
    def _get_fallback_recommendations(self, retailer_id: str, num_recs: int) -> List[Dict]:
        """Get fallback recommendations when models fail"""
        try:
            # Get popular products in retailer's preferred categories
            retailer = Retailer.query.get(retailer_id)
            
            query = Product.query.filter(Product.is_active == True)
            
            # If retailer has a store type, filter by related categories
            if retailer and retailer.store_type:
                category_mapping = {
                    'Grocery Store': 'Food & Beverages',
                    'Electronics Store': 'Electronics',
                    'Clothing Store': 'Clothing & Apparel',
                    'Home Improvement': 'Home & Garden',
                    'Health Store': 'Health & Beauty'
                }
                
                preferred_category = category_mapping.get(retailer.store_type)
                if preferred_category:
                    query = query.filter(Product.category == preferred_category)
            
            products = query.order_by(Product.popularity_score.desc()).limit(num_recs).all()
            
            recommendations = []
            for i, product in enumerate(products):
                recommendations.append({
                    'product_id': str(product.product_id),
                    'product': product.to_dict(),
                    'score': 1.0 - (i * 0.1),  # Decreasing score
                    'collaborative_score': 0,
                    'content_score': 0,
                    'recommendation_type': 'fallback'
                })
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Error getting fallback recommendations: {e}")
            return []
    
    def record_feedback(self, retailer_id: str, product_id: str, feedback_type: str, 
                       feedback_value: Optional[float] = None, recommendation_id: Optional[str] = None):
        """Record user feedback for improving recommendations"""
        try:
            feedback = Feedback(
                retailer_id=retailer_id,
                product_id=product_id,
                recommendation_id=recommendation_id,
                feedback_type=feedback_type,
                feedback_value=feedback_value,
                context={'source': 'api'}
            )
            
            db.session.add(feedback)
            db.session.commit()
            
            # Update recommendation tracking if applicable
            if recommendation_id:
                from backend.models.database import Recommendation
                recommendation = Recommendation.query.get(recommendation_id)
                if recommendation:
                    if feedback_type == 'click':
                        recommendation.was_clicked = True
                    elif feedback_type == 'purchase':
                        recommendation.was_purchased = True
                    
                    db.session.commit()
            
            logger.info(f"Recorded feedback: {feedback_type} for product {product_id} by retailer {retailer_id}")
            
        except Exception as e:
            logger.error(f"Error recording feedback: {e}")
            db.session.rollback()

# Global recommendation engine instance
recommendation_engine = RecommendationEngine()
