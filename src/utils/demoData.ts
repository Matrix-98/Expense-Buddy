import { DebtRecord, RecurringExpense, SavingsGoal, Transaction, UserProfile, Wallet } from '../types/finance';
import { generateGoogleAvatar } from './avatarUtils';

export const INITIAL_USER_EMAIL = 'afmabdur2@gmail.com';

export function createDefaultProfile(email: string = INITIAL_USER_EMAIL): UserProfile {
  return {
    id: `user_${Date.now()}`,
    email,
    fullName: 'Abdur Rahman',
    avatar: generateGoogleAvatar('Abdur Rahman', email),
    phone: '+8801711223344',
    currency: 'BDT',
    currencySymbol: '৳',
    monthlyBudget: 80000,
    createdAt: new Date().toISOString(),
  };
}

export function createInitialWallets(): Wallet[] {
  return [
    {
      id: 'wallet-cash',
      name: 'Physical Cash',
      balance: 14500,
      type: 'cash',
      color: '#10B981', // emerald
      icon: 'Banknote',
      accountNumber: 'In Pocket & Drawer',
    },
    {
      id: 'wallet-bank',
      name: 'Main Bank Account',
      balance: 125000,
      type: 'bank',
      color: '#3B82F6', // blue
      icon: 'Building2',
      accountNumber: 'City Bank •••• 8921',
    },
    {
      id: 'wallet-mobile',
      name: 'bKash / Mobile Wallet',
      balance: 18200,
      type: 'mobile_wallet',
      color: '#EC4899', // pink
      icon: 'Smartphone',
      accountNumber: '01711-223344',
    },
    {
      id: 'wallet-savings',
      name: 'Dedicated Savings',
      balance: 75000,
      type: 'savings',
      color: '#8B5CF6', // purple
      icon: 'PiggyBank',
      accountNumber: 'High-Yield Reserve',
      isDefaultSavings: true,
    },
  ];
}

export function createInitialDebts(): DebtRecord[] {
  return [
    {
      id: 'debt-1',
      personName: 'Tanvir Hossain',
      phone: '+8801819876543',
      originalAmount: 12000,
      remainingAmount: 7000,
      debtType: 'lent', // Money lent to Tanvir (owed to user)
      walletId: 'wallet-bank',
      date: '2026-09-08',
      dueDate: '2026-10-05',
      notes: 'Lent for emergency laptop repair',
      status: 'active',
      repayments: [
        {
          id: 'rep-1',
          amount: 5000,
          date: '2026-09-18',
          walletId: 'wallet-mobile',
          note: 'Partial repayment sent via bKash',
        },
      ],
    },
    {
      id: 'debt-2',
      personName: 'Rifat Chowdhury',
      phone: '+8801912345678',
      originalAmount: 4500,
      remainingAmount: 4500,
      debtType: 'lent', // Money lent to Rifat (owed to user)
      walletId: 'wallet-cash',
      date: '2026-09-14',
      dueDate: '2026-09-30',
      notes: 'Group dinner & concert tickets payment',
      status: 'active',
      repayments: [],
    },
    {
      id: 'debt-3',
      personName: 'Siam Ahmed',
      phone: '+8801723456789',
      originalAmount: 15000,
      remainingAmount: 5000,
      debtType: 'borrowed', // Money borrowed from Siam (user owes Siam)
      walletId: 'wallet-bank',
      date: '2026-08-25',
      dueDate: '2026-10-10',
      notes: 'Short loan during home renovation',
      status: 'active',
      repayments: [
        {
          id: 'rep-2',
          amount: 10000,
          date: '2026-09-12',
          walletId: 'wallet-bank',
          note: 'Paid back from monthly freelance payout',
        },
      ],
    },
  ];
}

export function createInitialGoals(): SavingsGoal[] {
  return [
    {
      id: 'goal-1',
      name: 'New Custom PC Rig',
      targetAmount: 180000,
      currentSavedAmount: 115000,
      walletId: 'wallet-savings',
      targetDate: '2026-12-15',
      icon: 'Monitor',
      color: '#06B6D4', // cyan
      notes: 'AMD Ryzen 9 + RTX 5070 Workstation build',
      history: [
        {
          id: 'gh-1',
          amount: 80000,
          type: 'deposit',
          date: '2026-08-10',
          walletId: 'wallet-savings',
          note: 'Initial goal allocation from bonus',
        },
        {
          id: 'gh-2',
          amount: 35000,
          type: 'deposit',
          date: '2026-09-05',
          walletId: 'wallet-bank',
          note: 'September contribution',
        },
      ],
    },
    {
      id: 'goal-2',
      name: 'Emergency Buffer 3 Months',
      targetAmount: 150000,
      currentSavedAmount: 75000,
      walletId: 'wallet-savings',
      targetDate: '2027-03-31',
      icon: 'ShieldCheck',
      color: '#10B981', // emerald
      notes: 'Safe liquid emergency fund in bank & high yield',
      history: [
        {
          id: 'gh-3',
          amount: 75000,
          type: 'deposit',
          date: '2026-07-20',
          walletId: 'wallet-savings',
          note: 'Quarterly savings seed',
        },
      ],
    },
  ];
}

export function createInitialTransactions(): Transaction[] {
  return [
    {
      id: 'tx-1',
      type: 'income',
      amount: 95000,
      walletId: 'wallet-bank',
      category: 'Salary',
      date: '2026-09-01',
      time: '09:30',
      note: 'Monthly engineering salary deposit',
      tags: ['Work', 'Salary'],
    },
    {
      id: 'tx-2',
      type: 'income',
      amount: 38000,
      walletId: 'wallet-bank',
      category: 'Freelance & Consulting',
      date: '2026-09-10',
      time: '14:20',
      note: 'UI/UX Dashboard project milestone',
      tags: ['Client', 'Side-Hustle'],
    },
    {
      id: 'tx-3',
      type: 'transfer', // Moving cash from Bank to Cash wallet (Req 4.5 & 4.6)
      amount: 10000,
      walletId: 'wallet-bank',
      toWalletId: 'wallet-cash',
      category: 'Transfer',
      date: '2026-09-03',
      time: '11:15',
      note: 'ATM cash withdrawal for weekly expenses',
      tags: ['ATM', 'Cashout'],
    },
    {
      id: 'tx-4',
      type: 'transfer', // Moving funds to mobile wallet
      amount: 8000,
      walletId: 'wallet-bank',
      toWalletId: 'wallet-mobile',
      category: 'Transfer',
      date: '2026-09-06',
      time: '16:45',
      note: 'Bank to bKash add money for utilities & rides',
      tags: ['bKash', 'Top-up'],
    },
    {
      id: 'tx-5',
      type: 'expense',
      amount: 22000,
      walletId: 'wallet-bank',
      category: 'Housing & Rent',
      date: '2026-09-04',
      time: '10:00',
      note: 'Apartment monthly rent payment',
      tags: ['Fixed', 'Home'],
    },
    {
      id: 'tx-6',
      type: 'expense',
      amount: 6500,
      walletId: 'wallet-mobile',
      category: 'Utilities & Bills',
      date: '2026-09-07',
      time: '18:30',
      note: 'Electricity, fiber internet and DESCO bill',
      tags: ['Bills'],
    },
    {
      id: 'tx-7',
      type: 'expense',
      amount: 7200,
      walletId: 'wallet-cash',
      category: 'Food & Dining',
      date: '2026-09-12',
      time: '19:40',
      note: 'Weekly supermarket groceries & fresh produce',
      tags: ['Groceries'],
    },
    {
      id: 'tx-8',
      type: 'expense',
      amount: 3400,
      walletId: 'wallet-mobile',
      category: 'Transportation',
      date: '2026-09-15',
      time: '08:50',
      note: 'Ride sharing & commute fuel expenses',
      tags: ['Commute'],
    },
    {
      id: 'tx-9',
      type: 'expense',
      amount: 4200,
      walletId: 'wallet-cash',
      category: 'Food & Dining',
      date: '2026-09-20',
      time: '21:10',
      note: 'Weekend dining with family at Chef’s Table',
      tags: ['Dining'],
    },
  ];
}

export function createInitialRecurringExpenses(): RecurringExpense[] {
  return [
    {
      id: 'rec-1',
      name: 'Apartment Monthly Rent',
      amount: 22000,
      walletId: 'wallet-bank',
      category: 'Housing & Rent',
      billingDay: 4,
      active: true,
      lastDeductedMonth: '2026-09',
      createdAt: '2026-01-01',
      notes: 'Auto-deducted on the 4th of every month from Bank Account',
    },
    {
      id: 'rec-2',
      name: 'Fiber Internet & Broadband',
      amount: 1200,
      walletId: 'wallet-mobile',
      category: 'Utilities & Bills',
      billingDay: 7,
      active: true,
      lastDeductedMonth: '2026-09',
      createdAt: '2026-01-01',
      notes: 'Carnival Broadband 50Mbps unlimited',
    },
    {
      id: 'rec-3',
      name: 'Electricity / DESCO Prepaid',
      amount: 3500,
      walletId: 'wallet-mobile',
      category: 'Utilities & Bills',
      billingDay: 12,
      active: true,
      lastDeductedMonth: '2026-09',
      createdAt: '2026-02-01',
      notes: 'Smart meter monthly top-up',
    },
    {
      id: 'rec-4',
      name: 'Netflix & Spotify Family',
      amount: 1850,
      walletId: 'wallet-bank',
      category: 'Entertainment',
      billingDay: 20,
      active: true,
      lastDeductedMonth: '2026-09',
      createdAt: '2026-03-01',
      notes: 'Monthly digital entertainment subscriptions',
    },
    {
      id: 'rec-5',
      name: 'Gym & Fitness Membership',
      amount: 2500,
      walletId: 'wallet-cash',
      category: 'Healthcare & Medical',
      billingDay: 28,
      active: true,
      lastDeductedMonth: undefined, // Pending for current month!
      createdAt: '2026-05-01',
      notes: 'Fitness club monthly subscription due on the 28th',
    },
  ];
}

