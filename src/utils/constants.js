export const ZONES = [
  { id: 'north', name: 'North Stand', capacity: 9200, color: '#00D4FF' },
  { id: 'south', name: 'South Stand', capacity: 9200, color: '#7C3AED' },
  { id: 'east', name: 'East Wing', capacity: 8500, color: '#10B981' },
  { id: 'west', name: 'West Wing', capacity: 8500, color: '#F59E0B' },
  { id: 'vip', name: 'VIP Zone', capacity: 5600, color: '#EC4899' },
  { id: 'concourse', name: 'Concourse', capacity: 9000, color: '#94A3B8' },
];

export const TOTAL_CAPACITY = 50000;

export const QUEUE_LOCATIONS = [
  { id: 'gate-a', name: 'Gate A', type: 'Gate', maxCounters: 5 },
  { id: 'gate-b', name: 'Gate B', type: 'Gate', maxCounters: 5 },
  { id: 'gate-c', name: 'Gate C', type: 'Gate', maxCounters: 5 },
  { id: 'food-court', name: 'Food Court', type: 'Food & Beverage', maxCounters: 8 },
  { id: 'food-north', name: 'Food Stall N', type: 'Food & Beverage', maxCounters: 4 },
  { id: 'washroom-n', name: 'Washrooms N', type: 'Washrooms', maxCounters: 6 },
  { id: 'washroom-s', name: 'Washrooms S', type: 'Washrooms', maxCounters: 6 },
  { id: 'parking-exit', name: 'Parking Exit', type: 'Parking', maxCounters: 4 },
  { id: 'merch-store', name: 'Merch Store', type: 'Food & Beverage', maxCounters: 3 },
];

export const STAFF_ROLES = ['Security', 'Crowd Manager', 'Medical', 'Operations'];
export const STAFF_TASKS = ['Crowd Control', 'Queue Management', 'Emergency Response', 'Patrol'];
export const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

export const STAFF_LIST = [
  { id: 1, name: 'Arjun Mehta', role: 'Security', zone: 'north', status: 'available' },
  { id: 2, name: 'Priya Sharma', role: 'Crowd Manager', zone: 'south', status: 'available' },
  { id: 3, name: 'Rahul Dev', role: 'Security', zone: 'east', status: 'dispatched' },
  { id: 4, name: 'Ananya Iyer', role: 'Medical', zone: 'vip', status: 'available' },
  { id: 5, name: 'Vikram Singh', role: 'Operations', zone: 'west', status: 'on-break' },
  { id: 6, name: 'Deepika Reddy', role: 'Security', zone: 'north', status: 'dispatched' },
  { id: 7, name: 'Karan Patel', role: 'Crowd Manager', zone: 'concourse', status: 'available' },
  { id: 8, name: 'Neha Gupta', role: 'Medical', zone: 'south', status: 'available' },
  { id: 9, name: 'Amit Kumar', role: 'Operations', zone: 'east', status: 'available' },
  { id: 10, name: 'Riya Verma', role: 'Security', zone: 'west', status: 'dispatched' },
  { id: 11, name: 'Suresh Nair', role: 'Crowd Manager', zone: 'north', status: 'available' },
  { id: 12, name: 'Kavita Joshi', role: 'Medical', zone: 'concourse', status: 'on-break' },
  { id: 13, name: 'Manish Tiwari', role: 'Security', zone: 'vip', status: 'available' },
  { id: 14, name: 'Pooja Das', role: 'Operations', zone: 'south', status: 'available' },
  { id: 15, name: 'Rohan Bose', role: 'Crowd Manager', zone: 'east', status: 'dispatched' },
  { id: 16, name: 'Sanya Kapoor', role: 'Security', zone: 'north', status: 'available' },
  { id: 17, name: 'Aditya Rao', role: 'Operations', zone: 'west', status: 'available' },
  { id: 18, name: 'Meera Pillai', role: 'Medical', zone: 'concourse', status: 'available' },
];

export const THRESHOLDS = {
  queue: { good: 8, warning: 12 },
  density: { good: 60, warning: 80, critical: 90 },
};

export const CHART_COLORS = ['#00D4FF', '#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

export const getStatusColor = (value, type = 'queue') => {
  const t = THRESHOLDS[type];
  if (type === 'queue') {
    if (value <= t.good) return '#10B981';
    if (value <= t.warning) return '#F59E0B';
    return '#EF4444';
  }
  if (type === 'density') {
    if (value <= t.good) return '#10B981';
    if (value <= t.warning) return '#F59E0B';
    if (value <= t.critical) return '#F59E0B';
    return '#EF4444';
  }
  return '#94A3B8';
};

export const PROMPT_CHIPS = [
  'What zones are overcrowded?',
  'Predict crowd in 30 minutes',
  'Optimize staff deployment',
  'Generate incident report',
  'Suggest gate rerouting',
];
