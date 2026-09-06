import React, { useState } from 'react';
import type { WalletAccount } from '../types/wallet';
import { Copy, Check, Trash2, Key, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface AccountCardProps {
  account: WalletAccount;
  onDelete: (id: string) => void;
  onReceiveClick?: (account: WalletAccount) => void;
  onSendClick?: (account: WalletAccount) => void;
  isDarkMode: boolean;
}

export const AccountCard: React.FC<AccountCardProps> = ({
  account,
  onDelete,
  isDarkMode,
}) => {
  const [copiedAddr, setCopiedAddr] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [showPrivateKey, setShowPrivateKey] = useState<boolean>(false);

  const isSolana = account.chain === 'solana';

  const truncateAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 8)}...${addr.slice(-8)}`;
  };

  const handleCopyAddr = async () => {
    try {
      await navigator.clipboard.writeText(account.publicKey);
      setCopiedAddr(true);
      toast.success('Public address copied to clipboard');
      setTimeout(() => setCopiedAddr(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleCopyKey = async () => {
    try {
      await navigator.clipboard.writeText(account.privateKey);
      setCopiedKey(true);
      toast.success('Secret key copied to clipboard');
      setTimeout(() => setCopiedKey(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <div
      className={`border rounded-xl p-5 mb-4 shadow-sm transition ${
        isDarkMode
          ? 'bg-[#0e0e10] border-zinc-800 text-white'
          : 'bg-white border-zinc-200 text-zinc-900'
      }`}
    >
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h4 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
              {account.name}
            </h4>
            <span
              className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                isDarkMode
                  ? 'bg-zinc-900 text-zinc-400 border-zinc-800'
                  : 'bg-zinc-100 text-zinc-600 border-zinc-200'
              }`}
            >
              {isSolana ? 'SOL' : 'ETH'}
            </span>
          </div>

          <div className="flex items-center space-x-2 mt-1">
            <span
              className={`text-xs font-mono px-2 py-1 rounded border ${
                isDarkMode
                  ? 'text-zinc-400 bg-black/50 border-zinc-800/80'
                  : 'text-zinc-700 bg-zinc-100 border-zinc-200'
              }`}
            >
              {truncateAddress(account.publicKey)}
            </span>
            <button
              onClick={handleCopyAddr}
              className={`transition p-1 ${
                isDarkMode ? 'text-zinc-500 hover:text-zinc-200' : 'text-zinc-400 hover:text-zinc-800'
              }`}
              title="Copy Address"
            >
              {copiedAddr ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div
        className={`flex items-center justify-between pt-3 border-t text-xs ${
          isDarkMode ? 'border-zinc-800/80' : 'border-zinc-200'
        }`}
      >
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowPrivateKey(!showPrivateKey)}
            className={`px-3 py-1.5 rounded-lg border font-medium transition flex items-center space-x-1 ${
              isDarkMode
                ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border-zinc-800'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-900 border-zinc-300'
            }`}
          >
            {showPrivateKey ? <EyeOff className="w-3.5 h-3.5" /> : <Key className="w-3.5 h-3.5" />}
            <span>{showPrivateKey ? 'Hide' : 'Secret Key'}</span>
          </button>
        </div>

        <button
          onClick={() => onDelete(account.id)}
          className={`p-1.5 transition ${
            isDarkMode ? 'text-zinc-500 hover:text-red-400' : 'text-zinc-400 hover:text-red-500'
          }`}
          title="Delete Account"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Secret Key Box */}
      {showPrivateKey && (
        <div
          className={`mt-3 p-3 rounded-lg border text-xs font-mono flex items-center justify-between gap-2 ${
            isDarkMode
              ? 'bg-black border-zinc-800 text-zinc-300'
              : 'bg-zinc-50 border-zinc-200 text-zinc-800'
          }`}
        >
          <div className="truncate">
            <span className={`mr-2 font-sans ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Secret Key:
            </span>
            <span>{account.privateKey}</span>
          </div>

          <button
            onClick={handleCopyKey}
            className={`px-2 py-1 rounded shrink-0 text-[11px] transition flex items-center space-x-1 ${
              isDarkMode
                ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300'
                : 'bg-zinc-200 hover:bg-zinc-300 text-zinc-800'
            }`}
          >
            {copiedKey ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            <span>{copiedKey ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
