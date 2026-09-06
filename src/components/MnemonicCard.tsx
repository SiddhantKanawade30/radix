import React, { useState } from 'react';
import { Copy, Check, Eye, EyeOff, ShieldAlert, X } from 'lucide-react';
import { toast } from 'sonner';

interface MnemonicCardProps {
  mnemonic: string;
  onClose: () => void;
  isDarkMode: boolean;
}

export const MnemonicCard: React.FC<MnemonicCardProps> = ({ mnemonic, onClose, isDarkMode }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [isRevealed, setIsRevealed] = useState<boolean>(true);

  const words = mnemonic.trim().split(/\s+/);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(mnemonic);
      setCopied(true);
      toast.success('Secret recovery phrase copied');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div
        className={`rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 border transition ${
          isDarkMode
            ? 'bg-[#0e0e10] border-zinc-800 text-white'
            : 'bg-white border-zinc-200 text-zinc-900'
        }`}
      >
        
        {/* Modal Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 text-amber-500 mb-1">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <span className="text-xs font-semibold uppercase tracking-wider">Secret Recovery Phrase</span>
            </div>
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
              Save your secret phrase
            </h3>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
              This phrase is the only way to recover your wallet. Store it securely. It will only be shown in this popup.
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition ${
              isDarkMode ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-800'
            }`}
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 12-Word Grid */}
        <div className="relative">
          <div
            className={`grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-4 rounded-xl border ${
              isDarkMode ? 'bg-black/80 border-zinc-800/80' : 'bg-zinc-50 border-zinc-200'
            } ${!isRevealed ? 'filter blur-sm select-none opacity-30' : ''}`}
          >
            {words.map((word, idx) => (
              <div
                key={idx}
                className={`border rounded-lg px-3 py-2 flex items-center space-x-2 text-xs font-mono ${
                  isDarkMode
                    ? 'bg-zinc-900/90 border-zinc-800 text-zinc-100'
                    : 'bg-white border-zinc-200 text-zinc-800 shadow-sm'
                }`}
              >
                <span className={`font-semibold w-5 text-right ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  {idx + 1}.
                </span>
                <span className="font-medium">{word}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={() => setIsRevealed(!isRevealed)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition flex items-center space-x-1.5 ${
                isDarkMode
                  ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-300'
              }`}
            >
              {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{isRevealed ? 'Hide' : 'Show'}</span>
            </button>

            <button
              onClick={handleCopy}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition flex items-center space-x-1.5 ${
                isDarkMode
                  ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-300'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Phrase'}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer ${
              isDarkMode
                ? 'bg-white hover:bg-zinc-200 text-black'
                : 'bg-zinc-900 hover:bg-zinc-800 text-white'
            }`}
          >
            I've Saved My Phrase
          </button>
        </div>

      </div>
    </div>
  );
};
