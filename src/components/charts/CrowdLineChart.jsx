import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="custom-tooltip">
      <p className="font-mono text-xs text-text-secondary mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-semibold" style={{ color: entry.color }}>
          {entry.name}: {entry.value?.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

export default function CrowdLineChart({ data }) {
  return (
    <div className="glass-card p-5" style={{ overflow: 'hidden' }}>
      <h3 className="font-display text-sm font-semibold mb-4 tracking-wide">Crowd Flow — Last 30 Minutes</h3>
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(30, 42, 69, 0.5)" />
            <XAxis dataKey="time" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={{ stroke: '#1E2A45' }} />
            <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={{ stroke: '#1E2A45' }} width={50} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px', color: '#94A3B8' }} />
            <Line type="monotone" dataKey="total" name="Total Attendance" stroke="#00D4FF" strokeWidth={2} dot={false} activeDot={{ r: 5, fill: '#00D4FF' }} />
            <Line type="monotone" dataKey="zoneAvg" name="Zone Average" stroke="#7C3AED" strokeWidth={2} dot={false} activeDot={{ r: 5, fill: '#7C3AED' }} />
            <Line type="monotone" dataKey="threshold" name="Alert Threshold" stroke="#EF4444" strokeWidth={1} strokeDasharray="8 4" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
