import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import nacl from 'tweetnacl';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import { ethers } from 'ethers';
import { Buffer } from 'buffer';
import type { WalletAccount } from '../types/wallet';

if (typeof window !== 'undefined') {
  (window as any).Buffer = (window as any).Buffer || Buffer;
}

/**
 * Generates a valid 12-word BIP39 mnemonic recovery phrase
 */
export function generateRandomMnemonic(): string {
  return generateMnemonic();
}

/**
 * Validates a BIP39 mnemonic recovery phrase
 */
export function validateSeedPhrase(mnemonic: string): boolean {
  return validateMnemonic(mnemonic.trim());
}

/**
 * Derives a real Solana account keypair using Phantom standard BIP44 path: m/44'/501'/${accountIndex}'/0'
 */
export function deriveSolanaAccount(secret: string, accountIndex: number): WalletAccount {
  const seedBuffer = mnemonicToSeedSync(secret.trim());
  // Phantom standard Solana derivation path: m/44'/501'/i'/0'
  const path = `m/44'/501'/${accountIndex}'/0'`;
  const { key: derivedSeed } = derivePath(path, seedBuffer.toString('hex'));

  const { secretKey } = nacl.sign.keyPair.fromSeed(derivedSeed);
  const keypair = Keypair.fromSecretKey(secretKey);

  const privateKeyEncoded = bs58.encode(secretKey);
  const publicKeyEncoded = keypair.publicKey.toBase58();

  return {
    id: `sol-${accountIndex}-${Date.now()}`,
    chain: 'solana',
    accountIndex,
    name: `Account ${accountIndex + 1}`,
    publicKey: publicKeyEncoded,
    privateKey: privateKeyEncoded,
    balance: 0,
    currencySymbol: 'SOL',
  };
}

/**
 * Derives a real Ethereum account keypair using MetaMask standard BIP44 path: m/44'/60'/0'/0/${accountIndex}
 */
export function deriveEthereumAccount(secret: string, accountIndex: number): WalletAccount {
  // MetaMask & Phantom standard Ethereum derivation path: m/44'/60'/0'/0/i
  const path = `m/44'/60'/0'/0/${accountIndex}`;
  const hdNode = ethers.HDNodeWallet.fromPhrase(secret.trim(), undefined, path);

  return {
    id: `eth-${accountIndex}-${Date.now()}`,
    chain: 'ethereum',
    accountIndex,
    name: `Account ${accountIndex + 1}`,
    publicKey: hdNode.address,
    privateKey: hdNode.privateKey,
    balance: 0,
    currencySymbol: 'ETH',
  };
}
