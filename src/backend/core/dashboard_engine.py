import pandas as pd
import numpy as np
import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

class DashboardEngine:
    """
    Analyzes datasets to automatically generate KPIs and charts.
    """
    
    @staticmethod
    def calculate_kpis(df: pd.DataFrame) -> List[Dict[str, Any]]:
        """
        Identify numeric columns and generate aggregate KPIs.
        """
        kpis = []
        
        # Always include Total Rows
        kpis.append({
            "id": "total_rows",
            "title": "Total Records",
            "value": len(df),
            "type": "count",
            "format": "number"
        })
        
        # Analyze numeric columns
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        
        for col in numeric_cols:
            # Skip likely ID columns
            if 'id' in col.lower() and df[col].is_unique:
                continue
                
            total_sum = df[col].sum()
            avg_val = df[col].mean()
            
            # Determine format
            fmt = "currency" if any(keyword in col.lower() for keyword in ['price', 'revenue', 'cost', 'sales', 'profit', 'margin']) else "number"
            
            # Only add sums if they make sense (sum > 0 and column is not a tiny bounded value like a rating)
            if total_sum > 0 and df[col].max() > 10:
                kpis.append({
                    "id": f"sum_{col}",
                    "title": f"Total {col}",
                    "value": float(total_sum) if pd.notna(total_sum) else 0,
                    "type": "sum",
                    "format": fmt
                })
                
            kpis.append({
                "id": f"avg_{col}",
                "title": f"Average {col}",
                "value": float(avg_val) if pd.notna(avg_val) else 0,
                "type": "average",
                "format": fmt
            })
            
        # Limit to top 5 most interesting KPIs to avoid clutter
        # Prioritize revenue/sales/profit
        priority_keywords = ['revenue', 'sales', 'profit', 'total']
        
        def kpi_score(kpi):
            if kpi['id'] == 'total_rows': return 100
            score = 0
            for kw in priority_keywords:
                if kw in kpi['title'].lower():
                    score += 10
            if kpi['type'] == 'sum':
                score += 5
            return score
            
        kpis.sort(key=kpi_score, reverse=True)
        return kpis[:6]

    @staticmethod
    def generate_chart_data(df: pd.DataFrame) -> List[Dict[str, Any]]:
        """
        Automatically detect categorical/numeric relationships to generate charts.
        """
        charts = []
        
        categorical_cols = df.select_dtypes(include=['object', 'category']).columns
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        date_cols = df.select_dtypes(include=['datetime64']).columns
        
        if len(date_cols) == 0:
            # Attempt to find string dates
            for col in categorical_cols:
                if 'date' in col.lower() or 'time' in col.lower():
                    try:
                        df[col] = pd.to_datetime(df[col])
                        date_cols = date_cols.insert(len(date_cols), col)
                        categorical_cols = categorical_cols.drop(col)
                    except:
                        pass
        
        # 1. Distribution of top categorical columns (Pie/Bar Chart)
        for cat_col in categorical_cols:
            if df[cat_col].nunique() < 15: # Low cardinality
                counts = df[cat_col].value_counts().head(10)
                charts.append({
                    "id": f"dist_{cat_col}",
                    "title": f"Distribution by {cat_col}",
                    "type": "pie" if len(counts) <= 5 else "bar",
                    "labels": counts.index.astype(str).tolist(),
                    "datasets": [{
                        "label": "Count",
                        "data": counts.values.tolist()
                    }]
                })
                
                # If we have numeric columns, show sum of numeric by category (Bar Chart)
                for num_col in numeric_cols:
                    if 'id' not in num_col.lower():
                        agg = df.groupby(cat_col)[num_col].sum().sort_values(ascending=False).head(10)
                        if agg.sum() > 0:
                            charts.append({
                                "id": f"sum_{num_col}_by_{cat_col}",
                                "title": f"Total {num_col} by {cat_col}",
                                "type": "bar",
                                "labels": agg.index.astype(str).tolist(),
                                "datasets": [{
                                    "label": num_col,
                                    "data": agg.values.tolist()
                                }]
                            })
                            break # Only do one numeric per categorical to avoid spam
                
        # 2. Time series if dates exist (Line Chart)
        if len(date_cols) > 0 and len(numeric_cols) > 0:
            date_col = date_cols[0]
            # Group by month/day depending on span
            df_sorted = df.sort_values(date_col)
            time_span = (df_sorted[date_col].max() - df_sorted[date_col].min()).days
            
            if time_span > 60:
                period = df_sorted[date_col].dt.to_period('M').astype(str)
            else:
                period = df_sorted[date_col].dt.to_period('D').astype(str)
                
            for num_col in numeric_cols:
                if 'id' not in num_col.lower():
                    time_agg = df_sorted.groupby(period)[num_col].sum()
                    charts.append({
                        "id": f"trend_{num_col}",
                        "title": f"{num_col} Trend",
                        "type": "line",
                        "labels": time_agg.index.tolist(),
                        "datasets": [{
                            "label": num_col,
                            "data": time_agg.values.tolist()
                        }]
                    })
                    break # Just one trend line to start

        # Return top 4 charts to not overwhelm the UI
        return charts[:4]
