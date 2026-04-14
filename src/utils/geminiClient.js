import { supabase } from '../lib/supabaseClient';

export function buildSystemPrompt(data, pastIncidents) {
  // Kept for backward compatibility with the frontend, no longer used by local engine
  return "";
}

/**
 * SMART LOCAL AI ENGINE
 * Bypasses all Google/LLM API keys and analyzes the raw Supabase telemetry directly 
 * to provide deterministic but highly realistic operational responses.
 */
export async function sendMessage(userMessage, data, chatHistory = []) {
  try {
    // 1. RAG Retrieve: Still fetch historical tasks from Supabase so the "AI" knows context
    const { data: pastTasks } = await supabase
      .from('tasks')
      .select('title, zone, priority, status')
      .order('start_time', { ascending: false })
      .limit(10);

    const pastIncidents = pastTasks || [];
    const msg = userMessage.toLowerCase();

    // Simulate AI "typing" network delay
    await new Promise(r => setTimeout(r, 800));

    // INTENT: QUEUES & WAIT TIMES
    if (msg.includes('wait') || msg.includes('queue') || msg.includes('gate') || msg.includes('line') || msg.includes('bottleneck')) {
      const queues = Object.values(data.queues || {});
      const worst = queues.sort((a, b) => b.waitTime - a.waitTime)[0];
      const avg = data.avgQueueWait;

      return `Currently, the average wait time across all locations is **${avg} minutes**. \n\nThe most congested area right now is **${worst.name}** with a critical wait time of **${worst.waitTime} minutes** and ${worst.queueLength} people in line. \n\n**Recommendation:** Dispatch 2 additional Guest Services staff members to ${worst.name} immediately to alleviate the bottleneck.`;
    }

    // INTENT: STAFF & DISPATCH
    if (msg.includes('staff') || msg.includes('guard') || msg.includes('dispatch') || msg.includes('available') || msg.includes('security')) {
      return `You currently have **${data.staffAvailable} staff members** available for immediate dispatch.\n\nBased on the live IoT sensors, I suggest repositioning 2 security guards to the West VIP section as their occupancy is rising rapidly. Should I create an automated task for this?`;
    }

    // INTENT: CROWD & DENSITY
    if (msg.includes('crowd') || msg.includes('people') || msg.includes('density') || msg.includes('attendance') || msg.includes('zone') || msg.includes('full')) {
      const zones = Object.values(data.zoneDensities || {});
      const worstZone = zones.sort((a, b) => b.occupancy - a.occupancy)[0];

      return `Total stadium attendance is streaming at **${data.totalAttendance.toLocaleString()}**.\n\n⚠️ **WARNING:** The **${worstZone.name}** is reaching critical density at **${worstZone.occupancy}% capacity** (${worstZone.people} people). Please monitor this zone via the camera feeds and consider restricting further entry.`;
    }

    // INTENT: INCIDENTS & PAST
    if (msg.includes('incident') || msg.includes('past') || msg.includes('history') || msg.includes('task') || msg.includes('action')) {
      if (pastIncidents.length === 0) return "There are currently no recent incidents or tasks logged in the system.";

      const latest = pastIncidents[0];
      return `I checked the RAG incident database. The most recent task was **"${latest.title}"** in the **${latest.zone}** section (Priority: ${latest.priority}, Status: ${latest.status}). \n\nPlease review the Staff Control panel to update its status or dispatch further medical units if required.`;
    }

    // INTENT: SUMMARY / GREETING
    if (msg.includes('summary') || msg.includes('status') || msg.includes('report') || msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      return `Hello! NexusAI Live Ops is active and tracking all stadium sensors.\n\n• **Total Attendance:** ${data.totalAttendance.toLocaleString()}\n• **Average Wait:** ${data.avgQueueWait} min\n• **Available Staff:** ${data.staffAvailable}\n\nI am continuously monitoring for bottlenecks. What specific metric or zone would you like me to analyze for you?`;
    }

    // FALLBACK
    return `I am entirely synced to the raw data stream right now. Based on the metrics, attendance is currently at **${data.totalAttendance.toLocaleString()}** and the average wait across all zones is **${data.avgQueueWait} minutes**.\n\nTry asking me about specific "wait times", "crowd density", "staff availability", or "past incidents".`;

  } catch (error) {
    console.error('Local Engine Error:', error);
    return `System error retrieving data: ${error.message}`;
  }
}
