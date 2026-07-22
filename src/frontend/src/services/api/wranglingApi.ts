import axios from 'axios';

const API_BASE_URL = import.meta.env.PROD ? '/api/v1/datasets' : 'http://localhost:5000/api/v1/datasets';

export interface DatasetPreview {
  columns: string[];
  data: any[];
  total_rows: number;
}

export interface WranglingOperation {
  type: 'drop_columns' | 'handle_missing' | 'rename_columns';
  columns?: string[];
  strategy?: 'drop' | 'fill_zero' | 'fill_mean' | 'fill_median';
  mapping?: Record<string, string>;
}

export const wranglingApi = {
  getPreview: async (datasetId: number): Promise<DatasetPreview> => {
    const response = await axios.get(`${API_BASE_URL}/${datasetId}/preview`);
    return response.data;
  },

  applyOperations: async (datasetId: number, operations: WranglingOperation[]): Promise<any> => {
    const response = await axios.post(`${API_BASE_URL}/${datasetId}/wrangle`, { operations });
    return response.data;
  }
};
