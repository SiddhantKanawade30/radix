import { useState } from 'react';
import { Header } from './components/Header';
import { KeyGenerator } from './components/KeyGenerator';
import { MnemonicCard } from './components/MnemonicCard';
import { AccountCard } from './components/AccountCard';
import { Toaster, toast } from 'sonner';
import type { WalletAccount, ChainType } from './types/wallet';
import {
  generateRandomMnemonic,
  validateSeedPhrase,
  deriveSolanaAccount,
  deriveEthereumAccount,
} from './utils/crypto';
import { Plus, Coins, Layers } from 'lucide-react';

function App() {
  const [inputKey, setInputKey] = useState<string>('');
  const [activeMnemonic, setActiveMnemonic] = useState<string>('');
  const [selectedChain, setSelectedChain] = useState<ChainType>('solana');
  const [solanaAccounts, setSolanaAccounts] = useState<WalletAccount[]>([]);
  const [ethereumAccounts, setEthereumAccounts] = useState<WalletAccount[]>([]);
  const [showMnemonicModal, setShowMnemonicModal] = useState<boolean>(false);

  // Generate or Import UI action
  const handleGenerateOrImport = () => {
    const seedToUse = inputKey.trim();
    let finalSeed = seedToUse;
    
    if (finalSeed) {
      if (!validateSeedPhrase(finalSeed)) {
        toast.error('Invalid recovery phrase. Please check your 12-word phrase.');
        return;
      }
    } else {
      finalSeed = generateRandomMnemonic();
      setInputKey(finalSeed);
    }

    setActiveMnemonic(finalSeed);
    setShowMnemonicModal(true);

    if (selectedChain === 'solana') {
      const sol0 = deriveSolanaAccount(finalSeed, 0);
      setSolanaAccounts([sol0]);
      setEthereumAccounts([]);
      toast.success('Account 1 generated for Solana');
    } else {
      const eth0 = deriveEthereumAccount(finalSeed, 0);
      setEthereumAccounts([eth0]);
      setSolanaAccounts([]);
      toast.success('Account 1 generated for Ethereum');
    }
  };

  // Add derived account under same seed
  const handleAddAccount = (chain: ChainType) => {
    if (!activeMnemonic) return;

    if (chain === 'solana') {
      const nextIndex = solanaAccounts.length;
      const newAcc = deriveSolanaAccount(activeMnemonic, nextIndex);
      setSolanaAccounts((prev) => [...prev, newAcc]);
      toast.success(`${newAcc.name} generated for Solana`);
    } else {
      const nextIndex = ethereumAccounts.length;
      const newAcc = deriveEthereumAccount(activeMnemonic, nextIndex);
      setEthereumAccounts((prev) => [...prev, newAcc]);
      toast.success(`${newAcc.name} generated for Ethereum`);
    }
  };

  // Delete account
  const handleDeleteAccount = (id: string) => {
    setSolanaAccounts((prev) => prev.filter((acc) => acc.id !== id));
    setEthereumAccounts((prev) => prev.filter((acc) => acc.id !== id));
    toast.info('Account deleted');
  };

  // Reset session
  const handleResetSession = () => {
    setInputKey('');
    setActiveMnemonic('');
    setShowMnemonicModal(false);
    setSolanaAccounts([]);
    setEthereumAccounts([]);
    toast('Session cleared');
  };



  const activeAccountsList =
    selectedChain === 'solana' ? solanaAccounts : ethereumAccounts;

  const totalAccountsCount = solanaAccounts.length + ethereumAccounts.length;

  return (
    <div className="min-h-screen flex flex-col bg-[#080808] text-zinc-100 font-sans selection:bg-zinc-200 selection:text-black">
      
      {/* Header Bar */}
      <Header
        onReset={handleResetSession}
        activeAccountsCount={totalAccountsCount}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8">
        
        <div className="mb-6">
          <h1 className="text-5xl font-bold tracking-tight text-white">
            Radix
          </h1>
          <p className="text-zinc-400 font-medium text-base mt-2">
            Where every key begins.
          </p>
        </div>

        {/* Input Box & Beside Action Button */}
        <KeyGenerator
          inputKey={inputKey}
          setInputKey={setInputKey}
          onGenerateOrImport={handleGenerateOrImport}
        />

        {/* Render Mnemonic Modal Popup (shows once upon generation/import) */}
        {showMnemonicModal && activeMnemonic && (
          <MnemonicCard
            mnemonic={activeMnemonic}
            onClose={() => setShowMnemonicModal(false)}
          />
        )}

        {/* Wallet Accounts Section */}
        {activeMnemonic && (
          <div className="w-full max-w-5xl mx-auto space-y-4">
            
            {/* Chain Selector Header */}
            <div className="flex items-center justify-between py-2 border-b border-zinc-800">
              
              {/* Chain tabs */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedChain('solana')}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    selectedChain === 'solana'
                      ? 'bg-zinc-100 text-black'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>Solana ({solanaAccounts.length})</span>
                </button>

                <button
                  onClick={() => setSelectedChain('ethereum')}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    selectedChain === 'ethereum'
                      ? 'bg-zinc-100 text-black'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Ethereum ({ethereumAccounts.length})</span>
                </button>
              </div>

              {/* Add Account button */}
              <button
                onClick={() => handleAddAccount(selectedChain)}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-semibold flex items-center space-x-1 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add {selectedChain === 'solana' ? 'Solana' : 'Ethereum'} Wallet</span>
              </button>

            </div>

            {/* Account List */}
            {activeAccountsList.length > 0 ? (
              <div className="pt-2">
                {activeAccountsList.map((account) => (
                  <AccountCard
                    key={account.id}
                    account={account}
                    onDelete={handleDeleteAccount}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-xl bg-[#0e0e10] border border-zinc-800">
                <p className="text-xs text-zinc-400">No {selectedChain} wallets created.</p>
              </div>
            )}

          </div>
        )}

      </main>

      {/* Sonner Toast Notifications */}
      <Toaster position="top-right" theme="dark" richColors />
    </div>
  );
}

export default App;
