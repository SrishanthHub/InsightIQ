import os
import logging
from flask import Flask, jsonify
from flask_cors import CORS

from dotenv import load_dotenv
load_dotenv()

from src.backend.models.database import init_db
from src.backend.api.upload_router import upload_router
from src.backend.api.dataset_router import dataset_router
from src.backend.api.dashboard_router import dashboard_router
from src.backend.api.chat_router import chat_router
from src.backend.api.forecasting_router import forecasting_router
from src.backend.api.auth_router import auth_router
from src.backend.api.wrangling_router import wrangling_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

def create_app():
    """
    Factory function to create and configure the Flask application.
    """
    app = Flask(__name__)
    
    # Enable CORS for the frontend
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Initialize the SQLite database
    with app.app_context():
        init_db()
        
    # Register blueprints
    app.register_blueprint(upload_router)
    app.register_blueprint(dataset_router)
    app.register_blueprint(dashboard_router)
    app.register_blueprint(chat_router)
    app.register_blueprint(forecasting_router)
    app.register_blueprint(auth_router)
    app.register_blueprint(wrangling_router)
    
    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({'status': 'healthy', 'version': '0.1.0'}), 200

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found'}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500

    return app

if __name__ == '__main__':
    app = create_app()
    # Create data directories if they don't exist
    os.makedirs(os.path.join(app.root_path, '..', '..', 'data', 'uploads'), exist_ok=True)
    
    app.run(host='0.0.0.0', port=5000, debug=True)
