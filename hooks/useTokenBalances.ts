// Hook for managing token balances on Sui
import { useState, useEffect, useCallback } from 'react';
import { suiClient, TOKENS, formatTokenAmount } from '../config/suiWalletConfig';
import { useSuiWallet } from './useSuiWallet';

export interface TokenBalance {
  symbol: string;
  balance: string;
  balanceRaw: bigint;
  decimals: number;
  type: string;
}

export interface UseTokenBalancesReturn {
  balances: Record<string, TokenBalance>;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  getBalance: (symbol: string) => TokenBalance | null;
  hasBalance: (symbol: string, minAmount: string) => boolean;
}

/**
 * Hook for fetching and managing token balances
 */
export const useTokenBalances = (): UseTokenBalancesReturn => {
  const { address, isConnected } = useSuiWallet();
  const [balances, setBalances] = useState<Record<string, TokenBalance>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchBalances = useCallback(async () => {
    if (!address || !isConnected) {
      setBalances({});
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newBalances: Record<string, TokenBalance> = {};

      // Fetch all token balances in parallel
      await Promise.all(
        Object.entries(TOKENS).map(async ([symbol, token]) => {
          try {
            const balance = await suiClient.getBalance({
              owner: address,
              coinType: token.type,
            });

            const balanceRaw = BigInt(balance.totalBalance);
            const balanceFormatted = formatTokenAmount(balanceRaw, token.decimals);

            newBalances[symbol] = {
              symbol,
              balance: balanceFormatted,
              balanceRaw,
              decimals: token.decimals,
              type: token.type,
            };
          } catch (err) {
            console.error(`Error fetching ${symbol} balance:`, err);
            // Set zero balance on error
            newBalances[symbol] = {
              symbol,
              balance: '0',
              balanceRaw: 0n,
              decimals: token.decimals,
              type: token.type,
            };
          }
        })
      );

      setBalances(newBalances);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching token balances:', err);
    } finally {
      setIsLoading(false);
    }
  }, [address, isConnected]);

  // Auto-fetch on mount and when address changes
  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      fetchBalances();
    }, 30000);

    return () => clearInterval(interval);
  }, [isConnected, fetchBalances]);

  const getBalance = useCallback((symbol: string): TokenBalance | null => {
    return balances[symbol] || null;
  }, [balances]);

  const hasBalance = useCallback((symbol: string, minAmount: string): boolean => {
    const balance = balances[symbol];
    if (!balance) return false;
    
    const minAmountNum = parseFloat(minAmount);
    const balanceNum = parseFloat(balance.balance);
    
    return balanceNum >= minAmountNum;
  }, [balances]);

  return {
    balances,
    isLoading,
    error,
    refresh: fetchBalances,
    getBalance,
    hasBalance,
  };
};
