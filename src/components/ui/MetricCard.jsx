import { useEffect, useState, useRef } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  const prevTarget = useRef(target);

  useEffect(() => {
    const start = prevTarget.current === target ? 0 : prevTarget.current;
    prevTarget.current = target;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(start + (target - start) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [target, duration]);

  return value;
}

export default function MetricCard({
  title, value, icon: Icon, iconColor, trend, trendUp,
  subtext, delay = 0, format
}) {
  const displayValue = useCountUp(typeof value === 'number' ? value : parseFloat(value) || 0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  const formattedValue = format ? format(displayValue) : displayValue.toLocaleString();

  return (
    <div
      className="glass-card"
      style={{
        padding: '20px',
        overflow: 'hidden',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
      }}
    >
      <div style={{ position: 'relative' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>{title}</h3>
          {Icon && (
            <div style={{ width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
              <Icon size={18} style={{ color: iconColor || 'var(--color-text-primary)' }} />
            </div>
          )}
        </div>

        {/* Value */}
        <div
          className="font-display"
          style={{
            fontSize: '28px', fontWeight: 700, marginBottom: '12px',
            color: 'var(--color-text-primary)',
          }}
        >
          {formattedValue}
        </div>

        {/* Trend */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {trendUp !== undefined && (
              trendUp ? (
                <TrendingUp size={14} style={{ color: 'var(--color-success)' }} />
              ) : (
                <TrendingDown size={14} style={{ color: trend?.includes('-') ? 'var(--color-success)' : 'var(--color-danger)' }} />
              )
            )}
            <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>{trend}</span>
          </div>
          {subtext && (
            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{subtext}</span>
          )}
        </div>
      </div>
    </div>
  );
}
