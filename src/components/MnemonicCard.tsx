import React, { useState } from 'react';
import { Copy, Check, Eye, EyeOff } from 'lucide-react';

interface MnemonicCardProps {
  mnemonic: string;
}

export const MnemonicCard: React.FC<MnemonicCardProps> = ({ mnemonic }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [isRevealed, setIsRevealed] = useState<boolean>(true);

  const words = mnemonic.trim().split(/\s+/);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(mnemonic);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mb-10">
      <div className="bg-[#0e0e10] border border-zinc-800 rounded-xl p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-zinc-300">
            Your Secret Recovery Phrase
          </h3>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsRevealed(!isRevealed)}
              className="text-xs text-zinc-400 hover:text-white transition flex items-center space-x-1.5"
            >
              {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{isRevealed ? 'Hide' : 'Show'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="text-xs text-zinc-400 hover:text-white transition flex items-center space-x-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* 12-Word Grid */}
        <div
          className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 ${
            !isRevealed ? 'filter blur-sm select-none opacity-30' : ''
          }`}
        >
          {words.map((word, idx) => (
            <div
              key={idx}
              className="bg-black/60 border border-zinc-800/80 rounded-lg px-3.5 py-2.5 flex items-center space-x-2 text-xs font-mono"
            >
              <span className="text-zinc-500 font-semibold w-5 text-right">{idx + 1}.</span>
              <span className="text-zinc-200 font-medium">{word}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
