import React, { useState } from 'react';
import {
  Wallet,
  ArrowRightLeft,
  ArrowUpRight,
  ArrowDownLeft,
  HandCoins,
  Target,
  Plus,
  Minus,
  PieChart,
  ListOrdered,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  CalendarClock,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { getTranslation } from '../utils/translations';
import { TransferModal } from './Modals/TransferModal';
import { TransactionModal } from './Modals/TransactionModal';
import { DebtModal } from './Modals/DebtModal';
import { FriendlyReminderModal } from './FriendlyReminderModal';
import { DebtRecord, TransactionType } from '../types/finance';
import { NavTab } from './Navbar';

interface SimplifiedDashboardViewProps {
  onNavigateTab: (tab: NavTab) => void;
}

export const SimplifiedDashboardView: React.FC<SimplifiedDashboardViewProps> = ({
  onNavigateTab,
}) => {
  const {
    user,
    language,
    wallets,
    transactions,
    debts,
    savingsGoals,
    recurringExpenses,
    totalNetWorth,
    totalMoneyLent,
    totalMoneyBorrowed,
    netDebtPosition,
    totalMonthlyRecurring,
    monthIncome,
    monthExpense,
  } = useFinance();

  const [showTransfer, setShowTransfer] = useState(false);
  const [showTxModal, setShowTxModal] = useState(false);
  const [txModalType, setTxModalType] = useState<TransactionType>('expense');
  const [showDebtModal, setShowDebtModal] = useState(false);
  const [reminderDebt, setReminderDebt] = useState<DebtRecord | null>(null);

  const activeDebts = debts.filter((d) => d.status === 'active');
  const totalSavedGoals = savingsGoals.reduce((sum, g) => sum + g.currentSavedAmount, 0);
  const totalTargetGoals = savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  const goalsPercentage =
    totalTargetGoals > 0
      ? Math.min(100, Math.round((totalSavedGoals / totalTargetGoals) * 100))
      : 0;

  // Recent 3 transactions for a quick, calm glance
  const recentTransactions = transactions.slice(0, 3);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. Welcoming Header & Direct Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-800/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {getTranslation('welcomeBack', language)}, {user?.fullName || 'User'}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Overview of your balances, debts, and monthly totals.
          </p>
        </div>

        {/* 3 Clear Primary Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              setTxModalType('expense');
              setShowTxModal(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white font-medium text-xs shadow-sm transition active:scale-95"
          >
            <Minus className="w-3.5 h-3.5" />
            <span>{getTranslation('logExpense', language)}</span>
          </button>

          <button
            onClick={() => {
              setTxModalType('income');
              setShowTxModal(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-medium text-xs shadow-sm transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{getTranslation('logIncome', language)}</span>
          </button>

          <button
            onClick={() => setShowTransfer(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 text-xs font-medium transition active:scale-95"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-400" />
            <span>{getTranslation('transferFunds', language)}</span>
          </button>
        </div>
      </div>

      {/* 2. Three Main Summary Figures (Clean, Legible, High Contrast) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1: Total Net Worth (Read-only as required) */}
        <div className="p-5 rounded-2xl bg-gray-900/90 border border-gray-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                {getTranslation('netWorth', language)}
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2 font-mono tracking-tight">
              {formatCurrency(totalNetWorth, user?.currency)}
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-800/80 text-xs text-gray-400 flex items-center justify-between">
            <span>{wallets.length} Active Accounts</span>
            <button
              onClick={() => onNavigateTab('wallets')}
              className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 text-xs"
            >
              Wallets <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Metric 2: Monthly Cash Flow */}
        <div className="p-5 rounded-2xl bg-gray-900/90 border border-gray-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Monthly Net Savings
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <PieChart className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2 font-mono tracking-tight">
              {formatCurrency(monthIncome - monthExpense, user?.currency)}
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-800/80 text-xs text-gray-400 flex items-center justify-between">
            <span>
              In: <strong className="text-emerald-400 font-mono">+{formatCurrency(monthIncome, user?.currency)}</strong> · Out: <strong className="text-rose-400 font-mono">-{formatCurrency(monthExpense, user?.currency)}</strong>
            </span>
            <button
              onClick={() => onNavigateTab('analytics')}
              className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1 text-xs"
            >
              Analytics <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Metric 3: Debt & IOU Position */}
        <div className="p-5 rounded-2xl bg-gray-900/90 border border-gray-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                {getTranslation('debtTotal', language)}
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <HandCoins className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2 font-mono tracking-tight">
              {netDebtPosition >= 0 ? '+' : '-'}
              {formatCurrency(Math.abs(netDebtPosition), user?.currency)}
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-800/80 text-xs text-gray-400 flex items-center justify-between">
            <span>
              Lent: <strong className="text-amber-400 font-mono">{formatCurrency(totalMoneyLent, user?.currency)}</strong> · Borrowed: <strong className="text-rose-400 font-mono">{formatCurrency(totalMoneyBorrowed, user?.currency)}</strong>
            </span>
            <button
              onClick={() => onNavigateTab('debts')}
              className="text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1 text-xs"
            >
              Debts <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Section Overview Cards (Totals for everything, then a button to go to that page) */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">
          App Sections & Totals
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* CARD 1: Wallets Overview */}
          <div className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800/80 hover:border-gray-700 transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-sm text-white">
                    {getTranslation('wallets', language)}
                  </span>
                </div>
                <span className="text-xs text-gray-400">{wallets.length} accounts</span>
              </div>

              <div className="text-xl font-bold text-white font-mono">
                {formatCurrency(totalNetWorth, user?.currency)}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Cash, Bank accounts, and Mobile wallets balances.
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('wallets')}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-[0.99]"
            >
              <span>{getTranslation('manageWallets', language)}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* CARD 2: Debt & IOU Overview */}
          <div className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800/80 hover:border-gray-700 transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <HandCoins className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold text-sm text-white">
                    {getTranslation('debts', language)}
                  </span>
                </div>
                <span className="text-xs text-gray-400">{activeDebts.length} active</span>
              </div>

              <div className="text-xl font-bold text-white font-mono">
                {formatCurrency(totalMoneyLent, user?.currency)} <span className="text-xs font-normal text-gray-400">lent</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                You owe {formatCurrency(totalMoneyBorrowed, user?.currency)} to others.
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('debts')}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-amber-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-[0.99]"
            >
              <span>{getTranslation('manageDebts', language)}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* CARD 3: Recurring Monthly Bills */}
          <div className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800/80 hover:border-gray-700 transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CalendarClock className="w-4 h-4 text-cyan-400" />
                  <span className="font-semibold text-sm text-white">
                    {getTranslation('recurring', language)}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {recurringExpenses.filter((r) => r.active).length} active bills
                </span>
              </div>

              <div className="text-xl font-bold text-white font-mono">
                {formatCurrency(totalMonthlyRecurring, user?.currency)} <span className="text-xs font-normal text-gray-400">/ month</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Scheduled monthly deductions from your chosen wallets.
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('recurring')}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-cyan-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-[0.99]"
            >
              <span>Manage Recurring Bills</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* CARD 4: Savings Goals Overview */}
          <div className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800/80 hover:border-gray-700 transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-teal-400" />
                  <span className="font-semibold text-sm text-white">
                    {getTranslation('savings', language)}
                  </span>
                </div>
                <span className="text-xs text-gray-400">{savingsGoals.length} goals</span>
              </div>

              <div className="text-xl font-bold text-white font-mono">
                {formatCurrency(totalSavedGoals, user?.currency)} <span className="text-xs font-normal text-gray-400">({goalsPercentage}% funded)</span>
              </div>
              <div className="w-full bg-gray-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-teal-500 h-full rounded-full transition-all"
                  style={{ width: `${goalsPercentage}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('savings')}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-teal-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-[0.99]"
            >
              <span>{getTranslation('viewSavings', language)}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* CARD 5: Monthly Analytics Overview */}
          <div className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800/80 hover:border-gray-700 transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-indigo-400" />
                  <span className="font-semibold text-sm text-white">
                    {getTranslation('analytics', language)}
                  </span>
                </div>
                <span className="text-xs text-gray-400">This Month</span>
              </div>

              <div className="text-xl font-bold text-white font-mono">
                {formatCurrency(monthExpense, user?.currency)} <span className="text-xs font-normal text-gray-400">spent</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Visual charts, category breakdowns, and PDF/CSV export.
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('analytics')}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-indigo-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-[0.99]"
            >
              <span>{getTranslation('viewAnalytics', language)}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* CARD 6: Transaction Ledger Overview */}
          <div className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800/80 hover:border-gray-700 transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ListOrdered className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold text-sm text-white">
                    {getTranslation('transactions', language)}
                  </span>
                </div>
                <span className="text-xs text-gray-400">{transactions.length} records</span>
              </div>

              <div className="text-xl font-bold text-white font-mono">
                {transactions.length} <span className="text-xs font-normal text-gray-400">total transactions</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Searchable, filterable activity history and receipts.
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('transactions')}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-[0.99]"
            >
              <span>{getTranslation('viewFullLedger', language)}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Recent Activity (Calm, 3 rows only) */}
      {recentTransactions.length > 0 && (
        <div className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800/80">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Recent Transactions
            </h3>
            <button
              onClick={() => onNavigateTab('transactions')}
              className="text-xs text-gray-400 hover:text-white transition flex items-center gap-1"
            >
              View all ({transactions.length}) <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-gray-800/60">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="py-2.5 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      tx.type === 'income'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : tx.type === 'expense'
                        ? 'bg-rose-500/10 text-rose-400'
                        : 'bg-indigo-500/10 text-indigo-400'
                    }`}
                  >
                    {tx.type === 'income' ? (
                      <ArrowDownLeft className="w-3.5 h-3.5" />
                    ) : tx.type === 'expense' ? (
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-200 block">
                      {tx.note || tx.category}
                    </span>
                    <span className="text-[11px] text-gray-500">
                      {formatDate(tx.date)} · {tx.category}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`font-mono font-bold ${
                      tx.type === 'income'
                        ? 'text-emerald-400'
                        : tx.type === 'expense'
                        ? 'text-rose-400'
                        : 'text-indigo-400'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : tx.type === 'expense' ? '-' : ''}
                    {formatCurrency(tx.amount, user?.currency)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <TransferModal isOpen={showTransfer} onClose={() => setShowTransfer(false)} />
      <TransactionModal
        isOpen={showTxModal}
        onClose={() => setShowTxModal(false)}
        initialType={txModalType}
      />
      <DebtModal isOpen={showDebtModal} onClose={() => setShowDebtModal(false)} />
      <FriendlyReminderModal
        isOpen={!!reminderDebt}
        onClose={() => setReminderDebt(null)}
        debt={reminderDebt}
      />
    </div>
  );
};
