import React, { useState } from 'react';
import {
  Wallet as WalletIcon,
  ArrowRightLeft,
  Plus,
  Building2,
  Smartphone,
  Banknote,
  PiggyBank,
  CreditCard,
  X,
  CheckCircle,
  ShieldCheck,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { Wallet, WalletType } from '../types/finance';
import { formatCurrency } from '../utils/formatters';
import { TransferModal } from './Modals/TransferModal';

const WALLET_TYPES: { type: WalletType; label: string; icon: string }[] = [
  { type: 'cash', label: 'Cash / In-Hand', icon: 'Banknote' },
  { type: 'bank', label: 'Bank Account', icon: 'Building2' },
  { type: 'mobile_wallet', label: 'Mobile Wallet (bKash / Nagad / Upay)', icon: 'Smartphone' },
  { type: 'savings', label: 'Dedicated Savings Account', icon: 'PiggyBank' },
  { type: 'credit', label: 'Credit / Prepaid Card', icon: 'CreditCard' },
];

const WALLET_COLORS = ['#10B981', '#3B82F6', '#EC4899', '#8B5CF6', '#F59E0B', '#06B6D4'];

export const WalletsView: React.FC = () => {
  const { wallets, user, addWallet, totalNetWorth } = useFinance();

  const [showAddWallet, setShowAddWallet] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [transferDefaultSource, setTransferDefaultSource] = useState<string | undefined>(undefined);

  // New Wallet Form state
  const [name, setName] = useState('');
  const [walletType, setWalletType] = useState<WalletType>('bank');
  const [initialBalance, setInitialBalance] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [color, setColor] = useState(WALLET_COLORS[1]);

  const getWalletIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2':
        return <Building2 className="w-5 h-5" />;
      case 'Smartphone':
        return <Smartphone className="w-5 h-5" />;
      case 'PiggyBank':
        return <PiggyBank className="w-5 h-5" />;
      case 'CreditCard':
        return <CreditCard className="w-5 h-5" />;
      default:
        return <Banknote className="w-5 h-5" />;
    }
  };

  const handleCreateWallet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const matchedType = WALLET_TYPES.find((t) => t.type === walletType);

    addWallet({
      name: name.trim(),
      type: walletType,
      color,
      icon: matchedType?.icon || 'Wallet',
      initialBalance: Number(initialBalance) || 0,
      accountNumber: accountNumber.trim() || undefined,
    });

    setName('');
    setInitialBalance('');
    setAccountNumber('');
    setShowAddWallet(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 border border-gray-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Wallets & Liquidity (Section 4.0)
            </span>
            <span className="text-[10px] bg-gray-800 px-2 py-0.5 rounded-full border border-gray-700 text-gray-300 font-medium">
              Strict Audit Integrity
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Accounts & Multi-Wallet Liquidity
          </h2>
          <p className="mt-1 text-xs text-gray-400 max-w-xl">
            Total Net Worth is securely aggregated at{' '}
            <strong className="text-emerald-400 font-mono">
              {formatCurrency(totalNetWorth, user?.currency)}
            </strong>. Balances cannot be manually forged; funds are only adjusted through verifiable transfers and transactions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setTransferDefaultSource(undefined);
              setShowTransfer(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs shadow-lg shadow-violet-600/20 transition active:scale-95"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>Transfer Funds</span>
          </button>
          <button
            onClick={() => setShowAddWallet(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Wallet</span>
          </button>
        </div>
      </div>

      {/* Wallets Grid - Balances are completely tamper proof */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wallets.map((wallet) => {
          const percentOfNetWorth =
            totalNetWorth > 0
              ? Math.max(0, Math.round((wallet.balance / totalNetWorth) * 100))
              : 0;

          return (
            <div
              key={wallet.id}
              className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 hover:border-gray-700 transition flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      style={{ backgroundColor: `${wallet.color}20`, color: wallet.color }}
                      className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/5"
                    >
                      {getWalletIcon(wallet.icon)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">{wallet.name}</h3>
                      <p className="text-xs text-gray-500 font-mono">
                        {wallet.accountNumber || wallet.type}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">
                    {wallet.type.replace('_', ' ')}
                  </span>
                </div>

                {/* Read-Only Balance Display */}
                <div className="mt-5 space-y-1">
                  <span className="text-[10px] text-gray-500 uppercase font-semibold block">
                    Verified Balance
                  </span>
                  <div className="text-2xl font-black text-white font-mono">
                    {formatCurrency(wallet.balance, user?.currency)}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                    <span>Share of Net Worth</span>
                    <span className="font-semibold text-gray-300">{percentOfNetWorth}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-gray-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentOfNetWorth}%`,
                        backgroundColor: wallet.color,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Transfer out shortcut */}
              <div className="pt-3 border-t border-gray-800 flex items-center justify-between">
                <span className="text-[11px] text-gray-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Audit Safe
                </span>
                <button
                  onClick={() => {
                    setTransferDefaultSource(wallet.id);
                    setShowTransfer(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 text-violet-400" />
                  <span>Transfer From</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Wallet Modal */}
      {showAddWallet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-800 bg-gray-950/70 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <WalletIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">Add New Wallet</h3>
                  <p className="text-xs text-gray-400">Configure a cash drawer, bank, or mobile wallet</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddWallet(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWallet} className="p-5 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Wallet / Account Name
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. BRAC Bank, Nagad, Locker Cash"
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Account Type
                </label>
                <select
                  value={walletType}
                  onChange={(e) => setWalletType(e.target.value as WalletType)}
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                >
                  {WALLET_TYPES.map((t) => (
                    <option key={t.type} value={t.type}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Opening Balance ({user?.currencySymbol || '৳'})
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={initialBalance}
                  onChange={(e) => setInitialBalance(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Account Number / Details (Optional)
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="e.g. •••• 4512 or 01712-XXXXXX"
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Color Accent</label>
                <div className="flex items-center gap-2">
                  {WALLET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      style={{ backgroundColor: c }}
                      className={`w-7 h-7 rounded-full transition ${
                        color === c ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowAddWallet(false)}
                  className="px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs shadow-md transition active:scale-95"
                >
                  Create Wallet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Funds Modal */}
      <TransferModal
        isOpen={showTransfer}
        onClose={() => setShowTransfer(false)}
        defaultFromWalletId={transferDefaultSource}
      />
    </div>
  );
};
