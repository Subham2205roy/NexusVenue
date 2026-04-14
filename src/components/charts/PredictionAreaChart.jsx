import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload[0]) return null;
  return (
    <div className="custom-tooltip">
      <p className="font-mono text-xs text-text-secondary mb-1">{label}</p>
      <p className="text-sm font-semibold text-accent-cyan">Predicted: {payload[0]?.value?.toLocaleString()}</p>
      {payload[1] && <p className="text-xs text-text-secondary">Upper: {payload[1]?.value?.toLocaleString()}</p>}
      {payload[2] && <p className="text-xs text-text-secondary">Lower: {payload[2]?.value?.toLocaleString()}</p>}
      <p className="text-xs text-accent-purple mt-1">Confidence: 87%</p>
    </div>
  );
};

export default function PredictionAreaChart({ data }) {
  if (!data) return null;

  return (
    <div className="glass-card p-5" style={{ overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3 className="font-display text-sm font-semibold tracking-wide">AI Crowd Prediction — Next 60 Minutes</h3>
        <span className="badge badge-purple" style={{ fontSize: '10px' }}>AI Prediction</span>
      </div>
      <div style={{ width: '100%', height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="predGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00D4FF" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#00D4FF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="confGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(30, 42, 69, 0.5)" />
            <XAxis dataKey="time" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={{ stroke: '#1E2A45' }} />
            <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={{ stroke: '#1E2A45' }} width={50} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x="+30m" stroke="#F59E0B" strokeDasharray="6 3" label={{ value: 'Halftime', fill: '#F59E0B', fontSize: 10 }} />
            <ReferenceLine x="+60m" stroke="#EF4444" strokeDasharray="6 3" label={{ value: 'Match End', fill: '#EF4444', fontSize: 10 }} />
            <Area type="monotone" dataKey="upper" stroke="none" fill="url(#confGradient)" />
            <Area type="monotone" dataKey="lower" stroke="none" fill="url(#confGradient)" />
            <Area type="monotone" dataKey="predicted" stroke="#00D4FF" strokeWidth={2} fill="url(#predGradient)" activeDot={{ r: 5, fill: '#00D4FF' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
