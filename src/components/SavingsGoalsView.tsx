import React, { useState } from 'react';
import {
  Target,
  Plus,
  PiggyBank,
  CheckCircle2,
  Calendar,
  Wallet as WalletIcon,
  Trash2,
  PlusCircle,
  MinusCircle,
  Monitor,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { SavingsGoal } from '../types/finance';
import { formatCurrency, formatDate } from '../utils/formatters';
import { GoalModal } from './Modals/GoalModal';
import { GoalDepositModal } from './Modals/GoalDepositModal';

export const SavingsGoalsView: React.FC = () => {
  const { savingsGoals, user, wallets, deleteGoal } = useFinance();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedGoalForDeposit, setSelectedGoalForDeposit] = useState<SavingsGoal | null>(null);

  const totalSavedAcrossGoals = savingsGoals.reduce((sum, g) => sum + g.currentSavedAmount, 0);
  const totalTargetAcrossGoals = savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  const overallPercentage =
    totalTargetAcrossGoals > 0
      ? Math.min(100, Math.round((totalSavedAcrossGoals / totalTargetAcrossGoals) * 100))
      : 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 border border-gray-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Targeted Savings (Section 6.0)
              </span>
              <span className="text-[10px] bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/20 font-medium">
                Milestones & Goals
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Savings Goals & Milestones
            </h2>
            <p className="mt-1 text-xs text-gray-400 max-w-xl">
              Create dedicated goals (e.g. "New PC", "Emergency Buffer") tied to your Savings wallet.
              Allocate deposits directly and track progress with real-time percentage meters.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Savings Goal</span>
          </button>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 pt-6 border-t border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">
              Total Saved: <strong className="text-white font-mono">{formatCurrency(totalSavedAcrossGoals, user?.currency)}</strong> of{' '}
              <strong className="text-gray-300 font-mono">{formatCurrency(totalTargetAcrossGoals, user?.currency)}</strong>
            </span>
            <span className="font-extrabold text-cyan-400 font-mono">{overallPercentage}% Reached</span>
          </div>
          <div className="w-full h-3 rounded-full bg-gray-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 transition-all duration-700"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      {savingsGoals.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-gray-900/40 border border-gray-800/80">
          <Target className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-300">No Savings Goals Yet</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Plan your next big purchase! Click "Create Savings Goal" to start saving for a New PC, vehicle, or rainy day buffer.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savingsGoals.map((goal) => {
            const percentage = Math.min(
              100,
              Math.round((goal.currentSavedAmount / goal.targetAmount) * 100)
            );
            const isCompleted = goal.currentSavedAmount >= goal.targetAmount;
            const linkedWallet = wallets.find((w) => w.id === goal.walletId)?.name || 'Savings';

            return (
              <div
                key={goal.id}
                className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 hover:border-gray-700/80 transition flex flex-col justify-between space-y-5"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        style={{ backgroundColor: `${goal.color}20`, color: goal.color }}
                        className="w-11 h-11 rounded-2xl flex items-center justify-center border border-white/5"
                      >
                        <Target className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white tracking-tight">
                            {goal.name}
                          </h3>
                          {isCompleted && (
                            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                              <Award className="w-3 h-3" />
                              <span>Goal Reached!</span>
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <WalletIcon className="w-3 h-3 text-gray-500" />
                          <span>Linked: {linkedWallet}</span>
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="p-1.5 text-gray-500 hover:text-rose-400 rounded-lg transition"
                      title="Delete goal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Target amounts & progress meter (Req 6.2 & 6.3) */}
                  <div className="mt-5 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-semibold block">
                          Current Saved
                        </span>
                        <span className="text-xl font-black text-white font-mono">
                          {formatCurrency(goal.currentSavedAmount, user?.currency)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-gray-500 uppercase font-semibold block">
                          Target
                        </span>
                        <span className="text-sm font-bold text-gray-300 font-mono">
                          {formatCurrency(goal.targetAmount, user?.currency)}
                        </span>
                      </div>
                    </div>

                    {/* Requirement 6.3: Visual Progress Bar */}
                    <div className="w-full h-3 rounded-full bg-gray-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: goal.color || '#06B6D4',
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{percentage}% achieved</span>
                      <span>
                        {isCompleted
                          ? '100% Funded!'
                          : `${formatCurrency(
                              goal.targetAmount - goal.currentSavedAmount,
                              user?.currency
                            )} left to reach target`}
                      </span>
                    </div>
                  </div>

                  {/* Notes & Target Date */}
                  {(goal.notes || goal.targetDate) && (
                    <div className="mt-3 p-3 rounded-xl bg-gray-950/60 border border-gray-800 text-xs text-gray-400 space-y-1">
                      {goal.notes && <p className="italic">"{goal.notes}"</p>}
                      {goal.targetDate && (
                        <p className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                          <Calendar className="w-3 h-3 text-cyan-400" />
                          <span>Target Date: {formatDate(goal.targetDate)}</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Button: Deposit / Withdraw from linked wallet */}
                <div className="pt-2 border-t border-gray-800/80 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setSelectedGoalForDeposit(goal)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition active:scale-95"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add / Withdraw Funds</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <GoalModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
      <GoalDepositModal
        isOpen={!!selectedGoalForDeposit}
        onClose={() => setSelectedGoalForDeposit(null)}
        goal={selectedGoalForDeposit}
      />
    </div>
  );
};
