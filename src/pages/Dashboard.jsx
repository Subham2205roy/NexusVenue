import { Users, Clock, AlertTriangle, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import MetricCard from '../components/ui/MetricCard';
import CrowdLineChart from '../components/charts/CrowdLineChart';
import ZoneDonut from '../components/charts/ZoneDonut';
import QueueBarChart from '../components/charts/QueueBarChart';
import PredictionAreaChart from '../components/charts/PredictionAreaChart';
import { ZONES, getStatusColor } from '../utils/constants';
import { motion } from 'framer-motion';

function StaffDeploymentGrid({ zoneDensities }) {
  if (!zoneDensities) return null;
  const zones = Object.values(zoneDensities);
  const grid = [zones.slice(0, 3), zones.slice(3, 6)];

  return (
    <div className="glass-card p-5" style={{ minHeight: 0 }}>
      <h3 className="font-display text-sm font-semibold mb-4 tracking-wide">Staff Deployment Map</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {grid.map((row, ri) => (
          <div key={ri} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            {row.map(zone => {
              const d = zoneDensities[zone.id];
              const staffCount = Math.round((d?.occupancy || 50) / 10 * 1.5);
              const status = d?.occupancy > 85 ? 'critical' : d?.occupancy > 70 ? 'warning' : 'good';
              const statusColor = status === 'critical' ? 'var(--color-danger)' : status === 'warning' ? 'var(--color-warning)' : 'var(--color-success)';
              return (
                <div key={zone.id} className="rounded-lg text-center"
                  style={{ padding: '12px 8px', background: 'var(--color-bg-secondary)', border: `1px solid var(--color-border)` }}>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>{zone.name}</div>
                  <div className="font-display font-bold" style={{ fontSize: '20px', marginTop: '4px', color: 'var(--color-text-primary)' }}>{staffCount}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '6px' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '4px', background: statusColor, display: 'inline-block' }}></span>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--color-text-secondary)', fontWeight: 600 }}>{status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function EventFeed({ events }) {
  return (
    <div className="glass-card p-5" style={{ minHeight: 0 }}>
      <h3 className="font-display text-sm font-semibold mb-4 tracking-wide">Real-Time Event Feed</h3>
      <div style={{ maxHeight: '220px', overflowY: 'auto' }} className="no-scrollbar">
        {(!events || events.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-10 opacity-60">
            <p className="text-sm tracking-wide text-text-secondary italic">No recent events logged today</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(events || []).slice(-8).reverse().map((evt, i) => (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '8px', borderRadius: '8px' }}
              >
                <div style={{ flex: 1, minWidth: 0, borderLeft: `2px solid ${evt.type === 'critical' ? 'var(--color-danger)' : evt.type === 'warning' ? 'var(--color-warning)' : evt.type === 'success' ? 'var(--color-success)' : 'var(--color-accent-cyan)'}`, paddingLeft: '12px' }}>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-primary)', lineHeight: '1.4' }}>{evt.message}</p>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                    {new Date(evt.time).toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data } = useApp();

  if (!data) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {[1, 2, 3, 4].map(i => <div key={i} className="skeleton" style={{ height: 130, borderRadius: 12 }}></div>)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '16px' }}>
          <div className="skeleton" style={{ height: 320, borderRadius: 12 }}></div>
          <div className="skeleton" style={{ height: 320, borderRadius: 12 }}></div>
        </div>
      </div>
    );
  }

  const alertCount = data.alerts?.length || 0;
  const criticalCount = data.alerts?.filter(a => a.type === 'critical').length || 0;
  const warningCount = data.alerts?.filter(a => a.type === 'warning').length || 0;

  const baseLine = data.totalAttendance || 42000;

  const crowdHistory = Array.from({ length: 12 }, (_, i) => {
    const timeOffset = (11 - i) * 5;
    return {
      time: `-${timeOffset}m`,
      total: Math.round(baseLine - (timeOffset * 50) + (Math.sin(i) * 1200)),
      zoneAvg: Math.round((baseLine / 6) - (timeOffset * 8) + (Math.sin(i) * 200)),
      threshold: 50000
    };
  });

  const predictionData = Array.from({ length: 12 }, (_, i) => {
    const timeOffset = i * 5;
    return {
      time: `+${timeOffset}m`,
      predicted: Math.round(baseLine + (timeOffset * 150) + (Math.cos(i) * 800)),
      actual: i === 0 ? baseLine : null,
    };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* KPI Cards — 4 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <MetricCard
          title="Total Attendance"
          value={data.totalAttendance}
          icon={Users}
          iconColor="#00D4FF"
          trend="+2.3% vs last hour"
          trendUp={true}
          subtext={`Capacity: ${Math.round(data.totalAttendance / 500)}%`}
          delay={0.1}
        />
        <MetricCard
          title="Avg Queue Wait"
          value={data.avgQueueWait}
          icon={Clock}
          iconColor="#F59E0B"
          trend="-12% improved"
          trendUp={false}
          subtext="Target: <10 min"
          delay={0.2}
          format={(v) => `${v.toFixed(1)} min`}
        />
        <MetricCard
          title="Active Alerts"
          value={alertCount}
          icon={AlertTriangle}
          iconColor="#EF4444"
          trend={`+1 new in last 5 min`}
          trendUp={true}
          subtext={`${criticalCount} Critical, ${warningCount} Warning`}
          delay={0.3}
        />
        <MetricCard
          title="Staff On Duty"
          value={data.staffOnDuty}
          icon={Shield}
          iconColor="#7C3AED"
          trend={`${Math.round(data.staffAvailable / data.staffOnDuty * 100)}% availability`}
          trendUp={true}
          subtext={`${data.staffDispatched} dispatched now`}
          delay={0.4}
        />
      </div>

      {/* Charts Row — 60/40 split */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '16px' }}>
        <div style={{ minWidth: 0 }}>
          <CrowdLineChart data={crowdHistory} />
        </div>
        <div style={{ minWidth: 0 }}>
          <ZoneDonut zoneDensities={data.zoneDensities} />
        </div>
      </div>

      {/* Middle Row — 3 equal columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div style={{ minWidth: 0 }}>
          <QueueBarChart queues={data.queues} />
        </div>
        <div style={{ minWidth: 0 }}>
          <StaffDeploymentGrid zoneDensities={data.zoneDensities} />
        </div>
        <div style={{ minWidth: 0 }}>
          <EventFeed events={data.events} />
        </div>
      </div>

      {/* Prediction Chart — full width */}
      <div style={{ minWidth: 0 }}>
        <PredictionAreaChart data={predictionData} />
      </div>
    </div>
  );
}
