import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Since this is in /scripts, resolve .env from the root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase Environment Variables!");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const simulateSensors = async () => {
    console.log('🏟️ NexusVenue Sensor Simulator Active.');
    console.log('📡 Feeding real-time IoT payloads to Supabase...');

    setInterval(async () => {
        try {
            // 1. Fetch current state
            const { data: zones } = await supabase.from('zones').select('id, occupancy, capacity, people');
            const { data: queues } = await supabase.from('queues').select('id, wait_time, queue_length, history');

            if (!zones || !queues) return;

            // 2. Simulate Zones Crowd Movement
            for (const zone of zones) {
                // Randomly fluctuate occupancy by -2% to +2%
                const change = Math.floor(Math.random() * 5) - 2;
                const newOccupancy = Math.max(10, Math.min(100, zone.occupancy + change));
                const newPeople = Math.floor(zone.capacity * (newOccupancy / 100));

                await supabase.from('zones')
                    .update({ occupancy: newOccupancy, people: newPeople, updated_at: new Date().toISOString() })
                    .eq('id', zone.id);
            }

            // 3. Simulate Queue Fluctuations
            for (const queue of queues) {
                let history = queue.history;
                if (typeof history === 'string') history = JSON.parse(history);
                if (!Array.isArray(history)) history = [];

                // Fluctuate wait time by -1 to +2 minutes
                const change = Math.floor(Math.random() * 4) - 1;
                const newWait = Math.max(1, queue.wait_time + change);
                const newLen = Math.max(0, queue.queue_length + (change * 3));

                history.push(newWait);
                if (history.length > 10) history.shift();

                const trend = newWait > queue.wait_time ? 'up' : (newWait < queue.wait_time ? 'down' : 'stable');

                await supabase.from('queues')
                    .update({
                        wait_time: newWait,
                        queue_length: newLen,
                        history: JSON.stringify(history),
                        trend,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', queue.id);
            }

            process.stdout.write('.'); // Visual tick indicator
        } catch (err) {
            console.error('\nSimulator Error:', err.message);
        }
    }, 4000); // 4-second intervals for fast visible changes on dashboard
};

simulateSensors();
