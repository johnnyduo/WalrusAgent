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
