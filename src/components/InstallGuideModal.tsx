import React from 'react';
import {
  Download,
  Smartphone,
  Laptop,
  Share2,
  CheckCircle,
  X,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDirectInstall?: () => void;
  isInstallable?: boolean;
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({
  isOpen,
  onClose,
  onDirectInstall,
  isInstallable,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-gray-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Install SpendWise Pro
              </h2>
              <p className="text-xs text-gray-400">
                Cross-Platform Mobile App & Desktop Installer
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-gray-300">
          {/* Quick Direct Prompt if Chromium/Android supported */}
          {isInstallable && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-emerald-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  Instant One-Click Install Ready!
                </p>
                <p className="text-xs text-emerald-200/80 mt-0.5">
                  Your current browser supports direct 1-click installation to your system launcher.
                </p>
              </div>
              <button
                onClick={() => {
                  onDirectInstall?.();
                  onClose();
                }}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-gray-950 font-semibold text-xs rounded-lg transition shadow-md whitespace-nowrap"
              >
                Install Now
              </button>
            </div>
          )}

          {/* Grid of Platforms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mobile (Android & iOS) */}
            <div className="p-4 rounded-xl bg-gray-800/60 border border-gray-700/60 space-y-3">
              <div className="flex items-center gap-2 text-white font-semibold">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span>Mobile (Android & iPhone)</span>
              </div>
              <div className="space-y-2 text-xs text-gray-400 leading-relaxed">
                <div className="p-2 rounded bg-gray-900/80 border border-gray-800">
                  <strong className="text-gray-200">Android (Chrome / Edge / Firefox):</strong>
                  <p className="mt-1">
                    Tap the <strong>three dots menu (⋮)</strong> in your browser and select{' '}
                    <span className="text-emerald-400 font-medium">"Install app"</span> or{' '}
                    <span className="text-emerald-400 font-medium">"Add to Home Screen"</span>.
                  </p>
                </div>
                <div className="p-2 rounded bg-gray-900/80 border border-gray-800">
                  <strong className="text-gray-200">iOS (iPhone & iPad Safari):</strong>
                  <p className="mt-1 flex items-start gap-1">
                    <Share2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>
                      Tap the <strong>Share</strong> button in Safari toolbar, scroll down and tap{' '}
                      <span className="text-cyan-300 font-medium">"Add to Home Screen"</span>.
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop (Windows / Mac / Linux) */}
            <div className="p-4 rounded-xl bg-gray-800/60 border border-gray-700/60 space-y-3">
              <div className="flex items-center gap-2 text-white font-semibold">
                <Laptop className="w-4 h-4 text-indigo-400" />
                <span>Desktop (Windows, Mac, Linux)</span>
              </div>
              <div className="space-y-2 text-xs text-gray-400 leading-relaxed">
                <div className="p-2 rounded bg-gray-900/80 border border-gray-800">
                  <strong className="text-gray-200">Google Chrome / Microsoft Edge:</strong>
                  <p className="mt-1">
                    Click the <strong>Install icon (⊕ / 💻)</strong> on the right side of the address bar, or open menu (⋮) →{' '}
                    <span className="text-indigo-400 font-medium">"Save and share" → "Install SpendWise"</span>.
                  </p>
                </div>
                <div className="p-2 rounded bg-gray-900/80 border border-gray-800">
                  <strong className="text-gray-200">Native Desktop Window:</strong>
                  <p className="mt-1">
                    Launches as an isolated native app window with custom icon, no URL bar, full keyboard shortcuts, and offline support.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Features highlight */}
          <div className="p-4 rounded-xl bg-gray-950/80 border border-gray-800">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-2">
              Why Install SpendWise Pro?
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-2 text-gray-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Latency & Offline</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Desktop App Window</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Home Screen Launcher</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Persistent Data</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp URI Links</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>PDF & CSV Exporting</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 bg-gray-950/80 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium rounded-lg transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
