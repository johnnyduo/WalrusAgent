// Sui Wallet Configuration using Suiet Wallet Kit
import { SuiClient } from '@mysten/sui.js/client';

// Sui Network Configuration
export const SUI_NETWORK = 'testnet'; // 'mainnet' | 'testnet' | 'devnet'

export const SUI_RPC_URLS = {
  mainnet: 'https://fullnode.mainnet.sui.io:443',
  testnet: 'https://fullnode.testnet.sui.io:443',
  devnet: 'https://fullnode.devnet.sui.io:443',
};

export const SUI_EXPLORER_URLS = {
  mainnet: 'https://suiscan.xyz/mainnet',
  testnet: 'https://suiscan.xyz/testnet',
  devnet: 'https://suiscan.xyz/devnet',
};

// Initialize Sui Client
export const suiClient = new SuiClient({
  url: SUI_RPC_URLS[SUI_NETWORK],
});

// Walrus Protocol Configuration
export const WALRUS_CONFIG = {
  // Walrus Testnet Aggregators (for reading blobs) - Multiple for redundancy
  aggregators: [
    'https://aggregator.walrus-testnet.walrus.space',
    'https://wal-aggregator-testnet.staketab.org',
    'https://walrus-testnet-aggregator.nodeinfra.com',
    'https://sm1-walrus-testnet-aggregator.stakesquid.com',
  ],
  aggregator: 'https://aggregator.walrus-testnet.walrus.space', // Primary
  
  // Walrus Testnet Publishers (for writing blobs) - Multiple for redundancy
  publishers: [
    'https://publisher.walrus-testnet.walrus.space',
    'https://wal-publisher-testnet.staketab.org',
    'https://walrus-testnet-publisher.nodeinfra.com',
    'https://sm1-walrus-testnet-publisher.stakesquid.com',
    'https://publisher.walrus-testnet.h2o-nodes.com',
  ],
  publisher: 'https://publisher.walrus-testnet.walrus.space', // Primary
  
  // Upload relay configuration for Walrus SDK
  uploadRelay: 'https://publisher.walrus-testnet.walrus.space',
  
  // Storage configuration
  epochs: 5, // Number of epochs to store (recommended: 5 for testnet)
  
  // Blob limits
  maxBlobSize: 10 * 1024 * 1024, // 10 MB max per blob on testnet
  
  // System Object IDs for Walrus on testnet
  systemObjectId: '0x98ebc47370603fe81d9e15491b2f1443d619d1dab720d586e429ed233e1255c1',
  stakingPoolId: '0x20266a17b4f1a216727f3eef5772f8d486a9e3b5e319af80a5b75809c035561d',
};

// Token Configurations
export const TOKENS = {
  // SUI Native Token
  SUI: {
    type: '0x2::sui::SUI',
    symbol: 'SUI',
    decimals: 9,
    name: 'Sui',
  },
  // USDC Stablecoin on Sui
  USDC: {
    type: '0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC',
    symbol: 'USDC',
    decimals: 6,
    name: 'USD Coin',
  },
  // WAL Token (Walrus)
  WAL: {
    type: '0x8270feb7375eee355e64fdb69c50abb6b5f9393a722883c1cf45f8e26048810a::wal::WAL',
    symbol: 'WAL',
    decimals: 9,
    name: 'Walrus Token',
  },
} as const;

export type TokenType = keyof typeof TOKENS;

// Agent Contract Addresses (deployed on Sui Testnet)
// ✅ DEPLOYED - November 23, 2025
export const AGENT_PACKAGE_ID = '0x5784dcccc3c786420465afed5f820779e61d2f950e2bca6a943b58d0cc4fc0f6';
export const AGENT_REGISTRY_ID = '0xf50fb987a2e47aa51996766f36ad8d497a10d5c271dec638fcd8c8955d8739b3';
export const REWARD_POOL_ID = '0xcbe93ec27a9364f210216028f5fbdc86e016ed5cd9325ca94b09910569be59f0';

// Your browser wallet address
export const YOUR_WALLET = '0xce2162a53565ac45e6338efcac7318d83d69debe934498bb2f592cee1f0410c9';

// Check if contracts are deployed
export const CONTRACTS_DEPLOYED = true; // ✅ Contracts deployed to Sui testnet

// Token Helper Functions
export const formatTokenAmount = (amount: string | bigint, decimals: number): string => {
  const amountBigInt = typeof amount === 'string' ? BigInt(amount) : amount;
  const divisor = BigInt(10 ** decimals);
  const whole = amountBigInt / divisor;
  const remainder = amountBigInt % divisor;
  const remainderStr = remainder.toString().padStart(decimals, '0');
  
  // Trim trailing zeros
  const trimmed = remainderStr.replace(/0+$/, '');
  return trimmed ? `${whole}.${trimmed}` : whole.toString();
};

export const parseTokenAmount = (amount: string, decimals: number): bigint => {
  const [whole, fraction = '0'] = amount.split('.');
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
  return BigInt(whole) * BigInt(10 ** decimals) + BigInt(paddedFraction);
};

export const getTokenByType = (tokenType: string) => {
  return Object.values(TOKENS).find(token => token.type === tokenType);
};

// Helper functions
export const getSuiExplorerUrl = (type: 'address' | 'object' | 'transaction', id: string): string => {
  return `${SUI_EXPLORER_URLS[SUI_NETWORK]}/${type}/${id}`;
};

export const getWalrusExplorerUrl = (blobId: string): string => {
  return `${WALRUS_CONFIG.aggregator}/v1/blobs/${blobId}`;
};

export const getWalrusScanUrl = (blobId: string): string => {
  return `https://walruscan.com/testnet/blob/${blobId}`;
};

export const getWalrusScanAccountUrl = (address: string): string => {
  return `https://walruscan.com/testnet/account/${address}/blobs`;
};

// Sui Wallet Kit Theme Configuration
export const WALLET_KIT_THEME = {
  '--wallet-kit-primary-color': '#99efe4',
  '--wallet-kit-secondary-color': '#cfb0ff',
  '--wallet-kit-border-color': 'rgba(207, 176, 255, 0.3)',
  '--wallet-kit-background': 'rgba(10, 10, 10, 0.95)',
};
