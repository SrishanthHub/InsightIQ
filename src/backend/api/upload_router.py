import os
import json
import uuid
from datetime import datetime
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename

from src.backend.models.database import get_db, Dataset, DatasetMetadata
from src.backend.core.data_processor import DataProcessor

upload_router = Blueprint('upload', __name__)

ALLOWED_EXTENSIONS = {'csv', 'xls', 'xlsx'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@upload_router.route('/api/v1/datasets/upload', methods=['POST'])
def upload_dataset():
    """
    Endpoint to upload a dataset (CSV/Excel).
    Validates the file, saves it securely, processes metadata via Pandas,
    and stores records in SQLite.
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
        
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
        
    if not file or not allowed_file(file.filename):
        return jsonify({'error': 'File type not allowed. Please upload CSV or Excel files.'}), 400
        
    # Create uploads directory if it doesn't exist
    upload_folder = os.path.join(current_app.root_path, '..', '..', 'data', 'uploads')
    os.makedirs(upload_folder, exist_ok=True)
    
    # Generate a secure, unique filename
    original_filename = secure_filename(file.filename)
    unique_id = str(uuid.uuid4())
    ext = original_filename.rsplit('.', 1)[1].lower()
    secure_name = f"{unique_id}.{ext}"
    file_path = os.path.join(upload_folder, secure_name)
    
    try:
        # Save file
        file.save(file_path)
        file_size = os.path.getsize(file_path)
        
        # Process dataset with Pandas
        df = DataProcessor.load_dataset(file_path)
        metadata = DataProcessor.extract_metadata(df)
        summary_stats = DataProcessor.generate_summary_stats(df)
        
        # Save to database
        db_gen = get_db()
        db = next(db_gen)
        
        try:
            # Create Dataset record
            new_dataset = Dataset(
                filename=secure_name,
                original_filename=original_filename,
                file_path=file_path,
                file_size_bytes=file_size,
                status="processed"
            )
            db.add(new_dataset)
            db.flush() # To get the new_dataset.id
            
            # Create Metadata record
            new_metadata = DatasetMetadata(
                dataset_id=new_dataset.id,
                row_count=metadata['row_count'],
                column_count=metadata['column_count'],
                columns_json=json.dumps(metadata['columns']),
                summary_stats_json=json.dumps(summary_stats)
            )
            db.add(new_metadata)
            db.commit()
            
            # Prepare response
            response_data = {
                'message': 'File uploaded and processed successfully',
                'dataset_id': new_dataset.id,
                'filename': original_filename,
                'metadata': metadata
            }
            return jsonify(response_data), 201
            
        except Exception as db_err:
            db.rollback()
            current_app.logger.error(f"Database error: {str(db_err)}")
            return jsonify({'error': 'Failed to save dataset metadata to database'}), 500
        finally:
            db_gen.close()
            
    except Exception as e:
        current_app.logger.error(f"Processing error: {str(e)}")
        # Cleanup file if processing failed
        if os.path.exists(file_path):
            os.remove(file_path)
        return jsonify({'error': f'Failed to process file: {str(e)}'}), 500
