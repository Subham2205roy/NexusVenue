import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/layout/Layout';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Heatmap from './pages/Heatmap';
import QueueMonitor from './pages/QueueMonitor';
import StaffControl from './pages/StaffControl';
import AICommand from './pages/AICommand';
import Alerts from './pages/Alerts';
import { Hexagon } from 'lucide-react';

function ProtectedRoute({ children }) {
  const { role, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F1117] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow" style={{ background: 'rgba(0, 212, 255, 0.1)', border: '1px solid rgba(0, 212, 255, 0.3)' }}>
            <Hexagon size={32} className="text-[#00D4FF]" />
          </div>
          <p className="font-display text-lg text-[#00D4FF] tracking-wider animate-pulse uppercase">NEXUSVENUE</p>
          <p className="text-xs text-white/40 mt-2">Initializing systems...</p>
        </div>
      </div>
    );
  }

  if (!role) return <Navigate to="/auth" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Primary Entry Point */}
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="/auth" element={<Auth />} />

      {/* Legacy Redirects to prevent "nothing is visible" if user has old tabs open */}
      <Route path="/login" element={<Navigate to="/auth" replace />} />
      <Route path="/register" element={<Navigate to="/auth" replace />} />

      {/* Protected Layout Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="heatmap" element={<Heatmap />} />
        <Route path="queues" element={<QueueMonitor />} />
        <Route path="staff" element={<StaffControl />} />
        <Route path="ai-command" element={<AICommand />} />
        <Route path="alerts" element={<Alerts />} />
      </Route>

      {/* Fallback for any unknown path */}
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#141B2D',
              color: '#F1F5F9',
              border: '1px solid #1E2A45',
              borderRadius: '12px',
              fontSize: '13px',
              fontFamily: 'Inter, sans-serif',
            },
          }}
        />
      </AppProvider>
    </BrowserRouter>
  );
}
