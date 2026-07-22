import os
import json
from flask import Blueprint, request, jsonify, current_app
from sqlalchemy.orm import Session

from src.backend.models.database import get_db, Dataset, DatasetMetadata
from src.backend.core.data_processor import DataProcessor

dataset_router = Blueprint('dataset', __name__)

@dataset_router.route('/api/v1/datasets', methods=['GET'])
def list_datasets():
    """
    List all uploaded datasets.
    """
    db = next(get_db())
    try:
        datasets = db.query(Dataset).order_by(Dataset.upload_date.desc()).all()
        result = []
        for ds in datasets:
            meta = db.query(DatasetMetadata).filter(DatasetMetadata.dataset_id == ds.id).first()
            result.append({
                'id': ds.id,
                'filename': ds.original_filename,
                'size_bytes': ds.file_size_bytes,
                'upload_date': ds.upload_date.isoformat(),
                'status': ds.status,
                'row_count': meta.row_count if meta else None,
                'column_count': meta.column_count if meta else None
            })
        return jsonify(result), 200
    except Exception as e:
        current_app.logger.error(f"Error listing datasets: {str(e)}")
        return jsonify({'error': 'Failed to fetch datasets'}), 500
    finally:
        db.close()

@dataset_router.route('/api/v1/datasets/<int:dataset_id>', methods=['GET'])
def get_dataset(dataset_id):
    """
    Get detailed metadata for a specific dataset.
    """
    db = next(get_db())
    try:
        ds = db.query(Dataset).filter(Dataset.id == dataset_id).first()
        if not ds:
            return jsonify({'error': 'Dataset not found'}), 404
            
        meta = db.query(DatasetMetadata).filter(DatasetMetadata.dataset_id == ds.id).first()
        
        return jsonify({
            'id': ds.id,
            'filename': ds.original_filename,
            'size_bytes': ds.file_size_bytes,
            'upload_date': ds.upload_date.isoformat(),
            'status': ds.status,
            'row_count': meta.row_count if meta else None,
            'column_count': meta.column_count if meta else None,
            'metadata': {
                'row_count': meta.row_count,
                'column_count': meta.column_count,
                'columns': json.loads(meta.columns_json),
                'summary_stats': json.loads(meta.summary_stats_json) if meta.summary_stats_json else {}
            } if meta else None
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error fetching dataset {dataset_id}: {str(e)}")
        return jsonify({'error': 'Failed to fetch dataset details'}), 500
    finally:
        db.close()

@dataset_router.route('/api/v1/datasets/<int:dataset_id>/data', methods=['GET'])
def get_dataset_data(dataset_id):
    """
    Get paginated raw data for a specific dataset.
    """
    page = int(request.args.get('page', 1))
    page_size = int(request.args.get('limit', 50))
    
    db = next(get_db())
    try:
        ds = db.query(Dataset).filter(Dataset.id == dataset_id).first()
        if not ds:
            return jsonify({'error': 'Dataset not found'}), 404
            
        if not os.path.exists(ds.file_path):
            return jsonify({'error': 'Dataset file is missing on the server'}), 404
            
        paginated_data = DataProcessor.get_paginated_data(ds.file_path, page, page_size)
        return jsonify(paginated_data), 200
        
    except Exception as e:
        current_app.logger.error(f"Error fetching data for dataset {dataset_id}: {str(e)}")
        return jsonify({'error': 'Failed to fetch dataset data'}), 500
    finally:
        db.close()

@dataset_router.route('/api/v1/datasets/<int:dataset_id>', methods=['DELETE'])
def delete_dataset(dataset_id):
    """
    Delete a dataset and its file.
    """
    db = next(get_db())
    try:
        ds = db.query(Dataset).filter(Dataset.id == dataset_id).first()
        if not ds:
            return jsonify({'error': 'Dataset not found'}), 404
            
        # Remove file
        if os.path.exists(ds.file_path):
            os.remove(ds.file_path)
            
        # Delete from DB (metadata is cascade deleted via relationship)
        db.delete(ds)
        db.commit()
        
        return jsonify({'message': 'Dataset deleted successfully'}), 200
    except Exception as e:
        db.rollback()
        current_app.logger.error(f"Error deleting dataset {dataset_id}: {str(e)}")
        return jsonify({'error': 'Failed to delete dataset'}), 500
    finally:
        db.close()
