import os
from flask import Blueprint, jsonify, request, current_app
from src.backend.models.database import get_db, Dataset
from src.backend.core.data_processor import DataProcessor
from src.backend.core.ai_engine import AIEngine

chat_router = Blueprint('chat', __name__)

@chat_router.route('/api/v1/datasets/<int:dataset_id>/chat', methods=['POST'])
def chat_with_dataset(dataset_id):
    """
    Accepts a natural language query, passes dataset context to Gemini, and returns the AI response.
    """
    data = request.get_json()
    if not data or 'query' not in data:
        return jsonify({'error': 'Missing query in request body'}), 400
        
    query = data['query']
    
    db = next(get_db())
    try:
        ds = db.query(Dataset).filter(Dataset.id == dataset_id).first()
        if not ds:
            return jsonify({'error': 'Dataset not found'}), 404
            
        if not os.path.exists(ds.file_path):
            return jsonify({'error': 'Dataset file is missing on the server'}), 404
            
        # Load dataset
        df = DataProcessor.load_dataset(ds.file_path)
        
        # Generate insight using AI Engine
        answer = AIEngine.generate_insight(df, query)
        
        return jsonify({
            'answer': answer,
            'dataset_id': dataset_id,
            'query': query
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error processing chat for dataset {dataset_id}: {str(e)}")
        return jsonify({'error': 'Failed to process chat query'}), 500
    finally:
        db.close()
