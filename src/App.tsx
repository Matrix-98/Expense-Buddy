import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Navbar, NavTab } from './components/Navbar';
import { SimplifiedDashboardView } from './components/SimplifiedDashboardView';
import { WalletsView } from './components/WalletsView';
import { DebtManagerView } from './components/DebtManagerView';
import { SavingsGoalsView } from './components/SavingsGoalsView';
import { TransactionsView } from './components/TransactionsView';
import { AnalyticsView } from './components/AnalyticsView';
import { RecurringExpensesView } from './components/RecurringExpensesView';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { AccountSetupWizard } from './components/AccountSetupWizard';
import { WifiOff, Home } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { appScreen, setAppScreen } = useFinance();
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 1. Landing Page (First destination for visitors)
  if (appScreen === 'landing') {
    return <LandingPage />;
  }

  // 2. Login Page (Google, Facebook, Phone Number, Email)
  if (appScreen === 'login') {
    return <LoginPage />;
  }

  // 3. Initial Setup Wizard (Adjust starting balances & bank accounts)
  if (appScreen === 'setup') {
    return <AccountSetupWizard />;
  }

  // 4. Main Application Workspace
  return (
    <div className="min-h-screen bg-[#0B0F17] text-gray-100 selection:bg-emerald-500 selection:text-black font-sans antialiased flex flex-col">
      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {activeTab === 'dashboard' && (
          <SimplifiedDashboardView onNavigateTab={setActiveTab} />
        )}
        {activeTab === 'wallets' && <WalletsView />}
        {activeTab === 'debts' && <DebtManagerView />}
        {activeTab === 'recurring' && <RecurringExpensesView />}
        {activeTab === 'savings' && <SavingsGoalsView />}
        {activeTab === 'transactions' && <TransactionsView />}
        {activeTab === 'analytics' && <AnalyticsView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-900/80 bg-gray-950/60 py-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAppScreen('landing')}
              className="hover:text-emerald-400 flex items-center gap-1 transition"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Landing Page</span>
            </button>
            <span>•</span>
            <p>© 2026 Expense Buddy • Personal Finance & IOU Platform</p>
          </div>
          <p className="text-[11px] text-gray-600">
            PWA Ready • Offline Enabled • Default: BDT (৳)
          </p>
        </div>
      </footer>

      {/* Offline Status Badge */}
      {!isOnline && (
        <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-500/90 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-gray-950 shadow-2xl animate-bounce">
          <WifiOff className="w-4 h-4" />
          <span>Offline Mode — Stored locally on device</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <FinanceProvider>
      <MainAppContent />
    </FinanceProvider>
  );
}
