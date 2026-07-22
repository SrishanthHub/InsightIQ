import os
import json
from flask import Blueprint, request, jsonify, current_app
from src.backend.models.database import get_db, Dataset, DatasetMetadata
from src.backend.core.wrangling_engine import WranglingEngine

wrangling_router = Blueprint('wrangling', __name__)

@wrangling_router.route('/api/v1/datasets/<int:dataset_id>/preview', methods=['GET'])
def preview_dataset(dataset_id):
    """
    Returns a preview of the dataset (first 50 rows) for the wrangling UI.
    """
    db = next(get_db())
    try:
        dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
        if not dataset:
            return jsonify({'error': 'Dataset not found'}), 404

        if not os.path.exists(dataset.file_path):
            return jsonify({'error': 'Dataset file not found on disk'}), 404
            
        preview_data = WranglingEngine.get_preview(dataset.file_path)
        return jsonify(preview_data), 200
    except Exception as e:
        current_app.logger.error(f"Error generating preview: {str(e)}")
        return jsonify({'error': 'Failed to generate preview'}), 500
    finally:
        db.close()


@wrangling_router.route('/api/v1/datasets/<int:dataset_id>/wrangle', methods=['POST'])
def wrangle_dataset(dataset_id):
    """
    Applies a series of transformations to the dataset, saves it,
    and updates the database metadata.
    """
    data = request.get_json()
    operations = data.get('operations', [])
    
    if not operations:
        return jsonify({'error': 'No operations provided'}), 400

    db = next(get_db())
    try:
        dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
        if not dataset:
            return jsonify({'error': 'Dataset not found'}), 404
            
        # Optional: check if user owns it
        if dataset.user_id is not None and dataset.user_id != request.user_id:
             return jsonify({'error': 'Unauthorized'}), 403

        if not os.path.exists(dataset.file_path):
            return jsonify({'error': 'Dataset file not found on disk'}), 404
            
        # Apply operations
        df_cleaned = WranglingEngine.apply_operations(dataset.file_path, operations)
        
        # Save and get new metadata
        metadata, summary_stats = WranglingEngine.save_and_reextract(df_cleaned, dataset.file_path)
        
        # Update database
        file_size = os.path.getsize(dataset.file_path)
        dataset.file_size_bytes = file_size
        
        db_metadata = db.query(DatasetMetadata).filter(DatasetMetadata.dataset_id == dataset_id).first()
        if db_metadata:
            db_metadata.row_count = metadata['row_count']
            db_metadata.column_count = metadata['column_count']
            db_metadata.columns_json = json.dumps(metadata['columns'])
            db_metadata.summary_stats_json = json.dumps(summary_stats)
            
        db.commit()
        
        return jsonify({
            'message': 'Dataset transformed successfully',
            'metadata': metadata
        }), 200
        
    except Exception as e:
        db.rollback()
        current_app.logger.error(f"Error wrangling dataset: {str(e)}")
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()
