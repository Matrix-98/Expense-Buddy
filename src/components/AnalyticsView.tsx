import React, { useState } from 'react';
import {
  PieChart as PieIcon,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatMonthYear } from '../utils/formatters';
import { ExportReportModal } from './ExportReportModal';

const CATEGORY_COLORS: Record<string, string> = {
  'Food & Dining': '#10B981',
  'Housing & Rent': '#6366F1',
  'Utilities & Bills': '#06B6D4',
  Transportation: '#F59E0B',
  Shopping: '#EC4899',
  'Healthcare & Medical': '#EF4444',
  Entertainment: '#8B5CF6',
  Education: '#3B82F6',
  Groceries: '#14B8A6',
  'Money Lent (IOU Out)': '#F97316',
  'Debt Repaid to Lender': '#E11D48',
  'Goal Deposit': '#84CC16',
  Transfer: '#A855F7',
};

const DEFAULT_COLOR = '#94A3B8';

export const AnalyticsView: React.FC = () => {
  const {
    user,
    selectedMonth,
    setSelectedMonth,
    transactions,
    monthIncome,
    monthExpense,
    monthTransfersVolume,
  } = useFinance();

  const [showExport, setShowExport] = useState(false);
  const [activeCategoryHover, setActiveCategoryHover] = useState<string | null>(null);

  // Filter current month transactions
  const monthTransactions = transactions.filter(
    (t) => t.date && t.date.startsWith(selectedMonth)
  );

  const expenseTransactions = monthTransactions.filter((t) => t.type === 'expense');

  // Aggregate expenses by category
  const categoryMap = expenseTransactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const categoryList = Object.entries(categoryMap)
    .map(([cat, amount]) => ({
      category: cat,
      amount,
      percentage: monthExpense > 0 ? Math.round((amount / monthExpense) * 100) : 0,
      color: CATEGORY_COLORS[cat] || DEFAULT_COLOR,
      count: expenseTransactions.filter((t) => t.category === cat).length,
    }))
    .sort((a, b) => b.amount - a.amount);

  // Month navigation
  const handlePrevMonth = () => {
    const [y, m] = selectedMonth.split('-').map(Number);
    const d = new Date(y, m - 2, 1);
    const newMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    setSelectedMonth(newMonth);
  };

  const handleNextMonth = () => {
    const [y, m] = selectedMonth.split('-').map(Number);
    const d = new Date(y, m, 1);
    const newMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    setSelectedMonth(newMonth);
  };

  // Requirement 7.2: Donut Chart SVG Generation
  const size = 260;
  const strokeWidth = 36;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercent = 0;

  const donutSlices = categoryList.map((item) => {
    const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((cumulativePercent / 100) * circumference);
    cumulativePercent += item.percentage;

    return {
      ...item,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 border border-gray-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Monthly Analytics & Reports (Section 7.0)
            </span>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/20 font-medium">
              Calendar Month Aggregation
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Financial Insights for {formatMonthYear(selectedMonth)}
          </h2>
          <p className="mt-1 text-xs text-gray-400 max-w-xl">
            Visual breakdown of your expenses, cashflow ratios, and transfers volume. Download or print the audited statement anytime.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3">
          {/* Month Stepper */}
          <div className="flex items-center bg-gray-900 border border-gray-800 rounded-xl p-1 text-xs">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition"
              title="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 font-semibold text-gray-200">
              {formatMonthYear(selectedMonth)}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition"
              title="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Export Report Modal Trigger (Req 7.3) */}
          <button
            onClick={() => setShowExport(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/20 transition active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Export Report (PDF / CSV)</span>
          </button>
        </div>
      </div>

      {/* 3 Overview Cashflow Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800">
          <span className="text-xs text-gray-400 block mb-1">Total Income</span>
          <span className="text-xl font-black text-emerald-400 font-mono">
            {formatCurrency(monthIncome, user?.currency)}
          </span>
          <span className="text-[11px] text-gray-500 block mt-1">
            {monthTransactions.filter((t) => t.type === 'income').length} income source(s)
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800">
          <span className="text-xs text-gray-400 block mb-1">Total Expenses</span>
          <span className="text-xl font-black text-rose-400 font-mono">
            {formatCurrency(monthExpense, user?.currency)}
          </span>
          <span className="text-[11px] text-gray-500 block mt-1">
            {expenseTransactions.length} itemized transaction(s)
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800">
          <span className="text-xs text-gray-400 block mb-1">Net Savings</span>
          <span
            className={`text-xl font-black font-mono ${
              monthIncome - monthExpense >= 0 ? 'text-cyan-400' : 'text-rose-400'
            }`}
          >
            {formatCurrency(monthIncome - monthExpense, user?.currency)}
          </span>
          <span className="text-[11px] text-gray-500 block mt-1">
            {monthIncome > 0
              ? `${Math.round(((monthIncome - monthExpense) / monthIncome) * 100)}% of income retained`
              : '0%'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800">
          <span className="text-xs text-gray-400 block mb-1">Inter-Wallet Transfers</span>
          <span className="text-xl font-black text-violet-400 font-mono">
            {formatCurrency(monthTransfersVolume, user?.currency)}
          </span>
          <span className="text-[11px] text-gray-500 block mt-1">
            {monthTransactions.filter((t) => t.type === 'transfer').length} transfer(s) logged
          </span>
        </div>
      </div>

      {/* Requirement 7.2: Visual Charts (Donut Chart & Distribution) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Donut Chart (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-gray-900/80 border border-gray-800 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-full text-left">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-400" />
              <span>Expense Category Distribution</span>
            </h3>
            <p className="text-xs text-gray-400">Interactive visual breakdown</p>
          </div>

          {monthExpense === 0 ? (
            <div className="py-16 text-gray-500 text-xs">
              No expenses recorded for {formatMonthYear(selectedMonth)}.
            </div>
          ) : (
            <div className="relative flex items-center justify-center my-4">
              <svg width={size} height={size} className="transform -rotate-90">
                {/* Background Ring */}
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke="#1E293B"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />

                {/* Slices */}
                {donutSlices.map((slice, i) => (
                  <circle
                    key={i}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={slice.color}
                    strokeWidth={activeCategoryHover === slice.category ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={slice.strokeDasharray}
                    strokeDashoffset={slice.strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-300 cursor-pointer"
                    onMouseEnter={() => setActiveCategoryHover(slice.category)}
                    onMouseLeave={() => setActiveCategoryHover(null)}
                  />
                ))}
              </svg>

              {/* Center hole text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
                  {activeCategoryHover || 'Total Expense'}
                </span>
                <span className="text-xl font-black text-white font-mono">
                  {activeCategoryHover
                    ? formatCurrency(categoryMap[activeCategoryHover] || 0, user?.currency)
                    : formatCurrency(monthExpense, user?.currency)}
                </span>
              </div>
            </div>
          )}

          <p className="text-[11px] text-gray-500">
            Hover over any category arc to inspect exact share.
          </p>
        </div>

        {/* Category Breakdown Table / Cards (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-gray-900/80 border border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white tracking-tight">Category Breakdown</h3>
            <span className="text-xs text-gray-400 font-mono">
              {categoryList.length} Categories
            </span>
          </div>

          {categoryList.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-500">
              No expense categories to show for this month.
            </div>
          ) : (
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {categoryList.map((item) => (
                <div
                  key={item.category}
                  onMouseEnter={() => setActiveCategoryHover(item.category)}
                  onMouseLeave={() => setActiveCategoryHover(null)}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    activeCategoryHover === item.category
                      ? 'bg-gray-800/90 border-gray-600 scale-[1.01]'
                      : 'bg-gray-950/60 border-gray-800/80 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-bold text-white">{item.category}</span>
                      <span className="text-[10px] text-gray-500">({item.count} txns)</span>
                    </div>

                    <div className="text-right">
                      <span className="font-bold font-mono text-white">
                        {formatCurrency(item.amount, user?.currency)}
                      </span>
                      <span className="text-gray-400 font-mono ml-2">({item.percentage}%)</span>
                    </div>
                  </div>

                  {/* Progress fill */}
                  <div className="w-full h-1.5 rounded-full bg-gray-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Export Report Modal */}
      <ExportReportModal isOpen={showExport} onClose={() => setShowExport(false)} />
    </div>
  );
};
