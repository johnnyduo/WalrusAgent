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
  // Walrus Testnet Aggregator
  aggregator: 'https://aggregator.walrus-testnet.walrus.space',
  publisher: 'https://publisher.walrus-testnet.walrus.space',
  
  // Storage configuration
  epochs: 1, // Number of epochs to store (1 epoch ≈ 1 day on testnet)
  
  // Blob limits
  maxBlobSize: 13 * 1024 * 1024, // 13 MB max per blob
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
// Update these after deploying contracts
let deployedAddresses: any = {};
try {
  deployedAddresses = require('../deployed-addresses.json');
} catch {
  // Use default values if file doesn't exist yet
  deployedAddresses = {
    packageId: '0x0',
    contracts: {
      agentRegistry: { sharedObjectId: '0x0' },
      trainingRewards: { sharedObjectId: '0x0' }
    }
  };
}

export const AGENT_PACKAGE_ID = deployedAddresses.packageId || '0x0';
export const AGENT_REGISTRY_ID = deployedAddresses.contracts?.agentRegistry?.sharedObjectId || '0x0';
export const REWARD_POOL_ID = deployedAddresses.contracts?.trainingRewards?.sharedObjectId || '0x0';

// Your browser wallet address
export const YOUR_WALLET = '0xce2162a53565ac45e6338efcac7318d83d69debe934498bb2f592cee1f0410c9';

// Check if contracts are deployed
export const CONTRACTS_DEPLOYED = AGENT_PACKAGE_ID !== '0x0' && AGENT_PACKAGE_ID !== '0x0000000000000000000000000000000000000000000000000000000000000000';

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
  return `${WALRUS_CONFIG.aggregator}/v1/${blobId}`;
};

// Sui Wallet Kit Theme Configuration
export const WALLET_KIT_THEME = {
  '--wallet-kit-primary-color': '#99efe4',
  '--wallet-kit-secondary-color': '#cfb0ff',
  '--wallet-kit-border-color': 'rgba(207, 176, 255, 0.3)',
  '--wallet-kit-background': 'rgba(10, 10, 10, 0.95)',
};
