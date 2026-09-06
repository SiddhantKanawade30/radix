# Radix — Non-Custodial Multi-Chain HD Wallet

Radix (referring to a "root" in latin) is a secure, Hierarchical Deterministic (HD) cryptocurrency wallet application. It enables users to generate new 12-word recovery phrases or import existing ones to derive production-ready Solana and Ethereum wallets.

---

## Application Logic & Key Derivation

### 1. Seed Phrase Generation & Validation (BIP39)
- **Generation**: Uses `bip39.generateMnemonic()` to produce a 12-word Secret Recovery Phrase.
- **Validation**: Verifies user-entered phrases using `bip39.validateMnemonic()` to ensure phrase integrity before key derivation.
- **Seed Conversion**: Converts the 12-word mnemonic into a binary seed buffer via `bip39.mnemonicToSeedSync()`.

---

### 2. Solana Key Derivation Logic
- **Elliptic Curve**: Ed25519
- **Standard Derivation Path**: `m/44'/501'/${accountIndex}'/0'` (Phantom & Solflare standard)
- **Derivation Process**:
  1. The binary seed is derived along the HD path `m/44'/501'/${accountIndex}'/0'` using `ed25519-hd-key.derivePath()`.
  2. The derived seed bytes are passed to `tweetnacl.sign.keyPair.fromSeed()` to generate an Ed25519 secret key.
  3. `@solana/web3.js` initializes a `Keypair.fromSecretKey()` to obtain the public key.
  4. Public address and private key are Base58-encoded using `bs58.encode()`.

---

### 3. Ethereum Key Derivation Logic
- **Elliptic Curve**: secp256k1
- **Standard Derivation Path**: `m/44'/60'/0'/0/${accountIndex}` (MetaMask & standard EVM BIP44)
- **Derivation Process**:
  1. The seed phrase is derived along the EVM HD path `m/44'/60'/0'/0/${accountIndex}` using `ethers.HDNodeWallet.fromPhrase()`.
  2. Generates the checksummed `0x...` Ethereum public address.
  3. Generates the 64-character hexadecimal private key (`0x...`).

---

## Features

- **Chain-Isolated Generation**: Derive wallets specifically for the active tab (Solana or Ethereum) without unnecessary multi-chain overhead.
- **One-Time Recovery Phrase Modal**: Secret recovery phrases are displayed once inside a secure backdrop popup modal to prevent screen exposure.
- **Multi-Account Derivation**: Easily add multiple sub-accounts (`Account 1`, `Account 2`, `Account 3`) under the same seed phrase using index incrementation.
- **Secret Key Security**: Secret keys remain hidden by default with togglable show/hide visibility.
- **1-Click Clipboard Copying**: Easily copy public addresses, private keys, or recovery phrases with Sonner toast confirmation.

---

## State Architecture

- `activeMnemonic`: Stores the active 12-word seed phrase in memory.
- `selectedChain`: Tracks the current active blockchain view (`solana` | `ethereum`).
- `solanaAccounts` / `ethereumAccounts`: Array of derived wallet objects (`WalletAccount`):
  - `accountIndex`: Derived derivation index (0, 1, 2, ...)
  - `publicKey`: Solana Base58 public key or Ethereum `0x` address
  - `privateKey`: Solana Base58 private key or Ethereum `0x` hex private key
  - `name`: Account label (`Account 1`, `Account 2`)
- `showMnemonicModal`: Controls the visibility of the initial recovery phrase popup modal.

---

## Required Dependencies

```bash
npm install bip39 ed25519-hd-key tweetnacl @solana/web3.js bs58 ethers sonner lucide-react vite-plugin-node-polyfills
```

---

## Security Guarantee

All cryptographic operations occur entirely client-side inside browser memory. Seed phrases and private keys are never transmitted to external APIs or backend services.
