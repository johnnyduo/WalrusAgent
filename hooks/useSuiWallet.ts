// Sui Wallet Connection Hook using Suiet Wallet Kit
import { useState, useEffect } from 'react';
import { useWallet } from '@suiet/wallet-kit';

export interface UseSuiWalletReturn {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  wallet: any;
  error: Error | null;
}

/**
 * Hook for managing Sui wallet connection
 */
export const useSuiWallet = (): UseSuiWalletReturn => {
  const {
    address,
    connected,
    connecting,
    select,
    disconnect: disconnectWallet,
    wallet,
  } = useWallet();
  
  const [error, setError] = useState<Error | null>(null);

  const connect = async () => {
    try {
      setError(null);
      // Select the first available wallet or let user choose
      await select('Sui Wallet');
    } catch (err) {
      setError(err as Error);
      console.error('Wallet connection error:', err);
    }
  };

  const disconnect = async () => {
    try {
      setError(null);
      await disconnectWallet();
    } catch (err) {
      setError(err as Error);
      console.error('Wallet disconnection error:', err);
    }
  };

  return {
    address: address || null,
    isConnected: connected,
    isConnecting: connecting,
    connect,
    disconnect,
    wallet,
    error,
  };
};
