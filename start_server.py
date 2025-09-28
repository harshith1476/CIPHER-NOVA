"""
Alternative server startup script to avoid Windows socket issues
"""

import os
import sys
from waitress import serve
from backend.app import create_app

def main():
    print("=== Retailer Recommendation System ===")
    print("Starting server with Waitress (production-ready WSGI server)...")
    
    # Get configuration
    config_name = os.environ.get('FLASK_CONFIG', 'development')
    
    try:
        # Create Flask app
        print("Creating Flask application...")
        app = create_app(config_name)
        print("✅ Flask app created successfully!")
        
        # Use Waitress server (more stable on Windows)
        port = 5001
        host = '127.0.0.1'
        
        print(f"🚀 Starting server on http://{host}:{port}")
        print("📊 Access your dashboard at: http://localhost:5001")
        print("🤖 AI Chatbot and Cart features are ready!")
        print("Press Ctrl+C to stop the server\n")
        
        # Start server
        serve(app, host=host, port=port, threads=6)
        
    except ImportError:
        print("❌ Waitress not installed. Installing...")
        os.system("pip install waitress")
        print("✅ Waitress installed. Please run the script again.")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\n🔧 Trying Flask development server as fallback...")
        
        try:
            app.run(
                host='127.0.0.1',
                port=5002,
                debug=False,
                use_reloader=False,
                threaded=True
            )
        except Exception as e2:
            print(f"❌ Fallback failed: {e2}")
            print("\n💡 Solutions:")
            print("1. Close any programs using ports 5000-5002")
            print("2. Restart your computer")
            print("3. Run: netstat -ano | findstr :5000")

if __name__ == '__main__':
    main()
