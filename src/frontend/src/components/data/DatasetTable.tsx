import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginatedData } from '../../services/api/explorerApi';

interface DatasetTableProps {
  data: PaginatedData | null;
  columns: Array<{ name: string; type: string }>;
  isLoading: boolean;
  onPageChange: (newPage: number) => void;
}

export const DatasetTable: React.FC<DatasetTableProps> = ({ data, columns, isLoading, onPageChange }) => {
  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading data...</p>
        </div>
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="w-full p-8 text-center bg-gray-50 rounded-xl border border-gray-200">
        <p className="text-gray-500">No data available for this dataset.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      {/* Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col, idx) => (
                <th 
                  key={idx}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {col.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.data.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-gray-50">
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {row[col.name] !== null ? String(row[col.name]) : <span className="text-gray-400 italic">null</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{(data.pagination.page - 1) * data.pagination.page_size + 1}</span> to <span className="font-medium">{Math.min(data.pagination.page * data.pagination.page_size, data.pagination.total_rows)}</span> of <span className="font-medium">{data.pagination.total_rows.toLocaleString()}</span> results
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onPageChange(data.pagination.page - 1)}
            disabled={data.pagination.page <= 1}
            className="p-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center px-4 text-sm font-medium text-gray-700">
            Page {data.pagination.page} of {data.pagination.total_pages}
          </div>
          
          <button
            onClick={() => onPageChange(data.pagination.page + 1)}
            disabled={data.pagination.page >= data.pagination.total_pages}
            className="p-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
