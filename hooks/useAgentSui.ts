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
  mintAgent: (metadata: AgentMetadata) => Promise<{ suiTxDigest: string; suiObjectId: string; walrusBlobId: string }>;
  isPending: boolean;
  isSuccess: boolean;
  error: Error | null;
  txDigest: string | null;
  walrusBlobId: string | null;
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
  const [walrusBlobId, setWalrusBlobId] = useState<string | null>(null);

  const mintAgent = async (metadata: AgentMetadata): Promise<{ suiTxDigest: string; walrusBlobId: string }> => {
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
        setWalrusBlobId(metadataBlobId);
      } catch (walrusError: any) {
        console.warn('⚠️ Walrus upload failed, using local storage fallback:', walrusError.message);
        // Store metadata locally as fallback
        const localId = `local_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const metadataWithId = { ...metadata, uploadedAt: Date.now(), version: '1.0' };
        localStorage.setItem(`agent_metadata_${localId}`, JSON.stringify(metadataWithId));
        metadataBlobId = localId;
        setWalrusBlobId(localId);
        console.log('💾 Metadata stored locally:', localId);
      }

      // Step 2: Create Sui transaction to mint agent NFT
      const tx = new TransactionBlock();
      
      console.log('🔍 Contract check:', { AGENT_PACKAGE_ID, AGENT_REGISTRY_ID });
      console.log('🔍 Wallet state:', { address, hasSignFunction: !!signAndExecuteTransactionBlock });
      
      // Check if wallet is properly connected
      if (!address) {
        console.error('❌ No wallet address available');
        throw new Error('Wallet not connected. Please connect your wallet first.');
      }
      
      if (!signAndExecuteTransactionBlock) {
        console.error('❌ signAndExecuteTransactionBlock not available');
        throw new Error('Wallet functions not available. Please reconnect your wallet.');
      }

      // Call the actual mint_agent function on the deployed contract
      console.log('📝 Calling mint_agent on contract:', AGENT_PACKAGE_ID);
      
      try {
        // mint_agent returns an Agent object that needs to be transferred
        const [agent] = tx.moveCall({
          target: `${AGENT_PACKAGE_ID}::agent_registry::mint_agent`,
          arguments: [
            tx.object(AGENT_REGISTRY_ID),
            tx.pure(Array.from(new TextEncoder().encode(metadata.name))),
            tx.pure(Array.from(new TextEncoder().encode(metadata.role))),
            tx.pure(Array.from(new TextEncoder().encode(metadataBlobId))),
          ],
        });
        
        // Transfer the Agent NFT to the sender
        tx.transferObjects([agent], tx.pure(address));

        console.log('🔐 Requesting wallet signature for mint_agent...');
        
        const result = await signAndExecuteTransactionBlock({
          transactionBlock: tx,
          options: {
            showEffects: true,
            showObjectChanges: true,
          },
        });
        
        console.log('📦 Mint result:', JSON.stringify(result, null, 2));
        
        // Validate the result
        if (!result || !result.digest) {
          console.error('❌ Invalid response from wallet - no digest:', result);
          throw new Error('Transaction failed: No digest returned from wallet.');
        }
        
        // Extract the created Agent object ID from transaction effects
        let agentObjectId = result.digest; // fallback to tx digest
        if (result.effects?.created && result.effects.created.length > 0) {
          // Find the Agent object (should be the first created object)
          const createdAgent = result.effects.created[0];
          agentObjectId = createdAgent.reference?.objectId || result.digest;
          console.log('🎯 Created Agent Object ID:', agentObjectId);
        } else if (result.objectChanges) {
          // Alternative: check objectChanges for created objects
          const created = result.objectChanges.find((change: any) => change.type === 'created');
          if (created && created.objectId) {
            agentObjectId = created.objectId;
            console.log('🎯 Created Agent Object ID (from objectChanges):', agentObjectId);
          }
        }
        
        console.log('✅ Agent minted on Sui!', result.digest);
        console.log('🔗 View on explorer:', `https://suiscan.xyz/testnet/tx/${result.digest}`);
        console.log('📦 Agent Object ID:', agentObjectId);
        
        setTxDigest(result.digest);
        setIsSuccess(true);
        setIsPending(false);
        return { 
          suiTxDigest: result.digest, 
          suiObjectId: agentObjectId,
          walrusBlobId: metadataBlobId 
        };
        
      } catch (txError: any) {
        console.error('❌ Transaction failed:', txError);
        
        // User rejected or other error - handle gracefully
        if (txError.message?.includes('rejected') || txError.message?.includes('cancelled') || txError.code === 4001) {
          console.warn('⚠️ User rejected transaction');
          throw new Error('Transaction cancelled by user');
        }
        
        // Re-throw the error
        throw txError;
      }
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
    walrusBlobId,
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
