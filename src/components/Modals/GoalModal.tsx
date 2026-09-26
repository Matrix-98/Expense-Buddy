import React, { useState } from 'react';
import { X, Target, PiggyBank, Calendar, DollarSign, FileText } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

const GOAL_ICONS = ['Target', 'PiggyBank', 'Monitor', 'ShieldCheck', 'Car', 'Plane', 'Home', 'GraduationCap'];
const GOAL_COLORS = ['#06B6D4', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899', '#3B82F6'];

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoalModal: React.FC<GoalModalProps> = ({ isOpen, onClose }) => {
  const { wallets, user, addSavingsGoal } = useFinance();

  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [initialDeposit, setInitialDeposit] = useState('');
  const [walletId, setWalletId] = useState(
    wallets.find((w) => w.type === 'savings')?.id || wallets[0]?.id || ''
  );
  const [targetDate, setTargetDate] = useState('');
  const [selectedColor, setSelectedColor] = useState(GOAL_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(GOAL_ICONS[0]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const target = Number(targetAmount);
    if (!target || target <= 0) {
      setError('Please specify a positive target amount.');
      return;
    }

    if (!name.trim()) {
      setError('Please provide a goal name (e.g. New PC).');
      return;
    }

    const deposit = Number(initialDeposit) || 0;
    const fundingWallet = wallets.find((w) => w.id === walletId);
    if (deposit > 0 && fundingWallet && fundingWallet.balance < deposit) {
      setError(`Insufficient balance in ${fundingWallet.name} for the initial deposit.`);
      return;
    }

    addSavingsGoal({
      name: name.trim(),
      targetAmount: target,
      initialDeposit: deposit,
      walletId,
      targetDate: targetDate || undefined,
      color: selectedColor,
      icon: selectedIcon,
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-gray-800 bg-gray-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Create Savings Goal</h3>
              <p className="text-xs text-gray-400">Save up for a milestone or dream purchase</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Goal Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Goal Name (e.g. "New PC", "Vacation")
            </label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. New Custom PC"
              className="w-full px-3.5 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
            />
          </div>

          {/* Target Amount */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Target Amount ({user?.currencySymbol || '৳'})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-gray-400 font-bold">
                {user?.currencySymbol || '৳'}
              </span>
              <input
                type="number"
                step="any"
                min="1"
                required
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="100000"
                className="w-full pl-8 pr-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white font-semibold text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Initial Deposit & Wallet */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Initial Deposit (Optional)
              </label>
              <input
                type="number"
                step="any"
                min="0"
                value={initialDeposit}
                onChange={(e) => setInitialDeposit(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Linked Wallet
              </label>
              <select
                value={walletId}
                onChange={(e) => setWalletId(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {wallets.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Target Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              Target Completion Date (Optional)
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
            />
          </div>

          {/* Color theme selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Theme Color</label>
            <div className="flex items-center gap-2">
              {GOAL_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    selectedColor === c ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs shadow-md transition active:scale-95"
            >
              Start Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
