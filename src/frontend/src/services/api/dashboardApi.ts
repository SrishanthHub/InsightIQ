import axios from 'axios';

const API_BASE_URL = import.meta.env.PROD ? '/api/v1' : 'http://localhost:5000/api/v1';

export interface KPI {
  id: string;
  title: string;
  value: number;
  type: string;
  format: 'number' | 'currency' | 'percent';
}

export interface ChartData {
  id: string;
  title: string;
  type: 'bar' | 'pie' | 'line' | 'doughnut';
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
  }>;
}

export interface DashboardResponse {
  kpis: KPI[];
  charts: ChartData[];
}

export const dashboardApi = {
  getDashboardData: async (datasetId: number): Promise<DashboardResponse> => {
    const response = await axios.get(`${API_BASE_URL}/datasets/${datasetId}/dashboard`);
    return response.data;
  },
};
