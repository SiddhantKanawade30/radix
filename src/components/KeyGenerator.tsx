import React, { useState } from 'react';
import { Eye, EyeOff, X, Clipboard } from 'lucide-react';

interface KeyGeneratorProps {
  inputKey: string;
  setInputKey: (val: string) => void;
  onGenerateOrImport: () => void;
}

export const KeyGenerator: React.FC<KeyGeneratorProps> = ({
  inputKey,
  setInputKey,
  onGenerateOrImport,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(true);

  const hasInput = inputKey.trim().length > 0;

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputKey(text);
      }
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  const handleClear = () => {
    setInputKey('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-4 mb-8">
      <div className="flex flex-col sm:flex-row items-stretch gap-3">
        
        {/* Long Minimal Input Field */}
        <div className="relative flex-1 flex items-center">
          <input
            type={showPassword ? 'text' : 'password'}
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder="Enter your secret phrase (or leave blank to generate)"
            className="w-full bg-[#0e0e10] text-zinc-100 placeholder-zinc-500 text-sm font-sans px-4 py-3.5 rounded-lg border border-zinc-800 focus:border-zinc-600 outline-none transition"
          />

          {/* Inline Action Buttons (Eye / Clear / Paste) */}
          <div className="absolute right-3 flex items-center space-x-1 text-zinc-400">
            {hasInput ? (
              <>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide Secret' : 'Show Secret'}
                  className="p-1 hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  title="Clear"
                  className="p-1 hover:text-red-400 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handlePaste}
                title="Paste from clipboard"
                className="p-1 text-xs text-zinc-400 hover:text-white transition flex items-center space-x-1"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span>Paste</span>
              </button>
            )}
          </div>
        </div>

        {/* Beside Action Button - Solid White Button matching screenshot */}
        <button
          onClick={onGenerateOrImport}
          className="bg-white hover:bg-zinc-200 text-black font-semibold text-sm px-6 py-3.5 rounded-lg shadow-sm transition shrink-0 cursor-pointer"
        >
          {hasInput ? 'Import Wallet' : 'Generate Wallet'}
        </button>

      </div>
    </div>
  );
};
