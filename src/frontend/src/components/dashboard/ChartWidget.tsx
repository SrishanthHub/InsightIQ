import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement,
  Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import { ChartData } from '../../services/api/dashboardApi';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement,
  Title, Tooltip, Legend, Filler
);

interface ChartWidgetProps {
  data: ChartData;
}

// Premium Power BI / Tableau palette
const COLORS = [
  '#6366f1', '#22d3ee', '#10b981', '#f59e0b',
  '#f43f5e', '#8b5cf6', '#0ea5e9', '#84cc16',
];
const COLORS_LIGHT = COLORS.map(c => c + '33');

export const ChartWidget: React.FC<ChartWidgetProps> = ({ data }) => {
  const isPie = data.type === 'pie' || data.type === 'doughnut';

  const chartJsData = {
    labels: data.labels,
    datasets: data.datasets.map((dataset, i) => ({
      ...dataset,
      backgroundColor: isPie ? COLORS : COLORS[i % COLORS.length] + 'cc',
      borderColor:     isPie ? COLORS : COLORS[i % COLORS.length],
      borderWidth: isPie ? 2 : 0,
      borderRadius: data.type === 'bar' ? 6 : 0,
      fill: data.type === 'line',
      tension: 0.45,
      pointBackgroundColor: COLORS[i % COLORS.length],
      pointRadius: data.type === 'line' ? 4 : 0,
      pointHoverRadius: 6,
    })),
  };

  const commonOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 800, easing: 'easeInOutQuart' },
    plugins: {
      legend: {
        display: isPie || data.datasets.length > 1,
        position: isPie ? 'right' as const : 'top' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 16,
          font: { size: 12, family: "'Inter', sans-serif" },
          color: '#6b7280',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15,23,42,0.9)',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (ctx: any) => {
            const v = ctx.parsed?.y ?? ctx.parsed;
            if (typeof v === 'number') {
              if (v >= 100000) return ` ₹${(v / 100000).toFixed(2)} L`;
              return ` ${new Intl.NumberFormat('en-IN').format(Math.round(v))}`;
            }
            return String(v);
          },
        },
      },
    },
    scales: isPie ? undefined : {
      x: {
        grid: { display: false },
        ticks: { color: '#9ca3af', font: { size: 11 } },
        border: { display: false },
      },
      y: {
        grid: { color: 'rgba(156,163,175,0.12)', drawBorder: false },
        ticks: {
          color: '#9ca3af',
          font: { size: 11 },
          callback: (v: any) => {
            if (v >= 10000000) return `₹${(v / 10000000).toFixed(1)}Cr`;
            if (v >= 100000)   return `₹${(v / 100000).toFixed(1)}L`;
            if (v >= 1000)     return `${(v / 1000).toFixed(0)}K`;
            return v;
          },
        },
        border: { display: false },
      },
    },
  };

  const renderChart = () => {
    switch (data.type) {
      case 'bar':   return <Bar   options={commonOptions} data={chartJsData} />;
      case 'line':  return <Line  options={commonOptions} data={chartJsData} />;
      case 'pie':   return <Pie   options={commonOptions} data={chartJsData} />;
      default:      return <Bar   options={commonOptions} data={chartJsData} />;
    }
  };

  const typeLabel = { bar: 'Bar Chart', line: 'Line Chart', pie: 'Pie Chart' }[data.type] ?? 'Chart';

  return (
    <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-800">{data.title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{typeLabel}</p>
        </div>
        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200">
          Auto-generated
        </span>
      </div>

      {/* Chart */}
      <div className="flex-grow p-5 min-h-[280px] relative">
        {renderChart()}
      </div>
    </div>
  );
};
