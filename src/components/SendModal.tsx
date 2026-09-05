import React, { useState } from 'react';
import type { WalletAccount } from '../types/wallet';
import { X, Send, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface SendModalProps {
  account: WalletAccount | null;
  onClose: () => void;
  onSendSuccess: (accountId: string, amount: number) => void;
}

export const SendModal: React.FC<SendModalProps> = ({ account, onClose, onSendSuccess }) => {
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  if (!account) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!recipient.trim() || isNaN(numAmount) || numAmount <= 0) return;
    
    if (numAmount > account.balance) {
      setStatus('error');
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setStatus('success');
      onSendSuccess(account.id, numAmount);
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setRecipient('');
        setAmount('');
      }, 1800);
    }, 1200);
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

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-800/60 flex items-center justify-center mx-auto mb-3">
            <Send className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">Send {account.currencySymbol}</h3>
          <p className="text-xs text-slate-400 mt-1">
            Transfer crypto from {account.name}
          </p>
        </div>

        {status === 'success' ? (
          <div className="py-8 text-center animate-fadeIn">
            <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto mb-3 animate-bounce" />
            <h4 className="text-base font-bold text-slate-100 font-sans">Transaction Submitted!</h4>
            <p className="text-xs text-slate-400 mt-1">
              Sent {amount} {account.currencySymbol} successfully on Devnet.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4">
            
            {/* Recipient Input */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Recipient Public Address
              </label>
              <input
                type="text"
                required
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder={account.chain === 'solana' ? 'Solana Base58 Address...' : '0x... Ethereum Address'}
                className="w-full bg-slate-950 text-slate-100 placeholder-slate-500 text-xs font-mono p-3 rounded-xl border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
              />
            </div>

            {/* Amount Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Amount ({account.currencySymbol})
                </label>
                <span className="text-[11px] text-slate-400">
                  Available: {account.balance.toFixed(4)} {account.currencySymbol}
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder="0.00"
                  className="w-full bg-slate-950 text-slate-100 placeholder-slate-500 text-sm font-mono p-3 pr-16 rounded-xl border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setAmount(account.balance.toString())}
                  className="absolute right-3 top-2.5 px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-purple-950 text-purple-300 border border-purple-800/60 hover:bg-purple-900 transition"
                >
                  MAX
                </button>
              </div>
            </div>

            {status === 'error' && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/50 flex items-center space-x-2 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>Insufficient balance for transaction fee.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSending}
              className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 transition disabled:opacity-50"
            >
              {isSending ? (
                <span>Broadcasting to Devnet...</span>
              ) : (
                <>
                  <span>Send Transaction</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
