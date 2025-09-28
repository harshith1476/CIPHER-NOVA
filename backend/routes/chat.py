"""
Chat routes for AI-powered chatbot using Gemini API
"""

import os
import json
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
import google.generativeai as genai

chat_bp = Blueprint('chat', __name__)

# Configure Gemini API
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if GEMINI_API_KEY and GEMINI_API_KEY != 'your-gemini-api-key-here':
    genai.configure(api_key=GEMINI_API_KEY)
    print(f"Gemini API configured with key: {GEMINI_API_KEY[:10]}...")
else:
    print("Gemini API key not configured or using placeholder")

@chat_bp.route('/test', methods=['GET'])
@cross_origin()
def test_gemini():
    """Test endpoint to verify Gemini API is working"""
    try:
        if not GEMINI_API_KEY or GEMINI_API_KEY == 'your-gemini-api-key-here':
            return jsonify({
                'success': False,
                'error': 'API key not configured'
            }), 500
        
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content("Say hello in a friendly way")
        
        return jsonify({
            'success': True,
            'response': response.text if response.text else 'No response',
            'api_key_prefix': GEMINI_API_KEY[:10] + '...'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@chat_bp.route('/gemini', methods=['POST'])
@cross_origin()
def chat_with_gemini():
    """
    Chat with Gemini AI assistant for retail recommendations
    """
    try:
        data = request.get_json()
        message = data.get('message', '')
        context = data.get('context', 'general')
        
        print(f"Received chat request: {message}")
        
        if not message:
            return jsonify({
                'success': False,
                'error': 'Message is required'
            }), 400
        
        if not GEMINI_API_KEY or GEMINI_API_KEY == 'your-gemini-api-key-here':
            return jsonify({
                'success': False,
                'error': 'Gemini API key not configured properly'
            }), 500
        
        print(f"Using API key: {GEMINI_API_KEY[:10]}...")
        
        # Create context-aware prompt
        system_prompt = """
        You are a helpful AI shopping assistant for RetailRecommend, an AI-powered retail recommendation platform. 
        Your role is to help customers find products, answer questions about shopping, provide recommendations, 
        and assist with their shopping experience.
        
        Key capabilities:
        - Product recommendations based on user preferences
        - Shopping advice and comparisons
        - Information about categories, brands, and features
        - Help with finding specific items
        - General shopping guidance
        
        Be friendly, helpful, and concise in your responses. Focus on providing practical shopping advice.
        If asked about specific products not in our catalog, provide general guidance about what to look for.
        """
        
        # Initialize the model
        try:
            model = genai.GenerativeModel('gemini-pro')
            print("Model initialized successfully")
        except Exception as model_error:
            print(f"Model initialization error: {str(model_error)}")
            return jsonify({
                'success': False,
                'error': f'Failed to initialize AI model: {str(model_error)}'
            }), 500
        
        # Create the full prompt
        full_prompt = f"{system_prompt}\n\nUser: {message}\n\nAssistant:"
        
        # Generate response
        try:
            response = model.generate_content(full_prompt)
            print(f"Generated response: {response}")
            
            if response and hasattr(response, 'text') and response.text:
                return jsonify({
                    'success': True,
                    'response': response.text
                })
            else:
                print("No text in response")
                return jsonify({
                    'success': False,
                    'error': 'No response text generated'
                }), 500
                
        except Exception as gen_error:
            print(f"Content generation error: {str(gen_error)}")
            # Fallback response if Gemini fails
            fallback_responses = {
                'hi': "Hello! Welcome to RetailRecommend! I'm here to help you find amazing products. What are you looking for today?",
                'hello': "Hi there! I'm your AI shopping assistant. I can help you discover products, compare options, and find the best deals. How can I assist you?",
                'help': "I'm here to help you with product recommendations, shopping advice, and finding the perfect items for your needs. Just tell me what you're looking for!",
                'default': "I'm your AI shopping assistant! I can help you find products, compare prices, and get recommendations. What would you like to shop for today?"
            }
            
            response_text = fallback_responses.get(message.lower().strip(), fallback_responses['default'])
            
            return jsonify({
                'success': True,
                'response': response_text,
                'fallback': True
            })
            
    except Exception as e:
        print(f"Gemini chat error: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Failed to process chat request: {str(e)}'
        }), 500

@chat_bp.route('/product-help', methods=['POST'])
@cross_origin()
def product_help():
    """
    Get AI assistance for specific product queries
    """
    try:
        data = request.get_json()
        product_name = data.get('product_name', '')
        query = data.get('query', '')
        
        if not product_name or not query:
            return jsonify({
                'success': False,
                'error': 'Product name and query are required'
            }), 400
        
        if not GEMINI_API_KEY:
            return jsonify({
                'success': False,
                'error': 'Gemini API key not configured'
            }), 500
        
        # Create product-specific prompt
        prompt = f"""
        As a retail expert, help a customer with their question about the product: {product_name}
        
        Customer question: {query}
        
        Provide helpful, accurate information about this product type, including:
        - Key features to consider
        - Usage recommendations
        - Comparison points with similar products
        - Any relevant shopping tips
        
        Keep the response concise and practical.
        """
        
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt)
        
        if response.text:
            return jsonify({
                'success': True,
                'response': response.text
            })
        else:
            return jsonify({
                'success': False,
                'error': 'No response generated'
            }), 500
            
    except Exception as e:
        print(f"Product help error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to process product help request'
        }), 500
