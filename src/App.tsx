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
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

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
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isDarkMode
          ? 'bg-[#080808] text-zinc-100 selection:bg-zinc-200 selection:text-black'
          : 'bg-[#f8f9fa] text-zinc-900 selection:bg-zinc-800 selection:text-white'
      }`}
    >
      {/* Header Bar */}
      <Header
        onReset={handleResetSession}
        activeAccountsCount={totalAccountsCount}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8">
        
        <div className="mb-6">
          <h1 className={`text-5xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
            Radix
          </h1>
          <p className={`font-medium text-base mt-2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Where every key begins.
          </p>
        </div>

        {/* Input Box & Action Button */}
        <KeyGenerator
          inputKey={inputKey}
          setInputKey={setInputKey}
          onGenerateOrImport={handleGenerateOrImport}
          isDarkMode={isDarkMode}
        />

        {/* Render Mnemonic Modal Popup */}
        {showMnemonicModal && activeMnemonic && (
          <MnemonicCard
            mnemonic={activeMnemonic}
            onClose={() => setShowMnemonicModal(false)}
            isDarkMode={isDarkMode}
          />
        )}

        {/* Wallet Accounts Section */}
        {activeMnemonic && (
          <div className="w-full max-w-5xl mx-auto space-y-4">
            
            {/* Chain Selector Header */}
            <div
              className={`flex items-center justify-between py-2 border-b transition ${
                isDarkMode ? 'border-zinc-800' : 'border-zinc-200'
              }`}
            >
              
              {/* Chain tabs */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedChain('solana')}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    selectedChain === 'solana'
                      ? isDarkMode
                        ? 'bg-zinc-100 text-black'
                        : 'bg-zinc-900 text-white'
                      : isDarkMode
                      ? 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'
                  }`}
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>Solana ({solanaAccounts.length})</span>
                </button>

                <button
                  onClick={() => setSelectedChain('ethereum')}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    selectedChain === 'ethereum'
                      ? isDarkMode
                        ? 'bg-zinc-100 text-black'
                        : 'bg-zinc-900 text-white'
                      : isDarkMode
                      ? 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Ethereum ({ethereumAccounts.length})</span>
                </button>
              </div>

              {/* Add Account button */}
              <button
                onClick={() => handleAddAccount(selectedChain)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center space-x-1 transition cursor-pointer ${
                  isDarkMode
                    ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-200'
                    : 'bg-white hover:bg-zinc-100 border-zinc-300 text-zinc-800 shadow-sm'
                }`}
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
                    isDarkMode={isDarkMode}
                  />
                ))}
              </div>
            ) : (
              <div
                className={`p-8 text-center rounded-xl border transition ${
                  isDarkMode ? 'bg-[#0e0e10] border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
                }`}
              >
                <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  No {selectedChain} wallets created.
                </p>
              </div>
            )}

          </div>
        )}

      </main>

      {/* Sonner Toast Notifications */}
      <Toaster position="top-right" theme={isDarkMode ? 'dark' : 'light'} richColors />
    </div>
  );
}

export default App;
