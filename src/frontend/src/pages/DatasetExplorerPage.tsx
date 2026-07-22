import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Database, FileSpreadsheet, Trash2, Search, ArrowRight, ExternalLink } from 'lucide-react';
import { explorerApi, DatasetSummary } from '../services/api/explorerApi';

export const DatasetExplorerPage: React.FC = () => {
  const [datasets, setDatasets] = useState<DatasetSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = async () => {
    try {
      setLoading(true);
      const data = await explorerApi.getDatasets();
      setDatasets(data);
    } catch (error) {
      console.error('Failed to load datasets', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Prevent navigating to details
    if (window.confirm('Are you sure you want to delete this dataset? This action cannot be undone.')) {
      try {
        await explorerApi.deleteDataset(id);
        setDatasets(datasets.filter(d => d.id !== id));
      } catch (error) {
        console.error('Failed to delete dataset', error);
        alert('Failed to delete dataset.');
      }
    }
  };

  const filteredDatasets = datasets.filter(d => 
    d.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Dataset Explorer</h1>
            <p className="mt-2 text-gray-500">Manage and explore your uploaded business datasets.</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search datasets..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
              />
            </div>
            
            <Link 
              to="/upload" 
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors whitespace-nowrap"
            >
              Upload New
            </Link>
          </div>
        </div>

        {/* Dataset Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredDatasets.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <Database className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No datasets found</h3>
            <p className="mt-2 text-gray-500">
              {searchTerm ? 'No datasets match your search criteria.' : 'Get started by uploading your first dataset.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDatasets.map(dataset => (
              <div 
                key={dataset.id}
                onClick={() => navigate(`/explorer/${dataset.id}`)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <FileSpreadsheet className="w-6 h-6 text-blue-600" />
                  </div>
                  <button 
                    onClick={(e) => handleDelete(e, dataset.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete Dataset"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 truncate" title={dataset.filename}>
                  {dataset.filename}
                </h3>
                
                <div className="mt-2 text-sm text-gray-500 space-y-1 flex-grow">
                  <p>Uploaded: {new Date(dataset.upload_date).toLocaleDateString()}</p>
                  <p>Size: {(dataset.size_bytes / 1024).toFixed(1)} KB</p>
                  <div className="flex items-center space-x-4 mt-3 pt-3 border-t border-gray-100">
                    <div>
                      <span className="font-semibold text-gray-700">{dataset.row_count?.toLocaleString() || 0}</span> rows
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">{dataset.column_count || 0}</span> cols
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                  View Data <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
