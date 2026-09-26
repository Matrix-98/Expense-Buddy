import React, { useState } from 'react';
import {
  Wallet,
  ArrowRightLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Plus,
  User,
  PieChart,
  HandCoins,
  Target,
  ListOrdered,
  LayoutDashboard,
  CalendarClock,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatMonthYear } from '../utils/formatters';
import { getTranslation } from '../utils/translations';
import { PWAInstallButton } from './PWAInstallButton';
import { LanguageSelector } from './LanguageSelector';
import { ProfileModal } from './ProfileModal';
import { ExportReportModal } from './ExportReportModal';
import { TransferModal } from './Modals/TransferModal';
import { TransactionModal } from './Modals/TransactionModal';

export type NavTab =
  | 'dashboard'
  | 'wallets'
  | 'debts'
  | 'recurring'
  | 'savings'
  | 'transactions'
  | 'analytics';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { user, language, selectedMonth, setSelectedMonth } = useFinance();

  const [showProfile, setShowProfile] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showAddTx, setShowAddTx] = useState(false);

  // Month navigation (Req 7.1)
  const handlePrevMonth = () => {
    const [y, m] = selectedMonth.split('-').map(Number);
    const d = new Date(y, m - 2, 1);
    const newMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    setSelectedMonth(newMonth);
  };

  const handleNextMonth = () => {
    const [y, m] = selectedMonth.split('-').map(Number);
    const d = new Date(y, m, 1);
    const newMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    setSelectedMonth(newMonth);
  };

  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'dashboard',
      label: getTranslation('dashboard', language),
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'wallets',
      label: getTranslation('wallets', language),
      icon: <Wallet className="w-4 h-4" />,
    },
    {
      id: 'debts',
      label: getTranslation('debts', language),
      icon: <HandCoins className="w-4 h-4" />,
    },
    {
      id: 'recurring',
      label: getTranslation('recurring', language),
      icon: <CalendarClock className="w-4 h-4" />,
    },
    {
      id: 'savings',
      label: getTranslation('savings', language),
      icon: <Target className="w-4 h-4" />,
    },
    {
      id: 'transactions',
      label: getTranslation('transactions', language),
      icon: <ListOrdered className="w-4 h-4" />,
    },
    {
      id: 'analytics',
      label: getTranslation('analytics', language),
      icon: <PieChart className="w-4 h-4" />,
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-gray-950 font-black shadow-lg shadow-emerald-500/20">
                <Wallet className="w-5 h-5 text-gray-950" />
              </div>
              <div>
                <h1 className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
                  <span>{getTranslation('appName', language)}</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Smart
                  </span>
                </h1>
                <p className="text-[11px] text-gray-400">
                  {getTranslation('appSubtitle', language)}
                </p>
              </div>
            </div>

            {/* Month Navigator */}
            <div className="hidden lg:flex items-center bg-gray-900/90 border border-gray-800 rounded-xl p-1 text-xs">
              <button
                onClick={handlePrevMonth}
                title="Previous Month"
                className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <div className="px-2.5 font-semibold text-gray-200 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span className="whitespace-nowrap">{formatMonthYear(selectedMonth)}</span>
              </div>
              <button
                onClick={handleNextMonth}
                title="Next Month"
                className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Action Buttons & Tools */}
            <div className="flex items-center gap-2">
              {/* Language Switcher Dropdown */}
              <LanguageSelector />

              {/* Quick Transfer Button */}
              <button
                onClick={() => setShowTransfer(true)}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-950/40 hover:bg-violet-900/40 text-violet-300 border border-violet-500/30 text-xs font-semibold transition"
                title="Transfer funds between wallets"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>{getTranslation('transferFunds', language)}</span>
              </button>

              {/* Export Report */}
              <button
                onClick={() => setShowExport(true)}
                className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 text-xs font-medium transition"
                title="Export monthly PDF and CSV report"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>{getTranslation('exportReport', language)}</span>
              </button>

              {/* PWA Download & Install Button */}
              <PWAInstallButton />

              {/* User Profile Avatar / Trigger */}
              {user && (
                <button
                  onClick={() => setShowProfile(true)}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-gray-900 border border-gray-800 hover:border-gray-700 transition"
                  title="Manage Profile & Currency"
                >
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="w-7 h-7 rounded-full object-cover border border-emerald-500/40"
                  />
                  <div className="text-left hidden sm:block">
                    <span className="block text-xs font-bold text-gray-200 leading-tight">
                      {user.fullName}
                    </span>
                    <span className="block text-[10px] font-mono text-emerald-400 leading-tight">
                      {user.currency} ({user.currencySymbol})
                    </span>
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Navigation Bar Links */}
          <nav className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none border-t border-gray-900">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-gray-800 text-white shadow-sm border border-gray-700/80'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900/60'
                  }`}
                >
                  <span className={isActive ? 'text-emerald-400' : 'text-gray-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Modals */}
      <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
      <ExportReportModal isOpen={showExport} onClose={() => setShowExport(false)} />
      <TransferModal isOpen={showTransfer} onClose={() => setShowTransfer(false)} />
      <TransactionModal isOpen={showAddTx} onClose={() => setShowAddTx(false)} />
    </>
  );
};
