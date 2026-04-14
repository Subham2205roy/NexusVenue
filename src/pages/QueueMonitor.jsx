import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QUEUE_LOCATIONS, getStatusColor, THRESHOLDS } from '../utils/constants';
import { UserPlus, PlusCircle, Bell, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import toast from 'react-hot-toast';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="custom-tooltip">
      <p className="font-mono text-xs text-text-secondary mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-xs" style={{ color: entry.color }}>{entry.name}: {entry.value} min</p>
      ))}
    </div>
  );
};

function Sparkline({ data, color }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80, h = 24;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  return (
    <svg width={w} height={h} className="opacity-60">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

export default function QueueMonitor() {
  const { data, modifyQueue, addAlert, addEvent } = useApp();
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('high');

  if (!data) return <div className="skeleton h-96 rounded-xl"></div>;

  const queuesList = Object.values(data.queues || {});
  const filters = ['All', 'Gate', 'Food', 'Washroom', 'Parking'];

  let filtered = queuesList.filter(q => {
    if (filter === 'All') return true;
    return q.type.toLowerCase() === filter.toLowerCase();
  });

  if (sortBy === 'high') {
    filtered = [...filtered].sort((a, b) => (b.waitTime || 0) - (a.waitTime || 0));
  } else {
    filtered = [...filtered].sort((a, b) => (a.waitTime || 0) - (b.waitTime || 0));
  }

  const handleAddStaff = (q) => {
    modifyQueue(q.id, { staffDelta: 1, waitTimeDelta: -2 });
    toast.success(`Staff added to ${q.name}`, { style: { background: '#141B2D', color: '#F1F5F9', border: '1px solid #10B981' } });
    addEvent({ type: 'success', message: `Staff added to ${q.name} — wait time reduced` });
  };

  const handleOpenCounter = (q) => {
    modifyQueue(q.id, { counterDelta: 1, waitTimeDelta: -3 });
    toast.success(`Counter opened at ${q.name}`, { style: { background: '#141B2D', color: '#F1F5F9', border: '1px solid #00D4FF' } });
    addEvent({ type: 'info', message: `New counter opened at ${q.name}` });
  };

  const handleAlertQueue = (q) => {
    addAlert({ type: 'warning', zone: q.name, message: `${q.name} — Queue alert triggered manually` });
    toast.error(`Alert raised for ${q.name}`, { style: { background: '#141B2D', color: '#F1F5F9', border: '1px solid #EF4444' } });
  };

  // Build trend chart data
  const trendData = Array.from({ length: 10 }, (_, i) => {
    const point = { time: `${-45 + i * 5}m` };
    queuesList.slice(0, 6).forEach(q => {
      point[q.name] = q.history?.[i] || 5;
    });
    return point;
  });

  const lineColors = ['#00D4FF', '#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

  return (
    <div className="space-y-5">
      {/* Filter Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f
                ? 'bg-bg-secondary text-text-primary border border-border'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary border border-transparent'
                }`}
            >
              {f}
            </button>
          ))}
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="px-3 py-2 rounded-lg bg-bg-card border border-border text-text-primary text-sm focus:outline-none focus:border-accent-cyan"
        >
          <option value="high">Sort: Wait Time (High to Low)</option>
          <option value="low">Sort: Wait Time (Low to High)</option>
        </select>
      </div>

      {/* Queue Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((q, i) => {
          const color = getStatusColor(q.waitTime);
          const isCritical = q.waitTime > THRESHOLDS.queue.warning;

          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-5 transition-shadow"
              style={isCritical ? { border: '1px solid var(--color-danger)' } : {}}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-display text-sm font-semibold">{q.name}</h3>
                  <span className={`badge ${q.type === 'gate' ? 'badge-cyan' : q.type === 'parking' ? 'badge-amber' : q.type === 'washroom' ? 'badge-purple' : 'badge-green'} mt-1 uppercase`}>
                    {q.type}
                  </span>
                </div>
                {isCritical && (
                  <span className="badge badge-red flex items-center gap-1">
                    <AlertTriangle size={10} /> Critical
                  </span>
                )}
              </div>

              {/* Wait time */}
              <div className="text-center my-4">
                <span className="font-display text-4xl font-bold" style={{ color }}>{q.waitTime}</span>
                <span className="text-lg text-text-secondary ml-1">min</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-bg-primary rounded-full overflow-hidden mb-3">
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(q.waitTime / 25 * 100, 100)}%`, background: color }}></div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-center mb-3">
                <div>
                  <p className="text-[10px] text-text-secondary">Queue</p>
                  <p className="text-sm font-mono font-semibold text-text-primary">{q.queueLength}</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-secondary">Staff</p>
                  <p className="text-sm font-mono font-semibold text-text-primary">{q.staff}</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-secondary">Counters</p>
                  <p className="text-sm font-mono font-semibold text-text-primary">{q.staff}/{Number(q.staff) + 2}</p>
                </div>
              </div>

              {/* Sparkline */}
              <div className="flex justify-center mb-3">
                <Sparkline data={q.history} color={color} />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button onClick={() => handleAddStaff(q)} className="flex-1 btn-primary text-[11px] py-2 flex items-center justify-center gap-1">
                  <UserPlus size={12} /> Add Staff
                </button>
                <button onClick={() => handleOpenCounter(q)} className="flex-1 btn-ghost text-[11px] py-2 flex items-center justify-center gap-1">
                  <PlusCircle size={12} /> Open Counter
                </button>
                <button onClick={() => handleAlertQueue(q)} className="btn-danger text-[11px] py-2 px-3">
                  <Bell size={12} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Trend Chart */}
      <div className="glass-card p-5">
        <h3 className="font-display text-sm font-semibold mb-4 tracking-wide">Queue Wait Time Trends — All Locations</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="time" tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} axisLine={{ stroke: 'var(--color-border)' }} />
            <YAxis tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} axisLine={{ stroke: 'var(--color-border)' }} unit=" min" />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
            <ReferenceLine y={8} stroke="#10B981" strokeDasharray="6 3" label={{ value: 'Target', fill: '#10B981', fontSize: 10, position: 'right' }} />
            <ReferenceLine y={12} stroke="#EF4444" strokeDasharray="6 3" label={{ value: 'Critical', fill: '#EF4444', fontSize: 10, position: 'right' }} />
            {queuesList.slice(0, 6).map((q, i) => (
              <Line key={q.id} type="monotone" dataKey={q.name} stroke={lineColors[i]} strokeWidth={1.5} dot={false} activeDot={{ r: 4 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
