import React, { useRef, useState } from 'react';
import { Upload, Check, Sparkles, Image as ImageIcon } from 'lucide-react';
import {
  EMOJI_PERSONS,
  generateEmojiAvatar,
  generateGoogleAvatar,
  processUploadedImage,
} from '../utils/avatarUtils';

interface AvatarPickerProps {
  currentAvatar: string;
  onSelectAvatar: (avatarUrl: string) => void;
  userName?: string;
  userEmail?: string;
}

export const AvatarPicker: React.FC<AvatarPickerProps> = ({
  currentAvatar,
  onSelectAvatar,
  userName = 'User',
  userEmail = 'user@gmail.com',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'emoji' | 'google' | 'upload'>('emoji');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const googleAvatar = generateGoogleAvatar(userName, userEmail);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setIsProcessing(true);
    try {
      const dataUrl = await processUploadedImage(file);
      onSelectAvatar(dataUrl);
      setActiveTab('upload');
    } catch {
      setUploadError('Failed to process image. Please try another image.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-gray-950/80 rounded-xl border border-gray-800 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('emoji')}
          className={`flex-1 py-1.5 px-2.5 rounded-lg font-medium transition ${
            activeTab === 'emoji'
              ? 'bg-gray-800 text-white shadow-sm'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Emoji Persons
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('google');
            onSelectAvatar(googleAvatar);
          }}
          className={`flex-1 py-1.5 px-2.5 rounded-lg font-medium transition flex items-center justify-center gap-1.5 ${
            activeTab === 'google'
              ? 'bg-gray-800 text-white shadow-sm'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-[9px] font-black text-white flex items-center justify-center">
            G
          </span>
          <span>Google Account</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-1.5 px-2.5 rounded-lg font-medium transition flex items-center justify-center gap-1 ${
            activeTab === 'upload'
              ? 'bg-gray-800 text-white shadow-sm'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Upload className="w-3 h-3" />
          <span>Upload Photo</span>
        </button>
      </div>

      {/* Tab 1: Emoji Persons Grid */}
      {activeTab === 'emoji' && (
        <div>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-1">
            {EMOJI_PERSONS.map((person) => {
              const svgData = generateEmojiAvatar(person.emoji, person.bg);
              const isSelected = currentAvatar === svgData;

              return (
                <button
                  key={person.id}
                  type="button"
                  onClick={() => onSelectAvatar(svgData)}
                  title={person.label}
                  className={`group relative p-2 rounded-xl flex flex-col items-center justify-center transition border ${
                    isSelected
                      ? 'bg-gray-800 border-emerald-500 shadow-md ring-1 ring-emerald-500/50 scale-105'
                      : 'bg-gray-950/60 border-gray-800/80 hover:bg-gray-800/80 hover:border-gray-700'
                  }`}
                >
                  <span className="text-2xl transition-transform group-hover:scale-110">
                    {person.emoji}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-1 truncate max-w-full">
                    {person.label.split(' ')[0]}
                  </span>
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center text-gray-950">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Google Account Avatar */}
      {activeTab === 'google' && (
        <div className="p-4 rounded-2xl bg-gray-950/80 border border-gray-800/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={googleAvatar}
                alt="Google Avatar"
                className="w-12 h-12 rounded-full border-2 border-emerald-500 shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-md">
                <span className="text-[10px] font-bold text-[#4285F4]">G</span>
              </div>
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                Google Account Avatar
              </span>
              <p className="text-[11px] text-gray-400">
                Synced with your Google/Gmail identity ({userEmail})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectAvatar(googleAvatar)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              currentAvatar === googleAvatar
                ? 'bg-emerald-500 text-gray-950 shadow-sm'
                : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
            }`}
          >
            {currentAvatar === googleAvatar ? 'Active' : 'Apply'}
          </button>
        </div>
      )}

      {/* Tab 3: Upload Custom Photo */}
      {activeTab === 'upload' && (
        <div className="p-4 rounded-2xl bg-gray-950/80 border border-gray-800/80 space-y-3">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-800 border-2 border-emerald-500 shrink-0 flex items-center justify-center">
              {currentAvatar ? (
                <img
                  src={currentAvatar}
                  alt="Uploaded preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="w-6 h-6 text-gray-500" />
              )}
            </div>

            <div className="flex-1">
              <span className="text-xs font-bold text-white block">Upload Personal Picture</span>
              <p className="text-[11px] text-gray-400 mt-0.5">
                PNG, JPG or WebP from your phone or computer.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                type="button"
                disabled={isProcessing}
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs transition active:scale-95 disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isProcessing ? 'Processing...' : 'Choose File'}</span>
              </button>
            </div>
          </div>

          {uploadError && <p className="text-xs text-rose-400">{uploadError}</p>}
        </div>
      )}
    </div>
  );
};
