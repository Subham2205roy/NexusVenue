import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useApp } from '../../context/AppContext';
import AlertBanner from '../ui/AlertBanner';

export default function Layout() {
  const location = useLocation();
  const { data } = useApp();
  const criticalAlerts = data?.alerts?.filter(a => a.type === 'critical') || [];

  return (
    <div className="min-h-screen bg-bg-primary" style={{ display: 'flex' }}>
      <Sidebar />
      {/* Main content area - use fixed left padding to avoid sidebar overlap */}
      <div style={{ marginLeft: '240px', width: 'calc(100% - 240px)', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Topbar />
        {criticalAlerts.length > 0 && <AlertBanner alerts={criticalAlerts} />}
        <main style={{ flex: 1, padding: '24px', overflowY: 'auto', overflowX: 'hidden' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
