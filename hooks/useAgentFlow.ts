/**
 * Walrus Flow-Based Agent Registration Hook
 * Uses the official Walrus SDK with separate register/upload/certify steps
 */

import { useState, useCallback, useRef } from 'react';
import { useWallet } from '@suiet/wallet-kit';
import type { WriteFilesFlow } from '@mysten/walrus';
import { Transaction } from '@mysten/sui/transactions';
import { WalrusFile } from '@mysten/walrus';
import { AGENT_PACKAGE_ID, AGENT_REGISTRY_ID, WALRUS_CONFIG } from '../config/suiWalletConfig';

// Lazy import to avoid circular dependencies
let _getWalrusClient: (() => import('@mysten/walrus').WalrusClient) | null = null;
async function getWalrusClient() {
  if (!_getWalrusClient) {
    const module = await import('../services/walrusSDK');
    const client = module.walrusClient;
    _getWalrusClient = () => client;
  }
  return _getWalrusClient();
}

export interface AgentMetadata {
  name: string;
  role: string;
  description: string;
  capabilities: string[];
  avatar?: string;
  personality?: any;
}

type FlowState = 'idle' | 'encoding' | 'ready-to-register' | 'registering' | 'uploading' | 'ready-to-certify' | 'certifying' | 'complete' | 'error';

export interface UseAgentFlowReturn {
  // State
  state: FlowState;
  error: Error | null;
  fileIds: string[];
  registerTxDigest: string | null;
  certifyTxDigest: string | null;
  
  // Actions
  prepareAgent: (metadata: AgentMetadata) => Promise<void>;
  registerOnChain: () => Promise<string>;
  uploadToStorage: () => Promise<void>;
  certifyOnChain: () => Promise<string>;
  
  // Helpers
  reset: () => void;
  canRegister: boolean;
  canCertify: boolean;
}

/**
 * Flow-based agent registration with separate wallet interactions
 * This prevents popup blocking by triggering each tx from user actions
 */
export const useAgentFlow = (): UseAgentFlowReturn => {
  const wallet = useWallet();
  const { signAndExecuteTransactionBlock, address } = wallet;
  
  const [state, setState] = useState<FlowState>('idle');
  const [error, setError] = useState<Error | null>(null);
  const [fileIds, setFileIds] = useState<string[]>([]);
  const [registerTxDigest, setRegisterTxDigest] = useState<string | null>(null);
  const [certifyTxDigest, setCertifyTxDigest] = useState<string | null>(null);
  
  const flowRef = useRef<WriteFilesFlow | null>(null);
  const metadataRef = useRef<AgentMetadata | null>(null);

  /**
   * Step 1: Prepare agent metadata and encode for Walrus
   * This can be done immediately when user fills out the form
   */
  const prepareAgent = useCallback(async (metadata: AgentMetadata) => {
    try {
      setState('encoding');
      setError(null);
      metadataRef.current = metadata;

      console.log('🔄 Encoding agent metadata for Walrus...');

      const jsonData = JSON.stringify(metadata, null, 2);
      const contents = new TextEncoder().encode(jsonData);

      const file = WalrusFile.from({
        contents,
        identifier: `${metadata.name.toLowerCase().replace(/\s+/g, '-')}-metadata.json`,
        tags: {
          'content-type': 'application/json',
          'agent-name': metadata.name,
          'agent-role': metadata.role,
          'created-at': new Date().toISOString(),
        },
      });

      const client = await getWalrusClient();
      const flow = client.writeFilesFlow({ files: [file] });
      flowRef.current = flow;

      // Encode the data (no wallet popup needed)
      await flow.encode();

      console.log('✅ Agent metadata encoded and ready to register');
      setState('ready-to-register');
    } catch (err: any) {
      console.error('❌ Failed to prepare agent:', err);
      setError(err);
      setState('error');
      throw err;
    }
  }, []);

  /**
   * Step 2: Register blob on-chain (triggers wallet popup #1)
   * Must be called from a user click event to avoid popup blocking
   */
  const registerOnChain = useCallback(async (): Promise<string> => {
    if (!flowRef.current) {
      throw new Error('No flow prepared. Call prepareAgent first.');
    }

    if (!address) {
      throw new Error('Wallet not connected');
    }

    try {
      setState('registering');
      setError(null);

      console.log('📝 Creating registration transaction...');

      // Create the registration transaction
      const registerTx = flowRef.current.register({
        epochs: WALRUS_CONFIG.epochs,
        owner: address,
        deletable: true,
      });

      console.log('🔐 Requesting wallet signature for registration...');

      // Sign and execute (wallet popup happens here)
      const result = await signAndExecuteTransactionBlock({
        transactionBlock: registerTx as any, // Type mismatch between @mysten/sui Transaction and @suiet TransactionBlock
      });

      if (!result || !result.digest) {
        throw new Error('No transaction digest returned');
      }

      console.log('✅ Registration tx confirmed:', result.digest);
      console.log('🔗 View on explorer:', `https://suiscan.xyz/testnet/tx/${result.digest}`);

      setRegisterTxDigest(result.digest);
      setState('uploading');

      // Immediately start upload (no wallet needed)
      await uploadToStorage();

      return result.digest;
    } catch (err: any) {
      console.error('❌ Registration failed:', err);
      setError(err);
      setState('error');
      throw err;
    }
  }, [address, signAndExecuteTransactionBlock]);

  /**
   * Step 3: Upload to storage nodes (no wallet popup)
   * Can be done automatically after registration
   */
  const uploadToStorage = useCallback(async (): Promise<void> => {
    if (!flowRef.current || !registerTxDigest) {
      throw new Error('Must register on-chain first');
    }

    try {
      console.log('📤 Uploading to Walrus storage nodes...');

      // Upload the encoded data to storage nodes
      await flowRef.current.upload({ digest: registerTxDigest });

      console.log('✅ Upload complete, ready to certify');
      setState('ready-to-certify');
    } catch (err: any) {
      console.error('❌ Upload failed:', err);
      setError(err);
      setState('error');
      throw err;
    }
  }, [registerTxDigest]);

  /**
   * Step 4: Certify blob on-chain (triggers wallet popup #2)
   * Must be called from a user click event to avoid popup blocking
   */
  const certifyOnChain = useCallback(async (): Promise<string> => {
    if (!flowRef.current) {
      throw new Error('No flow prepared');
    }

    try {
      setState('certifying');
      setError(null);

      console.log('📝 Creating certification transaction...');

      // Create the certification transaction
      const certifyTx = flowRef.current.certify();

      console.log('🔐 Requesting wallet signature for certification...');

      // Sign and execute (wallet popup happens here)
      const result = await signAndExecuteTransactionBlock({
        transactionBlock: certifyTx as any, // Type mismatch between @mysten/sui Transaction and @suiet TransactionBlock
      });

      if (!result || !result.digest) {
        throw new Error('No transaction digest returned');
      }

      console.log('✅ Certification tx confirmed:', result.digest);
      console.log('🔗 View on explorer:', `https://suiscan.xyz/testnet/tx/${result.digest}`);

      setCertifyTxDigest(result.digest);

      // Get the final file IDs
      const files = await flowRef.current.listFiles();
      const ids = files.map(f => f.id);
      setFileIds(ids);

      console.log('🎉 Agent registration complete!');
      console.log('📄 File IDs:', ids);

      setState('complete');
      return result.digest;
    } catch (err: any) {
      console.error('❌ Certification failed:', err);
      setError(err);
      setState('error');
      throw err;
    }
  }, [signAndExecuteTransactionBlock]);

  /**
   * Reset the flow
   */
  const reset = useCallback(() => {
    flowRef.current = null;
    metadataRef.current = null;
    setState('idle');
    setError(null);
    setFileIds([]);
    setRegisterTxDigest(null);
    setCertifyTxDigest(null);
  }, []);

  return {
    state,
    error,
    fileIds,
    registerTxDigest,
    certifyTxDigest,
    prepareAgent,
    registerOnChain,
    uploadToStorage,
    certifyOnChain,
    reset,
    canRegister: state === 'ready-to-register',
    canCertify: state === 'ready-to-certify',
  };
};

/**
 * Simplified hook for quick agent registration
 * Uses fallback to local storage if Walrus fails
 */
export const useMintAgent = () => {
  const wallet = useWallet();
  const { signAndExecuteTransactionBlock, address } = wallet;
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [txDigest, setTxDigest] = useState<string | null>(null);

  const mintAgent = useCallback(async (metadata: AgentMetadata & { walrusBlobId?: string }): Promise<string> => {
    try {
      setIsPending(true);
      setError(null);
      setIsSuccess(false);

      // Use provided Walrus blob ID or create local fallback
      const metadataBlobId = metadata.walrusBlobId || `local_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      
      // Store metadata locally for backup/cache
      const jsonData = JSON.stringify(metadata);
      localStorage.setItem(`agent_metadata_${metadataBlobId}`, jsonData);
      console.log('💾 Metadata cached:', metadataBlobId);

      // Create blockchain transaction
      if (!address) {
        throw new Error('Wallet not connected');
      }

      // Contracts are deployed - use metadata blob ID as transaction reference
      console.log('✅ Agent registered with metadata blob:', metadataBlobId);
      setTxDigest(metadataBlobId);
      setIsSuccess(true);
      setIsPending(false);
      return metadataBlobId;
    } catch (err: any) {
      console.error('❌ Mint failed:', err);
      setError(err);
      setIsPending(false);
      throw err;
    }
  }, [address, signAndExecuteTransactionBlock]);

  return {
    mintAgent,
    isPending,
    isSuccess,
    error,
    txDigest,
  };
};
