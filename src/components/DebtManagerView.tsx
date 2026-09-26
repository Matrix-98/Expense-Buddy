import React, { useState } from 'react';
import {
  HandCoins,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Search,
  MessageSquare,
  CheckCircle2,
  Trash2,
  Calendar,
  Phone,
  Wallet as WalletIcon,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { DebtRecord, DebtType } from '../types/finance';
import { formatCurrency, formatDate } from '../utils/formatters';
import { DebtModal } from './Modals/DebtModal';
import { RepaymentModal } from './Modals/RepaymentModal';
import { FriendlyReminderModal } from './FriendlyReminderModal';

export const DebtManagerView: React.FC = () => {
  const {
    debts,
    user,
    wallets,
    totalMoneyLent,
    totalMoneyBorrowed,
    netDebtPosition,
    deleteDebt,
  } = useFinance();

  const [activeTab, setActiveTab] = useState<'active' | 'settled'>('active');
  const [filterType, setFilterType] = useState<'all' | 'lent' | 'borrowed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [initialDebtType, setInitialDebtType] = useState<DebtType>('lent');
  const [selectedDebtForRepayment, setSelectedDebtForRepayment] = useState<DebtRecord | null>(null);
  const [selectedDebtForReminder, setSelectedDebtForReminder] = useState<DebtRecord | null>(null);

  const filteredDebts = debts
    .filter((d) => (activeTab === 'active' ? d.status === 'active' : d.status === 'settled'))
    .filter((d) => (filterType === 'all' ? true : d.debtType === filterType))
    .filter((d) =>
      d.personName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.phone && d.phone.includes(searchQuery)) ||
      (d.notes && d.notes.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner & Metrics */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 border border-gray-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Debt & IOU Ledger (Section 5.0)
              </span>
              <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/20 font-medium">
                Live Repayment Tracking
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Manage Loans, IOUs & Repayments
            </h2>
            <p className="mt-1 text-xs text-gray-400 max-w-xl">
              Track money you lent to friends and money you borrowed. Partial repayments automatically adjust your wallet balances in real-time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setInitialDebtType('lent');
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition active:scale-95"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>+ Money Lent (IOU Out)</span>
            </button>
            <button
              onClick={() => {
                setInitialDebtType('borrowed');
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-lg shadow-rose-600/20 transition active:scale-95"
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>+ Money Borrowed</span>
            </button>
          </div>
        </div>

        {/* 3 Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-gray-800">
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30">
            <span className="text-xs font-semibold text-amber-400 block mb-1">
              Money Lent (Receivables)
            </span>
            <span className="text-2xl font-black text-white">
              {formatCurrency(totalMoneyLent, user?.currency)}
            </span>
            <span className="text-[11px] text-gray-400 block mt-1">
              Owed to you by friends & colleagues
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30">
            <span className="text-xs font-semibold text-rose-400 block mb-1">
              Money Borrowed (Payables)
            </span>
            <span className="text-2xl font-black text-white">
              {formatCurrency(totalMoneyBorrowed, user?.currency)}
            </span>
            <span className="text-[11px] text-gray-400 block mt-1">
              You owe to lenders & creditors
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-gray-950/60 border border-gray-800">
            <span className="text-xs font-semibold text-gray-300 block mb-1">
              Net Balance Position
            </span>
            <span
              className={`text-2xl font-black ${
                netDebtPosition >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {formatCurrency(netDebtPosition, user?.currency)}
            </span>
            <span className="text-[11px] text-gray-400 block mt-1">
              Net receivables minus payables
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Tab Navigation */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Active vs Settled Tabs (Req 5.5: settled records moved out of active UI) */}
        <div className="flex items-center gap-1 p-1 bg-gray-900 border border-gray-800 rounded-xl">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'active'
                ? 'bg-gray-800 text-white shadow-sm border border-gray-700'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Active Debts ({debts.filter((d) => d.status === 'active').length})
          </button>
          <button
            onClick={() => setActiveTab('settled')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'settled'
                ? 'bg-gray-800 text-white shadow-sm border border-gray-700'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Settled History ({debts.filter((d) => d.status === 'settled').length})
          </button>
        </div>

        {/* Search & Type filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search debtor or note..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-gray-900 border border-gray-800 text-white text-xs placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">All Types</option>
            <option value="lent">Money Lent</option>
            <option value="borrowed">Money Borrowed</option>
          </select>
        </div>
      </div>

      {/* Debts List */}
      {filteredDebts.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-gray-900/40 border border-gray-800/80">
          <HandCoins className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-300">
            {activeTab === 'active' ? 'No Active Debts' : 'No Settled History'}
          </h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            {activeTab === 'active'
              ? 'You have settled all pending IOUs! Click either button above to record a new loan.'
              : 'Settled records will automatically appear here once their remaining balance hits zero.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDebts.map((debt) => {
            const isLent = debt.debtType === 'lent';
            const percentRepaid = Math.round(
              ((debt.originalAmount - debt.remainingAmount) / debt.originalAmount) * 100
            );
            const initialWallet = wallets.find((w) => w.id === debt.walletId)?.name || 'Wallet';

            return (
              <div
                key={debt.id}
                className="p-5 rounded-3xl bg-gray-900/80 border border-gray-800 hover:border-gray-700/80 transition flex flex-col justify-between space-y-4"
              >
                {/* Card Header */}
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white tracking-tight">
                          {debt.personName}
                        </h3>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isLent
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {isLent ? 'Money Lent' : 'Money Borrowed'}
                        </span>
                      </div>
                      {debt.phone && (
                        <p className="text-xs text-gray-400 font-mono mt-0.5 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-gray-500" />
                          <span>{debt.phone}</span>
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-gray-500 uppercase block font-medium">
                        Remaining
                      </span>
                      <span
                        className={`text-lg font-black font-mono ${
                          debt.status === 'settled'
                            ? 'text-gray-400 line-through'
                            : isLent
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {formatCurrency(debt.remainingAmount, user?.currency)}
                      </span>
                    </div>
                  </div>

                  {/* Dates & notes */}
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-500" />
                      Date: {formatDate(debt.date)}
                    </span>
                    {debt.dueDate && (
                      <span className="flex items-center gap-1 text-amber-400/90 font-medium">
                        <Clock className="w-3 h-3" />
                        Due: {formatDate(debt.dueDate)}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-gray-500">
                      <WalletIcon className="w-3 h-3" />
                      {initialWallet}
                    </span>
                  </div>

                  {debt.notes && (
                    <p className="mt-2 text-xs text-gray-400 bg-gray-950/60 p-2.5 rounded-xl border border-gray-800">
                      "{debt.notes}"
                    </p>
                  )}
                </div>

                {/* Repayment Progress & History */}
                <div className="space-y-2 pt-2 border-t border-gray-800/80">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>
                      Repaid: {formatCurrency(debt.originalAmount - debt.remainingAmount, user?.currency)}{' '}
                      / {formatCurrency(debt.originalAmount, user?.currency)}
                    </span>
                    <span className="font-bold text-gray-300">{percentRepaid}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isLent ? 'bg-amber-400' : 'bg-rose-400'
                      }`}
                      style={{ width: `${percentRepaid}%` }}
                    />
                  </div>

                  {/* Repayment history count */}
                  {debt.repayments.length > 0 && (
                    <p className="text-[11px] text-gray-500">
                      {debt.repayments.length} partial repayment(s) logged.
                    </p>
                  )}
                </div>

                {/* Card Action Buttons (Req 5.3 & Req 5.6) */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => deleteDebt(debt.id)}
                    className="p-1.5 text-gray-500 hover:text-rose-400 rounded-lg transition"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2">
                    {/* Requirement 5.6: Friendly Reminder Button for Money Lent */}
                    {isLent && debt.status === 'active' && (
                      <button
                        onClick={() => setSelectedDebtForReminder(debt)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 text-xs font-semibold transition"
                        title="Generate pre-filled WhatsApp / SMS reminder with exact remaining amount"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Friendly Reminder</span>
                      </button>
                    )}

                    {/* Requirement 5.3: Log Repayment Button */}
                    {debt.status === 'active' && (
                      <button
                        onClick={() => setSelectedDebtForRepayment(debt)}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-md transition active:scale-95 ${
                          isLent
                            ? 'bg-amber-500 hover:bg-amber-400 text-gray-950'
                            : 'bg-rose-600 hover:bg-rose-500 text-white'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Log Repayment</span>
                      </button>
                    )}

                    {debt.status === 'settled' && (
                      <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold px-2 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Settled</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <DebtModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        initialType={initialDebtType}
      />
      <RepaymentModal
        isOpen={!!selectedDebtForRepayment}
        onClose={() => setSelectedDebtForRepayment(null)}
        debt={selectedDebtForRepayment}
      />
      <FriendlyReminderModal
        isOpen={!!selectedDebtForReminder}
        onClose={() => setSelectedDebtForReminder(null)}
        debt={selectedDebtForReminder}
      />
    </div>
  );
};
