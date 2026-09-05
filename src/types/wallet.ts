export type ChainType = 'solana' | 'ethereum';

export interface WalletAccount {
  id: string;
  chain: ChainType;
  accountIndex: number;
  name: string;
  publicKey: string;
  privateKey: string;
  balance: number;
  currencySymbol: string;
}
