import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  CurrencyCode,
  DebtRecord,
  DebtRepayment,
  DebtType,
  LanguageCode,
  RecurringExpense,
  SavingsGoal,
  Transaction,
  TransactionType,
  UserProfile,
  Wallet,
  WalletType,
} from '../types/finance';
import {
  createDefaultProfile,
  createInitialDebts,
  createInitialGoals,
  createInitialRecurringExpenses,
  createInitialTransactions,
  createInitialWallets,
  INITIAL_USER_EMAIL,
} from '../utils/demoData';
import { getCurrencyConfig } from '../utils/formatters';

export type AppScreen = 'landing' | 'login' | 'setup' | 'app';

export interface InitialWalletSetupItem {
  name: string;
  type: WalletType;
  balance: number;
  accountNumber?: string;
  color?: string;
  icon?: string;
  isDefaultSavings?: boolean;
}

interface FinanceContextType {
  appScreen: AppScreen;
  setAppScreen: (screen: AppScreen) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  user: UserProfile | null;
  currentUserEmail: string;
  isNewUserOnboarding: boolean;
  wallets: Wallet[];
  transactions: Transaction[];
  debts: DebtRecord[];
  savingsGoals: SavingsGoal[];
  recurringExpenses: RecurringExpense[];
  selectedMonth: string; // YYYY-MM
  setSelectedMonth: (month: string) => void;
  // Computed stats
  totalNetWorth: number;
  totalMoneyLent: number; // Receivable
  totalMoneyBorrowed: number; // Payable
  netDebtPosition: number; // Lent - Borrowed
  activeDebtsCount: number;
  totalMonthlyRecurring: number;
  monthIncome: number;
  monthExpense: number;
  monthTransfersVolume: number;
  // Authentication & Onboarding
  loginWithSocial: (provider: 'google' | 'facebook' | 'phone' | 'email', identity: string, name?: string) => void;
  setupInitialAccount: (profile: Partial<UserProfile>, startingWallets: InitialWalletSetupItem[]) => void;
  loginWithEmail: (email: string) => void;
  completeOnboarding: (data: Partial<UserProfile>) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  logout: () => void;
  quickDemoLogin: () => void;
  // Wallets
  addWallet: (wallet: Omit<Wallet, 'id' | 'balance'> & { initialBalance?: number }) => void;
  // Transactions
  addTransaction: (tx: {
    type: TransactionType;
    amount: number;
    walletId: string;
    toWalletId?: string;
    category: string;
    date: string;
    time?: string;
    note: string;
    tags?: string[];
  }) => void;
  deleteTransaction: (id: string) => void;
  // Transfer Funds (Requirement 4.5 & 4.6)
  transferFunds: (transfer: {
    fromWalletId: string;
    toWalletId: string;
    amount: number;
    date: string;
    note: string;
  }) => void;
  // Debts & IOU (Requirement 5.1 - 5.6)
  addDebt: (debt: {
    personName: string;
    phone: string;
    amount: number;
    debtType: DebtType;
    walletId: string;
    date: string;
    dueDate?: string;
    notes: string;
  }) => void;
  logDebtRepayment: (data: {
    debtId: string;
    amount: number;
    walletId: string;
    date: string;
    note: string;
  }) => void;
  settleDebtDirectly: (debtId: string, walletId: string) => void;
  deleteDebt: (id: string) => void;
  // Savings Goals (Requirement 6.1 - 6.3)
  addSavingsGoal: (goal: {
    name: string;
    targetAmount: number;
    initialDeposit?: number;
    walletId: string;
    targetDate?: string;
    icon?: string;
    color?: string;
    notes?: string;
  }) => void;
  contributeToGoal: (data: {
    goalId: string;
    amount: number;
    type: 'deposit' | 'withdraw';
    walletId: string;
    note: string;
  }) => void;
  deleteGoal: (id: string) => void;
  // Recurring Expenses
  addRecurringExpense: (expense: {
    name: string;
    amount: number;
    walletId: string;
    category: string;
    billingDay: number;
    notes?: string;
  }) => void;
  updateRecurringExpense: (id: string, data: Partial<RecurringExpense>) => void;
  deleteRecurringExpense: (id: string) => void;
  toggleRecurringActive: (id: string) => void;
  deductRecurringExpense: (id: string) => void;
  resetAllData: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'expensebuddy_v1_';

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUserEmail, setCurrentUserEmail] = useState<string>(() => {
    return localStorage.getItem('expensebuddy_active_email') || INITIAL_USER_EMAIL;
  });

  const [language, setLanguageState] = useState<LanguageCode>(() => {
    return (localStorage.getItem('expensebuddy_language') as LanguageCode) || 'bn'; // default Bangla
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('expensebuddy_language', lang);
  };

  const [appScreen, setAppScreen] = useState<AppScreen>(() => {
    const hasVisited = localStorage.getItem('expensebuddy_has_visited');
    return hasVisited ? 'app' : 'landing';
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}user_${currentUserEmail}`);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return createDefaultProfile(currentUserEmail);
      }
    }
    if (currentUserEmail === INITIAL_USER_EMAIL) {
      const defaultProf = createDefaultProfile(currentUserEmail);
      localStorage.setItem(`${STORAGE_KEY_PREFIX}user_${currentUserEmail}`, JSON.stringify(defaultProf));
      return defaultProf;
    }
    return null;
  });

  const [isNewUserOnboarding, setIsNewUserOnboarding] = useState<boolean>(() => {
    return !user;
  });

  const [wallets, setWallets] = useState<Wallet[]>(() => {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}wallets_${currentUserEmail}`);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return createInitialWallets();
      }
    }
    const initial = createInitialWallets();
    localStorage.setItem(`${STORAGE_KEY_PREFIX}wallets_${currentUserEmail}`, JSON.stringify(initial));
    return initial;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}transactions_${currentUserEmail}`);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return createInitialTransactions();
      }
    }
    const initial = createInitialTransactions();
    localStorage.setItem(`${STORAGE_KEY_PREFIX}transactions_${currentUserEmail}`, JSON.stringify(initial));
    return initial;
  });

  const [debts, setDebts] = useState<DebtRecord[]>(() => {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}debts_${currentUserEmail}`);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return createInitialDebts();
      }
    }
    const initial = createInitialDebts();
    localStorage.setItem(`${STORAGE_KEY_PREFIX}debts_${currentUserEmail}`, JSON.stringify(initial));
    return initial;
  });

  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}goals_${currentUserEmail}`);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return createInitialGoals();
      }
    }
    const initial = createInitialGoals();
    localStorage.setItem(`${STORAGE_KEY_PREFIX}goals_${currentUserEmail}`, JSON.stringify(initial));
    return initial;
  });

  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>(() => {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}recurring_${currentUserEmail}`);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return createInitialRecurringExpenses();
      }
    }
    const initial = createInitialRecurringExpenses();
    localStorage.setItem(`${STORAGE_KEY_PREFIX}recurring_${currentUserEmail}`, JSON.stringify(initial));
    return initial;
  });

  // Current month default in YYYY-MM
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  });

  // Save changes to localStorage per user email
  useEffect(() => {
    if (currentUserEmail) {
      localStorage.setItem('expensebuddy_active_email', currentUserEmail);
    }
  }, [currentUserEmail]);

  useEffect(() => {
    if (user && currentUserEmail) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}user_${currentUserEmail}`, JSON.stringify(user));
    }
  }, [user, currentUserEmail]);

  useEffect(() => {
    if (currentUserEmail) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}wallets_${currentUserEmail}`, JSON.stringify(wallets));
    }
  }, [wallets, currentUserEmail]);

  useEffect(() => {
    if (currentUserEmail) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}transactions_${currentUserEmail}`, JSON.stringify(transactions));
    }
  }, [transactions, currentUserEmail]);

  useEffect(() => {
    if (currentUserEmail) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}debts_${currentUserEmail}`, JSON.stringify(debts));
    }
  }, [debts, currentUserEmail]);

  useEffect(() => {
    if (currentUserEmail) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}goals_${currentUserEmail}`, JSON.stringify(savingsGoals));
    }
  }, [savingsGoals, currentUserEmail]);

  useEffect(() => {
    if (currentUserEmail) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}recurring_${currentUserEmail}`, JSON.stringify(recurringExpenses));
    }
  }, [recurringExpenses, currentUserEmail]);

  // Social / Phone Login handler
  const loginWithSocial = (
    provider: 'google' | 'facebook' | 'phone' | 'email',
    identity: string,
    displayName?: string
  ) => {
    const cleanId = identity.trim().toLowerCase();
    setCurrentUserEmail(cleanId);
    localStorage.setItem('expensebuddy_has_visited', 'true');

    const existingUserRaw = localStorage.getItem(`${STORAGE_KEY_PREFIX}user_${cleanId}`);
    if (existingUserRaw) {
      try {
        const parsed = JSON.parse(existingUserRaw);
        setUser(parsed);
        setIsNewUserOnboarding(false);

        // Load existing data
        const wRaw = localStorage.getItem(`${STORAGE_KEY_PREFIX}wallets_${cleanId}`);
        setWallets(wRaw ? JSON.parse(wRaw) : createInitialWallets());
        const tRaw = localStorage.getItem(`${STORAGE_KEY_PREFIX}transactions_${cleanId}`);
        setTransactions(tRaw ? JSON.parse(tRaw) : createInitialTransactions());
        const dRaw = localStorage.getItem(`${STORAGE_KEY_PREFIX}debts_${cleanId}`);
        setDebts(dRaw ? JSON.parse(dRaw) : createInitialDebts());
        const gRaw = localStorage.getItem(`${STORAGE_KEY_PREFIX}goals_${cleanId}`);
        setSavingsGoals(gRaw ? JSON.parse(gRaw) : createInitialGoals());
        const rRaw = localStorage.getItem(`${STORAGE_KEY_PREFIX}recurring_${cleanId}`);
        setRecurringExpenses(rRaw ? JSON.parse(rRaw) : createInitialRecurringExpenses());

        setAppScreen('app');
        return;
      } catch {
        // Continue to setup
      }
    }

    setAppScreen('setup');
  };

  // Initial Account Setup Wizard
  const setupInitialAccount = (
    profileData: Partial<UserProfile>,
    startingWallets: InitialWalletSetupItem[]
  ) => {
    const currency = (profileData.currency || 'BDT') as CurrencyCode;
    const config = getCurrencyConfig(currency);

    const newProfile: UserProfile = {
      id: `user_${Date.now()}`,
      email: currentUserEmail,
      fullName: profileData.fullName || currentUserEmail.split('@')[0],
      avatar:
        profileData.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      phone: profileData.phone || '+8801700000000',
      currency,
      currencySymbol: config.symbol,
      language: language,
      monthlyBudget: Number(profileData.monthlyBudget) || 50000,
      createdAt: new Date().toISOString(),
    };

    const createdWallets: Wallet[] = startingWallets.map((item, index) => ({
      id: `wallet_${Date.now()}_${index}`,
      name: item.name,
      balance: Math.max(0, Number(item.balance) || 0),
      type: item.type,
      color: item.color || '#3B82F6',
      icon: item.icon || 'Wallet',
      accountNumber: item.accountNumber,
      isDefaultSavings: item.isDefaultSavings,
    }));

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().slice(0, 5);

    const openingTxs: Transaction[] = createdWallets
      .filter((w) => w.balance > 0)
      .map((w, idx) => ({
        id: `tx_opening_${Date.now()}_${idx}`,
        type: 'income',
        amount: w.balance,
        walletId: w.id,
        category: 'Opening Balance',
        date: dateStr,
        time: timeStr,
        note: `Account setup initial balance for ${w.name}`,
        tags: ['Opening Balance'],
      }));

    setUser(newProfile);
    setWallets(createdWallets);
    setTransactions(openingTxs);
    setDebts([]);
    setSavingsGoals([]);
    setRecurringExpenses(createInitialRecurringExpenses());
    setIsNewUserOnboarding(false);
    localStorage.setItem('expensebuddy_has_visited', 'true');
    setAppScreen('app');
  };

  const loginWithEmail = (email: string) => {
    loginWithSocial('email', email);
  };

  const quickDemoLogin = () => {
    setCurrentUserEmail(INITIAL_USER_EMAIL);
    const defaultProf = createDefaultProfile(INITIAL_USER_EMAIL);
    setUser(defaultProf);
    setWallets(createInitialWallets());
    setTransactions(createInitialTransactions());
    setDebts(createInitialDebts());
    setSavingsGoals(createInitialGoals());
    setRecurringExpenses(createInitialRecurringExpenses());
    setIsNewUserOnboarding(false);
    localStorage.setItem('expensebuddy_has_visited', 'true');
    setAppScreen('app');
  };

  const completeOnboarding = (data: Partial<UserProfile>) => {
    const currency = (data.currency || 'BDT') as CurrencyCode;
    const config = getCurrencyConfig(currency);
    const newProfile: UserProfile = {
      id: `user_${Date.now()}`,
      email: currentUserEmail,
      fullName: data.fullName || currentUserEmail.split('@')[0],
      avatar:
        data.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      phone: data.phone || '+8801700000000',
      currency,
      currencySymbol: config.symbol,
      language: language,
      monthlyBudget: Number(data.monthlyBudget) || 50000,
      createdAt: new Date().toISOString(),
    };
    setUser(newProfile);
    setIsNewUserOnboarding(false);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    const currency = data.currency ? (data.currency as CurrencyCode) : user.currency;
    const config = getCurrencyConfig(currency);
    const updated: UserProfile = {
      ...user,
      ...data,
      currency,
      currencySymbol: config.symbol,
    };
    setUser(updated);
  };

  const logout = () => {
    setCurrentUserEmail('');
    setUser(null);
    setIsNewUserOnboarding(true);
    localStorage.removeItem('expensebuddy_active_email');
    setAppScreen('landing');
  };

  const addWallet = (walletData: Omit<Wallet, 'id' | 'balance'> & { initialBalance?: number }) => {
    const newWallet: Wallet = {
      id: `wallet_${Date.now()}`,
      name: walletData.name,
      balance: Number(walletData.initialBalance) || 0,
      type: walletData.type,
      color: walletData.color || '#3B82F6',
      icon: walletData.icon || 'Wallet',
      accountNumber: walletData.accountNumber,
      isDefaultSavings: walletData.isDefaultSavings,
    };
    setWallets((prev) => [...prev, newWallet]);

    if (newWallet.balance > 0) {
      const now = new Date();
      const initialTx: Transaction = {
        id: `tx_${Date.now()}`,
        type: 'income',
        amount: newWallet.balance,
        walletId: newWallet.id,
        category: 'Initial Deposit',
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().slice(0, 5),
        note: `Opening balance for ${newWallet.name}`,
      };
      setTransactions((prev) => [initialTx, ...prev]);
    }
  };

  const addTransaction = (txData: {
    type: TransactionType;
    amount: number;
    walletId: string;
    toWalletId?: string;
    category: string;
    date: string;
    time?: string;
    note: string;
    tags?: string[];
  }) => {
    const amount = Math.abs(Number(txData.amount));
    if (amount <= 0) return;

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: txData.type,
      amount,
      walletId: txData.walletId,
      toWalletId: txData.toWalletId,
      category: txData.category,
      date: txData.date,
      time: txData.time || new Date().toTimeString().slice(0, 5),
      note: txData.note,
      tags: txData.tags || [],
    };

    setWallets((prev) =>
      prev.map((w) => {
        if (txData.type === 'income' && w.id === txData.walletId) {
          return { ...w, balance: w.balance + amount };
        }
        if (txData.type === 'expense' && w.id === txData.walletId) {
          return { ...w, balance: w.balance - amount };
        }
        return w;
      })
    );

    setTransactions((prev) => [newTx, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    const tx = transactions.find((t) => t.id === id);
    if (!tx) return;

    setWallets((prev) =>
      prev.map((w) => {
        if (tx.type === 'income' && w.id === tx.walletId) {
          return { ...w, balance: w.balance - tx.amount };
        }
        if (tx.type === 'expense' && w.id === tx.walletId) {
          return { ...w, balance: w.balance + tx.amount };
        }
        if (tx.type === 'transfer') {
          if (w.id === tx.walletId) {
            return { ...w, balance: w.balance + tx.amount };
          }
          if (w.id === tx.toWalletId) {
            return { ...w, balance: w.balance - tx.amount };
          }
        }
        return w;
      })
    );

    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const transferFunds = ({
    fromWalletId,
    toWalletId,
    amount,
    date,
    note,
  }: {
    fromWalletId: string;
    toWalletId: string;
    amount: number;
    date: string;
    note: string;
  }) => {
    const amt = Math.abs(Number(amount));
    if (amt <= 0 || fromWalletId === toWalletId) return;

    setWallets((prev) =>
      prev.map((w) => {
        if (w.id === fromWalletId) {
          return { ...w, balance: w.balance - amt };
        }
        if (w.id === toWalletId) {
          return { ...w, balance: w.balance + amt };
        }
        return w;
      })
    );

    const fromWalletName = wallets.find((w) => w.id === fromWalletId)?.name || 'Wallet';
    const toWalletName = wallets.find((w) => w.id === toWalletId)?.name || 'Wallet';

    const transferTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'transfer',
      amount: amt,
      walletId: fromWalletId,
      toWalletId,
      category: 'Transfer',
      date,
      time: new Date().toTimeString().slice(0, 5),
      note: note.trim() || `Transfer from ${fromWalletName} to ${toWalletName}`,
      tags: ['Transfer'],
    };

    setTransactions((prev) => [transferTx, ...prev]);
  };

  const addDebt = ({
    personName,
    phone,
    amount,
    debtType,
    walletId,
    date,
    dueDate,
    notes,
  }: {
    personName: string;
    phone: string;
    amount: number;
    debtType: DebtType;
    walletId: string;
    date: string;
    dueDate?: string;
    notes: string;
  }) => {
    const amt = Math.abs(Number(amount));
    if (amt <= 0 || !personName.trim()) return;

    const newDebtId = `debt_${Date.now()}`;
    const newDebt: DebtRecord = {
      id: newDebtId,
      personName: personName.trim(),
      phone: phone.trim(),
      originalAmount: amt,
      remainingAmount: amt,
      debtType,
      walletId,
      date,
      dueDate,
      notes: notes.trim(),
      status: 'active',
      repayments: [],
    };

    setWallets((prev) =>
      prev.map((w) => {
        if (w.id === walletId) {
          const delta = debtType === 'lent' ? -amt : +amt;
          return { ...w, balance: w.balance + delta };
        }
        return w;
      })
    );

    const initialDebtTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: debtType === 'lent' ? 'expense' : 'income',
      amount: amt,
      walletId,
      category: debtType === 'lent' ? 'Money Lent (IOU Out)' : 'Money Borrowed (Loan In)',
      date,
      time: new Date().toTimeString().slice(0, 5),
      note: `${debtType === 'lent' ? 'Lent to' : 'Borrowed from'} ${personName.trim()}`,
      referenceDebtId: newDebtId,
      tags: ['Debt', debtType === 'lent' ? 'Lent' : 'Borrowed'],
    };

    setDebts((prev) => [newDebt, ...prev]);
    setTransactions((prev) => [initialDebtTx, ...prev]);
  };

  const logDebtRepayment = ({
    debtId,
    amount,
    walletId,
    date,
    note,
  }: {
    debtId: string;
    amount: number;
    walletId: string;
    date: string;
    note: string;
  }) => {
    const repaymentAmt = Math.abs(Number(amount));
    if (repaymentAmt <= 0) return;

    setDebts((prev) =>
      prev.map((d) => {
        if (d.id !== debtId) return d;

        const newRemaining = Math.max(0, d.remainingAmount - repaymentAmt);
        const isSettled = newRemaining === 0;

        const newRepayment: DebtRepayment = {
          id: `rep_${Date.now()}`,
          amount: repaymentAmt,
          date,
          walletId,
          note: note.trim() || `Repayment for ${d.personName}`,
        };

        return {
          ...d,
          remainingAmount: newRemaining,
          status: isSettled ? 'settled' : 'active',
          repayments: [...d.repayments, newRepayment],
        };
      })
    );

    const targetDebt = debts.find((d) => d.id === debtId);
    if (!targetDebt) return;

    setWallets((prev) =>
      prev.map((w) => {
        if (w.id === walletId) {
          const delta = targetDebt.debtType === 'lent' ? +repaymentAmt : -repaymentAmt;
          return { ...w, balance: w.balance + delta };
        }
        return w;
      })
    );

    const repaymentTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: targetDebt.debtType === 'lent' ? 'income' : 'expense',
      amount: repaymentAmt,
      walletId,
      category: targetDebt.debtType === 'lent' ? 'Debt Repayment Received' : 'Debt Repaid to Lender',
      date,
      time: new Date().toTimeString().slice(0, 5),
      note: note.trim() || `Repayment for ${targetDebt.personName}`,
      referenceDebtId: debtId,
      tags: ['Repayment', 'Debt'],
    };

    setTransactions((prev) => [repaymentTx, ...prev]);
  };

  const settleDebtDirectly = (debtId: string, walletId: string) => {
    const debt = debts.find((d) => d.id === debtId);
    if (!debt || debt.remainingAmount <= 0) return;
    const now = new Date().toISOString().split('T')[0];
    logDebtRepayment({
      debtId,
      amount: debt.remainingAmount,
      walletId,
      date: now,
      note: 'Full settlement',
    });
  };

  const deleteDebt = (id: string) => {
    setDebts((prev) => prev.filter((d) => d.id !== id));
  };

  const addSavingsGoal = ({
    name,
    targetAmount,
    initialDeposit = 0,
    walletId,
    targetDate,
    icon = 'Target',
    color = '#10B981',
    notes = '',
  }: {
    name: string;
    targetAmount: number;
    initialDeposit?: number;
    walletId: string;
    targetDate?: string;
    icon?: string;
    color?: string;
    notes?: string;
  }) => {
    const target = Math.abs(Number(targetAmount));
    const deposit = Math.max(0, Number(initialDeposit));
    if (!name.trim() || target <= 0) return;

    const goalId = `goal_${Date.now()}`;
    const newGoal: SavingsGoal = {
      id: goalId,
      name: name.trim(),
      targetAmount: target,
      currentSavedAmount: deposit,
      walletId,
      targetDate,
      icon,
      color,
      notes: notes.trim(),
      history: deposit > 0
        ? [
            {
              id: `gh_${Date.now()}`,
              amount: deposit,
              type: 'deposit',
              date: new Date().toISOString().split('T')[0],
              walletId,
              note: 'Initial deposit for savings goal',
            },
          ]
        : [],
    };

    if (deposit > 0) {
      setWallets((prev) =>
        prev.map((w) => (w.id === walletId ? { ...w, balance: w.balance - deposit } : w))
      );

      const depositTx: Transaction = {
        id: `tx_${Date.now()}`,
        type: 'transfer',
        amount: deposit,
        walletId,
        category: 'Savings Goal Allocation',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        note: `Allocated to goal: ${name.trim()}`,
        referenceGoalId: goalId,
        tags: ['Savings Goal', 'Allocation'],
      };
      setTransactions((prev) => [depositTx, ...prev]);
    }

    setSavingsGoals((prev) => [newGoal, ...prev]);
  };

  const contributeToGoal = ({
    goalId,
    amount,
    type,
    walletId,
    note,
  }: {
    goalId: string;
    amount: number;
    type: 'deposit' | 'withdraw';
    walletId: string;
    note: string;
  }) => {
    const amt = Math.abs(Number(amount));
    if (amt <= 0) return;

    setSavingsGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const newSaved =
          type === 'deposit'
            ? g.currentSavedAmount + amt
            : Math.max(0, g.currentSavedAmount - amt);

        return {
          ...g,
          currentSavedAmount: newSaved,
          history: [
            ...g.history,
            {
              id: `gh_${Date.now()}`,
              amount: amt,
              type,
              date: new Date().toISOString().split('T')[0],
              walletId,
              note: note.trim() || `${type === 'deposit' ? 'Added' : 'Withdrawn'} for ${g.name}`,
            },
          ],
        };
      })
    );

    setWallets((prev) =>
      prev.map((w) => {
        if (w.id === walletId) {
          const delta = type === 'deposit' ? -amt : +amt;
          return { ...w, balance: w.balance + delta };
        }
        return w;
      })
    );

    const goal = savingsGoals.find((g) => g.id === goalId);
    const goalTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'transfer',
      amount: amt,
      walletId,
      category: type === 'deposit' ? 'Goal Deposit' : 'Goal Withdrawal',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      note: note.trim() || `${type === 'deposit' ? 'Contribution to' : 'Withdrawal from'} ${goal?.name || 'Goal'}`,
      referenceGoalId: goalId,
      tags: ['Savings Goal'],
    };
    setTransactions((prev) => [goalTx, ...prev]);
  };

  const deleteGoal = (id: string) => {
    setSavingsGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // Recurring Expenses Management (User Request: tab for recurring monthly expenses deducted every month on selected date from wallet of choice)
  const addRecurringExpense = ({
    name,
    amount,
    walletId,
    category,
    billingDay,
    notes,
  }: {
    name: string;
    amount: number;
    walletId: string;
    category: string;
    billingDay: number;
    notes?: string;
  }) => {
    const amt = Math.abs(Number(amount));
    if (!name.trim() || amt <= 0) return;

    const newExpense: RecurringExpense = {
      id: `rec_${Date.now()}`,
      name: name.trim(),
      amount: amt,
      walletId,
      category,
      billingDay: Math.min(31, Math.max(1, Number(billingDay) || 1)),
      active: true,
      createdAt: new Date().toISOString().split('T')[0],
      notes: notes?.trim(),
    };

    setRecurringExpenses((prev) => [newExpense, ...prev]);
  };

  const updateRecurringExpense = (id: string, data: Partial<RecurringExpense>) => {
    setRecurringExpenses((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...data } : r))
    );
  };

  const deleteRecurringExpense = (id: string) => {
    setRecurringExpenses((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleRecurringActive = (id: string) => {
    setRecurringExpenses((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
  };

  const deductRecurringExpense = (id: string) => {
    const item = recurringExpenses.find((r) => r.id === id);
    if (!item) return;

    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().slice(0, 5);

    // Deduct from chosen wallet
    setWallets((prev) =>
      prev.map((w) => {
        if (w.id === item.walletId) {
          return { ...w, balance: w.balance - item.amount };
        }
        return w;
      })
    );

    // Create itemized transaction
    const tx: Transaction = {
      id: `tx_rec_${Date.now()}`,
      type: 'expense',
      amount: item.amount,
      walletId: item.walletId,
      category: item.category,
      date: dateStr,
      time: timeStr,
      note: `Recurring Auto-Bill: ${item.name}`,
      tags: ['Recurring', 'Subscription'],
    };
    setTransactions((prev) => [tx, ...prev]);

    // Mark as deducted for current month
    setRecurringExpenses((prev) =>
      prev.map((r) => (r.id === id ? { ...r, lastDeductedMonth: currentMonthKey } : r))
    );
  };

  // Auto-deduct check: Executes automatic deduction if current date is >= billingDay and not yet deducted for this month
  useEffect(() => {
    if (!recurringExpenses || recurringExpenses.length === 0) return;
    const now = new Date();
    const currentDay = now.getDate();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    recurringExpenses.forEach((item) => {
      if (
        item.active &&
        item.lastDeductedMonth !== currentMonthKey &&
        currentDay >= item.billingDay
      ) {
        deductRecurringExpense(item.id);
      }
    });
  }, [recurringExpenses]);

  const resetAllData = () => {
    const defWallets = createInitialWallets();
    const defTx = createInitialTransactions();
    const defDebts = createInitialDebts();
    const defGoals = createInitialGoals();
    const defRecurring = createInitialRecurringExpenses();
    const defUser = createDefaultProfile(currentUserEmail || INITIAL_USER_EMAIL);

    setWallets(defWallets);
    setTransactions(defTx);
    setDebts(defDebts);
    setSavingsGoals(defGoals);
    setRecurringExpenses(defRecurring);
    setUser(defUser);
  };

  const totalNetWorth = useMemo(() => {
    return wallets.reduce((sum, w) => sum + w.balance, 0);
  }, [wallets]);

  const totalMoneyLent = useMemo(() => {
    return debts
      .filter((d) => d.status === 'active' && d.debtType === 'lent')
      .reduce((sum, d) => sum + d.remainingAmount, 0);
  }, [debts]);

  const totalMoneyBorrowed = useMemo(() => {
    return debts
      .filter((d) => d.status === 'active' && d.debtType === 'borrowed')
      .reduce((sum, d) => sum + d.remainingAmount, 0);
  }, [debts]);

  const netDebtPosition = totalMoneyLent - totalMoneyBorrowed;

  const activeDebtsCount = useMemo(() => {
    return debts.filter((d) => d.status === 'active').length;
  }, [debts]);

  const totalMonthlyRecurring = useMemo(() => {
    return recurringExpenses
      .filter((r) => r.active)
      .reduce((sum, r) => sum + r.amount, 0);
  }, [recurringExpenses]);

  const monthTransactions = useMemo(() => {
    return transactions.filter((t) => t.date && t.date.startsWith(selectedMonth));
  }, [transactions, selectedMonth]);

  const monthIncome = useMemo(() => {
    return monthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [monthTransactions]);

  const monthExpense = useMemo(() => {
    return monthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [monthTransactions]);

  const monthTransfersVolume = useMemo(() => {
    return monthTransactions
      .filter((t) => t.type === 'transfer')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [monthTransactions]);

  return (
    <FinanceContext.Provider
      value={{
        appScreen,
        setAppScreen,
        language,
        setLanguage,
        user,
        currentUserEmail,
        isNewUserOnboarding,
        wallets,
        transactions,
        debts,
        savingsGoals,
        recurringExpenses,
        selectedMonth,
        setSelectedMonth,
        totalNetWorth,
        totalMoneyLent,
        totalMoneyBorrowed,
        netDebtPosition,
        activeDebtsCount,
        totalMonthlyRecurring,
        monthIncome,
        monthExpense,
        monthTransfersVolume,
        loginWithSocial,
        setupInitialAccount,
        loginWithEmail,
        completeOnboarding,
        updateProfile,
        logout,
        quickDemoLogin,
        addWallet,
        addTransaction,
        deleteTransaction,
        transferFunds,
        addDebt,
        logDebtRepayment,
        settleDebtDirectly,
        deleteDebt,
        addSavingsGoal,
        contributeToGoal,
        deleteGoal,
        addRecurringExpense,
        updateRecurringExpense,
        deleteRecurringExpense,
        toggleRecurringActive,
        deductRecurringExpense,
        resetAllData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
