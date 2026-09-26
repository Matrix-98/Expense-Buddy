import React from 'react';
import {
  Wallet,
  ArrowRight,
  HandCoins,
  ArrowRightLeft,
  Target,
  PieChart,
  ShieldCheck,
  CheckCircle,
  MessageSquare,
  Sparkles,
  Smartphone,
  Download,
  Users,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { PWAInstallButton } from './PWAInstallButton';
import { AppLogo } from './AppLogo';

export const LandingPage: React.FC = () => {
  const { setAppScreen, quickDemoLogin } = useFinance();

  return (
    <div className="min-h-screen bg-[#0B0F17] text-gray-100 flex flex-col selection:bg-emerald-500 selection:text-black">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AppLogo size="sm" />
            <div>
              <span className="text-base font-extrabold text-white tracking-tight leading-none block">
                Expense Buddy
              </span>
              <span className="block text-[10px] text-emerald-400 font-semibold tracking-wider uppercase mt-0.5">
                Finance & IOU Made Simple
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <PWAInstallButton />
            <button
              onClick={() => setAppScreen('login')}
              className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold transition"
            >
              Log In
            </button>
            <button
              onClick={() => setAppScreen('login')}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition active:scale-95"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 relative">
          {/* Mascot Brand Hero Feature */}
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full scale-110 pointer-events-none" />
              <div className="w-28 h-28 sm:w-36 sm:h-36 mx-auto relative drop-shadow-2xl transition-transform hover:scale-105 duration-300">
                <img
                  src="/logo.svg"
                  alt="Expense Buddy Mascot"
                  className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(16,185,129,0.25)]"
                />
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Effortless Money & Debt Tracking</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Meet <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Expense Buddy</span>.
            <br />
            Finance without the overwhelm.
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-400 leading-relaxed">
            No endless spreadsheets or confusing charts. An uncluttered dashboard of your net worth,
            money lent to friends with one-tap WhatsApp reminders, clean wallet transfers, and automated savings milestones.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setAppScreen('login')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-gray-950 font-bold text-sm shadow-xl shadow-emerald-500/20 transition active:scale-95"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={quickDemoLogin}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-700/80 font-semibold text-sm transition active:scale-95"
            >
              <span>Explore Instant Demo (BDT ৳)</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-6 pt-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Default BDT (৳) Currency
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              WhatsApp Reminders
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Offline & PWA Installable
            </span>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars Grid */}
      <section className="py-12 bg-gray-950/60 border-y border-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-white tracking-tight">Everything in One Place</h2>
            <p className="text-xs text-gray-400 mt-1">
              Totals at a glance, with deep controls only when you need them.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Multi-Wallet Transfers */}
            <div className="p-5 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center border border-violet-500/30">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Multi-Wallet Transfers</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Move cash from Bank to Cash or bKash seamlessly without corrupting your Net Worth or inflating expenses.
              </p>
            </div>

            {/* 2. Debt & IOU Reminders */}
            <div className="p-5 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <HandCoins className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">IOUs & WhatsApp Alerts</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Log money lent and borrowed. Partial repayments auto-update your wallets. Friendly WhatsApp links notify borrowers instantly.
              </p>
            </div>

            {/* 3. Targeted Savings */}
            <div className="p-5 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Savings Goals</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Save for a New PC, vehicle, or rainy day buffer. Visual percentage progress bars keep you on track.
              </p>
            </div>

            {/* 4. Monthly Reports */}
            <div className="p-5 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <PieChart className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Audited Reports</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Month-by-month financial statements, category donut distributions, and one-click PDF/CSV statement exports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 text-center text-xs text-gray-500 border-t border-gray-900">
        <p>© 2026 Expense Buddy • Modern, simple personal finance</p>
      </footer>
    </div>
  );
};
