import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { QUEUE_LOCATIONS, getStatusColor } from '../../utils/constants';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload[0]) return null;
  const d = payload[0].payload;
  return (
    <div className="custom-tooltip">
      <p className="text-sm font-semibold text-text-primary mb-1">{d.name}</p>
      <p className="text-xs text-text-secondary">Wait: <span className="font-mono" style={{ color: getStatusColor(d.waitTime) }}>{d.waitTime} min</span></p>
      <p className="text-xs text-text-secondary">Queue: {d.queueLength} people</p>
    </div>
  );
};

export default function QueueBarChart({ queues }) {
  if (!queues) return null;

  const queuesList = Object.values(queues).slice(0, 6);
  const data = queuesList.map(q => ({
    name: q.name,
    waitTime: q.waitTime || 0,
    queueLength: q.queueLength || 0,
  }));

  return (
    <div className="glass-card p-5" style={{ overflow: 'hidden' }}>
      <h3 className="font-display text-sm font-semibold mb-4 tracking-wide">Queue Status Summary</h3>
      <div style={{ width: '100%', height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(30, 42, 69, 0.5)" horizontal={false} />
            <XAxis type="number" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={{ stroke: '#1E2A45' }} unit=" min" />
            <YAxis type="category" dataKey="name" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={{ stroke: '#1E2A45' }} width={80} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x={8} stroke="#10B981" strokeDasharray="4 4" />
            <ReferenceLine x={12} stroke="#EF4444" strokeDasharray="4 4" />
            <Bar dataKey="waitTime" radius={[0, 6, 6, 0]} barSize={18} animationDuration={1200}>
              {data.map((entry, i) => (
                <Cell key={i} fill={getStatusColor(entry.waitTime)} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
