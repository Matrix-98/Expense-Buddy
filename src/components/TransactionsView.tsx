import React, { useState } from 'react';
import {
  ListOrdered,
  Plus,
  ArrowRightLeft,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Filter,
  Trash2,
  Calendar,
  Wallet as WalletIcon,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { TransactionType } from '../types/finance';
import { formatCurrency, formatDate } from '../utils/formatters';
import { TransactionModal } from './Modals/TransactionModal';
import { TransferModal } from './Modals/TransferModal';

export const TransactionsView: React.FC = () => {
  const { transactions, wallets, user, deleteTransaction } = useFinance();

  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [walletFilter, setWalletFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  const filteredTransactions = transactions
    .filter((t) => (typeFilter === 'all' ? true : t.type === typeFilter))
    .filter((t) =>
      walletFilter === 'all'
        ? true
        : t.walletId === walletFilter || t.toWalletId === walletFilter
    )
    .filter((t) =>
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.note && t.note.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 border border-gray-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Audit Ledger & Transactions
            </span>
            <span className="text-[10px] bg-gray-800 px-2 py-0.5 rounded-full border border-gray-700 text-gray-300 font-medium">
              Real-time Ledger
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Transaction History & Transfers
          </h2>
          <p className="mt-1 text-xs text-gray-400 max-w-xl">
            Complete itemized record of all financial activity. Transfers, debts, and expense payments are immutably tied to their respective wallets.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowTransferModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs shadow-lg shadow-violet-600/20 transition active:scale-95"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>Transfer Funds</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Log Transaction</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Type pills */}
        <div className="flex items-center gap-1 p-1 bg-gray-900 border border-gray-800 rounded-xl overflow-x-auto scrollbar-none">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              typeFilter === 'all'
                ? 'bg-gray-800 text-white shadow-sm border border-gray-700'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            All Activity
          </button>
          <button
            onClick={() => setTypeFilter('expense')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              typeFilter === 'expense'
                ? 'bg-rose-950 text-rose-300 shadow-sm border border-rose-800'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => setTypeFilter('income')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              typeFilter === 'income'
                ? 'bg-emerald-950 text-emerald-300 shadow-sm border border-emerald-800'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Income
          </button>
          <button
            onClick={() => setTypeFilter('transfer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              typeFilter === 'transfer'
                ? 'bg-violet-950 text-violet-300 shadow-sm border border-violet-800'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Transfers (⇄)
          </button>
        </div>

        {/* Search & Wallet Filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search category, note..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-gray-900 border border-gray-800 text-white text-xs placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <select
            value={walletFilter}
            onChange={(e) => setWalletFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All Wallets</option>
            {wallets.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-gray-900/40 border border-gray-800/80">
          <ListOrdered className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-300">No Transactions Found</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or log a new transaction with the buttons above.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl bg-gray-900/80 border border-gray-800">
          <div className="divide-y divide-gray-800/80">
            {filteredTransactions.map((tx) => {
              const isTransfer = tx.type === 'transfer';
              const isIncome = tx.type === 'income';
              const fromWallet = wallets.find((w) => w.id === tx.walletId)?.name || 'Wallet';
              const toWallet = tx.toWalletId
                ? wallets.find((w) => w.id === tx.toWalletId)?.name
                : null;

              return (
                <div
                  key={tx.id}
                  className="p-4 sm:p-5 flex items-center justify-between hover:bg-gray-800/40 transition gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                        isTransfer
                          ? 'bg-violet-950/60 text-violet-400 border border-violet-500/30'
                          : isIncome
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-950/60 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {isTransfer ? (
                        <ArrowRightLeft className="w-5 h-5" />
                      ) : isIncome ? (
                        <ArrowUpRight className="w-5 h-5" />
                      ) : (
                        <ArrowDownLeft className="w-5 h-5" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white truncate">{tx.category}</span>
                        {isTransfer && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-950 text-violet-300 border border-violet-800">
                            Transfer
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mt-0.5">
                        <span className="flex items-center gap-1 text-gray-500">
                          <WalletIcon className="w-3 h-3" />
                          {fromWallet}
                          {toWallet && ` → ${toWallet}`}
                        </span>
                        <span className="text-gray-600">•</span>
                        <span className="font-mono text-gray-500">{formatDate(tx.date)}</span>
                        {tx.note && (
                          <>
                            <span className="text-gray-600 hidden sm:inline">•</span>
                            <span className="text-gray-400 italic truncate hidden sm:inline">
                              "{tx.note}"
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span
                        className={`text-sm sm:text-base font-bold font-mono ${
                          isTransfer
                            ? 'text-violet-400'
                            : isIncome
                            ? 'text-emerald-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {isIncome ? '+' : isTransfer ? '⇄ ' : '-'}
                        {formatCurrency(tx.amount, user?.currency)}
                      </span>
                      {tx.time && (
                        <span className="block text-[10px] text-gray-500 font-mono">{tx.time}</span>
                      )}
                    </div>

                    <button
                      onClick={() => deleteTransaction(tx.id)}
                      className="p-2 text-gray-600 hover:text-rose-400 hover:bg-gray-800 rounded-xl transition"
                      title="Delete record & revert balance"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modals */}
      <TransactionModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
      <TransferModal isOpen={showTransferModal} onClose={() => setShowTransferModal(false)} />
    </div>
  );
};
