import { useState, useEffect } from 'react';
import {
  onChainDataService,
  PriceFeed,
  ValidatorStats,
  NFTMetrics,
  BlockchainMetrics
} from '../services/onChainDataService';

/**
 * React hook for on-chain data feeds
 * Powers AI agents with real-time blockchain data
 */

interface MarketData {
  price: PriceFeed;
  validators: ValidatorStats[];
  nft: NFTMetrics;
  network: BlockchainMetrics;
  timestamp: number;
}

export const useOnChainData = () => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarketData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await onChainDataService.getAggregatedMarketData();
      setMarketData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch market data');
      console.error('Error fetching market data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchMarketData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    marketData,
    isLoading,
    error,
    refresh: fetchMarketData
  };
};

/**
 * Hook for fetching training features from on-chain data
 */
export const useTrainingFeatures = () => {
  const [features, setFeatures] = useState<number[][] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeatures = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const featureData = await onChainDataService.getTrainingFeatures();
      setFeatures(featureData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch training features');
      console.error('Error fetching training features:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    features,
    isLoading,
    error,
    fetchFeatures
  };
};

/**
 * Hook for specific data types
 */
export const useSuiPrice = () => {
  const [price, setPrice] = useState<PriceFeed | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const priceData = await onChainDataService.getSuiPrice();
        setPrice(priceData);
      } catch (err) {
        console.error('Error fetching SUI price:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 10000); // Update every 10s
    
    return () => clearInterval(interval);
  }, []);

  return { price, isLoading };
};

export const useValidators = () => {
  const [validators, setValidators] = useState<ValidatorStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchValidators = async () => {
      try {
        const data = await onChainDataService.getValidatorStats();
        setValidators(data);
      } catch (err) {
        console.error('Error fetching validators:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchValidators();
    const interval = setInterval(fetchValidators, 60000); // Update every 60s
    
    return () => clearInterval(interval);
  }, []);

  return { validators, isLoading };
};
