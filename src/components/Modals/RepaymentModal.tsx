import React, { useState } from 'react';
import { X, CheckCircle, Wallet as WalletIcon, Calendar, FileText, ArrowRight } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { DebtRecord } from '../../types/finance';
import { formatCurrency } from '../../utils/formatters';

interface RepaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  debt: DebtRecord | null;
}

export const RepaymentModal: React.FC<RepaymentModalProps> = ({ isOpen, onClose, debt }) => {
  const { wallets, user, logDebtRepayment } = useFinance();

  const [amount, setAmount] = useState(debt ? String(debt.remainingAmount) : '');
  const [walletId, setWalletId] = useState(wallets[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !debt) return null;

  const handleMaxAmount = () => {
    setAmount(String(debt.remainingAmount));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const repaymentAmt = Number(amount);
    if (!repaymentAmt || repaymentAmt <= 0) {
      setError('Please enter a valid repayment amount.');
      return;
    }

    if (repaymentAmt > debt.remainingAmount) {
      setError(
        `Repayment amount cannot exceed remaining balance of ${formatCurrency(debt.remainingAmount, user?.currency)}.`
      );
      return;
    }

    const selectedWallet = wallets.find((w) => w.id === walletId);
    if (debt.debtType === 'borrowed' && selectedWallet && selectedWallet.balance < repaymentAmt) {
      setError(
        `Insufficient balance in ${selectedWallet.name} to pay ${formatCurrency(repaymentAmt, user?.currency)}.`
      );
      return;
    }

    logDebtRepayment({
      debtId: debt.id,
      amount: repaymentAmt,
      walletId,
      date,
      note: note.trim() || `Repayment on ${debt.personName}'s debt`,
    });

    onClose();
  };

  const isLent = debt.debtType === 'lent';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-gray-800 bg-gray-950/70">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                Log Repayment
              </span>
              <h3 className="text-base font-bold text-white tracking-tight">
                {isLent ? `Received from ${debt.personName}` : `Repay to ${debt.personName}`}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Debt details card */}
        <div className="p-4 mx-5 mt-4 rounded-xl bg-gray-800/60 border border-gray-700/60 flex items-center justify-between text-xs">
          <div>
            <span className="text-gray-400 block">Total Remaining</span>
            <span className="text-base font-bold text-white">
              {formatCurrency(debt.remainingAmount, user?.currency)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-gray-400 block">Type</span>
            <span
              className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                isLent ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
              }`}
            >
              {isLent ? 'Money Lent (Receivable)' : 'Money Borrowed (Payable)'}
            </span>
          </div>
        </div>

        {/* Notice on wallet balance effect */}
        <div className="px-5 mt-2 text-[11px] text-gray-400">
          {isLent ? (
            <p className="text-emerald-400/90">
              ✓ Logging this will <strong>increment</strong> your chosen wallet balance by the repayment amount.
            </p>
          ) : (
            <p className="text-rose-400/90">
              ✓ Logging this will <strong>decrement</strong> your chosen wallet balance as you repay the lender.
            </p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Amount input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-gray-300">Repayment Amount</label>
              <button
                type="button"
                onClick={handleMaxAmount}
                className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 hover:underline"
              >
                Pay Full Balance
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-gray-400 font-bold">
                {user?.currencySymbol || '৳'}
              </span>
              <input
                type="number"
                step="any"
                min="0.01"
                max={debt.remainingAmount}
                required
                autoFocus
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white font-semibold text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Wallet */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1.5">
              <WalletIcon className="w-3.5 h-3.5 text-gray-400" />
              {isLent ? 'Deposit Into Wallet' : 'Withdraw From Wallet'}
            </label>
            <select
              value={walletId}
              onChange={(e) => setWalletId(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            >
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({formatCurrency(w.balance, user?.currency)})
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              Repayment Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-gray-400" />
              Note / Reference
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Sent via bKash, Cash in hand"
              className="w-full px-3.5 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
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
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs shadow-md transition active:scale-95"
            >
              Confirm Repayment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
