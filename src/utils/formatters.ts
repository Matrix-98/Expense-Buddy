import { CurrencyCode, CurrencyConfig, DebtRecord, UserProfile } from '../types/finance';

export const CURRENCY_LIST: CurrencyConfig[] = [
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka (BDT)', locale: 'en-BD' },
  { code: 'USD', symbol: '$', name: 'US Dollar (USD)', locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'British Pound (GBP)', locale: 'en-GB' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (INR)', locale: 'en-IN' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal (SAR)', locale: 'ar-SA' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham (AED)', locale: 'ar-AE' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar (CAD)', locale: 'en-CA' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar (AUD)', locale: 'en-AU' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen (JPY)', locale: 'ja-JP' },
];

export function getCurrencyConfig(code: CurrencyCode = 'BDT'): CurrencyConfig {
  return CURRENCY_LIST.find((c) => c.code === code) || CURRENCY_LIST[0];
}

export function formatCurrency(amount: number, currencyCode: CurrencyCode = 'BDT'): string {
  const config = getCurrencyConfig(currencyCode);
  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${config.symbol} ${formattedNumber}`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const d = new Date(dateString.includes('T') ? dateString : `${dateString}T00:00:00`);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatMonthYear(monthKey: string): string {
  // monthKey is YYYY-MM
  if (!monthKey || !monthKey.includes('-')) return monthKey;
  const [year, month] = monthKey.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function cleanPhoneNumber(phone: string): string {
  if (!phone) return '';
  return phone.replace(/[^\d+]/g, '');
}

export interface ReminderTone {
  id: 'cordial' | 'gentle' | 'formal';
  label: string;
  generateText: (debt: DebtRecord, user: UserProfile) => string;
}

export const REMINDER_TONES: ReminderTone[] = [
  {
    id: 'cordial',
    label: 'Cordial & Friendly',
    generateText: (debt, user) => {
      const amountStr = formatCurrency(debt.remainingAmount, user.currency);
      const senderName = user.fullName || 'me';
      return `Hi ${debt.personName}! Hope you're doing well. Just a gentle note regarding the ${amountStr} balance from our transaction on ${formatDate(debt.date)}. Whenever you get a moment, please let me know or send it over. Thanks so much! - ${senderName}`;
    },
  },
  {
    id: 'gentle',
    label: 'Casual Quick Ping',
    generateText: (debt, user) => {
      const amountStr = formatCurrency(debt.remainingAmount, user.currency);
      return `Hey ${debt.personName}, friendly check-in about the ${amountStr} balance remaining. Let me know when convenient to settle up. Cheers!`;
    },
  },
  {
    id: 'formal',
    label: 'Direct & Clear',
    generateText: (debt, user) => {
      const amountStr = formatCurrency(debt.remainingAmount, user.currency);
      const dueInfo = debt.dueDate ? ` (Due: ${formatDate(debt.dueDate)})` : '';
      return `Dear ${debt.personName}, this is a payment reminder for the pending balance of ${amountStr}${dueInfo} regarding our loan logged on ${formatDate(debt.date)}. Please arrange the repayment to your earliest convenience. Thank you.`;
    },
  },
];

export function getWhatsAppUrl(phone: string, text: string): string {
  const clean = cleanPhoneNumber(phone).replace(/^\+/, '');
  const encoded = encodeURIComponent(text);
  if (clean) {
    return `https://wa.me/${clean}?text=${encoded}`;
  }
  return `https://wa.me/?text=${encoded}`;
}

export function getSmsUrl(phone: string, text: string): string {
  const clean = cleanPhoneNumber(phone);
  const encoded = encodeURIComponent(text);
  if (clean) {
    return `sms:${clean}?body=${encoded}`;
  }
  return `sms:?body=${encoded}`;
}
