import pandas as pd
import numpy as np
from src.backend.core.data_processor import DataProcessor

class WranglingEngine:
    """
    Core logic for applying data wrangling operations to a dataset.
    """
    
    @staticmethod
    def get_preview(file_path: str, n_rows: int = 50) -> dict:
        """Reads the first N rows of a dataset for preview."""
        df = DataProcessor.load_dataset(file_path)
        # Handle NaN values for JSON serialization
        df = df.replace({np.nan: None})
        
        return {
            "columns": df.columns.tolist(),
            "data": df.head(n_rows).to_dict(orient='records'),
            "total_rows": len(df)
        }
        
    @staticmethod
    def apply_operations(file_path: str, operations: list) -> pd.DataFrame:
        """
        Applies a list of operations sequentially to the dataset.
        Format: [{'type': 'drop_columns', 'columns': ['A', 'B']}, ...]
        """
        df = DataProcessor.load_dataset(file_path)
        
        for op in operations:
            op_type = op.get('type')
            
            if op_type == 'drop_columns':
                cols_to_drop = op.get('columns', [])
                # Only drop columns that actually exist
                cols_to_drop = [c for c in cols_to_drop if c in df.columns]
                df = df.drop(columns=cols_to_drop)
                
            elif op_type == 'rename_columns':
                mapping = op.get('mapping', {})
                df = df.rename(columns=mapping)
                
            elif op_type == 'handle_missing':
                strategy = op.get('strategy', 'drop')
                target_cols = op.get('columns', df.columns.tolist())
                target_cols = [c for c in target_cols if c in df.columns]
                
                if not target_cols:
                    continue
                    
                if strategy == 'drop':
                    df = df.dropna(subset=target_cols)
                elif strategy == 'fill_zero':
                    df[target_cols] = df[target_cols].fillna(0)
                elif strategy == 'fill_mean':
                    for col in target_cols:
                        if pd.api.types.is_numeric_dtype(df[col]):
                            df[col] = df[col].fillna(df[col].mean())
                elif strategy == 'fill_median':
                    for col in target_cols:
                        if pd.api.types.is_numeric_dtype(df[col]):
                            df[col] = df[col].fillna(df[col].median())
                            
        return df

    @staticmethod
    def save_and_reextract(df: pd.DataFrame, file_path: str) -> tuple:
        """
        Saves the wrangled dataframe back to the original file path and
        re-extracts metadata for the database.
        """
        if file_path.endswith('.csv'):
            df.to_csv(file_path, index=False)
        else:
            df.to_excel(file_path, index=False)
            
        metadata = DataProcessor.extract_metadata(df)
        summary_stats = DataProcessor.generate_summary_stats(df)
        
        return metadata, summary_stats
