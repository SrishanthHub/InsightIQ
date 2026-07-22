import pandas as pd
import json
import os
import logging
import numpy as np

logger = logging.getLogger(__name__)

class DataProcessor:
    """
    Handles data ingestion, profiling, and metadata extraction.
    """
    @staticmethod
    def load_dataset(file_path: str) -> pd.DataFrame:
        """
        Loads a CSV or Excel file into a Pandas DataFrame.
        """
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
            
        file_ext = os.path.splitext(file_path)[1].lower()
        
        try:
            if file_ext == '.csv':
                # Try UTF-8 first, fallback to common encodings
                try:
                    df = pd.read_csv(file_path, encoding='utf-8')
                except UnicodeDecodeError:
                    df = pd.read_csv(file_path, encoding='latin1')
            elif file_ext in ['.xls', '.xlsx']:
                df = pd.read_excel(file_path)
            else:
                raise ValueError(f"Unsupported file format: {file_ext}")
                
            return df
        except Exception as e:
            logger.error(f"Error loading dataset: {str(e)}")
            raise ValueError(f"Failed to load file: {str(e)}")

    @staticmethod
    def extract_metadata(df: pd.DataFrame) -> dict:
        """
        Extracts basic metadata from the DataFrame.
        """
        # Get column names and their inferred data types
        columns_info = []
        for col in df.columns:
            dtype = str(df[col].dtype)
            
            # Map pandas dtypes to generic types
            if 'int' in dtype or 'float' in dtype:
                generic_type = 'numeric'
            elif 'datetime' in dtype:
                generic_type = 'datetime'
            elif 'bool' in dtype:
                generic_type = 'boolean'
            else:
                # Check if it might be a date column disguised as object
                if df[col].dtype == 'object':
                    try:
                        # Attempt to parse a small sample to see if it's a date
                        sample = df[col].dropna().head(10)
                        if not sample.empty and pd.to_datetime(sample, errors='coerce').notna().all():
                            generic_type = 'datetime'
                        else:
                            # Check for low cardinality (categorical)
                            if df[col].nunique() < 20 and df[col].nunique() < len(df) * 0.1:
                                generic_type = 'categorical'
                            else:
                                generic_type = 'text'
                    except:
                        generic_type = 'text'
                else:
                    generic_type = 'text'
                    
            columns_info.append({
                'name': col,
                'pandas_type': dtype,
                'type': generic_type,
                'missing_count': int(df[col].isna().sum())
            })
            
        return {
            'row_count': len(df),
            'column_count': len(df.columns),
            'columns': columns_info
        }

    @staticmethod
    def generate_summary_stats(df: pd.DataFrame) -> dict:
        """
        Generates summary statistics for numerical columns.
        """
        # Only describe numeric columns
        numeric_df = df.select_dtypes(include=[np.number])
        if numeric_df.empty:
            return {}
            
        stats = numeric_df.describe().to_dict()
        
        # Clean up numpy types for JSON serialization
        clean_stats = {}
        for col, col_stats in stats.items():
            clean_stats[col] = {
                k: float(v) if pd.notna(v) else None 
                for k, v in col_stats.items()
            }
            
        return clean_stats

    @staticmethod
    def get_paginated_data(file_path: str, page: int = 1, page_size: int = 50) -> dict:
        """
        Reads a specific chunk (page) of the dataset.
        Useful for displaying data in a paginated frontend table without loading the whole file if possible,
        though here we'll load and slice for simplicity.
        """
        df = DataProcessor.load_dataset(file_path)
        
        total_rows = len(df)
        total_pages = (total_rows + page_size - 1) // page_size
        
        # Ensure page is within bounds
        page = max(1, min(page, total_pages)) if total_pages > 0 else 1
        
        start_idx = (page - 1) * page_size
        end_idx = min(start_idx + page_size, total_rows)
        
        # Get the slice and replace NaN with None for JSON serialization
        chunk = df.iloc[start_idx:end_idx].replace({np.nan: None})
        
        return {
            'data': chunk.to_dict(orient='records'),
            'pagination': {
                'page': page,
                'page_size': page_size,
                'total_rows': total_rows,
                'total_pages': total_pages
            }
        }
