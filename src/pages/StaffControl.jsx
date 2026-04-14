import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { STAFF_LIST, ZONES, STAFF_TASKS, PRIORITIES } from '../utils/constants';
import { Search, Send, X, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StaffRadarChart from '../components/charts/StaffRadarChart';
import toast from 'react-hot-toast';

const statusColors = {
  available: '#10B981',
  dispatched: '#F59E0B',
  'on-break': '#94A3B8',
};

const statusLabels = {
  available: 'Available',
  dispatched: 'Dispatched',
  'on-break': 'On Break',
};

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

function getAvatarColor(name) {
  const colors = ['#00D4FF', '#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export default function StaffControl() {
  const { data, staffList, setStaffList, tasks, addTask, updateTask, addEvent } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [dispatchForm, setDispatchForm] = useState({ zone: 'north', task: 'Crowd Control', priority: 'Medium', notes: '' });

  useEffect(() => {
    if (!staffList) {
      setStaffList(STAFF_LIST);
    }
  }, [staffList, setStaffList]);

  const staff = (staffList || STAFF_LIST).filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.zone.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = statusFilter === 'All' || s.status === statusFilter.toLowerCase().replace(' ', '-');
    return matchesSearch && matchesFilter;
  });

  const handleDispatchClick = (s) => {
    setSelectedStaff(s);
    setShowModal(true);
  };

  const handleConfirmDispatch = () => {
    if (!selectedStaff) return;
    const zoneName = ZONES.find(z => z.id === dispatchForm.zone)?.name || dispatchForm.zone;

    setStaffList(prev => prev.map(s => s.id === selectedStaff.id ? { ...s, status: 'dispatched', zone: dispatchForm.zone } : s));

    addTask({
      title: dispatchForm.task,
      zone: zoneName,
      staffName: selectedStaff.name,
      staffId: selectedStaff.id,
      priority: dispatchForm.priority,
      notes: dispatchForm.notes,
    });

    addEvent({ type: 'success', message: `${selectedStaff.name} dispatched to ${zoneName} for ${dispatchForm.task}` });
    toast.success(`${selectedStaff.name} dispatched to ${zoneName}`, { style: { background: '#141B2D', color: '#F1F5F9', border: '1px solid #10B981' } });

    setShowModal(false);
    setSelectedStaff(null);
    setDispatchForm({ zone: 'north', task: 'Crowd Control', priority: 'Medium', notes: '' });
  };

  const handleCompleteTask = (taskId) => {
    updateTask(taskId, { status: 'completed' });
    toast.success('Task marked as completed', { style: { background: '#141B2D', color: '#F1F5F9', border: '1px solid #10B981' } });
  };

  const handleEscalateTask = (taskId) => {
    updateTask(taskId, { priority: 'Urgent' });
    toast.error('Task escalated to URGENT', { style: { background: '#141B2D', color: '#F1F5F9', border: '1px solid #EF4444' } });
  };

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  // Auto move pending tasks to in-progress after 5s
  useEffect(() => {
    const timer = setInterval(() => {
      pendingTasks.forEach(t => {
        if (Date.now() - t.startTime > 5000) {
          updateTask(t.id, { status: 'in-progress' });
        }
      });
    }, 2000);
    return () => clearInterval(timer);
  }, [pendingTasks, updateTask]);

  const priorityColors = { Low: '#94A3B8', Medium: '#F59E0B', High: '#EF4444', Urgent: '#EF4444' };

  return (
    <div style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 160px)', minHeight: '500px' }}>
      {/* Staff Roster */}
      <div className="glass-card" style={{ width: '35%', display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0, flexShrink: 0 }}>
        <div className="p-4 border-b" style={{ borderColor: 'rgba(30, 42, 69, 0.5)' }}>
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search staff..."
              className="w-full pl-9 pr-4 py-2 rounded-lg text-sm bg-bg-primary border border-border text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-cyan"
            />
          </div>
          <div className="flex gap-1.5">
            {['All', 'Available', 'Dispatched', 'On Break'].map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${statusFilter === f ? 'bg-accent-cyan/15 text-accent-cyan' : 'text-text-secondary hover:text-text-primary'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {staff.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-bg-secondary transition-colors"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold text-bg-primary flex-shrink-0"
                style={{ background: getAvatarColor(s.name) }}>
                {getInitials(s.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[15px] font-medium text-text-primary truncate">{s.name}</p>
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: statusColors[s.status] }}></span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-text-secondary">{s.role}</span>
                  <span className="text-xs text-text-secondary">•</span>
                  <span className="badge text-[10px] py-0 bg-bg-secondary text-text-secondary border border-border">
                    {ZONES.find(z => z.id === s.zone)?.name || s.zone}
                  </span>
                </div>
              </div>
              {s.status === 'available' && (
                <button onClick={() => handleDispatchClick(s)} className="btn-primary text-xs py-2 px-4 flex items-center gap-2">
                  <Send size={12} /> Dispatch
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Task Board */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', overflow: 'hidden', minWidth: 0 }}>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', overflow: 'hidden', minHeight: 0 }}>
          {/* Pending */}
          <div className="flex flex-col glass-card overflow-hidden">
            <div className="p-4 border-b border-border flex items-center gap-2">
              <Clock size={16} className="text-warning" />
              <span className="font-display text-sm font-semibold text-text-primary tracking-wide">PENDING</span>
              <span className="ml-auto badge badge-amber text-[11px]">{pendingTasks.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              <AnimatePresence>
                {pendingTasks.map(task => (
                  <TaskCard key={task.id} task={task} onComplete={handleCompleteTask} onEscalate={handleEscalateTask} priorityColors={priorityColors} />
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* In Progress */}
          <div className="flex flex-col glass-card overflow-hidden">
            <div className="p-4 border-b border-border flex items-center gap-2">
              <Send size={16} className="text-accent-cyan" />
              <span className="font-display text-sm font-semibold text-text-primary tracking-wide">IN PROGRESS</span>
              <span className="ml-auto badge badge-cyan text-[11px]">{inProgressTasks.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              <AnimatePresence>
                {inProgressTasks.map(task => (
                  <TaskCard key={task.id} task={task} onComplete={handleCompleteTask} onEscalate={handleEscalateTask} priorityColors={priorityColors} />
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Completed */}
          <div className="flex flex-col glass-card overflow-hidden">
            <div className="p-4 border-b border-border flex items-center gap-2">
              <CheckCircle size={16} className="text-success" />
              <span className="font-display text-sm font-semibold text-text-primary tracking-wide">COMPLETED</span>
              <span className="ml-auto badge badge-green text-[11px]">{completedTasks.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              <AnimatePresence>
                {completedTasks.map(task => (
                  <TaskCard key={task.id} task={task} completed priorityColors={priorityColors} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Radar Chart */}
        <div style={{ height: '280px', flexShrink: 0 }}>
          <StaffRadarChart zoneDensities={data?.zoneDensities} />
        </div>
      </div>

      {/* Dispatch Modal */}
      <AnimatePresence>
        {showModal && selectedStaff && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-strong p-6 rounded-2xl w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-lg font-semibold">Dispatch Staff</h3>
                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                  <X size={18} className="text-text-secondary" />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-5 p-3 rounded-lg bg-bg-primary/50">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-bg-primary"
                  style={{ background: getAvatarColor(selectedStaff.name) }}>
                  {getInitials(selectedStaff.name)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{selectedStaff.name}</p>
                  <p className="text-xs text-text-secondary">{selectedStaff.role}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-text-secondary block mb-1.5">Select Zone</label>
                  <select value={dispatchForm.zone} onChange={e => setDispatchForm(p => ({ ...p, zone: e.target.value }))}
                    className="w-full p-2.5 rounded-lg bg-bg-card border border-border text-text-primary text-sm focus:outline-none focus:border-accent-cyan">
                    {ZONES.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-text-secondary block mb-1.5">Select Task</label>
                  <select value={dispatchForm.task} onChange={e => setDispatchForm(p => ({ ...p, task: e.target.value }))}
                    className="w-full p-2.5 rounded-lg bg-bg-card border border-border text-text-primary text-sm focus:outline-none focus:border-accent-cyan">
                    {STAFF_TASKS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-text-secondary block mb-1.5">Priority</label>
                  <div className="flex gap-2">
                    {PRIORITIES.map(p => (
                      <button key={p}
                        onClick={() => setDispatchForm(prev => ({ ...prev, priority: p }))}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${dispatchForm.priority === p ? 'border-accent-cyan bg-accent-cyan/10 text-accent-cyan' : 'border-border text-text-secondary hover:text-text-primary'
                          } border`}
                      >{p}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-text-secondary block mb-1.5">Notes</label>
                  <textarea
                    value={dispatchForm.notes}
                    onChange={e => setDispatchForm(p => ({ ...p, notes: e.target.value }))}
                    placeholder="Additional instructions..."
                    className="w-full p-2.5 rounded-lg bg-bg-card border border-border text-text-primary text-sm focus:outline-none focus:border-accent-cyan resize-none h-20"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <button onClick={handleConfirmDispatch} className="btn-primary flex-1 py-3 text-sm font-semibold">
                  Confirm Dispatch
                </button>
                <button onClick={() => setShowModal(false)} className="btn-ghost px-6 text-sm">
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TaskCard({ task, onComplete, onEscalate, completed, priorityColors }) {
  const elapsed = Math.round((Date.now() - task.startTime) / 60000);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`p-4 rounded-xl ${completed ? 'opacity-60' : ''}`}
      style={{ background: 'var(--color-bg-secondary)', border: `1px solid ${task.priority === 'Urgent' ? 'var(--color-danger)' : 'var(--color-border)'}` }}
    >
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm font-medium text-text-primary">{task.title}</p>
        <span className="badge text-[10px]" style={{ background: `${priorityColors[task.priority]}15`, color: priorityColors[task.priority], border: `1px solid ${priorityColors[task.priority]}30` }}>
          {task.priority}
        </span>
      </div>
      <p className="text-xs text-text-secondary">{task.zone} • {task.staffName}</p>
      <p className="text-xs text-text-secondary font-mono mt-1.5">{elapsed}m elapsed</p>

      {!completed && onComplete && (
        <div className="flex gap-2 mt-3">
          <button onClick={() => onComplete(task.id)} className="text-[11px] font-medium px-3 py-1.5 rounded-lg border border-success text-success hover:bg-success/10 transition-colors">
            Complete
          </button>
          <button onClick={() => onEscalate(task.id)} className="text-[11px] font-medium px-3 py-1.5 rounded-lg border border-danger text-danger hover:bg-danger/10 transition-colors">
            Escalate
          </button>
        </div>
      )}
    </motion.div>
  );
}
