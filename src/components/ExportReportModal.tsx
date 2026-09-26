import React, { useRef } from 'react';
import { X, FileSpreadsheet, Printer, Download, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDate, formatMonthYear } from '../utils/formatters';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({ isOpen, onClose }) => {
  const {
    user,
    selectedMonth,
    wallets,
    transactions,
    debts,
    savingsGoals,
    totalNetWorth,
    totalMoneyLent,
    totalMoneyBorrowed,
    monthIncome,
    monthExpense,
    monthTransfersVolume,
  } = useFinance();

  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !user) return null;

  const currentMonthTransactions = transactions.filter(
    (t) => t.date && t.date.startsWith(selectedMonth)
  );

  const timestamp = new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  // 1. Generate & Download CSV
  const handleDownloadCSV = () => {
    const lines: string[] = [];

    // Header & Metadata
    lines.push(`"EXPENSE BUDDY - MONTHLY FINANCIAL REPORT"`);
    lines.push(`"Report Month","${formatMonthYear(selectedMonth)}"`);
    lines.push(`"Generated Timestamp","${timestamp}"`);
    lines.push(`"Account Name","${user.fullName}"`);
    lines.push(`"Account Email","${user.email}"`);
    lines.push(`"Currency","${user.currency} (${user.currencySymbol})"`);
    lines.push('');

    // Summary Section
    lines.push(`"EXECUTIVE MONTHLY SUMMARY"`);
    lines.push(`"Metric","Amount (${user.currency})"`);
    lines.push(`"Total Monthly Income","${monthIncome}"`);
    lines.push(`"Total Monthly Expenses","${monthExpense}"`);
    lines.push(`"Net Monthly Savings","${monthIncome - monthExpense}"`);
    lines.push(`"Total Transfers Volume","${monthTransfersVolume}"`);
    lines.push(`"Total Net Worth (All Wallets)","${totalNetWorth}"`);
    lines.push(`"Total Money Lent (Receivables)","${totalMoneyLent}"`);
    lines.push(`"Total Money Borrowed (Payables)","${totalMoneyBorrowed}"`);
    lines.push('');

    // Wallet Ending Balances Section
    lines.push(`"ENDING WALLET BALANCES"`);
    lines.push(`"Wallet Name","Type","Balance (${user.currency})"`);
    wallets.forEach((w) => {
      lines.push(`"${w.name}","${w.type}","${w.balance}"`);
    });
    lines.push('');

    // Transactions Section
    lines.push(`"ITEMIZED TRANSACTIONS FOR ${formatMonthYear(selectedMonth).toUpperCase()}"`);
    lines.push(`"Date","Type","Category","Wallet","Amount (${user.currency})","Note"`);
    currentMonthTransactions.forEach((t) => {
      const walletName = wallets.find((w) => w.id === t.walletId)?.name || 'Wallet';
      const toWalletName = t.toWalletId
        ? ` -> ${wallets.find((w) => w.id === t.toWalletId)?.name || 'Wallet'}`
        : '';
      lines.push(
        `"${t.date}","${t.type.toUpperCase()}","${t.category}","${walletName}${toWalletName}","${t.amount}","${(t.note || '').replace(/"/g, '""')}"`
      );
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(lines.join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `ExpenseBuddy_Report_${selectedMonth}_${user.fullName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 2. Print / Save as PDF
  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-800 bg-gray-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">
                Expense Buddy Audit
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Export Monthly Financial Report
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

        {/* Action Buttons Toolbar */}
        <div className="p-4 bg-gray-950/50 border-b border-gray-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Clock className="w-3.5 h-3.5 text-gray-500" />
            <span>Generated: {timestamp}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Download CSV</span>
            </button>

            <button
              onClick={handlePrintPDF}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>

        {/* Printable Document Preview Area */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-gray-300 print:text-black print:p-0">
          <div
            ref={printAreaRef}
            id="printable-report"
            className="p-6 rounded-2xl bg-gray-950 border border-gray-800 print:border-none print:bg-white print:text-black space-y-6"
          >
            {/* Document Header (Req 7.5) */}
            <div className="border-b border-gray-800 print:border-gray-300 pb-5">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-black text-white print:text-black tracking-tight">
                    Expense Buddy Financial Statement
                  </h1>
                  <p className="text-xs text-gray-400 print:text-gray-600 mt-1">
                    Monthly Performance, Wallet Balances & IOU Ledger
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-bold text-xs">
                    Period: {formatMonthYear(selectedMonth)}
                  </span>
                  <p className="text-[11px] text-gray-400 print:text-gray-500 mt-1">
                    Timestamp: {timestamp}
                  </p>
                </div>
              </div>

              {/* User profile banner */}
              <div className="mt-4 pt-3 border-t border-gray-900 print:border-gray-200 grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-gray-500 print:text-gray-600 block">Account Holder</span>
                  <span className="font-semibold text-white print:text-black">{user.fullName}</span>
                </div>
                <div>
                  <span className="text-gray-500 print:text-gray-600 block">Email Address</span>
                  <span className="font-mono text-gray-300 print:text-black">{user.email}</span>
                </div>
                <div>
                  <span className="text-gray-500 print:text-gray-600 block">Base Currency</span>
                  <span className="font-semibold text-white print:text-black">
                    {user.currency} ({user.currencySymbol})
                  </span>
                </div>
              </div>
            </div>

            {/* Financial Summary Cards */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 print:text-gray-700 mb-3">
                Monthly Financial Summary
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-gray-900 print:bg-gray-100 border border-gray-800 print:border-gray-300">
                  <span className="text-gray-400 print:text-gray-600 block">Total Income</span>
                  <span className="text-base font-bold text-emerald-400 print:text-emerald-700">
                    {formatCurrency(monthIncome, user.currency)}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-gray-900 print:bg-gray-100 border border-gray-800 print:border-gray-300">
                  <span className="text-gray-400 print:text-gray-600 block">Total Expenses</span>
                  <span className="text-base font-bold text-rose-400 print:text-rose-700">
                    {formatCurrency(monthExpense, user.currency)}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-gray-900 print:bg-gray-100 border border-gray-800 print:border-gray-300">
                  <span className="text-gray-400 print:text-gray-600 block">Net Savings</span>
                  <span className="text-base font-bold text-cyan-400 print:text-cyan-700">
                    {formatCurrency(monthIncome - monthExpense, user.currency)}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-gray-900 print:bg-gray-100 border border-gray-800 print:border-gray-300">
                  <span className="text-gray-400 print:text-gray-600 block">Total Net Worth</span>
                  <span className="text-base font-bold text-white print:text-black">
                    {formatCurrency(totalNetWorth, user.currency)}
                  </span>
                </div>
              </div>
            </div>

            {/* Ending Wallet Balances (Req 7.4) */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 print:text-gray-700 mb-2">
                Ending Wallet Balances
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {wallets.map((w) => (
                  <div
                    key={w.id}
                    className="p-3 rounded-xl bg-gray-900/80 print:bg-gray-50 border border-gray-800 print:border-gray-200"
                  >
                    <span className="text-gray-400 print:text-gray-600 block truncate">{w.name}</span>
                    <span className="font-bold text-white print:text-black">
                      {formatCurrency(w.balance, user.currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Debt & IOU Summary */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 print:text-gray-700 mb-2">
                Outstanding Debt & IOU Position
              </h4>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-gray-900/80 print:bg-gray-50 border border-gray-800 print:border-gray-200">
                  <span className="text-gray-400 print:text-gray-600 block">Money Lent (Receivables)</span>
                  <span className="font-bold text-amber-400 print:text-amber-700">
                    {formatCurrency(totalMoneyLent, user.currency)}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-gray-900/80 print:bg-gray-50 border border-gray-800 print:border-gray-200">
                  <span className="text-gray-400 print:text-gray-600 block">Money Borrowed (Payables)</span>
                  <span className="font-bold text-rose-400 print:text-rose-700">
                    {formatCurrency(totalMoneyBorrowed, user.currency)}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-gray-900/80 print:bg-gray-50 border border-gray-800 print:border-gray-200">
                  <span className="text-gray-400 print:text-gray-600 block">Net Debt Position</span>
                  <span className="font-bold text-white print:text-black">
                    {formatCurrency(totalMoneyLent - totalMoneyBorrowed, user.currency)}
                  </span>
                </div>
              </div>
            </div>

            {/* Itemized Transactions Table (Req 7.4) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 print:text-gray-700">
                  Itemized Transactions ({currentMonthTransactions.length})
                </h4>
              </div>
              <div className="overflow-x-auto rounded-xl border border-gray-800 print:border-gray-300">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-900 print:bg-gray-100 text-gray-400 print:text-gray-700 border-b border-gray-800 print:border-gray-300">
                      <th className="p-2.5">Date</th>
                      <th className="p-2.5">Type</th>
                      <th className="p-2.5">Category</th>
                      <th className="p-2.5">Account / Transfer</th>
                      <th className="p-2.5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60 print:divide-gray-200">
                    {currentMonthTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-gray-500">
                          No transactions recorded for this period.
                        </td>
                      </tr>
                    ) : (
                      currentMonthTransactions.map((t) => {
                        const wName = wallets.find((w) => w.id === t.walletId)?.name || 'Wallet';
                        const toWName = t.toWalletId
                          ? ` → ${wallets.find((w) => w.id === t.toWalletId)?.name || 'Wallet'}`
                          : '';

                        return (
                          <tr key={t.id} className="hover:bg-gray-900/40 print:hover:bg-transparent">
                            <td className="p-2.5 font-mono text-gray-400 print:text-black">
                              {formatDate(t.date)}
                            </td>
                            <td className="p-2.5">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                  t.type === 'income'
                                    ? 'bg-emerald-950/60 text-emerald-400'
                                    : t.type === 'expense'
                                    ? 'bg-rose-950/60 text-rose-400'
                                    : 'bg-violet-950/60 text-violet-400'
                                }`}
                              >
                                {t.type}
                              </span>
                            </td>
                            <td className="p-2.5 text-white print:text-black font-medium">
                              {t.category}
                              {t.note && (
                                <span className="block text-[11px] text-gray-500 print:text-gray-600">
                                  {t.note}
                                </span>
                              )}
                            </td>
                            <td className="p-2.5 text-gray-400 print:text-gray-700">
                              {wName}
                              {toWName}
                            </td>
                            <td
                              className={`p-2.5 text-right font-bold font-mono ${
                                t.type === 'income'
                                  ? 'text-emerald-400 print:text-emerald-700'
                                  : t.type === 'expense'
                                  ? 'text-rose-400 print:text-rose-700'
                                  : 'text-violet-400 print:text-violet-700'
                              }`}
                            >
                              {t.type === 'income' ? '+' : t.type === 'expense' ? '-' : '⇄'}{' '}
                              {formatCurrency(t.amount, user.currency)}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Verification Stamp / Footer */}
            <div className="pt-4 border-t border-gray-900 print:border-gray-200 flex items-center justify-between text-[11px] text-gray-500 print:text-gray-600">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Verified SpendWise Audit Record
              </span>
              <span>Generated on: {timestamp}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 bg-gray-950/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
