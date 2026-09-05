import React, { useState } from 'react';
import type { WalletAccount } from '../types/wallet';
import { X, Copy, Check, QrCode } from 'lucide-react';

interface ReceiveModalProps {
  account: WalletAccount | null;
  onClose: () => void;
}

export const ReceiveModal: React.FC<ReceiveModalProps> = ({ account, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!account) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(account.publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center mx-auto mb-3">
            <QrCode className="w-6 h-6 text-cyan-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">Receive {account.currencySymbol}</h3>
          <p className="text-xs text-slate-400 mt-1">
            Scan QR code or copy public deposit address
          </p>
        </div>

        {/* Simulated QR Code Box */}
        <div className="bg-white p-4 rounded-2xl w-48 h-48 mx-auto flex items-center justify-center shadow-inner mb-6">
          <div className="w-full h-full border-4 border-slate-950 rounded-xl flex flex-col items-center justify-center text-slate-950 p-2 text-center bg-gradient-to-tr from-slate-100 to-slate-200">
            <QrCode className="w-24 h-24 text-slate-900" />
            <span className="text-[10px] font-bold uppercase tracking-widest mt-1 text-slate-800">
              {account.currencySymbol} Deposit
            </span>
          </div>
        </div>

        {/* Address & Copy Action */}
        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 mb-6">
          <label className="text-[11px] font-semibold text-slate-400 block mb-1">
            Your {account.name} Deposit Address:
          </label>
          <p className="text-xs font-mono text-cyan-300 break-all select-all font-medium">
            {account.publicKey}
          </p>
        </div>

        <button
          onClick={handleCopy}
          className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 transition ${
            copied
              ? 'bg-emerald-600 text-white'
              : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20'
          }`}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Address Copied!' : 'Copy Deposit Address'}</span>
        </button>

      </div>
    </div>
  );
};
