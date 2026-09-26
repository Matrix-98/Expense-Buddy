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
  Sparkles,
  TrendingUp,
  TrendingDown,
  Building2,
  Smartphone,
  Banknote,
  PiggyBank,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { TransferModal } from './Modals/TransferModal';
import { TransactionModal } from './Modals/TransactionModal';
import { DebtModal } from './Modals/DebtModal';
import { GoalModal } from './Modals/GoalModal';
import { FriendlyReminderModal } from './FriendlyReminderModal';
import { DebtRecord, TransactionType } from '../types/finance';
import { NavTab } from './Navbar';

interface DashboardViewProps {
  onNavigateTab: (tab: NavTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigateTab }) => {
  const {
    user,
    wallets,
    transactions,
    debts,
    savingsGoals,
    totalNetWorth,
    totalMoneyLent,
    totalMoneyBorrowed,
    netDebtPosition,
    activeDebtsCount,
    monthIncome,
    monthExpense,
  } = useFinance();

  const [showTransfer, setShowTransfer] = useState(false);
  const [showTxModal, setShowTxModal] = useState(false);
  const [txModalType, setTxModalType] = useState<TransactionType>('expense');
  const [showDebtModal, setShowDebtModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [reminderDebt, setReminderDebt] = useState<DebtRecord | null>(null);

  // Icon selector helper
  const getWalletIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2':
        return <Building2 className="w-4 h-4" />;
      case 'Smartphone':
        return <Smartphone className="w-4 h-4" />;
      case 'PiggyBank':
        return <PiggyBank className="w-4 h-4" />;
      default:
        return <Banknote className="w-4 h-4" />;
    }
  };

  const activeDebts = debts.filter((d) => d.status === 'active');
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner: Total Net Worth & Strict Balance Integrity Notice */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-950 to-black border border-gray-800/80 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Total Net Worth
              </span>
              <span className="text-[10px] text-gray-400 bg-gray-800/80 px-2 py-0.5 rounded-full border border-gray-700/60 font-medium">
                Live Aggregation • Tamper-Proof
              </span>
            </div>

            {/* Read-Only Total Net Worth (No direct edit) */}
            <div className="flex items-baseline gap-3">
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                {formatCurrency(totalNetWorth, user?.currency)}
              </h2>
            </div>

            <p className="mt-2 text-xs text-gray-400 max-w-xl">
              Calculated dynamically from {wallets.length} active wallets. To adjust balances, log an income, expense, transfer, or debt settlement below.
            </p>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Transfer Funds (Req 4.5 & 4.6) */}
            <button
              onClick={() => setShowTransfer(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs shadow-lg shadow-violet-600/20 transition active:scale-95"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Transfer Funds</span>
            </button>

            {/* Log Income */}
            <button
              onClick={() => {
                setTxModalType('income');
                setShowTxModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Income</span>
            </button>

            {/* Log Expense */}
            <button
              onClick={() => {
                setTxModalType('expense');
                setShowTxModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-lg shadow-rose-600/20 transition active:scale-95"
            >
              <Minus className="w-4 h-4" />
              <span>Expense</span>
            </button>

            {/* Add Debt / IOU */}
            <button
              onClick={() => setShowDebtModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-amber-300 border border-gray-700 font-semibold text-xs transition active:scale-95"
            >
              <HandCoins className="w-4 h-4" />
              <span>Debt / IOU</span>
            </button>
          </div>
        </div>
      </div>

      {/* Prominent Debt & IOU Balance Dashboard Integration (User Requirement) */}
      <div className="p-6 rounded-3xl bg-gray-900/90 border border-gray-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <HandCoins className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Debt & IOU Position
              </h3>
              <p className="text-xs text-gray-400">
                Track pending money lent to others and money borrowed
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('debts')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition"
          >
            <span>Manage All Debts</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Metric Cards for Debt */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Money Lent (Receivable) */}
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-amber-400 flex items-center gap-1.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
                Money Lent (Owed to you)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                Asset
              </span>
            </div>
            <div className="text-2xl font-black text-white">
              {formatCurrency(totalMoneyLent, user?.currency)}
            </div>
            <p className="mt-1 text-[11px] text-gray-400">
              Total pending receivable from friends & colleagues
            </p>
          </div>

          {/* Money Borrowed (Payable) */}
          <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-rose-400 flex items-center gap-1.5">
                <ArrowDownLeft className="w-3.5 h-3.5" />
                Money Borrowed (You owe)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold">
                Liability
              </span>
            </div>
            <div className="text-2xl font-black text-white">
              {formatCurrency(totalMoneyBorrowed, user?.currency)}
            </div>
            <p className="mt-1 text-[11px] text-gray-400">
              Total amount you currently owe to lenders
            </p>
          </div>

          {/* Net Debt Position */}
          <div className="p-4 rounded-2xl bg-gray-950/60 border border-gray-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-300">Net IOU Position</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  netDebtPosition >= 0
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                {netDebtPosition >= 0 ? '+ Net Positive' : '- Net Negative'}
              </span>
            </div>
            <div
              className={`text-2xl font-black ${
                netDebtPosition >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {formatCurrency(Math.abs(netDebtPosition), user?.currency)}
            </div>
            <p className="mt-1 text-[11px] text-gray-400">
              {netDebtPosition >= 0
                ? 'People owe you more than you owe others.'
                : 'You owe more than you are owed.'}
            </p>
          </div>
        </div>

        {/* Quick reminder highlights if active debts exist */}
        {activeDebts.filter((d) => d.debtType === 'lent').length > 0 && (
          <div className="pt-2 border-t border-gray-800/80 flex items-center justify-between text-xs">
            <span className="text-gray-400">
              Active borrowers:{' '}
              <strong className="text-white">
                {activeDebts
                  .filter((d) => d.debtType === 'lent')
                  .map((d) => d.personName)
                  .join(', ')}
              </strong>
            </span>
            <button
              onClick={() => {
                const firstLent = activeDebts.find((d) => d.debtType === 'lent');
                if (firstLent) setReminderDebt(firstLent);
              }}
              className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-medium hover:bg-emerald-900/60 transition"
            >
              Send Friendly Reminder
            </button>
          </div>
        )}
      </div>

      {/* Grid: Wallets Overview & Monthly Cashflow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wallets Overview (2 cols) - Non editable balances! */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-gray-900/80 border border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Active Wallets</h3>
              <p className="text-xs text-gray-400">
                Balances are securely updated through transfers & transactions
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('wallets')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition"
            >
              Manage Wallets →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {wallets.map((wallet) => (
              <div
                key={wallet.id}
                className="p-4 rounded-2xl bg-gray-950/70 border border-gray-800/80 hover:border-gray-700 transition flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      style={{ backgroundColor: `${wallet.color}20`, color: wallet.color }}
                      className="w-8 h-8 rounded-xl flex items-center justify-center border border-white/5"
                    >
                      {getWalletIcon(wallet.icon)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white leading-tight">{wallet.name}</h4>
                      <span className="text-[10px] text-gray-500 font-mono">
                        {wallet.accountNumber || wallet.type}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">
                    {wallet.type.replace('_', ' ')}
                  </span>
                </div>

                {/* Balance display without edit controls */}
                <div className="mt-4 pt-3 border-t border-gray-900 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-medium">Balance</span>
                    <div className="text-lg font-bold text-white font-mono">
                      {formatCurrency(wallet.balance, user?.currency)}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowTransfer(true)}
                    className="p-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white transition text-xs flex items-center gap-1"
                    title="Transfer money from or to this wallet"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>Transfer</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Performance Card (1 col) */}
        <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-white tracking-tight">This Month's Flow</h3>
              <button
                onClick={() => onNavigateTab('analytics')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
              >
                Analytics →
              </button>
            </div>

            <div className="space-y-3">
              {/* Income */}
              <div className="p-3 rounded-xl bg-gray-950/60 border border-gray-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block leading-tight">Income</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">
                      {formatCurrency(monthIncome, user?.currency)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expense */}
              <div className="p-3 rounded-xl bg-gray-950/60 border border-gray-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                    <TrendingDown className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block leading-tight">Expenses</span>
                    <span className="text-sm font-bold text-rose-400 font-mono">
                      {formatCurrency(monthExpense, user?.currency)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Net Savings */}
              <div className="p-3 rounded-xl bg-gray-950/60 border border-gray-800/80 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 block leading-tight">Net Savings</span>
                  <span
                    className={`text-sm font-bold font-mono ${
                      monthIncome - monthExpense >= 0 ? 'text-cyan-400' : 'text-rose-400'
                    }`}
                  >
                    {formatCurrency(monthIncome - monthExpense, user?.currency)}
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 font-medium">
                  {monthIncome > 0
                    ? `${Math.round(((monthIncome - monthExpense) / monthIncome) * 100)}% Saved`
                    : '0%'}
                </span>
              </div>
            </div>
          </div>

          {/* Budget Target progress */}
          <div className="pt-3 border-t border-gray-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-gray-400">Budget Limit</span>
              <span className="text-white font-mono">
                {formatCurrency(monthExpense, user?.currency)} / {formatCurrency(user?.monthlyBudget || 75000, user?.currency)}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-500"
                style={{
                  width: `${Math.min(
                    100,
                    Math.round((monthExpense / (user?.monthlyBudget || 75000)) * 100)
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Savings Goals Progress (Req 6.1 - 6.3) & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Savings Goals Widget */}
        <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" />
              <h3 className="text-base font-bold text-white tracking-tight">Savings Goals</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowGoalModal(true)}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold hover:bg-cyan-500/30 transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Goal</span>
              </button>
              <button
                onClick={() => onNavigateTab('savings')}
                className="text-xs text-gray-400 hover:text-white"
              >
                View All →
              </button>
            </div>
          </div>

          <div className="space-y-3.5">
            {savingsGoals.map((goal) => {
              const percent = Math.min(
                100,
                Math.round((goal.currentSavedAmount / goal.targetAmount) * 100)
              );
              return (
                <div
                  key={goal.id}
                  className="p-4 rounded-2xl bg-gray-950/70 border border-gray-800 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{goal.name}</h4>
                      <p className="text-[11px] text-gray-400">
                        {formatCurrency(goal.currentSavedAmount, user?.currency)} of{' '}
                        {formatCurrency(goal.targetAmount, user?.currency)}
                      </p>
                    </div>
                    <span className="text-xs font-extrabold font-mono text-cyan-400">
                      {percent}%
                    </span>
                  </div>

                  {/* Visual Progress Bar (Req 6.3) */}
                  <div className="w-full h-2.5 rounded-full bg-gray-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: goal.color || '#06B6D4',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions List with Transfer Badges */}
        <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white tracking-tight">Recent Activity</h3>
            <button
              onClick={() => onNavigateTab('transactions')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
            >
              Full Ledger →
            </button>
          </div>

          <div className="space-y-2.5">
            {recentTransactions.map((tx) => {
              const isTransfer = tx.type === 'transfer';
              const isIncome = tx.type === 'income';

              return (
                <div
                  key={tx.id}
                  className="p-3 rounded-xl bg-gray-950/60 border border-gray-800/80 flex items-center justify-between hover:border-gray-700 transition"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isTransfer
                          ? 'bg-violet-950/60 text-violet-400 border border-violet-500/30'
                          : isIncome
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-950/60 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {isTransfer ? (
                        <ArrowRightLeft className="w-4 h-4" />
                      ) : isIncome ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownLeft className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{tx.category}</span>
                        {isTransfer && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-violet-950 text-violet-300 border border-violet-800">
                            Transfer
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 truncate max-w-[180px] sm:max-w-xs">
                        {tx.note || formatDate(tx.date)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs font-bold font-mono ${
                        isTransfer
                          ? 'text-violet-400'
                          : isIncome
                          ? 'text-emerald-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {isIncome ? '+' : isTransfer ? '⇄ ' : '-'}
                      {formatCurrency(tx.amount, user?.currency)}
                    </span>
                    <span className="block text-[10px] text-gray-500">{formatDate(tx.date)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modals */}
      <TransferModal isOpen={showTransfer} onClose={() => setShowTransfer(false)} />
      <TransactionModal
        isOpen={showTxModal}
        onClose={() => setShowTxModal(false)}
        initialType={txModalType}
      />
      <DebtModal isOpen={showDebtModal} onClose={() => setShowDebtModal(false)} />
      <GoalModal isOpen={showGoalModal} onClose={() => setShowGoalModal(false)} />
      <FriendlyReminderModal
        isOpen={!!reminderDebt}
        onClose={() => setReminderDebt(null)}
        debt={reminderDebt}
      />
    </div>
  );
};
