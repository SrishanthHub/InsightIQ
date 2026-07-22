import os
from flask import Blueprint, jsonify, request, current_app
from src.backend.models.database import get_db, Dataset
from src.backend.core.data_processor import DataProcessor
from src.backend.core.forecasting_engine import ForecastingEngine

forecasting_router = Blueprint('forecasting', __name__)

@forecasting_router.route('/api/v1/datasets/<int:dataset_id>/forecast/options', methods=['GET'])
def get_forecast_options(dataset_id):
    """
    Returns the valid date columns and numeric columns that can be forecasted.
    """
    db = next(get_db())
    try:
        ds = db.query(Dataset).filter(Dataset.id == dataset_id).first()
        if not ds or not os.path.exists(ds.file_path):
            return jsonify({'error': 'Dataset not found'}), 404
            
        df = DataProcessor.load_dataset(ds.file_path)
        options = ForecastingEngine.get_forecast_options(df)
        
        return jsonify(options), 200
    except Exception as e:
        current_app.logger.error(f"Error getting forecast options: {str(e)}")
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()

@forecasting_router.route('/api/v1/datasets/<int:dataset_id>/forecast', methods=['POST'])
def run_forecast(dataset_id):
    """
    Runs the ML model to predict future values.
    Expects JSON: { "date_column": "Date", "target_column": "Sales", "periods": 14 }
    """
    data = request.get_json()
    if not data or 'date_column' not in data or 'target_column' not in data:
        return jsonify({'error': 'Missing date_column or target_column'}), 400
        
    date_col = data['date_column']
    target_col = data['target_column']
    periods = int(data.get('periods', 14)) # Default to 14 periods
    
    db = next(get_db())
    try:
        ds = db.query(Dataset).filter(Dataset.id == dataset_id).first()
        if not ds or not os.path.exists(ds.file_path):
            return jsonify({'error': 'Dataset not found'}), 404
            
        df = DataProcessor.load_dataset(ds.file_path)
        
        if date_col not in df.columns or target_col not in df.columns:
            return jsonify({'error': 'Invalid columns selected'}), 400
            
        forecast_result = ForecastingEngine.generate_forecast(df, date_col, target_col, periods)
        
        return jsonify(forecast_result), 200
        
    except ValueError as ve:
        # e.g., not enough data points
        return jsonify({'error': str(ve)}), 400
    except Exception as e:
        current_app.logger.error(f"Error generating forecast: {str(e)}")
        return jsonify({'error': 'Failed to generate forecast due to an internal error.'}), 500
    finally:
        db.close()
