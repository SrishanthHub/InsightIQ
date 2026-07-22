import os
from flask import Blueprint, jsonify, current_app
from src.backend.models.database import get_db, Dataset
from src.backend.core.data_processor import DataProcessor
from src.backend.core.dashboard_engine import DashboardEngine

dashboard_router = Blueprint('dashboard', __name__)

@dashboard_router.route('/api/v1/datasets/<int:dataset_id>/dashboard', methods=['GET'])
def get_dashboard_data(dataset_id):
    """
    Analyzes the dataset and returns auto-generated KPIs and chart configurations.
    """
    db = next(get_db())
    try:
        ds = db.query(Dataset).filter(Dataset.id == dataset_id).first()
        if not ds:
            return jsonify({'error': 'Dataset not found'}), 404
            
        if not os.path.exists(ds.file_path):
            return jsonify({'error': 'Dataset file is missing on the server'}), 404
            
        # Load dataset
        df = DataProcessor.load_dataset(ds.file_path)
        
        # Generate KPIs and Charts
        kpis = DashboardEngine.calculate_kpis(df)
        charts = DashboardEngine.generate_chart_data(df)
        
        return jsonify({
            'kpis': kpis,
            'charts': charts
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error generating dashboard for dataset {dataset_id}: {str(e)}")
        return jsonify({'error': 'Failed to generate dashboard data'}), 500
    finally:
        db.close()