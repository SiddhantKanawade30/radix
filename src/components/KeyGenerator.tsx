import React, { useState } from 'react';
import { Eye, EyeOff, X, Clipboard } from 'lucide-react';

interface KeyGeneratorProps {
  inputKey: string;
  setInputKey: (val: string) => void;
  onGenerateOrImport: () => void;
  isDarkMode: boolean;
}

export const KeyGenerator: React.FC<KeyGeneratorProps> = ({
  inputKey,
  setInputKey,
  onGenerateOrImport,
  isDarkMode,
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
        
        {/* Long Input Field */}
        <div className="relative flex-1 flex items-center">
          <input
            type={showPassword ? 'text' : 'password'}
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder="Enter your secret phrase (or leave blank to generate)"
            className={`w-full text-sm font-sans px-4 py-3.5 rounded-lg border outline-none transition ${
              isDarkMode
                ? 'bg-[#0e0e10] text-zinc-100 placeholder-zinc-500 border-zinc-800 focus:border-zinc-600'
                : 'bg-white text-zinc-900 placeholder-zinc-400 border-zinc-300 focus:border-zinc-500 shadow-sm'
            }`}
          />

          {/* Inline Action Buttons (Eye / Clear / Paste) */}
          <div className={`absolute right-3 flex items-center space-x-1 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
            {hasInput ? (
              <>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide Secret' : 'Show Secret'}
                  className={`p-1 transition ${isDarkMode ? 'hover:text-white' : 'hover:text-zinc-900'}`}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  title="Clear"
                  className="p-1 hover:text-red-500 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handlePaste}
                title="Paste from clipboard"
                className={`p-1 text-xs transition flex items-center space-x-1 ${
                  isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span>Paste</span>
              </button>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onGenerateOrImport}
          className={`font-semibold text-sm px-6 py-3.5 rounded-lg shadow-sm transition shrink-0 cursor-pointer ${
            isDarkMode
              ? 'bg-white hover:bg-zinc-200 text-black'
              : 'bg-zinc-900 hover:bg-zinc-800 text-white'
          }`}
        >
          {hasInput ? 'Import Wallet' : 'Generate Wallet'}
        </button>

      </div>
    </div>
  );
};
