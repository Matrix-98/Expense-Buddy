import React, { useState } from 'react';
import { X, HandCoins, ArrowUpRight, ArrowDownLeft, Calendar, User, Phone, FileText } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { DebtType } from '../../types/finance';

interface DebtModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: DebtType;
}

export const DebtModal: React.FC<DebtModalProps> = ({
  isOpen,
  onClose,
  initialType = 'lent',
}) => {
  const { wallets, user, addDebt } = useFinance();

  const [debtType, setDebtType] = useState<DebtType>(initialType);
  const [personName, setPersonName] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [walletId, setWalletId] = useState(wallets[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const amt = Number(amount);
    if (!amt || amt <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    if (!personName.trim()) {
      setError("Please enter the person's name.");
      return;
    }

    if (!walletId) {
      setError('Please choose an affected wallet.');
      return;
    }

    addDebt({
      personName: personName.trim(),
      phone: phone.trim(),
      amount: amt,
      debtType,
      walletId,
      date,
      dueDate: dueDate || undefined,
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-gray-800 bg-gray-950/70">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <HandCoins className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Record Debt / IOU</h3>
                <p className="text-xs text-gray-400">Track loans owed to you or by you</p>
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
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-800/80 rounded-xl border border-gray-700/60">
            <button
              type="button"
              onClick={() => setDebtType('lent')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition ${
                debtType === 'lent'
                  ? 'bg-amber-500 text-gray-950 shadow-md'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Money Lent (Owed to you)</span>
            </button>
            <button
              type="button"
              onClick={() => setDebtType('borrowed')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition ${
                debtType === 'borrowed'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Money Borrowed (You owe)</span>
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

          {/* Person's Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-gray-400" />
              Person's Name
            </label>
            <input
              type="text"
              required
              autoFocus
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              placeholder="e.g. Tanvir Hossain"
              className="w-full px-3.5 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </div>

          {/* Phone (for reminders) */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              Phone / WhatsApp Number (Optional)
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+8801812345678"
              className="w-full px-3.5 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-mono"
            />
          </div>

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
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white font-semibold text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Wallet Impacted */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              {debtType === 'lent'
                ? 'Paid from Wallet (Funds leave account)'
                : 'Received into Wallet (Funds enter account)'}
            </label>
            <select
              value={walletId}
              onChange={(e) => setWalletId(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            >
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({user?.currencySymbol} {w.balance.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-gray-400" />
                Date Given
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-gray-400" />
                Due Date (Optional)
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-gray-400" />
              Notes / Purpose
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Loan for laptop purchase"
              className="w-full px-3.5 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </div>

          {/* Footer */}
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
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-xs shadow-md transition active:scale-95"
            >
              Save Debt Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
