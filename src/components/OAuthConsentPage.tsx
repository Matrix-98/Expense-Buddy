import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const OAuthConsentPage: React.FC = () => {
  const params = new URLSearchParams(window.location.search);
  const clientName = params.get('client_name') || 'An application';
  const redirectUri = params.get('redirect_uri');

  const handleContinue = () => {
    if (!redirectUri) return;
    window.location.assign(redirectUri);
  };

  return (
    <main className="min-h-screen bg-[#0B0F17] text-gray-100 flex items-center justify-center p-4">
      <section className="w-full max-w-md rounded-3xl border border-gray-800 bg-gray-900 p-8 shadow-2xl">
        <div className="mb-6 flex justify-center">
          <div className="rounded-2xl bg-emerald-500/10 p-4 text-emerald-400">
            <ShieldCheck className="h-8 w-8" aria-hidden="true" />
          </div>
        </div>
        <h1 className="text-center text-2xl font-black text-white">Authorize Expense Buddy</h1>
        <p className="mt-3 text-center text-sm leading-6 text-gray-400">
          {clientName} is requesting permission to sign you in with your Expense Buddy account.
        </p>
        <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-950/60 p-4 text-xs text-gray-400">
          <p className="font-semibold text-gray-200">Requested access</p>
          <p className="mt-1">Your basic account identity and email address.</p>
        </div>
        <button
          type="button"
          onClick={handleContinue}
          disabled={!redirectUri}
          className="mt-6 w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-gray-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue
        </button>
        {!redirectUri && (
          <p className="mt-3 text-center text-xs text-rose-300">
            This authorization request is missing a redirect URL.
          </p>
        )}
      </section>
    </main>
  );
};

export default OAuthConsentPage;
