import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUploadZone } from '../components/forms/FileUploadZone';
import { datasetApi, UploadResponse } from '../services/api/datasetApi';
import { CheckCircle, FileText, BarChart3, Database } from 'lucide-react';

export const UploadDatasetPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setUploadResult(null);

    try {
      const result = await datasetApi.uploadDataset(file);
      setUploadResult(result);
    } catch (err: any) {
      console.error('Upload failed:', err);
      setError(
        err.response?.data?.error || 'An unexpected error occurred during upload. Please ensure the backend is running.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Upload Your Dataset
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Let AI analyze your business data. Upload a CSV or Excel file to get started.
          </p>
        </div>

        {/* Upload Zone */}
        {!uploadResult && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <FileUploadZone 
              onFileSelect={handleFileSelect} 
              isLoading={isLoading} 
              error={error} 
            />
          </div>
        )}

        {/* Success & Summary View */}
        {uploadResult && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-green-50 p-6 flex items-start space-x-4 border-b border-green-100">
              <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-green-900">Dataset Processed Successfully</h3>
                <p className="text-green-700 mt-1">
                  We've successfully ingested {uploadResult.filename} and extracted the following metadata.
                </p>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 p-6 rounded-xl flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Total Rows</p>
                    <p className="text-2xl font-bold text-gray-900">{uploadResult.metadata.row_count.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-xl flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Total Columns</p>
                    <p className="text-2xl font-bold text-gray-900">{uploadResult.metadata.column_count}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-xl flex items-center space-x-4">
                  <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Format</p>
                    <p className="text-2xl font-bold text-gray-900 uppercase">
                      {uploadResult.filename.split('.').pop()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Detected Columns</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Column Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detected Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pandas Dtype</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Missing Values</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {uploadResult.metadata.columns.map((col, idx) => (
                        <tr key={idx}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{col.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${col.type === 'numeric' ? 'bg-blue-100 text-blue-800' : 
                                col.type === 'categorical' ? 'bg-purple-100 text-purple-800' : 
                                col.type === 'datetime' ? 'bg-green-100 text-green-800' : 
                                'bg-gray-100 text-gray-800'}`}>
                              {col.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{col.pandas_type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {col.missing_count > 0 ? (
                              <span className="text-orange-600 font-medium">{col.missing_count}</span>
                            ) : (
                              <span className="text-gray-400">0</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-4">
                <button 
                  onClick={() => setUploadResult(null)}
                  className="px-6 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Upload Another
                </button>
                <button 
                  onClick={() => navigate(`/explorer/${uploadResult.dataset_id}/chat`)}
                  className="px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Analyze with AI
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
