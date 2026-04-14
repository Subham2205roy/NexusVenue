import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Map, Clock, Users, Bot, Bell, Hexagon, Shield, UserCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useState, useEffect } from 'react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/heatmap', icon: Map, label: 'Crowd Heatmap' },
  { to: '/queues', icon: Clock, label: 'Queue Monitor' },
  { to: '/staff', icon: Users, label: 'Staff Control' },
  { to: '/ai-command', icon: Bot, label: 'AI Command' },
  { to: '/alerts', icon: Bell, label: 'Alerts' },
];

export default function Sidebar() {
  const { role, data } = useApp();
  const [time, setTime] = useState(new Date());
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const alertCount = data?.alerts?.length || 0;

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 flex flex-col z-50 bg-bg-secondary border-r border-border">

      {/* Logo */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0, 212, 255, 0.15)' }}>
            <Hexagon size={20} className="text-accent-cyan" />
          </div>
          <div>
            <h1 className="font-display text-sm font-bold tracking-wider text-accent-cyan">NEXUSVENUE</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`badge ${role === 'manager' ? 'badge-cyan' : 'badge-purple'}`} style={{ fontSize: '9px', padding: '1px 6px' }}>
                {role === 'manager' ? 'MANAGER' : 'STAFF'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Clock */}
      <div className="px-5 py-3 border-t border-b" style={{ borderColor: 'rgba(30, 42, 69, 0.5)' }}>
        <div className="font-mono text-2xl font-semibold text-text-primary tracking-wider">
          {time.toLocaleTimeString('en-US', { hour12: false })}
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="w-2 h-2 rounded-full bg-success"></span>
          <span className="text-xs text-text-secondary">MATCH LIVE — IPL 2026</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''} py-3 text-[14px]`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
            {item.label === 'Alerts' && alertCount > 0 && (
              <span className="ml-auto bg-danger text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {alertCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Live Event Feed */}
      <div className="px-4 py-3 border-t" style={{ borderColor: 'rgba(30, 42, 69, 0.5)' }}>
        <h3 className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary mb-2">Live Event Feed</h3>
        <div className="h-20 overflow-hidden relative">
          <div className="space-y-1.5">
            {(data?.events || []).slice(-4).map((evt, i) => (
              <div key={evt.id || i} className="flex items-start gap-1.5 opacity-80" style={{ animationDelay: `${i * 0.1}s` }}>
                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${evt.type === 'critical' ? 'bg-danger' : evt.type === 'warning' ? 'bg-warning' : evt.type === 'success' ? 'bg-success' : 'bg-accent-cyan'
                  }`}></span>
                <p className="text-xs text-text-secondary leading-tight line-clamp-2">{evt.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Powered by */}
      <div className="px-4 py-3 text-center border-t" style={{ borderColor: 'rgba(30, 42, 69, 0.5)' }}>
        <span className="text-[10px] text-text-secondary">Powered by </span>
        <span className="text-[10px] font-semibold">
          <span style={{ color: '#4285F4' }}>G</span>
          <span style={{ color: '#EA4335' }}>e</span>
          <span style={{ color: '#FBBC05' }}>m</span>
          <span style={{ color: '#4285F4' }}>i</span>
          <span style={{ color: '#34A853' }}>n</span>
          <span style={{ color: '#EA4335' }}>i</span>
          <span className="text-text-secondary"> AI</span>
        </span>
      </div>
    </aside>
  );
}
