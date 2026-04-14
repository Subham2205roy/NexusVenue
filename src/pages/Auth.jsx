import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Loader2, Eye, EyeOff, Hexagon, X } from 'lucide-react';
import toast from 'react-hot-toast';

function getPasswordStrength(value) {
    if (!value) {
        return { level: 0, label: 'No password', barClass: 'bg-white/20', textClass: 'text-white/50' };
    }

    let score = 0;
    if (value.length >= 8) score += 1;
    if (/[A-Z]/.test(value)) score += 1;
    if (/[a-z]/.test(value)) score += 1;
    if (/\d/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value)) score += 1;

    if (score <= 2) {
        return { level: 1, label: 'Weak', barClass: 'bg-rose-500', textClass: 'text-rose-300' };
    }
    if (score <= 4) {
        return { level: 2, label: 'Fair', barClass: 'bg-amber-500', textClass: 'text-amber-300' };
    }
    if (score === 5 && value.length < 12) {
        return { level: 3, label: 'Good', barClass: 'bg-lime-500', textClass: 'text-lime-300' };
    }
    return { level: 4, label: 'Strong', barClass: 'bg-emerald-500', textClass: 'text-emerald-300' };
}

export default function Auth() {
    const navigate = useNavigate();
    const { login, register } = useApp();

    // State
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [confirmRegisterPassword, setConfirmRegisterPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);
    const [showConfirmRegisterPassword, setShowConfirmRegisterPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const passwordStrength = useMemo(() => getPasswordStrength(registerPassword), [registerPassword]);
    const passwordsMatch = confirmRegisterPassword.length === 0 || registerPassword === confirmRegisterPassword;

    useEffect(() => {
        if (!showRegisterModal) {
            document.body.style.overflow = '';
            return;
        }

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setShowRegisterModal(false);
            }
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleEscape);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleEscape);
        };
    }, [showRegisterModal]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const res = await login(email.trim(), password);
        setIsSubmitting(false);

        if (res.success) {
            toast.success('Authenticated.', { style: { background: '#000', color: '#FFF', border: '1px solid #FFF' } });
            navigate('/dashboard');
        } else {
            toast.error(res.message);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (registerPassword !== confirmRegisterPassword) {
            toast.error('Passwords do not match.');
            return;
        }

        setIsSubmitting(true);
        const fullName = `${firstName} ${lastName}`.trim();
        const res = await register(fullName, registerEmail.trim(), registerPassword);
        setIsSubmitting(false);

        if (res.success) {
            toast.success('Account created. You may now sign in.', { style: { background: '#000', color: '#FFF', border: '1px solid #FFF' }, duration: 5000 });
            setShowRegisterModal(false);
            setFirstName('');
            setLastName('');
            setRegisterEmail('');
            setRegisterPassword('');
            setConfirmRegisterPassword('');
            setShowRegisterPassword(false);
            setShowConfirmRegisterPassword(false);
            // We removed navigate('/dashboard') here so the user stays on the login page!
        } else {
            toast.error(res.message);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-0 font-sans text-white relative overflow-x-hidden">

            <div className="absolute inset-0 bg-[#010101]" />

            <div className="w-full h-screen flex flex-col lg:flex-row overflow-hidden relative z-10">

                {/* Left Section: LOGIN */}
                <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 sm:px-10 lg:px-16 py-10 lg:py-16 transition-all duration-700">

                    <div className="w-full max-w-[360px]">
                        {/* Logo */}
                        <div className="flex items-center gap-3 mb-10 transition-all">
                            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                                <Hexagon className="w-7 h-7 text-white" strokeWidth={2.8} />
                            </div>
                            <span className="font-semibold text-[26px] tracking-[0.08em] uppercase">NexusVenue</span>
                        </div>

                        <div className="mb-8">
                            <h1 className="text-[48px] sm:text-[56px] lg:text-[60px] font-bold leading-[1.05] tracking-tight mb-4 uppercase">
                                SIGN IN
                            </h1>
                            <p className="text-white/45 text-[16px] leading-relaxed">
                                Access the high-fidelity venue oversight platform.
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="flex flex-col gap-8" autoComplete="off">
                            <div className="flex flex-col gap-5">
                                <div>
                                    <label htmlFor="auth-email" className="block text-[13px] font-medium text-white/70 mb-2">
                                        Email
                                    </label>
                                    <input
                                        id="auth-email"
                                        name="auth-email-address"
                                        type="email"
                                        autoComplete="off"
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="name@company.com"
                                        className="w-full h-11 rounded-xl border border-white/15 bg-[#111621] px-3.5 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/25 focus:border-transparent transition-all"
                                    />
                                </div>

                                <div className="relative">
                                    <label htmlFor="auth-password" className="block text-[13px] font-medium text-white/70 mb-2">
                                        Password
                                    </label>
                                    <input
                                        id="auth-password"
                                        name="auth-password-secret"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        required
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="Access key"
                                        className="w-full h-11 rounded-xl border border-white/15 bg-[#111621] px-3.5 pr-11 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/25 focus:border-transparent transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-[34px] text-white/50 hover:text-white transition-colors"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-start">
                                <button
                                    type="button"
                                    onClick={() => toast('Password reset is currently handled by your administrator.')}
                                    className="text-[13px] text-white/50 hover:text-white transition-colors underline underline-offset-4"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            <div className="mt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-white text-black hover:bg-neutral-200 font-semibold text-lg py-4 px-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 tracking-wide uppercase shadow-[0_20px_60px_rgba(255,255,255,0.05)]"
                                >
                                    {isSubmitting && !showRegisterModal ? <Loader2 className="animate-spin mx-auto" size={24} /> : "SIGN IN"}
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 pt-7 border-t border-white/10">
                            <button
                                type="button"
                                onClick={() => {
                                    setRegisterEmail(email);
                                    setRegisterPassword('');
                                    setConfirmRegisterPassword('');
                                    setShowRegisterPassword(false);
                                    setShowConfirmRegisterPassword(false);
                                    setShowRegisterModal(true);
                                }}
                                className="w-full h-11 rounded-xl border border-white/15 bg-transparent text-white/70 hover:text-white hover:bg-white/5 font-medium transition-all duration-300 text-[14px]"
                            >
                                Register user
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Section: Full-Bleed Visual */}
                <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1800&auto=format&fit=crop"
                        alt="Venue Operations Center"
                        className="absolute inset-0 w-full h-full object-cover grayscale brightness-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/35 via-black/55 to-black/85" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_24%,rgba(255,255,255,0.14),transparent_42%)]" />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent" />
                    <div className="absolute bottom-10 left-10 right-10">
                        <p className="text-xs uppercase tracking-[0.16em] text-white/60 mb-3">Venue Oversight</p>
                        <p className="text-3xl font-semibold leading-tight max-w-lg">
                            Coordinate every gate, corridor, and incident response from one live operations view.
                        </p>
                    </div>
                </div>

            </div>

            {/* REGISTRATION MODAL */}
            <div
                className={`fixed inset-0 z-[100] bg-black/80 backdrop-blur-md transition-opacity duration-200 ${showRegisterModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={(e) => e.target === e.currentTarget && setShowRegisterModal(false)}
                role="dialog"
                aria-modal="true"
                aria-hidden={!showRegisterModal}
            >
                <div
                    className={`absolute top-1/2 left-1/2 w-[calc(100vw-2rem)] max-w-[620px] max-h-[calc(100vh-2rem)] bg-[#0B0E14] border border-white/10 rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.7)] overflow-y-auto transform transition-all duration-300 ${showRegisterModal ? '-translate-x-1/2 -translate-y-1/2 scale-100 opacity-100' : '-translate-x-1/2 -translate-y-[45%] scale-[0.98] opacity-0'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="px-7 sm:px-9 pt-7 pb-6 border-b border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-3xl sm:text-[34px] font-semibold tracking-tight">Register user</h2>
                                <p className="text-sm text-white/50 mt-2">Add secure credentials for venue operations access.</p>
                            </div>
                            <button
                                onClick={() => setShowRegisterModal(false)}
                                className="h-10 w-10 inline-flex items-center justify-center rounded-lg border border-white/15 text-white/55 hover:text-white hover:border-white/30 hover:bg-white/5 transition-colors"
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleRegister} className="px-7 sm:px-9 py-7 sm:py-8 flex flex-col gap-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="register-first-name" className="block text-[13px] font-medium text-white/70 mb-2">
                                    First name
                                </label>
                                <input
                                    id="register-first-name"
                                    type="text"
                                    required
                                    value={firstName}
                                    onChange={e => setFirstName(e.target.value)}
                                    placeholder="John"
                                    className="w-full h-11 rounded-xl border border-white/15 bg-[#111621] px-3.5 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/25 focus:border-transparent transition-all"
                                />
                            </div>
                            <div>
                                <label htmlFor="register-last-name" className="block text-[13px] font-medium text-white/70 mb-2">
                                    Last name
                                </label>
                                <input
                                    id="register-last-name"
                                    type="text"
                                    required
                                    value={lastName}
                                    onChange={e => setLastName(e.target.value)}
                                    placeholder="Doe"
                                    className="w-full h-11 rounded-xl border border-white/15 bg-[#111621] px-3.5 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/25 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="register-email" className="block text-[13px] font-medium text-white/70 mb-2">
                                Email
                            </label>
                            <input
                                id="register-email"
                                type="email"
                                required
                                value={registerEmail}
                                onChange={e => setRegisterEmail(e.target.value)}
                                placeholder="john@company.com"
                                className="w-full h-11 rounded-xl border border-white/15 bg-[#111621] px-3.5 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/25 focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="relative">
                                <label htmlFor="register-password" className="block text-[13px] font-medium text-white/70 mb-2">
                                    Password
                                </label>
                                <input
                                    id="register-password"
                                    type={showRegisterPassword ? "text" : "password"}
                                    required
                                    minLength={8}
                                    value={registerPassword}
                                    onChange={e => setRegisterPassword(e.target.value)}
                                    placeholder="At least 8 characters"
                                    className="w-full h-11 rounded-xl border border-white/15 bg-[#111621] px-3.5 pr-11 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/25 focus:border-transparent transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                                    className="absolute right-3 top-[37px] text-white/50 hover:text-white transition-colors"
                                    aria-label={showRegisterPassword ? "Hide password" : "Show password"}
                                >
                                    {showRegisterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            <p className="text-[13px] text-white/60 mb-2">Use 8+ characters with a mix of letters and numbers.</p>

                            <div className="flex flex-col gap-2">
                                <div className="grid grid-cols-4 gap-2">
                                    {[0, 1, 2, 3].map((bar) => {
                                        const colors = ['bg-rose-500', 'bg-amber-500', 'bg-lime-500', 'bg-emerald-500'];
                                        return (
                                            <span
                                                key={bar}
                                                className={`h-1.5 rounded-full ${bar < passwordStrength.level ? colors[bar] : 'bg-white/10'}`}
                                            />
                                        );
                                    })}
                                </div>
                                <span className={`text-[14px] font-medium ${passwordStrength.textClass}`}>
                                    {passwordStrength.label ? `Strength: ${passwordStrength.label}` : ''}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="relative">
                                <label htmlFor="confirm-register-password" className="block text-[13px] font-medium text-white/70 mb-2">
                                    Confirm password
                                </label>
                                <input
                                    id="confirm-register-password"
                                    type={showConfirmRegisterPassword ? "text" : "password"}
                                    required
                                    minLength={8}
                                    value={confirmRegisterPassword}
                                    onChange={e => setConfirmRegisterPassword(e.target.value)}
                                    placeholder="Retype password"
                                    className={`w-full h-11 rounded-xl border px-3.5 pr-11 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${!passwordsMatch && confirmRegisterPassword ? 'border-rose-400/70 bg-rose-950/20 focus:ring-rose-300/30' : 'border-white/15 bg-[#111621] focus:ring-white/25'}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmRegisterPassword(!showConfirmRegisterPassword)}
                                    className="absolute right-3 top-[37px] text-white/50 hover:text-white transition-colors"
                                    aria-label={showConfirmRegisterPassword ? "Hide confirm password" : "Show confirm password"}
                                >
                                    {showConfirmRegisterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {!passwordsMatch && confirmRegisterPassword && (
                                <p className="text-[13px] text-rose-400">Passwords do not match.</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-6 mt-2 border-t border-white/10">
                            <button
                                type="button"
                                onClick={() => setShowRegisterModal(false)}
                                className="h-11 px-6 rounded-xl border border-white/20 bg-transparent text-sm font-medium text-white hover:border-white/40 hover:bg-white/5 transition-colors shrink-0"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || !passwordsMatch}
                                className="h-11 px-8 rounded-xl bg-white text-black hover:bg-neutral-200 text-sm font-semibold transition-colors disabled:opacity-60 shrink-0 min-w-[150px]"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={18} /> : "Register user"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: white !important;
          -webkit-box-shadow: 0 0 0px 1000px black inset !important;
          transition: background-color 10000s ease-in-out 0s !important;
        }
      `}} />
        </div>
    );
}
