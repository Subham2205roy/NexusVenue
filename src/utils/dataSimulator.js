import { ZONES, QUEUE_LOCATIONS, TOTAL_CAPACITY } from './constants';

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
const vary = (val, pct = 5) => {
  const change = val * (pct / 100) * (Math.random() > 0.5 ? 1 : -1);
  return Math.round(val + change);
};

export function generateInitialData() {
  const zoneDensities = {};
  let totalAttendance = 0;

  ZONES.forEach(zone => {
    const occupancy = rand(55, 92);
    const people = Math.round((occupancy / 100) * zone.capacity);
    zoneDensities[zone.id] = { occupancy, people, capacity: zone.capacity };
    totalAttendance += people;
  });

  const queues = {};
  QUEUE_LOCATIONS.forEach(loc => {
    const waitTime = rand(2, 20);
    const queueLength = rand(5, 60);
    const openCounters = rand(2, loc.maxCounters);
    const staff = rand(1, 4);
    queues[loc.id] = {
      waitTime,
      queueLength,
      openCounters,
      maxCounters: loc.maxCounters,
      staff,
      history: Array.from({ length: 10 }, () => rand(Math.max(1, waitTime - 5), waitTime + 5)),
    };
  });

  const crowdHistory = Array.from({ length: 7 }, (_, i) => ({
    time: `${-30 + i * 5}m`,
    total: vary(totalAttendance, 3),
    zoneAvg: vary(Math.round(totalAttendance / ZONES.length), 5),
    threshold: TOTAL_CAPACITY * 0.9,
  }));

  const predictionData = Array.from({ length: 7 }, (_, i) => ({
    time: `+${i * 10}m`,
    predicted: vary(totalAttendance + rand(-2000, 3000), 3),
    upper: vary(totalAttendance + rand(1000, 5000), 3),
    lower: vary(totalAttendance - rand(1000, 3000), 3),
  }));

  const alerts = [
    { id: 1, type: 'critical', zone: 'Gate C', message: 'Crowd density critical (94%)', time: Date.now() - 120000 },
    { id: 2, type: 'critical', zone: 'Parking Exit', message: 'Queue exceeding 15 min wait time', time: Date.now() - 60000 },
    { id: 3, type: 'warning', zone: 'Food Court', message: 'Queue approaching threshold (11 min)', time: Date.now() - 30000 },
  ];

  const events = [
    { id: 1, type: 'critical', message: 'Gate C — Crowd density critical (94%)', time: Date.now() - 180000 },
    { id: 2, type: 'warning', message: 'Food Court — Queue exceeding 10 min', time: Date.now() - 120000 },
    { id: 3, type: 'success', message: 'Staff dispatched to North Stand', time: Date.now() - 60000 },
    { id: 4, type: 'info', message: 'VIP section — All systems nominal', time: Date.now() - 30000 },
  ];

  return {
    totalAttendance,
    zoneDensities,
    queues,
    crowdHistory,
    predictionData,
    alerts,
    events,
    avgQueueWait: Math.round(
      Object.values(queues).reduce((sum, q) => sum + q.waitTime, 0) / QUEUE_LOCATIONS.length * 10
    ) / 10,
    staffOnDuty: 127,
    staffAvailable: 119,
    staffDispatched: 8,
  };
}

export function updateSimulatedData(prev) {
  const zoneDensities = { ...prev.zoneDensities };
  let totalAttendance = 0;

  ZONES.forEach(zone => {
    const old = zoneDensities[zone.id];
    const newOccupancy = clamp(vary(old.occupancy, rand(2, 6)), 30, 98);
    const newPeople = Math.round((newOccupancy / 100) * zone.capacity);
    zoneDensities[zone.id] = { ...old, occupancy: newOccupancy, people: newPeople };
    totalAttendance += newPeople;
  });

  const queues = { ...prev.queues };
  QUEUE_LOCATIONS.forEach(loc => {
    const old = queues[loc.id];
    const newWaitTime = clamp(vary(old.waitTime, rand(3, 8)), 1, 25);
    const newQueueLength = clamp(vary(old.queueLength, rand(3, 10)), 2, 80);
    const history = [...old.history.slice(1), newWaitTime];
    queues[loc.id] = { ...old, waitTime: newWaitTime, queueLength: newQueueLength, history };
  });

  const now = Date.now();
  const newCrowdPoint = {
    time: 'now',
    total: totalAttendance,
    zoneAvg: Math.round(totalAttendance / ZONES.length),
    threshold: TOTAL_CAPACITY * 0.9,
  };

  const crowdHistory = [...prev.crowdHistory.slice(1), newCrowdPoint].map((p, i, arr) => ({
    ...p,
    time: `${-30 + i * 5}m`,
  }));

  const predictionData = prev.predictionData.map((p, i) => ({
    ...p,
    predicted: vary(p.predicted, 2),
    upper: vary(p.upper, 2),
    lower: vary(p.lower, 2),
  }));

  // Random chance to add new event
  const events = [...prev.events];
  if (Math.random() < 0.05) {
    const eventTypes = ['critical', 'warning', 'success', 'info'];
    const eventMessages = [
      { type: 'critical', msg: `${ZONES[rand(0, 5)].name} — Density exceeding safe limits` },
      { type: 'warning', msg: `${QUEUE_LOCATIONS[rand(0, 5)].name} — Wait time increasing` },
      { type: 'success', msg: `Staff rotation completed in ${ZONES[rand(0, 5)].name}` },
      { type: 'info', msg: 'System health check passed — all sensors online' },
    ];
    const evt = eventMessages[rand(0, 3)];
    events.push({ id: now, type: evt.type, message: evt.msg, time: now });
    if (events.length > 20) events.shift();
  }

  const alerts = [...prev.alerts];
  if (Math.random() < 0.03) {
    const zone = ZONES[rand(0, 5)];
    alerts.push({
      id: now,
      type: Math.random() > 0.5 ? 'critical' : 'warning',
      zone: zone.name,
      message: `${zone.name} — Density at ${zoneDensities[zone.id].occupancy}%`,
      time: now,
    });
    if (alerts.length > 10) alerts.shift();
  }

  return {
    ...prev,
    totalAttendance,
    zoneDensities,
    queues,
    crowdHistory,
    predictionData,
    alerts,
    events,
    avgQueueWait: Math.round(
      Object.values(queues).reduce((sum, q) => sum + q.waitTime, 0) / QUEUE_LOCATIONS.length * 10
    ) / 10,
    staffOnDuty: clamp(vary(prev.staffOnDuty, 1), 120, 140),
    staffAvailable: clamp(vary(prev.staffAvailable, 2), 100, 135),
    staffDispatched: clamp(vary(prev.staffDispatched, 5), 3, 20),
  };
}
