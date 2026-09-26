import React, { useState } from 'react';
import { User, Phone, DollarSign, Sparkles, Check, Image as ImageIcon, Mail } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { CURRENCY_LIST } from '../utils/formatters';
import { CurrencyCode } from '../types/finance';
import { AvatarPicker } from './AvatarPicker';
import { generateGoogleAvatar } from '../utils/avatarUtils';

export const OnboardingModal: React.FC = () => {
  const { isNewUserOnboarding, currentUserEmail, completeOnboarding, loginWithEmail } = useFinance();

  const [emailInput, setEmailInput] = useState(currentUserEmail || 'afmabdur2@gmail.com');
  const [fullName, setFullName] = useState('Abdur Rahman');
  const [phone, setPhone] = useState('+8801711223344');
  const [currency, setCurrency] = useState<CurrencyCode>('BDT'); // Default BDT as requested!
  const [monthlyBudget, setMonthlyBudget] = useState('75000');
  const [selectedAvatar, setSelectedAvatar] = useState(() =>
    generateGoogleAvatar('Abdur Rahman', currentUserEmail || 'afmabdur2@gmail.com')
  );

  if (!isNewUserOnboarding) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    if (emailInput.trim().toLowerCase() !== currentUserEmail.toLowerCase()) {
      loginWithEmail(emailInput.trim().toLowerCase());
    }

    completeOnboarding({
      fullName: fullName.trim() || 'User',
      phone: phone.trim() || '+8801700000000',
      currency,
      avatar: selectedAvatar,
      monthlyBudget: Number(monthlyBudget) || 50000,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Banner */}
        <div className="p-6 bg-gradient-to-br from-emerald-950/80 via-gray-900 to-gray-950 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-gray-950 font-bold shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                Welcome to SpendWise Pro
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Create Your Financial Profile
              </h2>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            Let's configure your currency, personal details, and debt reminder preferences.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Email verification / input */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              Your Account Email
            </label>
            <input
              type="email"
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-800/80 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              placeholder="e.g. yourname@gmail.com"
            />
          </div>

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
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-800/80 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              placeholder="e.g. Abdur Rahman"
            />
          </div>

          {/* Avatar Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
              Choose Profile Photo (Emoji, Google Account, or Upload)
            </label>
            <AvatarPicker
              currentAvatar={selectedAvatar}
              onSelectAvatar={(newAvatar) => setSelectedAvatar(newAvatar)}
              userName={fullName}
              userEmail={emailInput}
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
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-800/80 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            >
              {CURRENCY_LIST.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.symbol})
                </option>
              ))}
            </select>
            <p className="mt-1 text-[11px] text-gray-400">
              Default is set to Bangladeshi Taka (৳). You can change this at any time.
            </p>
          </div>

          {/* Phone / WhatsApp Number */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              Phone / WhatsApp Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-800/80 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-mono"
              placeholder="+8801711223344"
            />
            <p className="mt-1 text-[11px] text-gray-400">
              Used when generating Friendly Reminder messages for money lent to friends.
            </p>
          </div>

          {/* Monthly Budget Target */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Monthly Spending Target ({currency})
            </label>
            <input
              type="number"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-800/80 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              placeholder="e.g. 75000"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-gray-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition active:scale-[0.98]"
            >
              Get Started with SpendWise
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
