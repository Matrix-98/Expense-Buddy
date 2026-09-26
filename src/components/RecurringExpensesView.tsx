import React, { useState } from 'react';
import {
  CalendarClock,
  Plus,
  Wallet as WalletIcon,
  CheckCircle2,
  Clock,
  Trash2,
  Power,
  Sparkles,
  ArrowRight,
  Zap,
  Building2,
  X,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';
import { getTranslation } from '../utils/translations';
import { RecurringExpense } from '../types/finance';

const RECURRING_CATEGORIES = [
  'Housing & Rent',
  'Utilities & Bills',
  'Entertainment & Subscriptions',
  'Internet & Telecom',
  'Healthcare & Medical',
  'Education & Tuition',
  'Transportation & Commute',
  'Insurance',
  'Other Recurring',
];

export const RecurringExpensesView: React.FC = () => {
  const {
    recurringExpenses,
    wallets,
    user,
    language,
    totalMonthlyRecurring,
    addRecurringExpense,
    deleteRecurringExpense,
    toggleRecurringActive,
    deductRecurringExpense,
  } = useFinance();

  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [walletId, setWalletId] = useState(wallets[0]?.id || '');
  const [category, setCategory] = useState(RECURRING_CATEGORIES[0]);
  const [billingDay, setBillingDay] = useState('5');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const currentDay = now.getDate();

  const handleCreateRecurring = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const amt = Number(amount);
    if (!amt || amt <= 0) {
      setError('Please specify a positive recurring amount.');
      return;
    }

    if (!name.trim()) {
      setError('Please provide a name for this recurring expense.');
      return;
    }

    const day = Math.min(31, Math.max(1, Number(billingDay) || 1));

    addRecurringExpense({
      name: name.trim(),
      amount: amt,
      walletId,
      category,
      billingDay: day,
      notes: notes.trim() || undefined,
    });

    setName('');
    setAmount('');
    setNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 border border-gray-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              {getTranslation('recurringCommitments', language)}
            </span>
            <span className="text-[10px] bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/20 font-medium">
              Auto-Deduction Engine
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            {getTranslation('recurring', language)} (Monthly Auto-Bills)
          </h2>
          <p className="mt-1 text-xs text-gray-400 max-w-xl">
            {getTranslation('recurringSubtitle', language)}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{getTranslation('addRecurring', language)}</span>
        </button>
      </div>

      {/* Summary Stat Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800">
          <span className="text-xs text-gray-400 block mb-1">
            {getTranslation('monthlyCommitment', language)}
          </span>
          <span className="text-2xl font-black text-white font-mono">
            {formatCurrency(totalMonthlyRecurring, user?.currency)}
          </span>
          <span className="text-[11px] text-gray-500 block mt-1">
            Across {recurringExpenses.filter((r) => r.active).length} active subscriptions & bills
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800">
          <span className="text-xs text-gray-400 block mb-1">
            {getTranslation('deductedThisMonth', language)}
          </span>
          <span className="text-2xl font-black text-emerald-400 font-mono">
            {formatCurrency(
              recurringExpenses
                .filter((r) => r.lastDeductedMonth === currentMonthKey)
                .reduce((sum, r) => sum + r.amount, 0),
              user?.currency
            )}
          </span>
          <span className="text-[11px] text-gray-500 block mt-1">
            {recurringExpenses.filter((r) => r.lastDeductedMonth === currentMonthKey).length} bill(s) paid
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800">
          <span className="text-xs text-gray-400 block mb-1">
            {getTranslation('pendingDeduction', language)}
          </span>
          <span className="text-2xl font-black text-amber-400 font-mono">
            {formatCurrency(
              recurringExpenses
                .filter((r) => r.active && r.lastDeductedMonth !== currentMonthKey)
                .reduce((sum, r) => sum + r.amount, 0),
              user?.currency
            )}
          </span>
          <span className="text-[11px] text-gray-500 block mt-1">
            Pending scheduled deduction dates
          </span>
        </div>
      </div>

      {/* List of Recurring Expenses */}
      {recurringExpenses.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-gray-900/40 border border-gray-800/80">
          <CalendarClock className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-300">No Recurring Expenses Configured</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Add your monthly rent, internet bill, subscriptions, or gym fees. They will automatically deduct from your chosen wallet on the selected day.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recurringExpenses.map((item) => {
            const assignedWallet = wallets.find((w) => w.id === item.walletId);
            const isDeductedThisMonth = item.lastDeductedMonth === currentMonthKey;

            return (
              <div
                key={item.id}
                className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                  !item.active
                    ? 'bg-gray-950/40 border-gray-850 opacity-60'
                    : 'bg-gray-900/80 border-gray-800 hover:border-gray-700/80'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white tracking-tight">
                          {item.name}
                        </h3>
                        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-gray-800 text-gray-300 border border-gray-700">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-1">
                        <WalletIcon className="w-3.5 h-3.5 text-cyan-400" />
                        <span>
                          Deducts from: <strong className="text-white">{assignedWallet?.name || 'Wallet'}</strong>
                        </span>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-gray-500 uppercase block font-semibold">
                        Monthly
                      </span>
                      <span className="text-xl font-black text-white font-mono">
                        {formatCurrency(item.amount, user?.currency)}
                      </span>
                    </div>
                  </div>

                  {/* Scheduled Date & Status */}
                  <div className="mt-4 p-3 rounded-2xl bg-gray-950/70 border border-gray-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      <div>
                        <span className="text-gray-300 font-medium block">
                          Day {item.billingDay} of every month
                        </span>
                        <span className="text-[11px] text-gray-500">
                          {isDeductedThisMonth
                            ? 'Deducted for this month'
                            : `Due on ${item.billingDay}th of this month`}
                        </span>
                      </div>
                    </div>

                    <div>
                      {isDeductedThisMonth ? (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-xl border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Deducted</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-xl border border-amber-500/30">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Pending</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {item.notes && (
                    <p className="mt-2 text-xs text-gray-400 italic">
                      "{item.notes}"
                    </p>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleRecurringActive(item.id)}
                      className={`p-1.5 rounded-xl border text-xs flex items-center gap-1.5 transition ${
                        item.active
                          ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30 hover:bg-emerald-900/40'
                          : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'
                      }`}
                      title={item.active ? 'Pause recurring bill' : 'Resume recurring bill'}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{item.active ? 'Active' : 'Paused'}</span>
                    </button>

                    <button
                      onClick={() => deleteRecurringExpense(item.id)}
                      className="p-1.5 text-gray-500 hover:text-rose-400 transition"
                      title="Delete recurring bill"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {!isDeductedThisMonth && item.active && (
                    <button
                      onClick={() => deductRecurringExpense(item.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/20 transition active:scale-95"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>{getTranslation('deductNow', language)}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Recurring Bill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-800 bg-gray-950/70 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                  <CalendarClock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {getTranslation('addRecurring', language)}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Auto-deducts monthly from your selected wallet
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRecurring} className="p-5 space-y-4 text-sm">
              {error && (
                <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs">
                  {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Bill / Subscription Name
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Apartment Rent, WiFi Internet, Netflix"
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Monthly Amount ({user?.currencySymbol || '৳'})
                </label>
                <input
                  type="number"
                  step="any"
                  min="1"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                />
              </div>

              {/* Wallet of choice (User requirement) */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1.5">
                  <WalletIcon className="w-3.5 h-3.5 text-cyan-400" />
                  Deduct from Wallet of Choice
                </label>
                <select
                  value={walletId}
                  onChange={(e) => setWalletId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                >
                  {wallets.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({formatCurrency(w.balance, user?.currency)})
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-gray-500">
                  Every month, this amount will be automatically subtracted from this account.
                </p>
              </div>

              {/* Billing Day of Month (User requirement: selected date of the user) */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Billing Day of Month (1 - 31)
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  required
                  value={billingDay}
                  onChange={(e) => setBillingDay(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                />
                <p className="mt-1 text-[11px] text-gray-500">
                  Example: 5 means the 5th of every month.
                </p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                >
                  {RECURRING_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Notes / Reference (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Due before DESCO cutoff date"
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-750 text-gray-300 text-xs font-medium transition"
                >
                  {getTranslation('cancel', language)}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs shadow-md transition active:scale-95"
                >
                  Save Recurring Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
