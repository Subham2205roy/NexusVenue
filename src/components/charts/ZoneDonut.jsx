import { useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { ZONES } from '../../utils/constants';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ZoneDonut({ zoneDensities }) {
  const chartRef = useRef(null);
  if (!zoneDensities) return null;

  const zones = Object.values(zoneDensities);
  const total = zones.reduce((sum, z) => sum + z.people, 0);

  const chartData = {
    labels: zones.map(z => z.name),
    datasets: [{
      data: zones.map(z => z.people || 0),
      backgroundColor: [
        'rgba(0, 212, 255, 0.7)',
        'rgba(124, 58, 237, 0.7)',
        'rgba(16, 185, 129, 0.7)',
        'rgba(245, 158, 11, 0.7)',
        'rgba(236, 72, 153, 0.7)',
        'rgba(148, 163, 184, 0.7)',
      ],
      borderColor: [
        '#00D4FF', '#7C3AED', '#10B981', '#F59E0B', '#EC4899', '#94A3B8',
      ],
      borderWidth: 2,
      hoverOffset: 8,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#94A3B8',
          font: { family: 'Inter', size: 11 },
          padding: 10,
          usePointStyle: true,
          pointStyleWidth: 10,
          boxWidth: 10,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(20, 27, 45, 0.95)',
        titleColor: '#F1F5F9',
        bodyColor: '#94A3B8',
        borderColor: 'rgba(0, 212, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: (ctx) => {
            const pct = ((ctx.raw / total) * 100).toFixed(1);
            return ` ${ctx.label}: ${ctx.raw.toLocaleString()} (${pct}%)`;
          },
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
    },
  };

  return (
    <div className="glass-card p-5" style={{ overflow: 'hidden' }}>
      <h3 className="font-display text-sm font-semibold mb-4 tracking-wide">Zone Distribution</h3>
      <div style={{ position: 'relative', width: '100%', height: 280 }}>
        <Doughnut ref={chartRef} data={chartData} options={options} />
        {/* Center text overlay */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '38%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none',
        }}>
          <div className="font-display" style={{ fontSize: '22px', fontWeight: 700, color: '#00D4FF' }}>{total.toLocaleString()}</div>
          <div style={{ fontSize: '9px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>Total</div>
        </div>
      </div>
    </div>
  );
}
