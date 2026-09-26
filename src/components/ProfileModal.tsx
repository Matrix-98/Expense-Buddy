import React, { useState } from 'react';
import { X, User, Phone, DollarSign, LogOut, Check, Image as ImageIcon, Mail } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { CURRENCY_LIST } from '../utils/formatters';
import { CurrencyCode } from '../types/finance';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
];

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, currentUserEmail, updateProfile, loginWithEmail, logout } = useFinance();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [currency, setCurrency] = useState<CurrencyCode>(user?.currency || 'BDT');
  const [monthlyBudget, setMonthlyBudget] = useState(String(user?.monthlyBudget || 75000));
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || AVATAR_OPTIONS[0]);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [switchEmail, setSwitchEmail] = useState('');
  const [showSwitchEmail, setShowSwitchEmail] = useState(false);

  if (!isOpen || !user) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName: fullName.trim() || user.fullName,
      phone: phone.trim() || user.phone,
      currency,
      avatar: customAvatarUrl.trim() || selectedAvatar,
      monthlyBudget: Number(monthlyBudget) || user.monthlyBudget,
    });
    onClose();
  };

  const handleSwitchAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!switchEmail.trim()) return;
    loginWithEmail(switchEmail.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-gray-950/60">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.fullName}
              className="w-10 h-10 rounded-full object-cover border border-emerald-500/40"
            />
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Your Financial Profile</h2>
              <p className="text-xs text-gray-400">{currentUserEmail}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 text-sm">
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
              className="w-full px-3.5 py-2 rounded-xl bg-gray-800/80 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          {/* Avatar Picker */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-gray-400" />
              Profile Photo / Avatar
            </label>
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {AVATAR_OPTIONS.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedAvatar(url);
                    setCustomAvatarUrl('');
                  }}
                  className={`relative w-11 h-11 rounded-full overflow-hidden shrink-0 border-2 transition ${
                    selectedAvatar === url && !customAvatarUrl
                      ? 'border-emerald-500 scale-105'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                  {selectedAvatar === url && !customAvatarUrl && (
                    <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={customAvatarUrl}
              onChange={(e) => setCustomAvatarUrl(e.target.value)}
              placeholder="Or enter custom image URL"
              className="mt-2 w-full px-3 py-1.5 text-xs rounded-lg bg-gray-800/60 border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Preferred Currency */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              Preferred Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-800/80 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            >
              {CURRENCY_LIST.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              Phone / WhatsApp Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-800/80 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-mono"
            />
          </div>

          {/* Monthly Budget */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Monthly Budget ({currency})
            </label>
            <input
              type="number"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-800/80 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          {/* Account switcher toggle */}
          <div className="pt-2 border-t border-gray-800">
            <button
              type="button"
              onClick={() => setShowSwitchEmail(!showSwitchEmail)}
              className="text-xs text-gray-400 hover:text-emerald-400 flex items-center gap-1.5 transition"
            >
              <Mail className="w-3.5 h-3.5" />
              {showSwitchEmail ? 'Hide Account Switcher' : 'Switch Account / Login with different email'}
            </button>

            {showSwitchEmail && (
              <div className="mt-2.5 p-3 rounded-xl bg-gray-950 border border-gray-800 space-y-2">
                <input
                  type="email"
                  value={switchEmail}
                  onChange={(e) => setSwitchEmail(e.target.value)}
                  placeholder="Enter email address..."
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleSwitchAccount}
                  className="w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition"
                >
                  Switch / Open Workspace
                </button>
              </div>
            )}
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={() => {
                logout();
                onClose();
              }}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs shadow-md transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
