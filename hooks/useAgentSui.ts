// Sui Agent Management Hooks
import { useState } from 'react';
import { useWallet } from '@suiet/wallet-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { suiClient, AGENT_PACKAGE_ID, AGENT_REGISTRY_ID } from '../config/suiWalletConfig';
import { walrusService } from '../services/walrusService';

export interface AgentMetadata {
  name: string;
  role: string;
  description: string;
  capabilities: string[];
  avatar?: string;
  personality?: any;
}

export interface UseMintAgentReturn {
  mintAgent: (metadata: AgentMetadata) => Promise<string>;
  isPending: boolean;
  isSuccess: boolean;
  error: Error | null;
  txDigest: string | null;
}

/**
 * Hook for minting agent NFTs on Sui blockchain
 * Agent metadata is stored on Walrus Protocol
 */
export const useMintAgent = (): UseMintAgentReturn => {
  const { signAndExecuteTransactionBlock } = useWallet();
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [txDigest, setTxDigest] = useState<string | null>(null);

  const mintAgent = async (metadata: AgentMetadata): Promise<string> => {
    try {
      setIsPending(true);
      setError(null);
      setIsSuccess(false);

      // Step 1: Upload metadata to Walrus
      console.log('📤 Uploading agent metadata to Walrus...');
      const metadataBlobId = await walrusService.uploadAgentMetadata(metadata);
      console.log('✅ Metadata uploaded, BlobId:', metadataBlobId);

      // Step 2: Create Sui transaction to mint agent NFT
      const tx = new TransactionBlock();
      
      if (!AGENT_PACKAGE_ID || !AGENT_REGISTRY_ID) {
        console.warn('⚠️ Agent contracts not deployed yet, simulating mint...');
        // Simulate successful mint for development
        setTxDigest(`simulated_${Date.now()}`);
        setIsSuccess(true);
        setIsPending(false);
        return metadataBlobId;
      }
      // tx.moveCall({
      //   target: `${AGENT_PACKAGE_ID}::agent::mint`,
      //   arguments: [
      //     tx.object(AGENT_REGISTRY_ID),
      //     tx.pure(metadata.name),
      //     tx.pure(metadata.role),
      //     tx.pure(metadataBlobId), // Store Walrus blob ID on-chain
      //   ],
      // });

      // For now, return the blob ID as the "agent ID"
      // This will be replaced with actual on-chain minting
      console.log('⚠️ Sui Move contracts not yet deployed - using Walrus-only mode');
      
      setTxDigest(metadataBlobId);
      setIsSuccess(true);
      setIsPending(false);

      return metadataBlobId;

      // Uncomment when Move contracts are ready:
      /*
      const result = await signAndExecuteTransactionBlock({
        transactionBlock: tx,
      });

      console.log('✅ Agent minted on Sui!', result.digest);
      setTxDigest(result.digest);
      setIsSuccess(true);
      setIsPending(false);

      return result.digest;
      */
    } catch (err) {
      setError(err as Error);
      setIsPending(false);
      throw err;
    }
  };

  return {
    mintAgent,
    isPending,
    isSuccess,
    error,
    txDigest,
  };
};

/**
 * Hook for checking if an agent is active on Sui
 */
export const useIsAgentActive = (agentId?: string) => {
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Implement when Sui Move contracts are deployed
  // This should query the agent registry on Sui

  return { isActive, isLoading };
};

/**
 * Hook for getting total agents minted
 */
export const useTotalAgents = () => {
  const [totalAgents, setTotalAgents] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Implement when Sui Move contracts are deployed

  return { totalAgents, isLoading };
};
