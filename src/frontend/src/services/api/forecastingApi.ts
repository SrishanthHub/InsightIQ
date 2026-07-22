import axios from 'axios';

const API_BASE_URL = import.meta.env.PROD ? '/api/v1' : 'http://localhost:5000/api/v1';

export interface ForecastOptions {
  date_columns: string[];
  target_columns: string[];
}

export interface ForecastResult {
  historical: {
    labels: string[];
    actual: number[];
    trend: number[];
  };
  forecast: {
    labels: string[];
    predicted: number[];
  };
}

export const forecastingApi = {
  getOptions: async (datasetId: number): Promise<ForecastOptions> => {
    const response = await axios.get(`${API_BASE_URL}/datasets/${datasetId}/forecast/options`);
    return response.data;
  },
  
  runForecast: async (datasetId: number, dateColumn: string, targetColumn: string, periods: number): Promise<ForecastResult> => {
    const response = await axios.post(`${API_BASE_URL}/datasets/${datasetId}/forecast`, {
      date_column: dateColumn,
      target_column: targetColumn,
      periods
    });
    return response.data;
  }
};
