import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Hexagon, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

function CountUpStat({ target, suffix = '' }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const start = Date.now();
    const duration = 1500;
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(target * eased);
      if (progress < 1) ref.current = requestAnimationFrame(animate);
    };
    ref.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(ref.current);
  }, [target]);

  const display = target >= 1000 ? `${(val / 1000).toFixed(val >= target ? 1 : 0)}k` :
    target < 10 ? val.toFixed(1) : Math.round(val).toLocaleString();

  return <span>{display}{suffix}</span>;
}

export default function Landing() {
  const navigate = useNavigate();
  const { setRole } = useApp();

  const [authMode, setAuthMode] = useState('manager'); // 'manager' | 'staff'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password', { style: { background: '#141B2D', color: '#F1F5F9', border: '1px solid #1E2A45' } });
      return;
    }

    setIsLoggingIn(true);
    // Simulate network authentication delay for realism
    await new Promise(res => setTimeout(res, 1200));
    setIsLoggingIn(false);

    setRole(authMode);
    toast.success(`Welcome back, ${authMode === 'manager' ? 'Command' : 'Field'} Team`, { style: { background: '#141B2D', color: '#F1F5F9', border: '1px solid #10B981' } });
    navigate('/dashboard');
  };

  const stats = [
    { label: 'Fans Managed', value: 50000, suffix: '+' },
    { label: 'Uptime', value: 99.2, suffix: '%' },
    { label: 'Avg Response', value: 3.2, suffix: 's' },
    { label: 'Active Zones', value: 12, suffix: '' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#050505] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-40 pointer-events-none"
        style={{ background: 'radial-gradient(circle at top, rgba(0, 212, 255, 0.15), transparent 60%)' }}></div>

      {/* Optional subtle grid texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#141414] border border-white/10 shadow-[0_0_30px_rgba(0,212,255,0.15)] mb-6">
            <Hexagon size={28} className="text-accent-cyan" />
          </div>
          <h1 className="text-[28px] font-bold text-white text-center tracking-tight mb-3 leading-tight">
            Sign in to unlock the full potential of NexusVenue.
          </h1>
          <p className="text-[13px] text-gray-500 text-center font-medium">
            By continuing, you agree to our <a href="#" className="text-gray-400 underline underline-offset-4 hover:text-white transition-colors">operational policy.</a>
          </p>
        </div>

        {/* Premium Bevel Wrapper */}
        <div className="relative p-[1px] rounded-[28px] bg-gradient-to-b from-white/15 via-white/5 to-transparent shadow-2xl">
          <div className="rounded-[27px] bg-[#0A0A0A] p-6 sm:p-8 backdrop-blur-2xl">

            {/* Role Tabs */}
            <div className="flex bg-[#141414] rounded-2xl p-1.5 mb-6 border border-white/5 shadow-inner">
              <button
                onClick={() => { setAuthMode('manager'); setEmail(''); setPassword(''); }}
                className={`flex-1 py-3 text-[13px] font-bold rounded-xl transition-all duration-300 ${authMode === 'manager' ? 'bg-[#2A2A2A] text-white shadow-md border border-white/10' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Manager
              </button>
              <button
                onClick={() => { setAuthMode('staff'); setEmail(''); setPassword(''); }}
                className={`flex-1 py-3 text-[13px] font-bold rounded-xl transition-all duration-300 ${authMode === 'staff' ? 'bg-[#2A2A2A] text-white shadow-md border border-white/10' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Field Staff
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={authMode === 'manager' ? 'manager@nexusvenue.com' : 'staff@nexusvenue.com'}
                    className="w-full px-5 py-4 bg-[#141414] border border-white/5 rounded-2xl text-[14px] text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all shadow-inner"
                  />
                </div>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your security code"
                  className="w-full px-5 py-4 bg-[#141414] border border-white/5 rounded-2xl text-[14px] text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all shadow-inner"
                />
                <a href="#" className="absolute right-5 top-1/2 -translate-y-1/2 text-[12px] font-bold text-gray-500 hover:text-white transition-colors">
                  Forgot?
                </a>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-4 rounded-2xl font-bold text-[15px] transition-all duration-300 flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200 disabled:opacity-70 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                >
                  {isLoggingIn ? <Loader2 size={20} className="animate-spin text-black" /> : 'Continue with credentials'}
                </button>
              </div>
            </form>

            <div className="text-center mt-6 pt-6">
              <a href="#" className="text-[13px] font-bold text-gray-600 hover:text-white transition-colors tracking-wide">
                Close
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
