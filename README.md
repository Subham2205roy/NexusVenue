# 🏟️ NexusVenue: Next-Gen Crowd Intelligence & Venue Management

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-000000?style=flat&logo=vercel)](https://nexus-venue-ten.vercel.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase)](https://supabase.com)

**NexusVenue** is a state-of-the-art venue management platform designed for the modern era. Using AI-driven insights and real-time data visualization, it empowers stadium managers and event coordinators to monitor crowd density, optimize staff distribution, and respond to emergencies with surgical precision.

---

## ✨ Key Features

### 🤖 AI Command Center
Control your entire venue using natural language. Powered by **Google Gemini**, the Command Center translates your text prompts into actionable operations—generating reports, reassigning staff, or analyzing historical trends instantly.

### 🗺️ Dynamic Heatmap Visualization
Real-time 2D/3D rendering of venue zones. Instantly identify "hotspots" where crowd density exceeds safety thresholds and visually track the flow of attendees across the property.

### 📊 Real-Time Analytics Dashboard
A high-fidelity monitoring suite featuring:
- **Total Attendance**: Live headcounts across all zones.
- **Queue Monitor**: Predictive wait-time analysis and length tracking for concessions and gates.
- **Staff Status**: Real-time GPS-style tracking of available, on-duty, and dispatched personnel.

### 🚨 Smart Alert System
Proactive monitoring that triggers critical alerts when:
- Occupancy exceeds 85% in any zone.
- Queue wait times exceed 15 minutes.
- Priority incidents require immediate staff dispatch.

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://reactjs.org/) & [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **Backend**: [Node.js](https://nodejs.org/) & [Express 5](https://expressjs.com/)
- **Database / Auth**: [Supabase](https://supabase.com/) (PostgreSQL + Auth)
- **AI Engine**: [Google Gemini Pro](https://ai.google.dev/)
- **Data Visualization**: [Recharts](https://recharts.org/) & [Chart.js](https://www.chartjs.org/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- A Supabase Project (URL & Anon Key)
- A Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Subham2205roy/NexusVenue.git
   cd NexusVenue
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add the following:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_JWT_SECRET=your_secret_signing_key
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

---

## 🌐 Deployment

NexusVenue is optimized for hosting on **Vercel**.

1. Connect your GitHub repository to Vercel.
2. In the "Environment Variables" section of the Vercel dashboard, add the four keys mentioned in the `.env` section above.
3. Vercel will automatically detect the Vite build settings and the Express Serverless Function in `/api`.
4. Click **Deploy**.

---

## 🛣️ Roadmap

- [ ] Multi-venue support for stadium chains.
- [ ] Direct integration with CCTV/Camera AI models for automated headcounts.
- [ ] Mobile App for on-site staff communication.
- [ ] Offline-first persistence for emergency offline scenarios.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

*Powered by [NexusVenue](https://nexus-venue-ten.vercel.app)*
