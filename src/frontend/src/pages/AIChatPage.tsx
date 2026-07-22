import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { explorerApi, DatasetSummary } from '../services/api/explorerApi';
import { ChatInterface } from '../components/chat/ChatInterface';
import { ArrowLeft, MessageSquare, AlertCircle } from 'lucide-react';

export const AIChatPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [datasetInfo, setDatasetInfo] = useState<DatasetSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadDatasetInfo(parseInt(id));
    }
  }, [id]);

  const loadDatasetInfo = async (datasetId: number) => {
    try {
      setLoading(true);
      const details = await explorerApi.getDatasetDetails(datasetId);
      setDatasetInfo(details);
    } catch (err: any) {
      console.error('Failed to load dataset info for chat', err);
      setError(err.response?.data?.error || 'Failed to load dataset');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !datasetInfo) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto bg-red-50 text-red-700 p-6 rounded-xl border border-red-200 flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-xl font-bold mb-2">Error Loading Dataset</h2>
            <p>{error}</p>
            <Link to="/explorer" className="mt-4 inline-block text-red-700 underline font-medium">Return to Explorer</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <Link to={`/explorer/${id}`} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dataset Details
          </Link>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-600 rounded-lg shadow-sm">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Data Analyst</h1>
                <p className="text-sm text-gray-500">Chatting with {datasetInfo.filename}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <ChatInterface datasetId={parseInt(id as string)} />

      </div>
    </div>
  );
};
