import React, { useState } from 'react';
import { X, PiggyBank, PlusCircle, MinusCircle, Wallet as WalletIcon } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { SavingsGoal } from '../../types/finance';
import { formatCurrency } from '../../utils/formatters';

interface GoalDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: SavingsGoal | null;
}

export const GoalDepositModal: React.FC<GoalDepositModalProps> = ({ isOpen, onClose, goal }) => {
  const { wallets, user, contributeToGoal } = useFinance();

  const [type, setType] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState('');
  const [walletId, setWalletId] = useState(
    goal?.walletId || wallets.find((w) => w.type === 'savings')?.id || wallets[0]?.id || ''
  );
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !goal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const amt = Number(amount);
    if (!amt || amt <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    if (type === 'withdraw' && amt > goal.currentSavedAmount) {
      setError(`Cannot withdraw more than current saved amount (${formatCurrency(goal.currentSavedAmount, user?.currency)}).`);
      return;
    }

    const selectedWallet = wallets.find((w) => w.id === walletId);
    if (type === 'deposit' && selectedWallet && selectedWallet.balance < amt) {
      setError(`Insufficient balance in ${selectedWallet.name} (${formatCurrency(selectedWallet.balance, user?.currency)} available).`);
      return;
    }

    contributeToGoal({
      goalId: goal.id,
      amount: amt,
      type,
      walletId,
      note: note.trim() || `${type === 'deposit' ? 'Added savings' : 'Withdrawn savings'} for ${goal.name}`,
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
              <PiggyBank className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Fund Savings Goal</h3>
              <p className="text-xs text-gray-400">{goal.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toggle Type */}
        <div className="p-5 pb-0">
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-800/80 rounded-xl border border-gray-700/60">
            <button
              type="button"
              onClick={() => setType('deposit')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition ${
                type === 'deposit'
                  ? 'bg-cyan-500 text-gray-950 shadow-md'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Deposit to Goal</span>
            </button>
            <button
              type="button"
              onClick={() => setType('withdraw')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition ${
                type === 'withdraw'
                  ? 'bg-amber-500 text-gray-950 shadow-md'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <MinusCircle className="w-4 h-4" />
              <span>Withdraw from Goal</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Amount ({user?.currencySymbol || '৳'})
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
                autoFocus
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white font-semibold text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Wallet */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1.5">
              <WalletIcon className="w-3.5 h-3.5 text-gray-400" />
              {type === 'deposit' ? 'From Wallet (Source)' : 'To Wallet (Destination)'}
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
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Note (Optional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Monthly goal allotment"
              className="w-full px-3.5 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
            />
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
              Confirm {type === 'deposit' ? 'Deposit' : 'Withdrawal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
