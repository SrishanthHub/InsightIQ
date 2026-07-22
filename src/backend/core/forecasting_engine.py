import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

class ForecastingEngine:
    """
    Handles predictive modeling and time-series forecasting.
    """
    
    @staticmethod
    def get_forecast_options(df: pd.DataFrame) -> Dict[str, List[str]]:
        """
        Identify columns that can be used for forecasting.
        """
        # Find potential date columns
        date_cols = list(df.select_dtypes(include=['datetime64']).columns)
        
        # If no strict datetimes, try to find object columns with 'date' in the name
        if not date_cols:
            for col in df.select_dtypes(include=['object', 'category']).columns:
                if 'date' in col.lower() or 'time' in col.lower():
                    try:
                        # Test if the first few rows parse as dates
                        pd.to_datetime(df[col].dropna().head())
                        date_cols.append(col)
                    except:
                        pass
                        
        # Find numeric columns to forecast
        numeric_cols = list(df.select_dtypes(include=[np.number]).columns)
        # Exclude typical ID columns
        numeric_cols = [col for col in numeric_cols if 'id' not in col.lower()]
        
        return {
            'date_columns': date_cols,
            'target_columns': numeric_cols
        }

    @staticmethod
    def generate_forecast(df: pd.DataFrame, date_col: str, target_col: str, periods: int) -> Dict[str, Any]:
        """
        Trains a simple Linear Regression model to predict the next N periods.
        """
        # Ensure date_col is datetime
        df = df.copy()
        df[date_col] = pd.to_datetime(df[date_col])
        
        # Aggregate the target metric by date (e.g. Total Sales per Day)
        # For simplicity, we assume daily data, or we just group by whatever frequency is present
        ts_data = df.groupby(df[date_col].dt.date)[target_col].sum().reset_index()
        ts_data.columns = ['ds', 'y']
        ts_data['ds'] = pd.to_datetime(ts_data['ds'])
        ts_data = ts_data.sort_values('ds').set_index('ds')
        
        # Resample to daily to fill gaps, then interpolate missing values
        ts_data = ts_data.resample('D').sum().replace(0, np.nan).interpolate(method='linear').fillna(0)
        
        if len(ts_data) < 5:
            raise ValueError("Not enough historical data points to train a forecasting model. Need at least 5 periods.")
            
        # Prepare for scikit-learn
        # We will use an ordinal date as our feature for a simple linear trend
        # A real production app would use Prophet or ARIMA, but Linear Regression is lightweight and fast
        ts_data['ordinal_date'] = ts_data.index.map(pd.Timestamp.toordinal)
        
        X = ts_data[['ordinal_date']].values
        y = ts_data['y'].values
        
        model = LinearRegression()
        model.fit(X, y)
        
        # Predict historical (to show the trend line)
        historical_pred = model.predict(X)
        
        # Predict future
        last_date = ts_data.index[-1]
        future_dates = [last_date + pd.Timedelta(days=i) for i in range(1, periods + 1)]
        future_ordinals = np.array([d.toordinal() for d in future_dates]).reshape(-1, 1)
        future_pred = model.predict(future_ordinals)
        
        # Ensure no negative predictions if the original data is strictly positive
        if ts_data['y'].min() >= 0:
            future_pred = np.maximum(future_pred, 0)
            
        return {
            "historical": {
                "labels": [d.strftime('%Y-%m-%d') for d in ts_data.index],
                "actual": ts_data['y'].tolist(),
                "trend": historical_pred.tolist()
            },
            "forecast": {
                "labels": [d.strftime('%Y-%m-%d') for d in future_dates],
                "predicted": future_pred.tolist()
            }
        }
