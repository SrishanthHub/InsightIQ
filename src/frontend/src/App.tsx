import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { Database, Upload, LogOut, User as UserIcon, Zap, BarChart2 } from 'lucide-react';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Import pages
import { UploadDatasetPage } from './pages/UploadDatasetPage';
import { DatasetExplorerPage } from './pages/DatasetExplorerPage';
import { DatasetDetailsPage } from './pages/DatasetDetailsPage';
import { DashboardPage } from './pages/DashboardPage';
import { AIChatPage } from './pages/AIChatPage';
import { ForecastingPage } from './pages/ForecastingPage';
import { DataWranglingPage } from './pages/DataWranglingPage';

const NAV_ITEMS = [
  { to: '/explorer', icon: Database, label: 'Explorer', desc: 'Browse datasets' },
  { to: '/upload',   icon: Upload,   label: 'Upload',   desc: 'Import new data' },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '??';

  return (
    <div className="w-60 bg-slate-900 text-white flex flex-col min-h-screen flex-shrink-0 border-r border-slate-800">

      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-900/40">
            <BarChart2 className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-extrabold tracking-tight">
            <span className="text-indigo-400">Insight</span>
            <span className="text-white">IQ</span>
          </span>
          <span className="ml-auto text-[10px] bg-indigo-900/50 text-indigo-300 px-2 py-0.5 rounded-full font-semibold border border-indigo-700/50">
            v1.0
          </span>
        </div>
        <p className="text-[11px] text-slate-500 mt-2 ml-0.5">AI-Powered Data Analytics</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2">Navigation</p>
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ to, icon: Icon, label, desc }) => {
            const active = isActive(to);
            return (
              <li key={to}>
                <Link
                  to={to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group
                    ${active
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                  <div className={`p-1.5 rounded-lg transition-colors ${active ? 'bg-indigo-500' : 'bg-slate-700 group-hover:bg-slate-600'}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-none">{label}</p>
                    <p className={`text-[11px] mt-0.5 truncate ${active ? 'text-indigo-200' : 'text-slate-500'}`}>{desc}</p>
                  </div>
                  {active && <div className="w-1.5 h-1.5 rounded-full bg-indigo-300 flex-shrink-0" />}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Divider */}
        <div className="my-4 border-t border-slate-800" />

        {/* Quick feature links promo */}
        <div className="px-2">
          <div className="bg-gradient-to-br from-indigo-900/60 to-violet-900/40 border border-indigo-700/40 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <p className="text-xs font-bold text-indigo-300">AI Features</p>
            </div>
            <p className="text-[11px] text-slate-400">Upload a dataset to unlock AI Chat, Dashboards, Forecasting & Data Prep.</p>
          </div>
        </div>
      </nav>

      {/* User Footer */}
      {user && (
        <div className="p-3 border-t border-slate-800">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800 transition-colors mb-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate leading-none">{user.name}</p>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 text-xs text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg px-4 py-2 transition-all font-medium mt-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden min-w-0">
        {children}
      </main>
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Layout>{children}</Layout>;
};

const AppRoutes = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login"    element={user ? <Navigate to="/explorer" /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/explorer" /> : <RegisterPage />} />

      {/* Protected Routes */}
      <Route path="/"                           element={<Navigate to="/explorer" replace />} />
      <Route path="/upload"                     element={<ProtectedRoute><UploadDatasetPage /></ProtectedRoute>} />
      <Route path="/explorer"                   element={<ProtectedRoute><DatasetExplorerPage /></ProtectedRoute>} />
      <Route path="/explorer/:id"               element={<ProtectedRoute><DatasetDetailsPage /></ProtectedRoute>} />
      <Route path="/explorer/:id/wrangle"       element={<ProtectedRoute><DataWranglingPage /></ProtectedRoute>} />
      <Route path="/explorer/:id/dashboard"     element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/explorer/:id/chat"          element={<ProtectedRoute><AIChatPage /></ProtectedRoute>} />
      <Route path="/explorer/:id/forecast"      element={<ProtectedRoute><ForecastingPage /></ProtectedRoute>} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;