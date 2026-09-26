import React, { useState } from 'react';
import {
  Wallet,
  ArrowLeft,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Shield,
  Smartphone,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export const LoginPage: React.FC = () => {
  const { loginWithSocial, quickDemoLogin, setAppScreen } = useFinance();

  const [mode, setMode] = useState<'signin' | 'signup' | 'phone'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');

  // Google Login Simulation
  const handleGoogleLogin = () => {
    loginWithSocial('google', 'google_user@gmail.com', 'Google User');
  };

  // Facebook Login Simulation
  const handleFacebookLogin = () => {
    loginWithSocial('facebook', 'fb_user@facebook.com', 'Facebook Member');
  };

  // Email / Password Form Submit
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please provide a valid email address.');
      return;
    }
    setError('');
    loginWithSocial('email', email.trim().toLowerCase(), name.trim() || undefined);
  };

  // Phone Login Submit
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      setError('Please enter a valid phone number.');
      return;
    }
    setError('');
    setOtpSent(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.length < 4) {
      setError('Please enter a 4-digit verification code.');
      return;
    }
    setError('');
    loginWithSocial('phone', `${phoneNumber.replace(/[^\d+]/g, '')}@phone.expensebuddy.com`, 'Phone User');
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-gray-100 flex flex-col justify-center items-center p-4 selection:bg-emerald-500 selection:text-black">
      {/* Back button */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between">
        <button
          onClick={() => setAppScreen('landing')}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <span className="text-[11px] text-emerald-400 font-mono">Expense Buddy Auth</span>
      </div>

      {/* Main Auth Card */}
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Brand */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-gray-950 font-black shadow-lg shadow-emerald-500/20 mx-auto mb-3">
            <Wallet className="w-6 h-6 text-gray-950" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {mode === 'signup'
              ? 'Create Your Account'
              : mode === 'phone'
              ? 'Phone Number Sign In'
              : 'Welcome Back'}
          </h2>
          <p className="text-xs text-gray-400">
            {mode === 'signup'
              ? 'Join Expense Buddy to begin managing your money & IOUs'
              : 'Choose your preferred way to access your finances'}
          </p>
        </div>

        {/* Demo Fast Track Button */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between gap-3">
          <div className="text-xs">
            <span className="font-bold text-emerald-300 block flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Instant Demo Access
            </span>
            <span className="text-emerald-400/80 text-[11px]">
              Explore with demo balances in BDT (৳)
            </span>
          </div>
          <button
            onClick={quickDemoLogin}
            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs rounded-xl shadow-sm transition active:scale-95 whitespace-nowrap"
          >
            Launch Demo
          </button>
        </div>

        {/* Social Login Options (Requirement: Google, Facebook, Phone number) */}
        {mode !== 'phone' && (
          <div className="space-y-2.5">
            {/* Google */}
            <button
              onClick={handleGoogleLogin}
              className="w-full py-2.5 px-4 rounded-xl bg-gray-800 hover:bg-gray-750 text-white border border-gray-700 font-semibold text-xs flex items-center justify-center gap-3 transition active:scale-[0.98]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Facebook */}
            <button
              onClick={handleFacebookLogin}
              className="w-full py-2.5 px-4 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] border border-[#1877F2]/30 font-semibold text-xs flex items-center justify-center gap-3 transition active:scale-[0.98]"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Continue with Facebook</span>
            </button>

            {/* Phone Number */}
            <button
              onClick={() => setMode('phone')}
              className="w-full py-2.5 px-4 rounded-xl bg-gray-800 hover:bg-gray-750 text-cyan-400 border border-cyan-500/30 font-semibold text-xs flex items-center justify-center gap-3 transition active:scale-[0.98]"
            >
              <Smartphone className="w-4 h-4" />
              <span>Continue with Phone Number</span>
            </button>
          </div>
        )}

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-800 w-full" />
          <span className="bg-gray-900 px-3 text-[11px] text-gray-500 uppercase tracking-wider">
            {mode === 'phone' ? 'Phone Verification' : 'or with email'}
          </span>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Mode: Phone Verification Flow */}
        {mode === 'phone' ? (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Mobile Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-gray-400 font-mono">
                      🇧🇩 +880
                    </span>
                    <input
                      type="tel"
                      required
                      autoFocus
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="1711223344"
                      className="w-full pl-20 pr-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm font-mono"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-gray-500">
                    We will send a 4-digit SMS verification code to this number.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs shadow-md transition active:scale-95"
                >
                  Send Verification SMS
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Enter 4-Digit SMS Code
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    required
                    autoFocus
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="1234"
                    className="w-full px-4 py-2.5 text-center tracking-widest text-lg font-mono rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <p className="mt-1 text-[11px] text-gray-500 text-center">
                    Enter code 1234 (Demo instant code)
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs shadow-md transition active:scale-95"
                >
                  Verify & Enter Account
                </button>
              </form>
            )}

            <button
              onClick={() => {
                setMode('signin');
                setOtpSent(false);
              }}
              className="w-full text-center text-xs text-gray-400 hover:text-white pt-2 block"
            >
              ← Use Email / Other methods
            </button>
          </div>
        ) : (
          /* Mode: Email Form */
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Abdur Rahman"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs shadow-md transition active:scale-95"
            >
              {mode === 'signup' ? 'Create Account & Adjust Balances' : 'Sign In'}
            </button>

            {/* Toggle signin / signup */}
            <div className="text-center pt-2">
              {mode === 'signup' ? (
                <p className="text-xs text-gray-400">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="text-emerald-400 hover:underline font-semibold"
                  >
                    Sign In
                  </button>
                </p>
              ) : (
                <p className="text-xs text-gray-400">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-emerald-400 hover:underline font-semibold"
                  >
                    Sign Up Free
                  </button>
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
