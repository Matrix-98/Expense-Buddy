import React, { useState } from 'react';
import {
  Wallet,
  Building2,
  Smartphone,
  Banknote,
  PiggyBank,
  Check,
  ArrowRight,
  User,
  Phone,
  DollarSign,
  Plus,
  Trash2,
  Sparkles,
  CreditCard,
} from 'lucide-react';
import { useFinance, InitialWalletSetupItem } from '../context/FinanceContext';
import { CURRENCY_LIST, formatCurrency } from '../utils/formatters';
import { CurrencyCode, WalletType } from '../types/finance';
import { AvatarPicker } from './AvatarPicker';
import { generateGoogleAvatar } from '../utils/avatarUtils';
import { AppLogo } from './AppLogo';

export const AccountSetupWizard: React.FC = () => {
  const { currentUserEmail, setupInitialAccount } = useFinance();

  const [step, setStep] = useState<1 | 2>(1);

  // Profile data
  const [fullName, setFullName] = useState('Abdur Rahman');
  const [phone, setPhone] = useState('+8801711223344');
  const [currency, setCurrency] = useState<CurrencyCode>('BDT'); // Default BDT
  const [avatar, setAvatar] = useState(() =>
    generateGoogleAvatar('Abdur Rahman', currentUserEmail)
  );

  // Initial Wallets Setup (Requirement: adjust their balances to begin their account and give bank accounts)
  const [walletsList, setWalletsList] = useState<InitialWalletSetupItem[]>([
    {
      name: 'Physical Cash',
      type: 'cash',
      balance: 10000,
      accountNumber: 'Cash in Hand',
      color: '#10B981',
      icon: 'Banknote',
    },
    {
      name: 'Primary Bank Account',
      type: 'bank',
      balance: 75000,
      accountNumber: 'City Bank •••• 8921',
      color: '#3B82F6',
      icon: 'Building2',
    },
    {
      name: 'bKash / Mobile Wallet',
      type: 'mobile_wallet',
      balance: 15000,
      accountNumber: '01711-223344',
      color: '#EC4899',
      icon: 'Smartphone',
    },
    {
      name: 'Dedicated Savings',
      type: 'savings',
      balance: 50000,
      accountNumber: 'High-Yield Reserve',
      color: '#8B5CF6',
      icon: 'PiggyBank',
      isDefaultSavings: true,
    },
  ]);

  const [customName, setCustomName] = useState('');
  const [customBalance, setCustomBalance] = useState('');
  const [customType, setCustomType] = useState<WalletType>('bank');
  const [showAddCustom, setShowAddCustom] = useState(false);

  const totalStartingBalance = walletsList.reduce(
    (sum, w) => sum + (Number(w.balance) || 0),
    0
  );

  const handleUpdateWallet = (index: number, field: keyof InitialWalletSetupItem, value: any) => {
    setWalletsList((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemoveWallet = (index: number) => {
    setWalletsList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddCustomWallet = () => {
    if (!customName.trim()) return;
    const item: InitialWalletSetupItem = {
      name: customName.trim(),
      type: customType,
      balance: Number(customBalance) || 0,
      color: '#06B6D4',
      icon: customType === 'credit' ? 'CreditCard' : 'Building2',
    };
    setWalletsList((prev) => [...prev, item]);
    setCustomName('');
    setCustomBalance('');
    setShowAddCustom(false);
  };

  const handleFinish = () => {
    setupInitialAccount(
      {
        fullName,
        phone,
        currency,
        avatar,
        monthlyBudget: 80000,
      },
      walletsList
    );
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-gray-100 flex flex-col justify-center items-center p-4 selection:bg-emerald-500 selection:text-black">
      <div className="w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Wizard Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <AppLogo size="sm" />
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {step === 1 ? '1. Personal Profile' : '2. Adjust Starting Balances'}
              </h2>
              <p className="text-xs text-gray-400">
                {step === 1
                  ? 'Set your name, phone, and preferred currency (Default: BDT ৳)'
                  : 'Enter your bank details and starting balances to calibrate your account'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                step === 1 ? 'bg-emerald-400' : 'bg-gray-700'
              }`}
            />
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                step === 2 ? 'bg-emerald-400' : 'bg-gray-700'
              }`}
            />
          </div>
        </div>

        {/* STEP 1: Profile & Currency */}
        {step === 1 && (
          <div className="space-y-5 animate-fadeIn">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-gray-400" />
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Abdur Rahman"
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            {/* Avatar selector */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Choose Profile Photo (Emoji, Google Account, or Upload)
              </label>
              <AvatarPicker
                currentAvatar={avatar}
                onSelectAvatar={(newAvatar) => setAvatar(newAvatar)}
                userName={fullName}
                userEmail={currentUserEmail}
              />
            </div>

            {/* Preferred Currency - Default BDT */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                Preferred Currency (Default: BDT ৳)
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              >
                {CURRENCY_LIST.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.symbol})
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[11px] text-gray-400">
                Defaulted to Bangladeshi Taka (৳). You can change this at any time in settings.
              </p>
            </div>

            {/* Phone Number for WhatsApp debt reminders */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                Phone / WhatsApp Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+8801711223344"
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-mono"
              />
              <p className="mt-1 text-[11px] text-gray-500">
                Used to dispatch friendly payment reminders to people who borrow money from you.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs shadow-md transition active:scale-95"
              >
                <span>Continue to Balances & Accounts</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Adjust Starting Balances & Bank Accounts */}
        {step === 2 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="p-3.5 rounded-2xl bg-gray-950 border border-gray-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-gray-500 uppercase font-semibold block">
                  Total Initial Starting Balance
                </span>
                <span className="text-xl font-black text-emerald-400 font-mono">
                  {formatCurrency(totalStartingBalance, currency)}
                </span>
              </div>
              <span className="text-xs text-gray-400">
                {walletsList.length} accounts configured
              </span>
            </div>

            {/* List of starting accounts */}
            <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
              {walletsList.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-gray-800/60 border border-gray-700/60 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                        style={{ backgroundColor: item.color }}
                      >
                        {item.type === 'bank' ? (
                          <Building2 className="w-3.5 h-3.5" />
                        ) : item.type === 'mobile_wallet' ? (
                          <Smartphone className="w-3.5 h-3.5" />
                        ) : item.type === 'savings' ? (
                          <PiggyBank className="w-3.5 h-3.5" />
                        ) : (
                          <Banknote className="w-3.5 h-3.5" />
                        )}
                      </span>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleUpdateWallet(idx, 'name', e.target.value)}
                        className="bg-transparent font-bold text-white text-xs focus:outline-none border-b border-dashed border-gray-600 focus:border-emerald-400 pb-0.5"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveWallet(idx)}
                      className="text-gray-500 hover:text-rose-400 p-1"
                      title="Remove account"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-gray-400 block mb-0.5">
                        Account / Note
                      </label>
                      <input
                        type="text"
                        value={item.accountNumber || ''}
                        onChange={(e) =>
                          handleUpdateWallet(idx, 'accountNumber', e.target.value)
                        }
                        placeholder="e.g. City Bank •••• 8921"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-gray-900 border border-gray-700 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-gray-400 block mb-0.5">
                        Starting Balance ({currency})
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.balance}
                        onChange={(e) =>
                          handleUpdateWallet(idx, 'balance', Number(e.target.value))
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-gray-900 border border-gray-700 text-xs text-white font-mono font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add another account expander */}
            {!showAddCustom ? (
              <button
                type="button"
                onClick={() => setShowAddCustom(true)}
                className="w-full py-2 rounded-xl border border-dashed border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Another Account or Card</span>
              </button>
            ) : (
              <div className="p-3.5 rounded-2xl bg-gray-950 border border-gray-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-300">
                  <span>Add New Account</span>
                  <button
                    type="button"
                    onClick={() => setShowAddCustom(false)}
                    className="text-gray-500 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Account Name..."
                    className="col-span-2 px-2.5 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-xs text-white"
                  />
                  <input
                    type="number"
                    value={customBalance}
                    onChange={(e) => setCustomBalance(e.target.value)}
                    placeholder="Balance..."
                    className="px-2.5 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-xs text-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddCustomWallet}
                  className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
                >
                  Confirm Account
                </button>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-gray-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-gray-400 hover:text-white"
              >
                ← Back
              </button>

              <button
                type="button"
                onClick={handleFinish}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-gray-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition active:scale-95"
              >
                <span>Launch Expense Buddy</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
