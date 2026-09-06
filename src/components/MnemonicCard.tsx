import React, { useState } from 'react';
import { Copy, Check, Eye, EyeOff, ShieldAlert, X } from 'lucide-react';
import { toast } from 'sonner';

interface MnemonicCardProps {
  mnemonic: string;
  onClose: () => void;
}

export const MnemonicCard: React.FC<MnemonicCardProps> = ({ mnemonic, onClose }) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#0e0e10] border border-zinc-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 mb-1">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <span className="text-xs font-semibold uppercase tracking-wider">Secret Recovery Phrase</span>
            </div>
            <h3 className="text-xl font-bold text-white">Save your secret phrase</h3>
            <p className="text-xs text-zinc-400 mt-1">
              This phrase is the only way to recover your wallet. Store it securely. It will only be shown in this popup.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white p-1 rounded-lg transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 12-Word Grid */}
        <div className="relative">
          <div
            className={`grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-4 rounded-xl bg-black/80 border border-zinc-800/80 ${
              !isRevealed ? 'filter blur-sm select-none opacity-30' : ''
            }`}
          >
            {words.map((word, idx) => (
              <div
                key={idx}
                className="bg-zinc-900/90 border border-zinc-800 rounded-lg px-3 py-2 flex items-center space-x-2 text-xs font-mono"
              >
                <span className="text-zinc-500 font-semibold w-5 text-right">{idx + 1}.</span>
                <span className="text-zinc-100 font-medium">{word}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={() => setIsRevealed(!isRevealed)}
              className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 transition flex items-center space-x-1.5"
            >
              {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{isRevealed ? 'Hide' : 'Show'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 transition flex items-center space-x-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Phrase'}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition shadow-sm cursor-pointer"
          >
            I've Saved My Phrase
          </button>
        </div>

      </div>
    </div>
  );
};
