import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { forecastingApi, ForecastOptions, ForecastResult } from '../services/api/forecastingApi';
import { explorerApi, DatasetSummary } from '../services/api/explorerApi';
import { ArrowLeft, TrendingUp, AlertCircle, Play } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const ForecastingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [datasetInfo, setDatasetInfo] = useState<DatasetSummary | null>(null);
  const [options, setOptions] = useState<ForecastOptions | null>(null);
  
  // Form State
  const [dateColumn, setDateColumn] = useState<string>('');
  const [targetColumn, setTargetColumn] = useState<string>('');
  const [periods, setPeriods] = useState<number>(14);
  
  // Result State
  const [result, setResult] = useState<ForecastResult | null>(null);
  
  // UI State
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [isForecasting, setIsForecasting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadInitialData(parseInt(id));
    }
  }, [id]);

  const loadInitialData = async (datasetId: number) => {
    try {
      setLoadingOptions(true);
      const [details, opts] = await Promise.all([
        explorerApi.getDatasetDetails(datasetId),
        forecastingApi.getOptions(datasetId)
      ]);
      setDatasetInfo(details);
      setOptions(opts);
      
      if (opts.date_columns.length > 0) setDateColumn(opts.date_columns[0]);
      if (opts.target_columns.length > 0) setTargetColumn(opts.target_columns[0]);
      
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load forecasting options');
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleRunForecast = async () => {
    if (!id || !dateColumn || !targetColumn) return;
    
    try {
      setIsForecasting(true);
      setError(null);
      const res = await forecastingApi.runForecast(parseInt(id), dateColumn, targetColumn, periods);
      setResult(res);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate forecast');
    } finally {
      setIsForecasting(false);
    }
  };

  const renderChart = () => {
    if (!result) return null;

    const allLabels = [...result.historical.labels, ...result.forecast.labels];
    
    // Pad actual data with nulls for the forecast period
    const actualData = [...result.historical.actual, ...Array(result.forecast.labels.length).fill(null)];
    
    // Pad forecast data with nulls for the historical period, but overlap the last historical point so the line connects
    const padding = Array(result.historical.labels.length - 1).fill(null);
    const lastActual = result.historical.actual[result.historical.actual.length - 1];
    const forecastData = [...padding, lastActual, ...result.forecast.predicted];

    const chartData = {
      labels: allLabels,
      datasets: [
        {
          label: `Historical ${targetColumn}`,
          data: actualData,
          borderColor: 'rgba(59, 130, 246, 1)', // blue-500
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.3,
          fill: true,
        },
        {
          label: `Forecasted ${targetColumn}`,
          data: forecastData,
          borderColor: 'rgba(245, 158, 11, 1)', // amber-500
          borderDash: [5, 5], // dashed line
          tension: 0.3,
          fill: false,
        }
      ],
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: `${targetColumn} Forecast over Time`,
          font: { size: 16 }
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        }
      }
    };

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-8 h-[500px]">
        <Line data={chartData} options={chartOptions} />
      </div>
    );
  };

  if (loadingOptions) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <Link to={`/explorer/${id}`} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dataset Details
          </Link>
          
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500 rounded-lg shadow-sm">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Trend Forecasting</h1>
              <p className="text-sm text-gray-500">Predict future metrics for {datasetInfo?.filename}</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {/* Configuration Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Forecast Configuration</h2>
          
          {options?.date_columns.length === 0 ? (
            <div className="text-amber-700 bg-amber-50 p-4 rounded-lg border border-amber-200">
              No date columns were detected in this dataset. Forecasting requires at least one date or time column to build a time-series model.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time/Date Column</label>
                <select 
                  value={dateColumn}
                  onChange={e => setDateColumn(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                >
                  {options?.date_columns.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Metric to Forecast</label>
                <select 
                  value={targetColumn}
                  onChange={e => setTargetColumn(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                >
                  {options?.target_columns.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Periods to Predict (Days)</label>
                <div className="flex items-center space-x-4">
                  <input 
                    type="range" 
                    min="1" 
                    max="90" 
                    value={periods}
                    onChange={e => setPeriods(parseInt(e.target.value))}
                    className="flex-1 accent-amber-500"
                  />
                  <span className="font-semibold text-gray-700 w-8">{periods}</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-8 flex justify-end border-t border-gray-100 pt-6">
            <button
              onClick={handleRunForecast}
              disabled={isForecasting || !dateColumn || !targetColumn}
              className="px-6 py-2 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 flex items-center shadow-sm transition-colors"
            >
              {isForecasting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Training Model...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run Forecast
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Chart */}
        {renderChart()}

      </div>
    </div>
  );
};
