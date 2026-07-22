import axios from 'axios';

const API_BASE_URL = import.meta.env.PROD ? '/api/v1' : 'http://localhost:5000/api/v1';

export interface DatasetMetadata {
  row_count: number;
  column_count: number;
  columns: Array<{
    name: string;
    pandas_type: string;
    type: string;
    missing_count: number;
  }>;
}

export interface UploadResponse {
  message: string;
  dataset_id: number;
  filename: string;
  metadata: DatasetMetadata;
}

export const datasetApi = {
  uploadDataset: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_BASE_URL}/datasets/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};
