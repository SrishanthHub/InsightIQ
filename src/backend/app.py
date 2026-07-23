import os
import logging
from flask import Flask, jsonify, send_from_directory
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

# Compute the absolute path to the dist folder (project_root/dist)
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
DIST_DIR = os.path.join(PROJECT_ROOT, 'dist')

def create_app():
    """
    Factory function to create and configure the Flask application.
    """
    # Disable Flask's built-in static file handler to prevent conflicts with catch-all route
    app = Flask(__name__, static_folder=None)
    
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

    # Debug endpoint - shows if the dist folder exists and what's inside
    @app.route('/debug-static', methods=['GET'])
    def debug_static():
        exists = os.path.isdir(DIST_DIR)
        files = os.listdir(DIST_DIR) if exists else []
        return jsonify({
            'dist_dir': DIST_DIR,
            'exists': exists,
            'files': files,
            'cwd': os.getcwd(),
        }), 200

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500

    # Catch-all route: serve React app for non-API requests
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_react_app(path):
        # If the file exists in dist, serve it (JS, CSS, images, etc.)
        if path and os.path.isfile(os.path.join(DIST_DIR, path)):
            return send_from_directory(DIST_DIR, path)
        # Otherwise serve index.html and let React Router handle it
        index_path = os.path.join(DIST_DIR, 'index.html')
        if os.path.isfile(index_path):
            return send_from_directory(DIST_DIR, 'index.html')
        return jsonify({'error': 'Frontend not built. dist/index.html not found.', 'dist_dir': DIST_DIR}), 404

    return app

# Initialize app globally for Gunicorn
app = create_app()

if __name__ == '__main__':
    # Create data directories if they don't exist
    os.makedirs(os.path.join(PROJECT_ROOT, 'data', 'uploads'), exist_ok=True)
    
    app.run(host='0.0.0.0', port=5000, debug=True)

