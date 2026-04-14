import { AlertTriangle, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function AlertBanner({ alerts }) {
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();

  if (dismissed || !alerts || alerts.length === 0) return null;

  return (
    <div className="flex items-center justify-between px-5 py-2.5" style={{
      background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05))',
      borderBottom: '1px solid rgba(239, 68, 68, 0.2)',
    }}>
      <div className="flex items-center gap-3">
        <AlertTriangle size={16} className="text-danger animate-pulse-dot" />
        <span className="text-sm font-semibold text-danger">
          {alerts.length} CRITICAL ALERT{alerts.length > 1 ? 'S' : ''}
        </span>
        <span className="text-sm text-text-secondary">
          — {alerts.map(a => `${a.location || a.zone || 'Venue'} ${a.message?.substring(0, 30)}`).join(' | ')}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/alerts')}
          className="flex items-center gap-1 text-xs font-semibold text-danger hover:text-red-300 transition-colors"
        >
          View Alerts <ArrowRight size={12} />
        </button>
        <button onClick={() => setDismissed(true)} className="p-1 hover:bg-red-900/20 rounded transition-colors">
          <X size={14} className="text-danger" />
        </button>
      </div>
    </div>
  );
}
