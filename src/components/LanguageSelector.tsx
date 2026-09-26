import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { LANGUAGES } from '../utils/translations';
import { LanguageCode } from '../types/finance';

export const LanguageSelector: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { language, setLanguage } = useFinance();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-800 hover:border-gray-700 text-xs font-medium transition"
        title="Select Language / ভাষা পরিবর্তন করুন"
      >
        <span className="text-sm leading-none">{activeLang.flag}</span>
        {!compact && <span className="font-semibold">{activeLang.nativeName}</span>}
        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-44 rounded-2xl bg-gray-900 border border-gray-800 shadow-2xl py-1 z-50 animate-fadeIn">
          <div className="px-3 py-1.5 border-b border-gray-800 text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
            Choose Language / ভাষা
          </div>
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => {
                setLanguage(l.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition ${
                language === l.code
                  ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                  : 'text-gray-300 hover:bg-gray-800/80 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-base leading-none">{l.flag}</span>
                <span>{l.nativeName}</span>
                <span className="text-[10px] text-gray-500">({l.name})</span>
              </span>
              {language === l.code && <Check className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
