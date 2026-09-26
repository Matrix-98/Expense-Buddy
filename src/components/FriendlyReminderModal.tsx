import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  Copy,
  Check,
  Phone,
  Send,
  Sparkles,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { DebtRecord } from '../types/finance';
import {
  formatCurrency,
  formatDate,
  getSmsUrl,
  getWhatsAppUrl,
  REMINDER_TONES,
} from '../utils/formatters';

interface FriendlyReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  debt: DebtRecord | null;
}

export const FriendlyReminderModal: React.FC<FriendlyReminderModalProps> = ({
  isOpen,
  onClose,
  debt,
}) => {
  const { user } = useFinance();
  const [selectedToneId, setSelectedToneId] = useState<'cordial' | 'gentle' | 'formal'>('cordial');
  const [customPhone, setCustomPhone] = useState(debt?.phone || '');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !debt || !user) return null;

  const activeTone = REMINDER_TONES.find((t) => t.id === selectedToneId) || REMINDER_TONES[0];
  const reminderMessage = activeTone.generateText(debt, user);
  const targetPhone = customPhone.trim() || debt.phone;

  const whatsAppUrl = getWhatsAppUrl(targetPhone, reminderMessage);
  const smsUrl = getSmsUrl(targetPhone, reminderMessage);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reminderMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-emerald-950/60 to-gray-950">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                  Requirement 5.6
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Friendly Payment Reminder
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            Generate and send a polite reminder to <strong>{debt.personName}</strong> for{' '}
            <strong className="text-emerald-400">
              {formatCurrency(debt.remainingAmount, user.currency)}
            </strong>.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Tone Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Select Reminder Tone
            </label>
            <div className="grid grid-cols-3 gap-2">
              {REMINDER_TONES.map((tone) => (
                <button
                  key={tone.id}
                  type="button"
                  onClick={() => setSelectedToneId(tone.id)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-medium border text-center transition ${
                    selectedToneId === tone.id
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm'
                      : 'bg-gray-800/60 border-gray-700/60 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {tone.label}
                </button>
              ))}
            </div>
          </div>

          {/* Recipient Phone */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              Recipient Phone / WhatsApp
            </label>
            <input
              type="text"
              value={customPhone}
              onChange={(e) => setCustomPhone(e.target.value)}
              placeholder="e.g. +8801711223344"
              className="w-full px-3.5 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs font-mono placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <p className="mt-1 text-[11px] text-gray-500">
              International format (e.g. +880...) is recommended for one-tap WhatsApp dispatch.
            </p>
          </div>

          {/* Generated Message Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-gray-300">Message Preview</label>
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-3.5 rounded-2xl bg-gray-950 border border-gray-800 text-xs text-gray-200 leading-relaxed font-sans relative">
              "{reminderMessage}"
            </div>
          </div>

          {/* Quick Launch Buttons */}
          <div className="space-y-2 pt-2">
            {/* WhatsApp Link with standard URI scheme */}
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition active:scale-[0.98]"
            >
              <Send className="w-4 h-4" />
              <span>Send via WhatsApp (wa.me)</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            {/* SMS Link with standard URI scheme */}
            <a
              href={smsUrl}
              className="w-full py-2.5 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold text-xs flex items-center justify-center gap-2 border border-gray-700 transition active:scale-[0.98]"
            >
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <span>Send via Native SMS App (sms:)</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 bg-gray-950/70 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
