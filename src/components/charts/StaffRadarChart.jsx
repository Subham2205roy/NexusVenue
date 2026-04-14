import { Radar, RadarChart as RChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { ZONES } from '../../utils/constants';

export default function StaffRadarChart({ zoneDensities }) {
  if (!zoneDensities) return null;

  const zonesList = Object.values(zoneDensities);
  const data = zonesList.map(zone => {
    const density = zone.occupancy || 50;
    const required = Math.round(density / 10 * 3);
    const actual = Math.round(required * (0.6 + Math.random() * 0.6));
    return {
      zone: zone.name.replace(' Stand', '').replace(' Wing', ''),
      required,
      actual,
    };
  });

  return (
    <div className="glass-card p-5" style={{ overflow: 'hidden' }}>
      <h3 className="font-display text-sm font-semibold mb-4 tracking-wide">Staff Deployment Coverage</h3>
      <div style={{ width: '100%', height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="rgba(30, 42, 69, 0.8)" />
            <PolarAngleAxis dataKey="zone" tick={{ fill: '#F1F5F9', fontSize: 12, fontWeight: 500 }} />
            <PolarRadiusAxis tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} />
            <Radar name="Required Staff" dataKey="required" stroke="#00D4FF" fill="#00D4FF" fillOpacity={0.3} strokeWidth={2.5} />
            <Radar name="Actual Staff" dataKey="actual" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.3} strokeWidth={2.5} />
            <Legend wrapperStyle={{ fontSize: '12px', color: '#94A3B8' }} />
          </RChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
