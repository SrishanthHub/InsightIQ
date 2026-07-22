import axios from 'axios';
import { DatasetMetadata } from './datasetApi';

const API_BASE_URL = import.meta.env.PROD ? '/api/v1' : 'http://localhost:5000/api/v1';

export interface DatasetSummary {
  id: number;
  filename: string;
  size_bytes: number;
  upload_date: string;
  status: string;
  row_count: number | null;
  column_count: number | null;
}

export interface DatasetDetails extends DatasetSummary {
  metadata: DatasetMetadata & {
    summary_stats: Record<string, any>;
  } | null;
}

export interface PaginatedData {
  data: Array<Record<string, any>>;
  pagination: {
    page: number;
    page_size: number;
    total_rows: number;
    total_pages: number;
  };
}

export const explorerApi = {
  getDatasets: async (): Promise<DatasetSummary[]> => {
    const response = await axios.get(`${API_BASE_URL}/datasets`);
    return response.data;
  },
  
  getDatasetDetails: async (id: number): Promise<DatasetDetails> => {
    const response = await axios.get(`${API_BASE_URL}/datasets/${id}`);
    return response.data;
  },
  
  getDatasetData: async (id: number, page: number = 1, limit: number = 50): Promise<PaginatedData> => {
    const response = await axios.get(`${API_BASE_URL}/datasets/${id}/data`, {
      params: { page, limit }
    });
    return response.data;
  },
  
  deleteDataset: async (id: number): Promise<{ message: string }> => {
    const response = await axios.delete(`${API_BASE_URL}/datasets/${id}`);
    return response.data;
  }
};
