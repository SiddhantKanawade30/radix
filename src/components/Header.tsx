import React from 'react';
import { Wallet, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  activeAccountsCount: number;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  activeAccountsCount,
  isDarkMode,
  onToggleTheme,
}) => {
  return (
    <header className="w-full max-w-5xl mx-auto px-6 pt-8 pb-4 flex items-center justify-between">
      {/* Top Left Minimal Logo Icon */}
      <div className={`flex items-center space-x-2 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
        <Wallet className="w-6 h-6 stroke-[1.75]" />
      </div>

      {/* Top Right Controls */}
      <div className="flex items-center space-x-4">
        {activeAccountsCount > 0 && (
          <button
            onClick={onReset}
            className={`text-xs transition font-medium underline underline-offset-4 ${
              isDarkMode ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Clear Session
          </button>
        )}

        {/* Minimal Sun/Moon Toggle Switch */}
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          className={`flex items-center space-x-2 border rounded-full px-2.5 py-1 cursor-pointer transition ${
            isDarkMode
              ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
              : 'bg-zinc-100 border-zinc-300 hover:border-zinc-400'
          }`}
        >
          <Sun className={`w-3.5 h-3.5 ${isDarkMode ? 'text-zinc-500' : 'text-amber-500'}`} />
          <div
            className={`w-7 h-4 rounded-full p-0.5 flex items-center transition ${
              isDarkMode ? 'bg-zinc-800 justify-end' : 'bg-zinc-200 justify-start'
            }`}
          >
            <div className={`w-3 h-3 rounded-full shadow-sm ${isDarkMode ? 'bg-zinc-200' : 'bg-white'}`}></div>
          </div>
          <Moon className={`w-3.5 h-3.5 ${isDarkMode ? 'text-zinc-100' : 'text-zinc-400'}`} />
        </button>
      </div>
    </header>
  );
};
