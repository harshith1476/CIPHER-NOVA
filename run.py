#!/usr/bin/env python3
"""
Main entry point for the Retailer Recommendation System
"""

import os
from backend.app import create_app

if __name__ == '__main__':
    # Get configuration from environment
    config_name = os.environ.get('FLASK_CONFIG', 'development')
    
    print("Creating Flask application...")
    
    # Create Flask application
    app = create_app(config_name)
    
    print("Flask app created successfully!")
    
    # Simple approach - use port 5001 to avoid conflicts
    port = 5001
    
    print(f"Starting server on http://localhost:{port}")
    print("Press Ctrl+C to stop the server")
    
    try:
        app.run(
            host='127.0.0.1',  # Use localhost instead of 0.0.0.0
            port=port,
            debug=True,
            use_reloader=False,  # Disable reloader to avoid socket issues
            threaded=True
        )
    except Exception as e:
        print(f"Error starting server: {e}")
        print("Trying fallback configuration...")
        try:
            app.run(
                host='127.0.0.1',
                port=8080,
                debug=False,
                use_reloader=False,
                threaded=True
            )
        except Exception as e2:
            print(f"Fallback also failed: {e2}")
            print("Please check if another service is using the ports.")
