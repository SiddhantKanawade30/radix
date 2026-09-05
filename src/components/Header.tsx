import React, { useState } from 'react';
import { Wallet, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  activeAccountsCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onReset, activeAccountsCount }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  return (
    <header className="w-full max-w-5xl mx-auto px-6 pt-8 pb-4 flex items-center justify-between">
      {/* Top Left Minimal Logo Icon */}
      <div className="flex items-center space-x-2 text-white">
        <Wallet className="w-6 h-6 stroke-[1.75]" />
      </div>

      {/* Top Right Controls */}
      <div className="flex items-center space-x-4">
        {activeAccountsCount > 0 && (
          <button
            onClick={onReset}
            className="text-xs text-zinc-400 hover:text-zinc-200 transition font-medium underline underline-offset-4"
          >
            Clear Session
          </button>
        )}

        {/* Minimal Sun/Moon Toggle Switch */}
        <div
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="flex items-center space-x-2 bg-zinc-900 border border-zinc-800 rounded-full px-2.5 py-1 cursor-pointer hover:border-zinc-700 transition"
        >
          <Sun className={`w-3.5 h-3.5 ${isDarkMode ? 'text-zinc-500' : 'text-amber-400'}`} />
          <div className={`w-7 h-4 bg-zinc-800 rounded-full p-0.5 flex items-center transition ${isDarkMode ? 'justify-end' : 'justify-start'}`}>
            <div className="w-3 h-3 bg-zinc-200 rounded-full shadow-sm"></div>
          </div>
          <Moon className={`w-3.5 h-3.5 ${isDarkMode ? 'text-zinc-100' : 'text-zinc-500'}`} />
        </div>
      </div>
    </header>
  );
};
