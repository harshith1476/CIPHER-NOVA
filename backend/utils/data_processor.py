"""
Data processing utilities for the Retailer Recommendation System
"""
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple
import logging
from backend.models.mongodb_models import Retailer, Product, Purchase

logger = logging.getLogger(__name__)

class DataProcessor:
    """Utility class for data processing and analysis"""
    
    @staticmethod
    def get_retailer_purchase_matrix(days: int = 180) -> pd.DataFrame:
        """
        Create a retailer-product purchase matrix
        
        Args:
            days: Number of days to look back for purchases
            
        Returns:
            DataFrame with retailers as rows and products as columns
        """
        try:
            # Get purchases from specified time period
            start_date = datetime.utcnow() - timedelta(days=days)
            
            purchases = db.session.query(
                Purchase.retailer_id,
                Purchase.product_id,
                Purchase.quantity,
                Purchase.total_amount
            ).filter(
                Purchase.purchase_date >= start_date
            ).all()
            
            if not purchases:
                return pd.DataFrame()
            
            # Create DataFrame
            df = pd.DataFrame(purchases, columns=[
                'retailer_id', 'product_id', 'quantity', 'total_amount'
            ])
            
            # Convert to strings for consistency
            df['retailer_id'] = df['retailer_id'].astype(str)
            df['product_id'] = df['product_id'].astype(str)
            
            # Aggregate multiple purchases of same product by same retailer
            df_agg = df.groupby(['retailer_id', 'product_id']).agg({
                'quantity': 'sum',
                'total_amount': 'sum'
            }).reset_index()
            
            # Create implicit rating (combination of quantity and amount)
            df_agg['rating'] = np.log1p(df_agg['quantity']) + np.log1p(df_agg['total_amount']) / 10
            df_agg['rating'] = np.clip(df_agg['rating'], 1, 5)
            
            # Pivot to create matrix
            matrix = df_agg.pivot_table(
                index='retailer_id',
                columns='product_id',
                values='rating',
                fill_value=0
            )
            
            return matrix
            
        except Exception as e:
            logger.error(f"Error creating purchase matrix: {e}")
            return pd.DataFrame()
    
    @staticmethod
    def get_product_features() -> pd.DataFrame:
        """
        Get product features for content-based filtering
        
        Returns:
            DataFrame with product features
        """
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
            
            # Fill missing values
            df['subcategory'] = df['subcategory'].fillna('Unknown')
            df['brand'] = df['brand'].fillna('Generic')
            df['description'] = df['description'].fillna('')
            df['popularity_score'] = df['popularity_score'].fillna(0.0)
            
            # Create price categories
            df['price_category'] = pd.cut(
                df['price'],
                bins=[0, 10, 25, 50, 100, float('inf')],
                labels=['Budget', 'Low', 'Medium', 'High', 'Premium']
            )
            
            return df
            
        except Exception as e:
            logger.error(f"Error getting product features: {e}")
            return pd.DataFrame()
    
    @staticmethod
    def calculate_retailer_similarity(retailer1_id: str, retailer2_id: str) -> float:
        """
        Calculate similarity between two retailers based on purchase history
        
        Args:
            retailer1_id: First retailer ID
            retailer2_id: Second retailer ID
            
        Returns:
            Similarity score between 0 and 1
        """
        try:
            # Get purchase history for both retailers
            purchases1 = set(db.session.query(Purchase.product_id).filter(
                Purchase.retailer_id == retailer1_id
            ).all())
            
            purchases2 = set(db.session.query(Purchase.product_id).filter(
                Purchase.retailer_id == retailer2_id
            ).all())
            
            if not purchases1 or not purchases2:
                return 0.0
            
            # Calculate Jaccard similarity
            intersection = len(purchases1.intersection(purchases2))
            union = len(purchases1.union(purchases2))
            
            return intersection / union if union > 0 else 0.0
            
        except Exception as e:
            logger.error(f"Error calculating retailer similarity: {e}")
            return 0.0
    
    @staticmethod
    def get_seasonal_trends(category: Optional[str] = None) -> Dict:
        """
        Analyze seasonal trends in purchases
        
        Args:
            category: Optional product category to filter by
            
        Returns:
            Dictionary with seasonal trend data
        """
        try:
            query = db.session.query(
                Purchase.purchase_date,
                Purchase.quantity,
                Purchase.total_amount,
                Product.category
            ).join(Product, Purchase.product_id == Product.product_id)
            
            if category:
                query = query.filter(Product.category == category)
            
            # Get last year of data
            one_year_ago = datetime.utcnow() - timedelta(days=365)
            purchases = query.filter(Purchase.purchase_date >= one_year_ago).all()
            
            if not purchases:
                return {}
            
            df = pd.DataFrame(purchases, columns=[
                'purchase_date', 'quantity', 'total_amount', 'category'
            ])
            
            # Extract month from purchase date
            df['month'] = df['purchase_date'].dt.month
            df['season'] = df['month'].map({
                12: 'Winter', 1: 'Winter', 2: 'Winter',
                3: 'Spring', 4: 'Spring', 5: 'Spring',
                6: 'Summer', 7: 'Summer', 8: 'Summer',
                9: 'Fall', 10: 'Fall', 11: 'Fall'
            })
            
            # Aggregate by season
            seasonal_data = df.groupby('season').agg({
                'quantity': 'sum',
                'total_amount': 'sum'
            }).to_dict()
            
            return seasonal_data
            
        except Exception as e:
            logger.error(f"Error analyzing seasonal trends: {e}")
            return {}
    
    @staticmethod
    def get_retailer_preferences(retailer_id: str) -> Dict:
        """
        Analyze retailer preferences based on purchase history
        
        Args:
            retailer_id: Retailer ID
            
        Returns:
            Dictionary with preference analysis
        """
        try:
            # Get purchase history
            purchases = db.session.query(
                Purchase.quantity,
                Purchase.total_amount,
                Product.category,
                Product.brand,
                Product.price
            ).join(
                Product, Purchase.product_id == Product.product_id
            ).filter(
                Purchase.retailer_id == retailer_id
            ).all()
            
            if not purchases:
                return {}
            
            df = pd.DataFrame(purchases, columns=[
                'quantity', 'total_amount', 'category', 'brand', 'price'
            ])
            
            # Category preferences
            category_prefs = df.groupby('category').agg({
                'quantity': 'sum',
                'total_amount': 'sum'
            }).sort_values('total_amount', ascending=False)
            
            # Brand preferences
            brand_prefs = df.groupby('brand').agg({
                'quantity': 'sum',
                'total_amount': 'sum'
            }).sort_values('total_amount', ascending=False)
            
            # Price preferences
            price_stats = {
                'avg_price': df['price'].mean(),
                'median_price': df['price'].median(),
                'price_range': {
                    'min': df['price'].min(),
                    'max': df['price'].max()
                }
            }
            
            return {
                'top_categories': category_prefs.head(5).to_dict(),
                'top_brands': brand_prefs.head(5).to_dict(),
                'price_preferences': price_stats
            }
            
        except Exception as e:
            logger.error(f"Error analyzing retailer preferences: {e}")
            return {}
    
    @staticmethod
    def get_recommendation_performance() -> Dict:
        """
        Analyze recommendation system performance
        
        Returns:
            Dictionary with performance metrics
        """
        try:
            # Get recommendation data from last 30 days
            thirty_days_ago = datetime.utcnow() - timedelta(days=30)
            
            from backend.models.database import Recommendation
            
            recommendations = db.session.query(
                Recommendation.recommendation_id,
                Recommendation.was_clicked,
                Recommendation.was_purchased,
                Recommendation.recommendation_type
            ).filter(
                Recommendation.recommended_date >= thirty_days_ago
            ).all()
            
            if not recommendations:
                return {}
            
            df = pd.DataFrame(recommendations, columns=[
                'recommendation_id', 'was_clicked', 'was_purchased', 'recommendation_type'
            ])
            
            # Overall metrics
            total_recs = len(df)
            total_clicks = df['was_clicked'].sum()
            total_purchases = df['was_purchased'].sum()
            
            click_rate = (total_clicks / total_recs) * 100 if total_recs > 0 else 0
            purchase_rate = (total_purchases / total_recs) * 100 if total_recs > 0 else 0
            conversion_rate = (total_purchases / total_clicks) * 100 if total_clicks > 0 else 0
            
            # Performance by recommendation type
            type_performance = df.groupby('recommendation_type').agg({
                'was_clicked': ['count', 'sum'],
                'was_purchased': 'sum'
            }).round(2)
            
            return {
                'overall_metrics': {
                    'total_recommendations': total_recs,
                    'click_rate': round(click_rate, 2),
                    'purchase_rate': round(purchase_rate, 2),
                    'conversion_rate': round(conversion_rate, 2)
                },
                'type_performance': type_performance.to_dict()
            }
            
        except Exception as e:
            logger.error(f"Error analyzing recommendation performance: {e}")
            return {}
    
    @staticmethod
    def clean_and_validate_data() -> Dict:
        """
        Clean and validate data in the database
        
        Returns:
            Dictionary with cleaning results
        """
        try:
            results = {
                'products_cleaned': 0,
                'purchases_cleaned': 0,
                'feedback_cleaned': 0,
                'errors': []
            }
            
            # Clean products
            # Remove products with invalid prices
            invalid_products = Product.query.filter(
                db.or_(Product.price <= 0, Product.price.is_(None))
            ).count()
            
            if invalid_products > 0:
                Product.query.filter(
                    db.or_(Product.price <= 0, Product.price.is_(None))
                ).update({'is_active': False})
                results['products_cleaned'] = invalid_products
            
            # Clean purchases
            # Remove purchases with invalid quantities or amounts
            invalid_purchases = Purchase.query.filter(
                db.or_(
                    Purchase.quantity <= 0,
                    Purchase.total_amount <= 0,
                    Purchase.unit_price <= 0
                )
            ).count()
            
            if invalid_purchases > 0:
                Purchase.query.filter(
                    db.or_(
                        Purchase.quantity <= 0,
                        Purchase.total_amount <= 0,
                        Purchase.unit_price <= 0
                    )
                ).delete()
                results['purchases_cleaned'] = invalid_purchases
            
            # Clean feedback
            # Remove feedback with invalid values
            invalid_feedback = Feedback.query.filter(
                db.and_(
                    Feedback.feedback_value.isnot(None),
                    db.or_(
                        Feedback.feedback_value < 0,
                        Feedback.feedback_value > 5
                    )
                )
            ).count()
            
            if invalid_feedback > 0:
                Feedback.query.filter(
                    db.and_(
                        Feedback.feedback_value.isnot(None),
                        db.or_(
                            Feedback.feedback_value < 0,
                            Feedback.feedback_value > 5
                        )
                    )
                ).delete()
                results['feedback_cleaned'] = invalid_feedback
            
            db.session.commit()
            
            return results
            
        except Exception as e:
            logger.error(f"Error cleaning data: {e}")
            db.session.rollback()
            return {'error': str(e)}

# Global data processor instance
data_processor = DataProcessor()
