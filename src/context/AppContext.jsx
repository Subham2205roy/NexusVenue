import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [staffList, setStaffList] = useState(null);

  const fetchLiveState = useCallback(async () => {
    try {
      const [
        { data: zones },
        { data: dbQueues },
        { data: dbStaff },
        { data: dbTasks },
        { data: dbEvents }
      ] = await Promise.all([
        supabase.from('zones').select('*'),
        supabase.from('queues').select('*'),
        supabase.from('staff').select('*'),
        supabase.from('tasks').select('*'),
        supabase.from('events').select('*').order('time', { ascending: false }).limit(20)
      ]);

      setStaffList(dbStaff || []);

      const mappedTasks = (dbTasks || []).map(t => ({
        ...t,
        staffName: t.staff_name,
        staffId: t.staff_id,
        startTime: parseInt(t.start_time)
      }));
      setTasks(mappedTasks);

      const zoneDensities = {};
      let totalPeople = 0;
      (zones || []).forEach(z => {
        zoneDensities[z.id] = z;
        totalPeople += z.people;
      });

      const queuesObj = {};
      let totalWait = 0;
      (dbQueues || []).forEach(q => {
        queuesObj[q.id] = {
          ...q,
          waitTime: q.wait_time,
          queueLength: q.queue_length,
          history: typeof q.history === 'string' ? JSON.parse(q.history) : (q.history || [])
        };
        totalWait += q.wait_time;
      });

      const avgWait = dbQueues?.length ? (totalWait / dbQueues.length).toFixed(1) : 0;
      const availableStaff = (dbStaff || []).filter(s => s.status === 'available').length;
      const dispatchedStaff = (dbStaff || []).filter(s => s.status === 'dispatched').length;
      const onDutyStaff = availableStaff + dispatchedStaff;

      const alerts = [];
      (zones || []).forEach(z => {
        if (z.occupancy > 85) alerts.push({ id: `alert-z-${z.id}`, type: 'critical', location: z.name, message: `Occupancy at ${z.occupancy}%`, time: Date.now() });
      });
      (dbQueues || []).forEach(q => {
        if (q.wait_time > 15) alerts.push({ id: `alert-q-${q.id}`, type: 'warning', location: q.name, message: `Wait time exceeds 15m`, time: Date.now() });
      });

      setData({
        totalAttendance: totalPeople,
        avgQueueWait: avgWait,
        staffAvailable: availableStaff,
        staffDispatched: dispatchedStaff,
        staffOnDuty: onDutyStaff,
        zoneDensities,
        queues: queuesObj,
        events: dbEvents || [],
        alerts
      });
    } catch (e) {
      console.error('Supabase fetch error:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveState();

    const channel = supabase.channel('public-db')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        fetchLiveState(); // Refresh data entirely on any change for consistency
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLiveState]);

  const dismissAlert = useCallback((id) => {
    setData(prev => ({ ...prev, alerts: prev.alerts.filter(a => a.id !== id) }));
  }, []);

  const addAlert = useCallback((alert) => {
    // Handled dynamically via zones/queues thresholds
  }, []);

  const addEvent = useCallback(async (event) => {
    const newEvent = {
      id: Date.now().toString(),
      type: event.type,
      message: event.message
    };
    await supabase.from('events').insert([newEvent]);
  }, []);

  const modifyQueue = useCallback(async (queueId, changes) => {
    const queue = data?.queues?.[queueId];
    if (!queue) return;

    // In a real app we'd just update row, but here we do simple math
    const newWait = Math.max(1, queue.waitTime + (changes.waitTimeDelta || 0));
    await supabase.from('queues')
      .update({ wait_time: newWait })
      .eq('id', queueId);
  }, [data]);

  const addTask = useCallback(async (task) => {
    const dbTask = {
      id: Date.now().toString(),
      title: task.title,
      zone: task.zone,
      staff_name: task.staffName,
      staff_id: task.staffId,
      priority: task.priority,
      status: 'pending',
      notes: task.notes || '',
      start_time: Date.now()
    };
    await supabase.from('tasks').insert([dbTask]);

    // Update staff status to dispatched
    await supabase.from('staff')
      .update({ status: 'dispatched', zone: task.zone })
      .eq('id', task.staffId);
  }, []);

  const updateTask = useCallback(async (taskId, updates) => {
    await supabase.from('tasks')
      .update(updates)
      .eq('id', taskId);
  }, []);

  const updateStaffStatus = useCallback(async (staffId, newStatus, zone) => {
    const updates = { status: newStatus };
    if (zone) updates.zone = zone;
    await supabase.from('staff').update(updates).eq('id', staffId);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const result = await res.json();
      if (result.success) {
        setToken(result.token);
        setRole('admin');
        localStorage.setItem('token', result.token);
        localStorage.setItem('role', 'admin');
      }
      return result;
    } catch (err) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const result = await res.json();
      // We purposefully DO NOT set tokens here. 
      // The user must manually log in after registering.
      return result;
    } catch (err) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };

  return (
    <AppContext.Provider value={{
      role, setRole, token, login, register, logout,
      data, isLoading,
      dismissAlert, addAlert, addEvent,
      modifyQueue,
      tasks, addTask, updateTask,
      staffList, setStaffList, updateStaffStatus,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
