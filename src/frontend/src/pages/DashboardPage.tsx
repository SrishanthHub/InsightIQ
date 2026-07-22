import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dashboardApi, DashboardResponse } from '../services/api/dashboardApi';
import { explorerApi, DatasetSummary } from '../services/api/explorerApi';
import { KPICard } from '../components/dashboard/KPICard';
import { ChartWidget } from '../components/dashboard/ChartWidget';
import {
  ArrowLeft, LayoutDashboard, Download, AlertCircle,
  RefreshCw, Database, Calendar, FileText,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [datasetInfo, setDatasetInfo] = useState<DatasetSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (id) loadDashboard(parseInt(id));
  }, [id]);

  const loadDashboard = async (datasetId: number) => {
    try {
      setLoading(true);
      setError(null);
      const [details, data] = await Promise.all([
        explorerApi.getDatasetDetails(datasetId),
        dashboardApi.getDashboardData(datasetId),
      ]);
      setDatasetInfo(details);
      setDashboardData(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!datasetInfo || !dashboardData) return;
    setIsExporting(true);
    try {
      // Dynamic import to avoid SSR issues
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      const element = document.getElementById('dashboard-export-container');
      if (!element) return;

      // Temporarily hide no-print elements
      const noPrint = document.querySelectorAll('.no-print');
      noPrint.forEach(el => (el as HTMLElement).style.visibility = 'hidden');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#f8fafc',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      noPrint.forEach(el => (el as HTMLElement).style.visibility = '');

      const pdf = new jsPDF('l', 'mm', 'a3'); // landscape A3 for better chart visibility
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      const margin = 12;

      // Header bar
      pdf.setFillColor(79, 70, 229);
      pdf.rect(0, 0, pdfW, 18, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(13);
      pdf.setTextColor(255, 255, 255);
      pdf.text('InsightIQ Analytics Dashboard', margin, 12);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.text(`Dataset: ${datasetInfo.filename}   |   Generated: ${new Date().toLocaleString('en-IN')}`, pdfW - margin, 12, { align: 'right' });

      // Main screenshot
      const imgData = canvas.toDataURL('image/png');
      const availW = pdfW - margin * 2;
      const availH = pdfH - 24;
      const ratio = canvas.width / canvas.height;
      const imgH = Math.min(availH, availW / ratio);
      const imgW = imgH * ratio;
      pdf.addImage(imgData, 'PNG', margin, 22, imgW, imgH);

      pdf.save(`insightiq_dashboard_${datasetInfo.filename.replace(/\.[^/.]+$/, '')}.pdf`);
    } catch (err) {
      console.error('Export failed', err);
      alert('PDF export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // ── Loading ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20" />
          <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 animate-spin" />
          <LayoutDashboard className="absolute inset-0 m-auto w-6 h-6 text-indigo-400" />
        </div>
        <p className="text-slate-400 text-sm font-medium animate-pulse">
          Analyzing dataset & building dashboard…
        </p>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────
  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 flex items-center justify-center">
        <div className="max-w-lg bg-slate-900 border border-red-900/40 text-red-400 p-8 rounded-2xl flex flex-col items-center gap-4">
          <div className="p-4 bg-red-900/20 rounded-full">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Dashboard Error</h2>
          <p className="text-center text-slate-400">{error}</p>
          <div className="flex gap-3 mt-2">
            <button
              onClick={() => id && loadDashboard(parseInt(id))}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors text-sm font-medium"
            >
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
            <Link to="/explorer" className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition-colors text-sm font-medium">
              Back to Explorer
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const uploadDate = datasetInfo?.upload_date
    ? new Date(datasetInfo.upload_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';

  // ── Main Dashboard ───────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Top Header Bar ── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 no-print">
        <div className="max-w-screen-2xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to={`/explorer/${id}`}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>
            <div className="h-5 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-600 rounded-md">
                <LayoutDashboard className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-gray-900 leading-none">Analytics Dashboard</h1>
                <p className="text-xs text-gray-400 mt-0.5">{datasetInfo?.filename}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Meta badges */}
            <div className="hidden md:flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                <Database className="w-3 h-3" />
                {(datasetInfo?.row_count ?? 0).toLocaleString('en-IN')} rows
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                <FileText className="w-3 h-3" />
                {datasetInfo?.column_count ?? 0} columns
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                <Calendar className="w-3 h-3" />
                {uploadDate}
              </span>
            </div>

            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-sm"
            >
              {isExporting ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Exporting…</>
              ) : (
                <><Download className="w-4 h-4" /> Export PDF</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div id="dashboard-export-container" className="max-w-screen-2xl mx-auto px-6 py-8 space-y-8">

        {/* Section: KPI Cards */}
        {dashboardData.kpis.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-4 w-1 bg-indigo-500 rounded-full" />
              <h2 className="text-sm font-bold text-gray-600 uppercase tracking-widest">Key Performance Indicators</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
              {dashboardData.kpis.map((kpi, i) => (
                <KPICard key={kpi.id} kpi={kpi} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Section: Charts */}
        {dashboardData.charts.length > 0 ? (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-4 w-1 bg-emerald-500 rounded-full" />
              <h2 className="text-sm font-bold text-gray-600 uppercase tracking-widest">Visual Analytics</h2>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {dashboardData.charts.map(chart => (
                <ChartWidget key={chart.id} data={chart} />
              ))}
            </div>
          </section>
        ) : (
          <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-16 text-center">
            <LayoutDashboard className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No chart-worthy relationships found.</p>
            <p className="text-gray-400 text-sm mt-1">Try uploading a dataset with categorical and numeric columns.</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            Generated by <span className="font-semibold text-indigo-500">InsightIQ</span> · {new Date().toLocaleString('en-IN')}
          </p>
        </div>

      </div>
    </div>
  );
};
