import { useEffect, useState } from 'react';

export default function GaugeChart({ value = 87, label = 'AI Confidence' }) {
  const [animatedValue, setAnimatedValue] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 300);
    return () => clearTimeout(timer);
  }, [value]);

  const radius = 80;
  const strokeWidth = 12;
  const circumference = Math.PI * radius;
  const offset = circumference - (animatedValue / 100) * circumference;

  return (
    <div className="glass-card p-5">
      <h3 className="font-display text-sm font-semibold mb-4 tracking-wide">Prediction Confidence</h3>
      <div className="flex flex-col items-center">
        <svg width="200" height="120" viewBox="0 0 200 120">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="50%" stopColor="#00D4FF" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
          {/* Background arc */}
          <path
            d={`M ${100 - radius} 100 A ${radius} ${radius} 0 0 1 ${100 + radius} 100`}
            fill="none"
            stroke="rgba(30, 42, 69, 0.5)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Filled arc */}
          <path
            d={`M ${100 - radius} 100 A ${radius} ${radius} 0 0 1 ${100 + radius} 100`}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
          {/* Value text */}
          <text x="100" y="85" textAnchor="middle" className="font-display" fill="#00D4FF" fontSize="28" fontWeight="700">
            {animatedValue}%
          </text>
          <text x="100" y="105" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="Inter">
            {label}
          </text>
        </svg>
        <p className="text-xs text-text-secondary mt-2 text-center">
          Based on 847 historical events | Last updated: just now
        </p>
      </div>
    </div>
  );
}
