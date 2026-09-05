import type { WalletAccount } from '../types/wallet';

const DEMO_WORDS = [
  "alpha", "bravo", "charlie", "delta", "echo", "foxtrot",
  "golf", "hotel", "india", "juliet", "kilo", "lima"
];

/**
 * Returns a 12-word seed phrase for UI preview
 */
export function generateRandomMnemonic(): string {
  return DEMO_WORDS.join(' ');
}

/**
 * Creates UI mock representation of a Solana account
 */
export function deriveSolanaAccount(secret: string, accountIndex: number): WalletAccount {
  const seedTag = secret.length > 5 ? secret.slice(0, 4) : 'demo';
  const pub = `Sol${seedTag}4x9PqM3kX${accountIndex + 1}Y8z7W6v5U4t3S2r1Q`;
  const priv = `5k${seedTag}PrivKeySolana${accountIndex + 1}X9y8Z7w6V5u4T3s2R1q0`;

  return {
    id: `sol-${accountIndex}-${Date.now()}`,
    chain: 'solana',
    accountIndex,
    name: `Solana Wallet #${accountIndex + 1}`,
    publicKey: pub,
    privateKey: priv,
    balance: parseFloat((Math.random() * 4.5 + 0.25).toFixed(4)),
    currencySymbol: 'SOL'
  };
}

/**
 * Creates UI mock representation of an Ethereum account
 */
export function deriveEthereumAccount(secret: string, accountIndex: number): WalletAccount {
  const seedTag = secret.length > 5 ? secret.slice(0, 4) : 'demo';
  const pub = `0x71C${seedTag}9B2e8A${accountIndex + 1}f3C4d5E6f7A8b9C0d1E2f3`;
  const priv = `0x4a9${seedTag}PrivateKeyEth${accountIndex + 1}9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2`;

  return {
    id: `eth-${accountIndex}-${Date.now()}`,
    chain: 'ethereum',
    accountIndex,
    name: `Ethereum Wallet #${accountIndex + 1}`,
    publicKey: pub,
    privateKey: priv,
    balance: parseFloat((Math.random() * 1.8 + 0.05).toFixed(4)),
    currencySymbol: 'ETH'
  };
}
