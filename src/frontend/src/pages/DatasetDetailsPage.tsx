import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { explorerApi, DatasetDetails, PaginatedData } from '../services/api/explorerApi';
import { DatasetTable } from '../components/data/DatasetTable';
import { Database, FileText, ArrowLeft, BarChart3, TrendingUp, Edit3 } from 'lucide-react';

export const DatasetDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [dataset, setDataset] = useState<DatasetDetails | null>(null);
  const [data, setData] = useState<PaginatedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (id) {
      loadDatasetDetails(parseInt(id));
    }
  }, [id]);

  useEffect(() => {
    if (id && dataset) {
      loadPaginatedData(parseInt(id), page);
    }
  }, [id, dataset, page]);

  const loadDatasetDetails = async (datasetId: number) => {
    try {
      setLoading(true);
      const details = await explorerApi.getDatasetDetails(datasetId);
      setDataset(details);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load dataset details');
    } finally {
      setLoading(false);
    }
  };

  const loadPaginatedData = async (datasetId: number, targetPage: number) => {
    try {
      setDataLoading(true);
      const result = await explorerApi.getDatasetData(datasetId, targetPage, 50);
      setData(result);
    } catch (err: any) {
      console.error('Failed to load data page', err);
    } finally {
      setDataLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !dataset) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto bg-red-50 text-red-700 p-6 rounded-xl border border-red-200">
          <h2 className="text-xl font-bold mb-2">Error Loading Dataset</h2>
          <p>{error}</p>
          <Link to="/explorer" className="mt-4 inline-block text-red-700 underline font-medium">Back to Explorer</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header navigation */}
        <div>
          <Link to="/explorer" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Datasets
          </Link>
        </div>
        
        {/* Dataset Summary Cards */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{dataset.filename}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${dataset.status === 'processed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {dataset.status}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl flex items-center space-x-3 border border-gray-100">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Database className="w-5 h-5" /></div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Total Rows</p>
                <p className="text-lg font-bold text-gray-900">{dataset.row_count?.toLocaleString() || '-'}</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl flex items-center space-x-3 border border-gray-100">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><BarChart3 className="w-5 h-5" /></div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Columns</p>
                <p className="text-lg font-bold text-gray-900">{dataset.column_count || '-'}</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl flex items-center space-x-3 border border-gray-100">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><FileText className="w-5 h-5" /></div>
              <div>
                <p className="text-xs text-gray-500 font-medium">File Size</p>
                <p className="text-lg font-bold text-gray-900">{(dataset.size_bytes / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-center border border-gray-100 space-x-1">
              <Link to={`/explorer/${dataset.id}/wrangle`} className="flex-1 h-full flex flex-col items-center justify-center text-teal-600 font-semibold hover:bg-teal-50 rounded-lg transition-colors p-2 text-center">
                <Edit3 className="w-5 h-5 mb-1 mx-auto" />
                <span className="text-[10px]">Prepare</span>
              </Link>
              <Link to={`/explorer/${dataset.id}/dashboard`} className="flex-1 h-full flex flex-col items-center justify-center text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition-colors p-2 text-center">
                <BarChart3 className="w-5 h-5 mb-1 mx-auto" />
                <span className="text-[10px]">Dashboard</span>
              </Link>
              <Link to={`/explorer/${dataset.id}/chat`} className="flex-1 h-full flex flex-col items-center justify-center text-indigo-600 font-semibold hover:bg-indigo-50 rounded-lg transition-colors p-2 text-center">
                <FileText className="w-5 h-5 mb-1 mx-auto" />
                <span className="text-[10px]">AI Chat</span>
              </Link>
              <Link to={`/explorer/${dataset.id}/forecast`} className="flex-1 h-full flex flex-col items-center justify-center text-amber-600 font-semibold hover:bg-amber-50 rounded-lg transition-colors p-2 text-center">
                <TrendingUp className="w-5 h-5 mb-1 mx-auto" />
                <span className="text-[10px]">Forecast</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Data Preview</h2>
          </div>
          
          <DatasetTable 
            data={data} 
            columns={dataset.metadata?.columns || []} 
            isLoading={dataLoading} 
            onPageChange={setPage} 
          />
        </div>

      </div>
    </div>
  );
};
