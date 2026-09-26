export type CurrencyCode = 'BDT' | 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD' | 'JPY' | 'SAR' | 'AED';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  locale: string;
}

export type LanguageCode = 'en' | 'bn' | 'ar' | 'hi' | 'es';

export interface LanguageConfig {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatar: string;
  phone: string;
  currency: CurrencyCode;
  currencySymbol: string;
  language?: LanguageCode;
  monthlyBudget: number;
  createdAt: string;
}

export interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
  walletId: string; // desired wallet of choice to deduct from
  category: string;
  billingDay: number; // day of month: 1 - 31
  active: boolean;
  lastDeductedMonth?: string; // YYYY-MM
  createdAt: string;
  notes?: string;
}

export type WalletType = 'cash' | 'bank' | 'mobile_wallet' | 'savings' | 'credit';

export interface Wallet {
  id: string;
  name: string;
  balance: number;
  type: WalletType;
  color: string;
  icon: string;
  accountNumber?: string;
  isDefaultSavings?: boolean;
}

export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  walletId: string;
  toWalletId?: string; // only for transfer
  category: string;
  date: string; // YYYY-MM-DD
  time?: string;
  note: string;
  tags?: string[];
  referenceDebtId?: string;
  referenceGoalId?: string;
}

export type DebtType = 'lent' | 'borrowed'; // lent = money lent to someone (owed to user); borrowed = money borrowed (user owes)
export type DebtStatus = 'active' | 'settled';

export interface DebtRepayment {
  id: string;
  amount: number;
  date: string;
  walletId: string;
  note: string;
}

export interface DebtRecord {
  id: string;
  personName: string;
  phone: string;
  originalAmount: number;
  remainingAmount: number;
  debtType: DebtType;
  walletId: string; // initial wallet impacted
  date: string;
  dueDate?: string;
  notes: string;
  status: DebtStatus;
  repayments: DebtRepayment[];
}

export interface GoalContribution {
  id: string;
  amount: number;
  type: 'deposit' | 'withdraw';
  date: string;
  walletId: string;
  note: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentSavedAmount: number;
  walletId: string; // associated savings wallet
  targetDate?: string;
  icon: string;
  color: string;
  notes?: string;
  history: GoalContribution[];
}

export interface MonthSummary {
  monthKey: string; // YYYY-MM
  label: string;
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  transfersCount: number;
  transfersVolume: number;
}
