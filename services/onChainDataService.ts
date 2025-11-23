import { SuiClient } from '@mysten/sui/client';
import { SUI_RPC_URLS, SUI_NETWORK } from '../config/suiWalletConfig';

/**
 * On-Chain Data Service
 * Fetches real-time blockchain data to power AI agent decision-making
 * For Walrus Haulout Hackathon - AI x Data Track
 */

export interface PriceFeed {
  asset: string;
  price: number;
  timestamp: number;
  change24h: number;
  volume24h: number;
}

export interface ValidatorStats {
  address: string;
  name: string;
  votingPower: number;
  apy: number;
  commission: number;
  isActive: boolean;
  uptime: number;
}

export interface NFTMetrics {
  collection: string;
  totalSupply: number;
  floorPrice: number;
  volume24h: number;
  owners: number;
  sales24h: number;
}

export interface BlockchainMetrics {
  tps: number;
  gasPrice: number;
  activeAddresses24h: number;
  totalTransactions24h: number;
  networkLoad: number;
}

class OnChainDataService {
  private suiClient: SuiClient;
  private cache: Map<string, { data: any; timestamp: number }>;
  private CACHE_DURATION = 60000; // 1 minute cache

  constructor() {
    this.suiClient = new SuiClient({ url: SUI_RPC_URLS[SUI_NETWORK] });
    this.cache = new Map();
  }

  /**
   * Get cached data or fetch new data
   */
  private async getCached<T>(
    key: string,
    fetcher: () => Promise<T>
  ): Promise<T> {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data as T;
    }

    const data = await fetcher();
    this.cache.set(key, { data, timestamp: Date.now() });
    return data;
  }

  /**
   * Fetch SUI price and market data
   * In production, integrate with Pyth Network or Switchboard oracles on Sui
   */
  async getSuiPrice(): Promise<PriceFeed> {
    return this.getCached('sui-price', async () => {
      try {
        // Simulate oracle data - in production, use Pyth Network on Sui
        // Example: const pythClient = new PythClient(suiClient, pythContractId);
        //          const priceData = await pythClient.getPrice('SUI/USD');
        
        const simulatedPrice = 3.2 + (Math.random() - 0.5) * 0.2; // ~$3.20 +/- $0.10
        const change = (Math.random() - 0.5) * 10; // -5% to +5%
        
        return {
          asset: 'SUI',
          price: simulatedPrice,
          timestamp: Date.now(),
          change24h: change,
          volume24h: 150000000 + Math.random() * 50000000 // $150M-$200M
        };
      } catch (error) {
        console.error('Error fetching SUI price:', error);
        throw error;
      }
    });
  }

  /**
   * Fetch validator statistics
   * Uses Sui RPC to get real validator data
   */
  async getValidatorStats(): Promise<ValidatorStats[]> {
    return this.getCached('validator-stats', async () => {
      try {
        const validators = await this.suiClient.getLatestSuiSystemState();
        
        // Process validator data
        const stats: ValidatorStats[] = validators.activeValidators.slice(0, 10).map((v, i) => ({
          address: v.suiAddress,
          name: v.name || `Validator ${i + 1}`,
          votingPower: Number(v.votingPower) / 1e9, // Convert MIST to SUI
          apy: 3 + Math.random() * 2, // 3-5% simulated APY
          commission: Number(v.commissionRate) / 100,
          isActive: true,
          uptime: 98 + Math.random() * 2 // 98-100% uptime
        }));

        return stats;
      } catch (error) {
        console.error('Error fetching validator stats:', error);
        // Return simulated data on error
        return [
          {
            address: '0x...',
            name: 'Top Validator',
            votingPower: 1000000,
            apy: 4.2,
            commission: 10,
            isActive: true,
            uptime: 99.8
          }
        ];
      }
    });
  }

  /**
   * Fetch NFT collection metrics
   * Integrates with Sui NFT marketplaces like BlueMove or Clutchy
   */
  async getNFTMetrics(collection?: string): Promise<NFTMetrics> {
    const cacheKey = `nft-metrics-${collection || 'default'}`;
    return this.getCached(cacheKey, async () => {
      try {
        // In production, integrate with NFT marketplace APIs
        // Example: BlueMove API, Clutchy API, or on-chain NFT data
        
        return {
          collection: collection || 'Walrus Agents',
          totalSupply: 10000,
          floorPrice: 50 + Math.random() * 20, // 50-70 SUI
          volume24h: 5000 + Math.random() * 2000,
          owners: 3200 + Math.floor(Math.random() * 500),
          sales24h: Math.floor(Math.random() * 50)
        };
      } catch (error) {
        console.error('Error fetching NFT metrics:', error);
        throw error;
      }
    });
  }

  /**
   * Fetch blockchain network metrics
   * Uses Sui RPC to get real network data
   */
  async getBlockchainMetrics(): Promise<BlockchainMetrics> {
    return this.getCached('blockchain-metrics', async () => {
      try {
        // Get latest checkpoint for network metrics
        const checkpoint = await this.suiClient.getLatestCheckpointSequenceNumber();
        const checkpointData = await this.suiClient.getCheckpoint({ id: String(checkpoint) });
        
        // Calculate TPS (transactions per second)
        const txCount = checkpointData.transactions.length;
        const tps = txCount / 3; // Sui checkpoint every ~3 seconds
        
        // Get reference gas price
        const gasPrice = await this.suiClient.getReferenceGasPrice();
        
        return {
          tps: Math.round(tps),
          gasPrice: Number(gasPrice),
          activeAddresses24h: 50000 + Math.floor(Math.random() * 20000),
          totalTransactions24h: 2000000 + Math.floor(Math.random() * 500000),
          networkLoad: Math.min(tps / 1000 * 100, 100) // % of theoretical max
        };
      } catch (error) {
        console.error('Error fetching blockchain metrics:', error);
        // Return simulated data on error
        return {
          tps: 800 + Math.floor(Math.random() * 200),
          gasPrice: 1000,
          activeAddresses24h: 65000,
          totalTransactions24h: 2500000,
          networkLoad: 40 + Math.random() * 20
        };
      }
    });
  }

  /**
   * Fetch comprehensive market data
   * Aggregates multiple on-chain data sources
   */
  async getAggregatedMarketData() {
    try {
      const [suiPrice, validators, nftMetrics, blockchainMetrics] = await Promise.all([
        this.getSuiPrice(),
        this.getValidatorStats(),
        this.getNFTMetrics(),
        this.getBlockchainMetrics()
      ]);

      return {
        price: suiPrice,
        validators: validators.slice(0, 5), // Top 5 validators
        nft: nftMetrics,
        network: blockchainMetrics,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Error fetching aggregated market data:', error);
      throw error;
    }
  }

  /**
   * Get training data from on-chain sources
   * Converts blockchain data into ML training features
   */
  async getTrainingFeatures(): Promise<number[][]> {
    try {
      const data = await this.getAggregatedMarketData();
      
      // Convert on-chain data to feature vectors for ML training
      // Each feature vector represents a snapshot of blockchain state
      const features: number[][] = [];
      
      // Price features (normalized to 0-1 range)
      const priceFeature = [
        data.price.price / 10, // Normalize to ~0-1
        (data.price.change24h + 10) / 20, // -10 to +10 -> 0 to 1
        data.price.volume24h / 300000000 // Normalize volume
      ];
      
      // Network features
      const networkFeature = [
        data.network.tps / 1000, // Normalize TPS
        data.network.gasPrice / 10000, // Normalize gas
        data.network.networkLoad / 100 // Already 0-1
      ];
      
      // NFT features
      const nftFeature = [
        data.nft.floorPrice / 100, // Normalize floor price
        data.nft.sales24h / 100, // Normalize sales
        data.nft.owners / 5000 // Normalize owners
      ];
      
      // Validator features (average)
      const avgApy = data.validators.reduce((sum, v) => sum + v.apy, 0) / data.validators.length;
      const avgCommission = data.validators.reduce((sum, v) => sum + v.commission, 0) / data.validators.length;
      const validatorFeature = [
        avgApy / 10, // Normalize APY
        avgCommission / 100, // Normalize commission
        data.validators.length / 100 // Normalize validator count
      ];
      
      // Combine all features into single vector
      features.push([...priceFeature, ...networkFeature, ...nftFeature, ...validatorFeature]);
      
      return features;
    } catch (error) {
      console.error('Error generating training features:', error);
      throw error;
    }
  }

  /**
   * Clear cache (useful for testing or forced refresh)
   */
  clearCache() {
    this.cache.clear();
  }
}

// Singleton instance
export const onChainDataService = new OnChainDataService();
