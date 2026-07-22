import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1';

export interface ChatResponse {
  answer: string;
  dataset_id: number;
  query: string;
}

export const chatApi = {
  sendMessage: async (datasetId: number, query: string): Promise<ChatResponse> => {
    const response = await axios.post(`${API_BASE_URL}/datasets/${datasetId}/chat`, {
      query
    });
    return response.data;
  },
};
