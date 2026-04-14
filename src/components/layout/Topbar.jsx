import { Search, Bell, Sun } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLocation } from 'react-router-dom';
import { TOTAL_CAPACITY } from '../../utils/constants';

const pageTitles = {
  '/dashboard': 'Command Center',
  '/heatmap': 'Crowd Heatmap',
  '/queues': 'Queue Monitor',
  '/staff': 'Staff Control',
  '/ai-command': 'AI Command Center',
  '/alerts': 'Alert Management',
};

export default function Topbar() {
  const { data, role } = useApp();
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Dashboard';
  const capacity = data?.totalAttendance || 42310;
  const pct = Math.round((capacity / TOTAL_CAPACITY) * 100);
  const alertCount = data?.alerts?.length || 0;

  return (
    <header style={{
      height: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      borderBottom: '1px solid var(--color-border)',
      background: 'var(--color-bg-primary)',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      zIndex: 30,
    }}>
      {/* Page Title */}
      <h2 className="font-display" style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '0.05em', color: '#F1F5F9', whiteSpace: 'nowrap' }}>{title}</h2>

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', maxWidth: 360, flex: '1 1 auto', margin: '0 24px' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
          <input
            type="text"
            placeholder="Search zones, staff, events..."
            style={{
              width: '100%',
              paddingLeft: 38, paddingRight: 16, paddingTop: 8, paddingBottom: 8,
              borderRadius: 8, fontSize: 13,
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
              outline: 'none',
              fontFamily: 'Inter, sans-serif',
            }}
          />
        </div>
      </div>

      {/* Right Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
        {/* Weather */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-text-secondary)' }}>
          <Sun size={16} style={{ color: 'var(--color-warning)' }} />
          <span>28°C</span>
        </div>

        {/* Notification Bell */}
        <button style={{ position: 'relative', padding: 8, borderRadius: 8, background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <Bell size={18} style={{ color: 'var(--color-text-secondary)' }} />
          {alertCount > 0 && (
            <span style={{
              position: 'absolute', top: -2, right: -2,
              background: 'var(--color-danger)', color: 'white', fontSize: 9, fontWeight: 700,
              borderRadius: '50%', width: 16, height: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {alertCount}
            </span>
          )}
        </button>

        {/* Capacity */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <span className="font-mono" style={{ color: 'var(--color-accent-cyan)', fontWeight: 600 }}>{capacity.toLocaleString()}</span>
            <span style={{ color: 'var(--color-text-secondary)' }}>/ {TOTAL_CAPACITY.toLocaleString()}</span>
          </div>
          <div style={{ width: 120, height: 4, background: 'var(--color-bg-secondary)', borderRadius: 2, marginTop: 4, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 2,
              width: `${pct}%`,
              background: pct > 90 ? 'var(--color-danger)' : pct > 75 ? 'var(--color-warning)' : 'var(--color-accent-cyan)',
              transition: 'width 1s ease'
            }} />
          </div>
        </div>

        {/* Avatar */}
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700,
          background: 'var(--color-bg-secondary)',
          color: 'var(--color-accent-cyan)',
          border: '1px solid var(--color-border)',
        }}>
          {role === 'manager' ? 'VM' : 'FS'}
        </div>
      </div>
    </header>
  );
}
