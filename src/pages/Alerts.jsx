import { useApp } from '../context/AppContext';
import { AlertTriangle, X, Bell, CheckCircle, Clock, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Alerts() {
  const { data, dismissAlert } = useApp();
  const alerts = data?.alerts || [];

  const handleDismiss = (id) => {
    dismissAlert(id);
    toast.success('Alert dismissed', { style: { background: '#141B2D', color: '#F1F5F9', border: '1px solid #10B981' } });
  };

  const criticals = alerts.filter(a => a.type === 'critical');
  const warnings = alerts.filter(a => a.type === 'warning');

  const getTimeAgo = (time) => {
    const diff = Math.round((Date.now() - time) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    return `${Math.round(diff / 60)}h ago`;
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-danger/10">
            <AlertTriangle size={24} className="text-danger" />
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-danger">{criticals.length}</p>
            <p className="text-xs text-text-secondary">Critical Alerts</p>
          </div>
        </div>
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-warning/10">
            <Bell size={24} className="text-warning" />
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-warning">{warnings.length}</p>
            <p className="text-xs text-text-secondary">Warnings</p>
          </div>
        </div>
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-success/10">
            <Shield size={24} className="text-success" />
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-success">{alerts.length}</p>
            <p className="text-xs text-text-secondary">Total Active</p>
          </div>
        </div>
      </div>

      {/* Alert List */}
      <div className="glass-card p-5">
        <h3 className="font-display text-sm font-semibold mb-4 tracking-wide">Active Alerts</h3>

        {alerts.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle size={48} className="text-success mx-auto mb-4 opacity-50" />
            <p className="text-text-secondary">All clear — no active alerts</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {alerts.sort((a, b) => b.time - a.time).map((alert, i) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-4 p-4 rounded-xl transition-all"
                  style={{
                    background: 'var(--color-bg-secondary)',
                    border: `1px solid ${alert.type === 'critical' ? 'var(--color-danger)' : 'var(--color-warning)'}`,
                  }}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${alert.type === 'critical' ? 'bg-danger/10' : 'bg-warning/10'
                    }`}>
                    <AlertTriangle size={20} className={alert.type === 'critical' ? 'text-danger' : 'text-warning'} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`badge ${alert.type === 'critical' ? 'badge-red' : 'badge-amber'}`}>
                        {alert.type.toUpperCase()}
                      </span>
                      <span className="text-xs text-text-secondary">{alert.location || alert.zone || 'Venue'}</span>
                    </div>
                    <p className="text-sm text-text-primary">{alert.message}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <Clock size={12} className="text-text-secondary" />
                      <span className="text-[10px] text-text-secondary font-mono">{getTimeAgo(alert.time)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDismiss(alert.id)}
                    className="p-2 rounded-lg hover:bg-bg-primary border border-transparent hover:border-border transition-colors flex-shrink-0"
                  >
                    <X size={16} className="text-text-secondary" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
