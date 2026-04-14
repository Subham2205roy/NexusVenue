# NexusVenue

> Next-generation crowd intelligence & venue management platform

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-000000?style=flat&logo=vercel)](https://nexus-venue-ten.vercel.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase)](https://supabase.com)

NexusVenue empowers stadium managers and event coordinators to monitor crowd density, optimize staff distribution, and respond to emergencies in real time — using AI-driven insights and live data visualization.

---

## 🚀 Detailed Features & Use Cases

### 🤖 1. AI Command Center (NexusAI)
The heart of the platform. NexusAI isn't just a chatbot; it’s a context-aware virtual operations manager.

*   **Micro-Features**:
    *   **Situational Awareness**: The AI starts every session with a "live brief," having analyzed your current attendance (e.g., "Monitoring 42k attendees...") and critical bottlenecks.
    *   **Prompt Suggestion Chips**: One-tap shortcuts for common queries like "Generate incident report" or "Staff efficiency."
    *   **Dynamic Recommendations**: Sidebar cards that suggest specific actions (e.g., "Redirect Gate C overflow") with a one-click **"Apply"** button to execute.
    *   **Situational HUD**: A mini-dashboard integrated into the chat view showing Attendance, Active Alerts, Available Staff, and Average Queue times.
*   **Use Cases**:
    *   **Incident Response**: *"There's a spill at Section 214, send a cleanup crew and redirect traffic."*
    *   **Predictive Analysis**: *"Based on current gate arrivals, when will we hit 90% capacity?"*
    *   **Operational Reports**: Quickly summarizing a match day's performance for board-level review.

### 🗺️ 2. Interactive Stadium Heatmap (The Bird's Eye)
A high-fidelity spatial overview of your entire property, color-coded by crowd density.

*   **Micro-Features**:
    *   **Layered Visualization**: Toggleable layers for **Staff GPS dots**, **Gate status**, and **Food Court markers**.
    *   **Deep-Hover Tooltips**: Hover over any zone to see precise headcounts, maximum capacity, and AI-suggested mitigations.
    *   **Visual Pulsing**: Zones exceeding 90% occupancy pulse with a "critical red" border to immediately draw the eye.
    *   **Critical Action Sidebar**: Automatically detects the 3 "trouble zones" and provides instant **Dispatch** and **Open Gate** buttons.
*   **Use Cases**:
    *   **Safety Monitoring**: Preventing crushes by spotting density buildups before they become dangerous.
    *   **Revenue Optimization**: Identifying high-traffic areas near concessions to optimize vendor placement.

### 👥 3. Staff Control & Task Board (Kanban Operations)
A comprehensive system to manage your most valuable asset: your people.

*   **Micro-Features**:
    *   **Smart Roster**: Searchable staff list with role-based avatars and live status indicators (Available, Dispatched, On-Break).
    *   **Precision Dispatching**: Multi-tier dispatch modal where you select the **Zone**, **Task Category** (Crowd Control, Medical, Cleaning), and **Priority**.
    *   **Automated Kanban Board**: Tasks automatically move from **Pending** to **In Progress** based on time-elapsed triggers.
    *   **One-Click Escalation**: Spot a task taking too long? One click escalates it to **URGENT**, alerting all regional managers.
    *   **Efficiency Radar**: A radar chart analyzing staff performance across all venue zones to find your top-performing teams.
*   **Use Cases**:
    *   **Medical Emergencies**: Instantly dispatching a medic to a specific zone with "High" priority notes.
    *   **Shift Management**: Tracking who is on break versus active to ensure mandatory coverage levels.

### ⏱️ 4. Queue Monitoring & Prediction
Stop the frustration of long wait times before they reach the social media complaint stage.

*   **Micro-Features**:
    *   **Category Filtering**: Sort queues by Gates, Food Stalls, Washrooms, or Parking exits.
    *   **Historical Sparklines**: Small mini-charts in every queue card showing the last 30 minutes of wait-time trends.
    *   **Throughput Controls**: Buttons to "Add Staff" or "Open Counter" that instantly simulate a reduction in wait times.
    *   **Trend Analysis**: A global line chart plotting all location wait times against **Target** and **Critical** thresholds.
*   **Use Cases**:
    *   **Gate Management**: Opening secondary gates (Gate F) when Gate C hits 15-minute wait times.
    *   **Concession Flow**: Reassigning staff from quiet burger stands to busy beverage stations during halftime.

---

## Tech stack

| Layer | Technology | Philosophy |
|---|---|---|
| **Frontend** | [React 19](https://reactjs.org/) | Utilizing the latest "Concurrent React" for a buttery-smooth UI. |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) | Subtle micro-animations for high-end "Premium" feel. |
| **Database** | [Supabase](https://supabase.com/) | Real-time PostgreSQL row-level security and lightning-fast queries. |
| **Logic** | [Express 5](https://expressjs.com/) | Robust serverless-ready routing for all authentication and AI calls. |
| **AI** | [Gemini Pro](https://ai.google.dev/) | Google's most capable multimodal AI for venue reasoning. |
| **Styling** | [Tailwind 4](https://tailwindcss.com/) | Next-gen CSS-first utility framework. |

---

## 📦 Components Spotlight

- **MetricCard**: Reusable, animated dashboard widgets with trend indicators.
- **DataSimulator**: A high-complexity utility that mimics real-world crowd fluctuations so the platform is always "alive."
- **StaffRadar**: Uses D3-style Canvas rendering to visualize complex performance data.
- **GaugeChart**: High-visibility safety occupancy gauges for critical zones.

---

## 🚀 Getting Started

1. **Clone & Install**:
   ```bash
   git clone https://github.com/Subham2205roy/NexusVenue.git
cd NexusVenue
```

**2. Install dependencies**

```bash
   npm install
   ```

**3. Configure environment variables**

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_JWT_SECRET=your_secret_signing_key
```

**4. Start the development server**

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Deployment

NexusVenue is optimized for **Vercel**.

1. Connect your GitHub repository to Vercel.
2. Add the four environment variables from the `.env` section in the Vercel dashboard.
3. Vercel auto-detects the Vite build config and the Express serverless function in `/api`.
4. Click **Deploy**.

---

## Roadmap

- [ ] Multi-venue support for stadium chains
- [ ] CCTV / camera AI integration for automated headcounts
- [ ] Mobile app for on-site staff communication
- [ ] Offline-first persistence for emergency scenarios

---

## License

Released under the [MIT License](./LICENSE).

---

*Powered by [NexusVenue](https://nexus-venue-ten.vercel.app)*
