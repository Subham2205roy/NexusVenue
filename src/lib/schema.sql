-- NexusVenue Initial Database Schema & Seed Data
-- Paste and Run this entirely inside the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS zones (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  occupancy INTEGER NOT NULL DEFAULT 0,
  people INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS queues (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  wait_time INTEGER NOT NULL DEFAULT 0,
  queue_length INTEGER NOT NULL DEFAULT 0,
  staff INTEGER NOT NULL DEFAULT 0,
  trend TEXT NOT NULL DEFAULT 'stable',
  history JSONB DEFAULT '[]',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS staff (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available',
  zone TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  zone TEXT NOT NULL,
  staff_name TEXT NOT NULL,
  staff_id TEXT NOT NULL,
  priority TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  start_time BIGINT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  type TEXT NOT NULL,
  message TEXT NOT NULL
);

-- Enable Supabase Realtime for these tables
BEGIN;
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE zones, queues, staff, tasks, events;
COMMIT;

-- Seed Initial Mock Data
INSERT INTO zones (id, name, capacity, occupancy, people) VALUES
('north', 'North Stand', 25000, 82, 20500),
('south', 'South Stand', 25000, 68, 17000),
('east', 'East Pavilion', 15000, 45, 6750),
('west', 'West VIP', 8000, 92, 7360),
('concourse', 'Main Concourse', 12000, 55, 6600),
('foodcourt', 'Food Court A', 3000, 78, 2340)
ON CONFLICT (id) DO NOTHING;

INSERT INTO queues (id, name, type, wait_time, queue_length, staff, trend, history) VALUES
('g-north', 'North Gate', 'gate', 14, 185, 8, 'up', '[8,9,10,12,14]'),
('g-south', 'South Gate', 'gate', 5, 42, 6, 'stable', '[6,5,5,4,5]'),
('g-vip', 'VIP Entrance', 'gate', 2, 12, 4, 'down', '[5,4,3,2,2]'),
('f-main', 'Main Food Court', 'food', 22, 145, 12, 'up', '[10,12,18,20,22]'),
('f-east', 'East Snacks', 'food', 8, 35, 4, 'stable', '[8,8,7,8,8]'),
('p-main', 'Main Parking', 'parking', 4, 15, 3, 'down', '[12,10,8,6,4]'),
('p-vip', 'VIP Parking', 'parking', 1, 2, 2, 'stable', '[1,2,1,1,1]'),
('w-north', 'North Washrooms', 'washroom', 18, 45, 2, 'up', '[5,8,12,15,18]')
ON CONFLICT (id) DO NOTHING;

INSERT INTO staff (id, name, role, status, zone) VALUES
('s1', 'Marcus Chen', 'Security Lead', 'available', 'north'),
('s2', 'Elena Rodriguez', 'Crowd Control', 'dispatched', 'east'),
('s3', 'Jamal Washington', 'Medical Responder', 'available', 'south'),
('s4', 'Sarah Jenkins', 'Guest Services', 'on-break', 'concourse'),
('s5', 'David Kim', 'Security', 'available', 'foodcourt')
ON CONFLICT (id) DO NOTHING;
