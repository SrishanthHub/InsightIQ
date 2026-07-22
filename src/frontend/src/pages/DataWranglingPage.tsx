import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Save, Trash2, Edit3, CheckCircle, AlertCircle,
  Layers, Wand2, RefreshCw, ChevronRight, Database
} from 'lucide-react';
import { wranglingApi, DatasetPreview, WranglingOperation } from '../services/api/wranglingApi';
import { explorerApi } from '../services/api/explorerApi';
import type { DatasetSummary } from '../services/api/explorerApi';

export const DataWranglingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [datasetInfo, setDatasetInfo] = useState<DatasetSummary | null>(null);
  const [preview, setPreview] = useState<DatasetPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [operations, setOperations] = useState<WranglingOperation[]>([]);
  const [activeTab, setActiveTab] = useState<'drop' | 'missing'>('drop');
  const [columnsToDrop, setColumnsToDrop] = useState<string[]>([]);
  const [missingStrategy, setMissingStrategy] = useState<'drop' | 'fill_zero' | 'fill_mean' | 'fill_median'>('drop');
  const [missingColumns, setMissingColumns] = useState<string[]>([]);

  useEffect(() => {
    if (id) loadData(parseInt(id));
  }, [id]);

  const loadData = async (datasetId: number) => {
    try {
      setLoading(true);
      setError(null);
      const [info, prev] = await Promise.all([
        explorerApi.getDatasetDetails(datasetId),
        wranglingApi.getPreview(datasetId),
      ]);
      setDatasetInfo(info);
      setPreview(prev);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load dataset preview. You may need to log in again.');
    } finally {
      setLoading(false);
    }
  };

  const addOperation = (op: WranglingOperation) => {
    setOperations(prev => [...prev, op]);
    setColumnsToDrop([]);
    setMissingColumns([]);
  };

  const removeOperation = (index: number) => {
    setOperations(prev => prev.filter((_, i) => i !== index));
  };

  const handleApplyChanges = async () => {
    if (!id || operations.length === 0) return;
    try {
      setSaving(true);
      await wranglingApi.applyOperations(parseInt(id), operations);
      setSuccess(true);
      setTimeout(() => navigate(`/explorer/${id}`), 1500);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to apply changes');
    } finally {
      setSaving(false);
    }
  };

  // ── Loading ──────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-200" />
          <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 animate-spin" />
          <Wand2 className="absolute inset-0 m-auto w-5 h-5 text-indigo-500" />
        </div>
        <p className="text-slate-500 text-sm font-medium animate-pulse">Loading data preview…</p>
      </div>
    );
  }

  // ── Error ─────────────────────────────
  if (error || !preview) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-red-100 p-8 text-center">
          <div className="p-4 bg-red-50 rounded-full w-fit mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Error Loading Preview</h2>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => id && loadData(parseInt(id))}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
            <Link
              to={`/explorer/${id}`}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tabClasses = (tab: string) =>
    `flex-1 py-2 text-xs font-semibold rounded-md transition-all ${activeTab === tab ? 'bg-white shadow text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`;

  const opTypeLabel: Record<string, string> = {
    drop_columns: 'Drop Columns',
    handle_missing: 'Handle Missing',
    rename_columns: 'Rename',
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            to={`/explorer/${id}`}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="h-5 w-px bg-gray-200" />
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-teal-600 rounded-md">
              <Wand2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 leading-none">Prepare Data</h1>
              <p className="text-xs text-gray-400 mt-0.5">{datasetInfo?.filename}</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full ml-2">
            <Database className="w-3 h-3" />
            {preview.total_rows.toLocaleString('en-IN')} rows · {preview.columns.length} cols
          </div>
        </div>

        <button
          onClick={handleApplyChanges}
          disabled={operations.length === 0 || saving || success}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-sm
            ${success
              ? 'bg-emerald-600 text-white'
              : 'bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-40'}`}
        >
          {success ? (
            <><CheckCircle className="w-4 h-4" /> Applied!</>
          ) : saving ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Applying…</>
          ) : (
            <><Save className="w-4 h-4" /> Save & Apply ({operations.length})</>
          )}
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">

        {/* ── Left Panel: Operations Builder ── */}
        <aside className="w-72 bg-white border-r border-gray-200 flex flex-col">

          {/* Tab switcher */}
          <div className="p-4 border-b border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Add Operation</p>
            <div className="flex bg-gray-100 p-1 rounded-lg gap-1">
              <button className={tabClasses('drop')} onClick={() => setActiveTab('drop')}>Drop Columns</button>
              <button className={tabClasses('missing')} onClick={() => setActiveTab('missing')}>Missing Values</button>
            </div>
          </div>

          {/* Tab body */}
          <div className="p-4 border-b border-gray-100 overflow-y-auto">

            {/* Drop Columns */}
            {activeTab === 'drop' && (
              <div className="space-y-3">
                <p className="text-xs text-gray-500">Select columns to permanently remove from the dataset.</p>
                <div className="max-h-52 overflow-y-auto rounded-xl border border-gray-200 divide-y divide-gray-100">
                  {preview.columns.map(col => (
                    <label key={col} className="flex items-center gap-3 px-3 py-2.5 hover:bg-indigo-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded accent-indigo-600"
                        checked={columnsToDrop.includes(col)}
                        onChange={e => {
                          if (e.target.checked) setColumnsToDrop(p => [...p, col]);
                          else setColumnsToDrop(p => p.filter(c => c !== col));
                        }}
                      />
                      <span className="text-sm text-gray-700 font-medium truncate">{col}</span>
                    </label>
                  ))}
                </div>
                <button
                  onClick={() => addOperation({ type: 'drop_columns', columns: columnsToDrop })}
                  disabled={columnsToDrop.length === 0}
                  className="w-full py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
                >
                  <Layers className="w-4 h-4" />
                  Add to Pipeline
                </button>
              </div>
            )}

            {/* Handle Missing */}
            {activeTab === 'missing' && (
              <div className="space-y-3">
                <p className="text-xs text-gray-500">Choose how to handle null/empty values.</p>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Strategy</label>
                  <select
                    className="w-full border border-gray-200 rounded-xl text-sm px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                    value={missingStrategy}
                    onChange={(e: any) => setMissingStrategy(e.target.value)}
                  >
                    <option value="drop">Drop rows with nulls</option>
                    <option value="fill_zero">Fill with Zero (0)</option>
                    <option value="fill_mean">Fill with Mean</option>
                    <option value="fill_median">Fill with Median</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Columns (leave all unchecked = all)</label>
                  <div className="max-h-40 overflow-y-auto rounded-xl border border-gray-200 divide-y divide-gray-100">
                    {preview.columns.map(col => (
                      <label key={col} className="flex items-center gap-3 px-3 py-2.5 hover:bg-indigo-50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded accent-indigo-600"
                          checked={missingColumns.includes(col)}
                          onChange={e => {
                            if (e.target.checked) setMissingColumns(p => [...p, col]);
                            else setMissingColumns(p => p.filter(c => c !== col));
                          }}
                        />
                        <span className="text-sm text-gray-700 font-medium truncate">{col}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => addOperation({
                    type: 'handle_missing',
                    strategy: missingStrategy,
                    columns: missingColumns.length > 0 ? missingColumns : preview.columns,
                  })}
                  className="w-full py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Layers className="w-4 h-4" />
                  Add to Pipeline
                </button>
              </div>
            )}
          </div>

          {/* Pipeline queue */}
          <div className="flex-1 p-4 bg-slate-50 overflow-y-auto">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              Pipeline <span className="ml-1 bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full text-[10px]">{operations.length}</span>
            </p>
            {operations.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Layers className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs">No operations yet.<br />Add one above to start.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {operations.map((op, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm group hover:border-indigo-200 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">{idx + 1}</span>
                        <div>
                          <p className="text-xs font-bold text-gray-800">{opTypeLabel[op.type] ?? op.type}</p>
                          {op.type === 'drop_columns' && (
                            <p className="text-[11px] text-gray-400 mt-0.5">{op.columns?.length} column(s) removed</p>
                          )}
                          {op.type === 'handle_missing' && (
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              {op.strategy?.replace('_', ' ')} · {op.columns?.length === preview.columns.length ? 'all cols' : `${op.columns?.length} cols`}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeOperation(idx)}
                        className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* ── Right Panel: Data Preview ── */}
        <main className="flex-1 flex flex-col overflow-hidden bg-white">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Data Preview</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                First {Math.min(50, preview.total_rows).toLocaleString('en-IN')} of {preview.total_rows.toLocaleString('en-IN')} rows
              </p>
            </div>
            <span className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-semibold rounded-full ring-1 ring-teal-200">
              {preview.columns.length} columns
            </span>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 sticky top-0 z-10 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 w-10">#</th>
                  {preview.columns.map((col, idx) => (
                    <th key={idx} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {preview.data.map((row, rowIdx) => (
                  <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white hover:bg-indigo-50/50' : 'bg-slate-50/50 hover:bg-indigo-50/50'} style={{ transition: 'background 0.1s' }}>
                    <td className="px-4 py-2.5 text-xs text-gray-300 font-mono">{rowIdx + 1}</td>
                    {preview.columns.map((col, colIdx) => (
                      <td key={colIdx} className="px-4 py-2.5 whitespace-nowrap text-gray-700">
                        {row[col] !== null && row[col] !== undefined
                          ? <span>{String(row[col])}</span>
                          : <span className="italic text-gray-300 text-xs">null</span>
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};
