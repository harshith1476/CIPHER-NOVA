#!/usr/bin/env python3
"""
Model training script for Retailer Recommendation System
"""

import os
import sys
import argparse
from pathlib import Path

# Add project root to Python path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from backend.app import create_app
from backend.models.recommendation import recommendation_engine
from backend.utils.data_processor import data_processor

def main():
    parser = argparse.ArgumentParser(description='Train ML models for recommendation system')
    parser.add_argument('--config', default='development', help='Flask configuration')
    parser.add_argument('--clean-data', action='store_true', help='Clean data before training')
    parser.add_argument('--verbose', action='store_true', help='Verbose output')
    
    args = parser.parse_args()
    
    # Create Flask app context
    app = create_app(args.config)
    
    with app.app_context():
        print("Starting model training for Retailer Recommendation System...")
        print("-" * 60)
        
        # Clean data if requested
        if args.clean_data:
            print("Cleaning data...")
            clean_results = data_processor.clean_and_validate_data()
            if 'error' in clean_results:
                print(f"Error cleaning data: {clean_results['error']}")
                sys.exit(1)
            else:
                print(f"Data cleaning completed:")
                print(f"  - Products cleaned: {clean_results['products_cleaned']}")
                print(f"  - Purchases cleaned: {clean_results['purchases_cleaned']}")
                print(f"  - Feedback cleaned: {clean_results['feedback_cleaned']}")
                print()
        
        # Train models
        print("Training recommendation models...")
        try:
            recommendation_engine.train_models()
            print("✓ Model training completed successfully!")
        except Exception as e:
            print(f"✗ Model training failed: {e}")
            sys.exit(1)
        
        # Get performance metrics
        print("\nGetting performance metrics...")
        try:
            performance = data_processor.get_recommendation_performance()
            if performance:
                metrics = performance.get('overall_metrics', {})
                print(f"Performance Metrics:")
                print(f"  - Total recommendations: {metrics.get('total_recommendations', 0)}")
                print(f"  - Click rate: {metrics.get('click_rate', 0)}%")
                print(f"  - Purchase rate: {metrics.get('purchase_rate', 0)}%")
                print(f"  - Conversion rate: {metrics.get('conversion_rate', 0)}%")
            else:
                print("No performance data available yet")
        except Exception as e:
            print(f"Warning: Could not get performance metrics: {e}")
        
        print("-" * 60)
        print("Model training completed successfully!")

if __name__ == '__main__':
    main()
