import React, { useState } from 'react';
import type { WalletAccount } from '../types/wallet';
import { Copy, Check, Trash2, Key, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface AccountCardProps {
  account: WalletAccount;
  onDelete: (id: string) => void;
  onReceiveClick: (account: WalletAccount) => void;
  onSendClick: (account: WalletAccount) => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({
  account,
  onDelete,
  onReceiveClick,
  onSendClick,
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
      setTimeout(() => setCopiedAddr(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleCopyKey = async () => {
    try {
      await navigator.clipboard.writeText(account.privateKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <div className="bg-[#0e0e10] border border-zinc-800 rounded-xl p-5 mb-4 shadow-sm">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h4 className="text-base font-bold text-white">{account.name}</h4>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
              {isSolana ? 'SOL' : 'ETH'}
            </span>
          </div>

          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs font-mono text-zinc-400 bg-black/50 px-2 py-1 rounded border border-zinc-800/80">
              {truncateAddress(account.publicKey)}
            </span>
            <button
              onClick={handleCopyAddr}
              className="text-zinc-500 hover:text-zinc-200 transition p-1"
              title="Copy Address"
            >
              {copiedAddr ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <div className="text-lg font-bold font-mono text-white">
            {account.balance.toFixed(4)} <span className="text-xs text-zinc-400">{account.currencySymbol}</span>
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80 text-xs">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onReceiveClick(account)}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 font-medium transition flex items-center space-x-1"
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>Receive</span>
          </button>

          <button
            onClick={() => onSendClick(account)}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 font-medium transition flex items-center space-x-1"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>

          <button
            onClick={() => setShowPrivateKey(!showPrivateKey)}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 font-medium transition flex items-center space-x-1"
          >
            <Key className="w-3.5 h-3.5" />
            <span>{showPrivateKey ? 'Hide Secret' : 'Secret Key'}</span>
          </button>
        </div>

        <button
          onClick={() => onDelete(account.id)}
          className="p-1.5 text-zinc-500 hover:text-red-400 transition"
          title="Delete Account"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Secret Key Box */}
      {showPrivateKey && (
        <div className="mt-3 p-3 rounded-lg bg-black border border-zinc-800 text-xs font-mono text-zinc-300 flex items-center justify-between gap-2">
          <div className="truncate">
            <span className="text-zinc-500 mr-2 font-sans">Secret Key:</span>
            <span>{account.privateKey}</span>
          </div>

          <button
            onClick={handleCopyKey}
            className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 shrink-0 text-[11px] transition flex items-center space-x-1"
          >
            {copiedKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copiedKey ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      )}

    </div>
  );
};
