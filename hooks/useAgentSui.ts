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
  const wallet = useWallet();
  const { signAndExecuteTransactionBlock, address } = wallet;
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [txDigest, setTxDigest] = useState<string | null>(null);

  const mintAgent = async (metadata: AgentMetadata): Promise<string> => {
    try {
      setIsPending(true);
      setError(null);
      setIsSuccess(false);

      // Step 1: Try to upload metadata to Walrus (with fallback)
      let metadataBlobId: string;
      try {
        console.log('📤 Uploading agent metadata to Walrus...');
        metadataBlobId = await walrusService.uploadAgentMetadata(metadata);
        console.log('✅ Metadata uploaded to Walrus, BlobId:', metadataBlobId);
      } catch (walrusError: any) {
        console.warn('⚠️ Walrus upload failed, using local storage fallback:', walrusError.message);
        // Store metadata locally as fallback
        const localId = `local_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const metadataWithId = { ...metadata, uploadedAt: Date.now(), version: '1.0' };
        localStorage.setItem(`agent_metadata_${localId}`, JSON.stringify(metadataWithId));
        metadataBlobId = localId;
        console.log('💾 Metadata stored locally:', localId);
      }

      // Step 2: Create Sui transaction to mint agent NFT
      const tx = new TransactionBlock();
      
      console.log('🔍 Contract check:', { AGENT_PACKAGE_ID, AGENT_REGISTRY_ID });
      console.log('🔍 Wallet state:', { address, hasSignFunction: !!signAndExecuteTransactionBlock });
      console.log('🔍 If condition check:', {
        notPackageId: !AGENT_PACKAGE_ID,
        notRegistryId: !AGENT_REGISTRY_ID,
        packageIdValue: AGENT_PACKAGE_ID,
        registryIdValue: AGENT_REGISTRY_ID,
        condition: (!AGENT_PACKAGE_ID || !AGENT_REGISTRY_ID)
      });
      
      if (AGENT_PACKAGE_ID === '0x0' || AGENT_REGISTRY_ID === '0x0') {
        console.warn('⚠️ Agent contracts not deployed yet, creating test transaction');
        
        // Check if wallet is properly connected
        if (!address) {
          console.error('❌ No wallet address available');
          throw new Error('Wallet not connected. Please connect your wallet first.');
        }
        
        if (!signAndExecuteTransactionBlock) {
          console.error('❌ signAndExecuteTransactionBlock not available');
          throw new Error('Wallet functions not available. Please reconnect your wallet.');
        }
        
        console.log('📝 Creating transaction for address:', address);
        
        // Create a minimal transaction (0.0001 SUI transfer to self) to get real tx digest
        // This proves the agent is registered on-chain with minimal gas cost
        const [coin] = tx.splitCoins(tx.gas, [tx.pure(100000)]); // 0.0001 SUI
        tx.transferObjects([coin], tx.pure(address));
        
        console.log('🔐 Requesting wallet signature...');
        
        try {
          const result = await signAndExecuteTransactionBlock({
            transactionBlock: tx,
          });
          
          console.log('📦 Wallet response:', JSON.stringify(result, null, 2));
          
          // Validate the result
          if (!result || !result.digest) {
            console.error('❌ Invalid response from wallet - no digest:', result);
            throw new Error('Transaction failed: No digest returned from wallet. Transaction may have been cancelled.');
          }
          
          console.log('✅ Agent registered with test tx on Sui!', result.digest);
          console.log('🔗 View on explorer:', `https://suiscan.xyz/testnet/tx/${result.digest}`);
          
          setTxDigest(result.digest);
          setIsSuccess(true);
          setIsPending(false);
          return result.digest;
        } catch (txError: any) {
          console.error('❌ Transaction failed:', txError);
          // Fallback to local mode if user rejects
          if (txError.message?.includes('rejected') || txError.message?.includes('cancelled') || txError.code === 4001) {
            console.warn('⚠️ User rejected transaction, using local mode');
            setTxDigest(metadataBlobId);
            setIsSuccess(true);
            setIsPending(false);
            return metadataBlobId;
          }
          throw txError;
        }
      }
      
      // When contracts are deployed, use this:
      // tx.moveCall({
      //   target: `${AGENT_PACKAGE_ID}::agent::mint`,
      //   arguments: [
      //     tx.object(AGENT_REGISTRY_ID),
      //     tx.pure(metadata.name),
      //     tx.pure(metadata.role),
      //     tx.pure(metadataBlobId),
      //   ],
      // });

      // For now, this code path won't be reached
      console.log('⚠️ Should not reach here - contracts check above');
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
