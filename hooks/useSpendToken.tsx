// Hook for spending tokens (USDC, WAL) on Sui
import React, { useState } from 'react';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { useWallet } from '@suiet/wallet-kit';
import { TOKENS, parseTokenAmount } from '../config/suiWalletConfig';
import { toast } from 'react-toastify';

export interface SpendTokenParams {
  tokenSymbol: 'USDC' | 'WAL' | 'SUI';
  amount: string; // Human-readable amount (e.g., "10.5")
  recipient: string;
  memo?: string;
}

export interface UseSpendTokenReturn {
  spendToken: (params: SpendTokenParams) => Promise<string | null>;
  isSpending: boolean;
  error: Error | null;
  lastTxDigest: string | null;
}

/**
 * Hook for spending tokens with proper transaction handling
 */
export const useSpendToken = (): UseSpendTokenReturn => {
  const { signAndExecuteTransactionBlock, address } = useWallet();
  const [isSpending, setIsSpending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastTxDigest, setLastTxDigest] = useState<string | null>(null);

  const spendToken = async (params: SpendTokenParams): Promise<string | null> => {
    const { tokenSymbol, amount, recipient, memo } = params;

    if (!address) {
      const err = new Error('Wallet not connected');
      setError(err);
      toast.error('Please connect your wallet first');
      return null;
    }

    if (!signAndExecuteTransactionBlock) {
      const err = new Error('Wallet does not support transactions');
      setError(err);
      toast.error('Wallet does not support transactions');
      return null;
    }

    setIsSpending(true);
    setError(null);

    try {
      const token = TOKENS[tokenSymbol];
      if (!token) {
        throw new Error(`Unknown token: ${tokenSymbol}`);
      }

      // Parse amount to smallest unit
      const amountRaw = parseTokenAmount(amount, token.decimals);

      // Create transaction
      const tx = new TransactionBlock();

      // Split coin and transfer
      if (tokenSymbol === 'SUI') {
        // For SUI, use splitCoins and transfer
        const [coin] = tx.splitCoins(tx.gas, [tx.pure(amountRaw.toString())]);
        tx.transferObjects([coin], tx.pure(recipient));
      } else {
        // For USDC and WAL, need to select coins and merge/split
        // This requires fetching user's coins first
        const { data: coins } = await import('../config/suiWalletConfig').then(mod => 
          mod.suiClient.getCoins({
            owner: address,
            coinType: token.type,
          })
        );

        if (!coins || coins.length === 0) {
          throw new Error(`No ${tokenSymbol} coins available`);
        }

        // Calculate total balance
        const totalBalance = coins.reduce((sum, coin) => sum + BigInt(coin.balance), 0n);

        if (totalBalance < amountRaw) {
          throw new Error(`Insufficient ${tokenSymbol} balance. Have: ${totalBalance}, Need: ${amountRaw}`);
        }

        // Use first coin as primary, merge others if needed
        const primaryCoin = tx.object(coins[0].coinObjectId);
        
        // If we have multiple coins, merge them
        if (coins.length > 1) {
          const coinObjectsToMerge = coins.slice(1).map(c => tx.object(c.coinObjectId));
          tx.mergeCoins(primaryCoin, coinObjectsToMerge);
        }

        // Split the exact amount
        const [paymentCoin] = tx.splitCoins(primaryCoin, [tx.pure(amountRaw.toString())]);

        // Transfer to recipient
        tx.transferObjects([paymentCoin], tx.pure(recipient));
      }

      // Add memo if provided (as a comment in transaction)
      if (memo) {
        // Store memo in transaction metadata (optional, for tracking)
        console.log(`Transaction memo: ${memo}`);
      }

      // Set gas budget
      tx.setGasBudget(100000000); // 0.1 SUI

      // Sign and execute
      const result = await signAndExecuteTransactionBlock({
        transactionBlock: tx,
        options: {
          showEffects: true,
          showObjectChanges: true,
        },
      });

      const digest = result.digest;
      setLastTxDigest(digest);

      toast.success(
        <div>
          <div>✅ Sent {amount} {tokenSymbol}</div>
          <div className="text-xs opacity-70 mt-1">To: {recipient.slice(0, 8)}...</div>
        </div>
      );

      console.log(`✅ ${tokenSymbol} transfer successful:`, {
        digest,
        amount,
        recipient,
        explorer: `https://suiscan.xyz/testnet/tx/${digest}`
      });

      return digest;
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.error('Token spend error:', error);
      
      toast.error(
        <div>
          <div>❌ Failed to send {tokenSymbol}</div>
          <div className="text-xs opacity-70 mt-1">{error.message}</div>
        </div>
      );

      return null;
    } finally {
      setIsSpending(false);
    }
  };

  return {
    spendToken,
    isSpending,
    error,
    lastTxDigest,
  };
};
