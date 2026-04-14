import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ZONES, getStatusColor } from '../utils/constants';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Users, Utensils, DoorOpen, AlertTriangle, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const zonePositions = {
  'z-north': { x: 150, y: 40, w: 300, h: 80, label: 'North Stand' },
  'z-south': { x: 150, y: 280, w: 300, h: 80, label: 'South Stand' },
  'z-east': { x: 450, y: 120, w: 80, h: 160, label: 'East Wing' },
  'z-west': { x: 70, y: 120, w: 80, h: 160, label: 'West Wing' },
  'z-vip': { x: 200, y: 140, w: 100, h: 50, label: 'VIP Zone' },
  'z-con': { x: 300, y: 200, w: 150, h: 50, label: 'Concourse' },
};

function getHeatColor(occupancy) {
  if (occupancy >= 90) return 'rgba(239, 68, 68, 0.6)';
  if (occupancy >= 80) return 'rgba(245, 158, 11, 0.5)';
  if (occupancy >= 60) return 'rgba(245, 158, 11, 0.3)';
  return 'rgba(16, 185, 129, 0.3)';
}

function getHeatBorder(occupancy) {
  if (occupancy >= 90) return '#EF4444';
  if (occupancy >= 80) return '#F59E0B';
  if (occupancy >= 60) return '#F59E0B';
  return '#10B981';
}

export default function Heatmap() {
  const { data, addEvent } = useApp();
  const [selectedZone, setSelectedZone] = useState('z-north');
  const [hoveredZone, setHoveredZone] = useState(null);
  const [showStaff, setShowStaff] = useState(true);
  const [showQueues, setShowQueues] = useState(true);
  const [showPrediction, setShowPrediction] = useState(false);
  const [staffPositions, setStaffPositions] = useState([]);

  useEffect(() => {
    const positions = [];
    for (let i = 0; i < 15; i++) {
      const zone = Object.keys(zonePositions)[Math.floor(Math.random() * 6)];
      const zp = zonePositions[zone];
      positions.push({
        id: i,
        x: zp.x + Math.random() * zp.w,
        y: zp.y + Math.random() * zp.h,
        zone,
      });
    }
    setStaffPositions(positions);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStaffPositions(prev => prev.map(p => ({
        ...p,
        x: p.x + (Math.random() - 0.5) * 8,
        y: p.y + (Math.random() - 0.5) * 8,
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="skeleton h-96 rounded-xl"></div>;

  const zonesList = Object.values(data.zoneDensities || {});
  const selected = data.zoneDensities?.[selectedZone];
  const zoneInfo = selected || {};

  const overcrowded = zonesList.filter(z => (z.occupancy || 0) > 80)
    .sort((a, b) => (b.occupancy || 0) - (a.occupancy || 0))
    .slice(0, 3);

  const criticalZones = zonesList.filter(z => (z.occupancy || 0) > 85);

  const handleDispatchStaff = (zoneName) => {
    toast.success(`Staff dispatched to ${zoneName}`, { style: { background: '#141B2D', color: '#F1F5F9', border: '1px solid #10B981' } });
    addEvent({ type: 'success', message: `Staff dispatched to ${zoneName}` });
  };

  const handleOpenGate = (zoneName) => {
    toast.success(`Alternate gate opened near ${zoneName}`, { style: { background: '#141B2D', color: '#F1F5F9', border: '1px solid #00D4FF' } });
    addEvent({ type: 'info', message: `Alternate gate opened near ${zoneName}` });
  };

  const gatePositions = [
    { x: 200, y: 25, label: 'Gate A' },
    { x: 350, y: 25, label: 'Gate B' },
    { x: 250, y: 370, label: 'Gate C' },
    { x: 400, y: 370, label: 'Gate D' },
  ];

  const foodPositions = [
    { x: 100, y: 180, label: 'Food' },
    { x: 480, y: 180, label: 'Food' },
  ];

  return (
    <div style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 160px)', minHeight: '500px' }}>
      {/* Heatmap */}
      <div className="glass-card" style={{ flex: '7 1 0%', padding: '24px', position: 'relative', overflow: 'hidden', minWidth: 0 }}>
        <h3 className="font-display text-sm font-semibold mb-4 tracking-wide">Stadium Heatmap — Live</h3>

        <div className="relative mx-auto" style={{ width: 600, height: 400 }}>
          {/* Pitch (center) */}
          <div className="absolute rounded-xl border-2 border-green-800/50"
            style={{ left: 180, top: 140, width: 240, height: 120, background: 'rgba(16, 185, 129, 0.05)' }}>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] text-green-700/60 font-display tracking-wider">PITCH</div>
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-green-800/30"></div>
            <div className="absolute left-1/2 top-1/2 w-12 h-12 -translate-x-1/2 -translate-y-1/2 border border-green-800/30 rounded-full"></div>
          </div>

          {/* Zones */}
          {Object.entries(zonePositions).map(([id, pos]) => {
            const zoneData = data.zoneDensities?.[id];
            const occupancy = zoneData?.occupancy || 50;
            const isPulsing = occupancy > 90;
            return (
              <motion.div
                key={id}
                className="absolute rounded-lg cursor-pointer transition-all duration-1000 flex flex-col items-center justify-center"
                style={{
                  left: pos.x,
                  top: pos.y,
                  width: pos.w,
                  height: pos.h,
                  background: getHeatColor(occupancy),
                  border: `2px solid ${getHeatBorder(occupancy)}`,
                }}
                onClick={() => setSelectedZone(id)}
                onMouseEnter={() => setHoveredZone(id)}
                onMouseLeave={() => setHoveredZone(null)}
                whileHover={{ scale: 1.02 }}
              >
                <span className="font-display text-[12px] font-medium tracking-wide text-text-primary">{pos.label}</span>
                <span className="font-mono text-xl font-bold" style={{ color: getHeatBorder(occupancy) }}>{occupancy}%</span>
                <span className="text-[11px] text-text-secondary mt-1">{zoneData?.people?.toLocaleString() || 0} ppl</span>
              </motion.div>
            );
          })}

          {/* Tooltip on hover */}
          {hoveredZone && (
            <div className="absolute z-20 glass-strong p-3 rounded-lg shadow-xl pointer-events-none"
              style={{ left: zonePositions[hoveredZone].x + zonePositions[hoveredZone].w + 10, top: zonePositions[hoveredZone].y }}>
              <p className="text-xs font-semibold text-text-primary">{zonePositions[hoveredZone].label}</p>
              <p className="text-[10px] text-text-secondary">Capacity: {data.zoneDensities?.[hoveredZone]?.occupancy}%</p>
              <p className="text-[10px] text-text-secondary">People: {data.zoneDensities?.[hoveredZone]?.people?.toLocaleString()}</p>
              <p className="text-[10px] mt-1" style={{ color: getHeatBorder(data.zoneDensities?.[hoveredZone]?.occupancy || 50) }}>
                {data.zoneDensities?.[hoveredZone]?.occupancy > 85 ? 'Recommended: Open Gate 4' : 'Status: Normal'}
              </p>
            </div>
          )}

          {/* Gate markers */}
          {showQueues && gatePositions.map((gate, i) => (
            <div key={i} className="absolute flex flex-col items-center" style={{ left: gate.x, top: gate.y }}>
              <DoorOpen size={14} className="text-accent-cyan" />
              <span className="text-[8px] text-text-secondary mt-0.5">{gate.label}</span>
            </div>
          ))}

          {/* Food markers */}
          {showQueues && foodPositions.map((food, i) => (
            <div key={i} className="absolute flex flex-col items-center" style={{ left: food.x, top: food.y }}>
              <Utensils size={12} className="text-warning" />
              <span className="text-[8px] text-text-secondary mt-0.5">{food.label}</span>
            </div>
          ))}

          {/* Staff dots */}
          {showStaff && staffPositions.map(staff => (
            <div
              key={staff.id}
              className="absolute w-2.5 h-2.5 rounded-full bg-accent-purple opacity-80 transition-all duration-2000"
              style={{ left: staff.x, top: staff.y, boxShadow: '0 0 6px rgba(124, 58, 237, 0.5)' }}
            />
          ))}
        </div>
      </div>

      {/* Control Panel */}
      <div className="no-scrollbar" style={{ flex: '3 1 0%', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', minWidth: 0 }}>
        {/* Zone Selector */}
        <div className="glass-card p-6">
          <label className="text-sm font-medium text-text-secondary block mb-3">Select Zone</label>
          <select
            value={selectedZone}
            onChange={e => setSelectedZone(e.target.value)}
            className="w-full p-2.5 rounded-lg bg-bg-card border border-border text-text-primary text-sm focus:outline-none focus:border-accent-cyan"
          >
            {zonesList.map(z => (
              <option key={z.id} value={z.id}>{z.name}</option>
            ))}
          </select>

          {selected && (
            <div className="mt-5 space-y-3">
              <div className="flex justify-between text-[15px]">
                <span className="text-text-secondary">Capacity</span>
                <span className="font-mono font-semibold" style={{ color: getHeatBorder(selected.occupancy) }}>{selected.occupancy}%</span>
              </div>
              <div className="w-full h-3 bg-bg-primary rounded-full overflow-hidden mb-2">
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(selected.occupancy, 100)}%`, background: getHeatBorder(selected.occupancy) }}></div>
              </div>
              <div className="flex justify-between text-sm text-text-secondary mt-2">
                <span>People: {selected.people?.toLocaleString()}</span>
                <span>Max: {selected.capacity?.toLocaleString()}</span>
              </div>
              <p className="text-[13px] text-text-secondary pt-2">Last updated: just now</p>
              <p className="text-[13px] font-medium" style={{ color: getStatusColor(selected.occupancy, 'density') }}>
                {selected.occupancy > 85 ? '⚠ Recommended: Redirect to adjacent zones' : '✓ No action needed'}
              </p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="glass-card p-6 space-y-4">
          <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Controls</h4>
          {[
            { label: 'Show Staff Positions', value: showStaff, set: setShowStaff },
            { label: 'Show Queue Markers', value: showQueues, set: setShowQueues },
            { label: 'Show Prediction Layer', value: showPrediction, set: setShowPrediction },
          ].map(ctrl => (
            <div key={ctrl.label} className="flex items-center justify-between pb-2">
              <span className="text-[15px] text-text-primary">{ctrl.label}</span>
              <button
                onClick={() => ctrl.set(!ctrl.value)}
                className={`w-10 h-5 rounded-full transition-all duration-300 relative ${ctrl.value ? 'bg-accent-cyan' : 'bg-border'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${ctrl.value ? 'left-5.5' : 'left-0.5'}`} style={{ left: ctrl.value ? 22 : 2 }}></div>
              </button>
            </div>
          ))}
        </div>

        {/* Top Overcrowded */}
        <div className="glass-card p-6">
          <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-5">Top Overcrowded Zones</h4>
          <div className="space-y-4">
            {overcrowded.map(zone => {
              const d = data.zoneDensities?.[zone.id];
              return (
                <div key={zone.id} className="flex items-center gap-3">
                  <span className="text-[14px] text-text-primary flex-1 font-medium">{zone.name}</span>
                  <div className="w-32 h-2.5 bg-bg-primary rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${Math.min(d?.occupancy || 0, 100)}%`, background: getHeatBorder(d?.occupancy || 0) }}></div>
                  </div>
                  <span className="text-[14px] font-mono font-bold w-12 text-right" style={{ color: getHeatBorder(d?.occupancy || 0) }}>{d?.occupancy}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Critical Alert Box */}
        {criticalZones.length > 0 && (
          <div className="glass-card p-6" style={{ border: '1px solid var(--color-danger)' }}>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={18} className="text-danger" />
              <span className="text-sm font-semibold text-danger">{criticalZones.length} zone{criticalZones.length > 1 ? 's' : ''} require action</span>
            </div>
            {criticalZones.map(zone => (
              <div key={zone.id} className="mb-4 last:mb-0">
                <p className="text-[14px] text-text-primary mb-2.5 font-medium">{zone.name} — {data.zoneDensities?.[zone.id]?.occupancy}%</p>
                <div className="flex gap-3">
                  <button onClick={() => handleDispatchStaff(zone.name)} className="btn-primary flex-1 text-[13px] py-2 flex items-center justify-center gap-2">
                    <Send size={14} /> Dispatch Staff
                  </button>
                  <button onClick={() => handleOpenGate(zone.name)} className="btn-ghost flex-1 text-[13px] py-2">
                    Open Gate
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
