/**
 * Official Walrus SDK Service
 * Uses @mysten/walrus for proper blob storage with upload relay
 */

import { SuiClient } from '@mysten/sui/client';
import { WalrusClient, WalrusFile } from '@mysten/walrus';
import type { WriteFilesFlow } from '@mysten/walrus';
import { SUI_RPC_URLS, SUI_NETWORK, WALRUS_CONFIG } from '../config/suiWalletConfig';

// Lazy initialization to avoid module loading issues
let _walrusClient: WalrusClient | null = null;

function getWalrusClient(): WalrusClient {
  if (!_walrusClient) {
    // Create new SuiClient instance compatible with Walrus SDK
    const suiClient = new SuiClient({
      url: SUI_RPC_URLS[SUI_NETWORK],
    });

    _walrusClient = new WalrusClient({
      network: 'testnet',
      suiClient,
      storageNodeClientOptions: {
        timeout: 60000, // 60 second timeout
        onError: (error) => {
          console.error('💥 Walrus storage node error:', error);
        },
      },
      uploadRelay: {
        host: WALRUS_CONFIG.uploadRelay,
        timeout: 60000,
        sendTip: {
          max: 1000, // Max 1000 MIST tip
        },
      },
    });
  }
  return _walrusClient;
}

// Export lazy-initialized client
export const walrusClient = getWalrusClient();

export interface WalrusUploadFlowState {
  state: 'empty' | 'encoding' | 'encoded' | 'registering' | 'uploading' | 'uploaded' | 'certifying' | 'done' | 'error';
  flow: WriteFilesFlow | null;
  files: { id: string; blobId: string }[];
  error?: Error;
}

/**
 * Create a Walrus upload flow for browser wallet integration
 * This returns a flow that can be executed step-by-step with separate wallet popups
 */
export function createWalrusUploadFlow(data: any, identifier: string = 'agent-metadata.json'): {
  flow: WriteFilesFlow;
  getState: () => 'idle' | 'encoding' | 'ready' | 'registered' | 'uploaded' | 'certified';
} {
  const jsonData = JSON.stringify(data, null, 2);
  const contents = new TextEncoder().encode(jsonData);
  
  const file = WalrusFile.from({
    contents,
    identifier,
    tags: {
      'content-type': 'application/json',
      'created-at': new Date().toISOString(),
      'agent-version': '1.0.0',
    },
  });

  const client = getWalrusClient();
  const flow = client.writeFilesFlow({ files: [file] });

  let currentState: 'idle' | 'encoding' | 'ready' | 'registered' | 'uploaded' | 'certified' = 'idle';

  return {
    flow,
    getState: () => currentState,
  };
}

/**
 * Simple upload helper for non-browser environments
 * Uses the simpler writeFiles API that handles everything in one call
 */
export async function uploadToWalrus(
  data: any,
  signer: any,
  options: {
    identifier?: string;
    epochs?: number;
    deletable?: boolean;
  } = {}
): Promise<{
  id: string;
  blobId: string;
  blobObject: any;
}> {
  const {
    identifier = 'data.json',
    epochs = WALRUS_CONFIG.epochs,
    deletable = true,
  } = options;

  const jsonData = JSON.stringify(data, null, 2);
  const contents = new TextEncoder().encode(jsonData);

  const file = WalrusFile.from({
    contents,
    identifier,
    tags: {
      'content-type': 'application/json',
      'created-at': new Date().toISOString(),
    },
  });

  console.log(`📤 Uploading ${identifier} to Walrus (${contents.length} bytes, ${epochs} epochs)`);

  const client = getWalrusClient();
  const results = await client.writeFiles({
    files: [file],
    epochs,
    deletable,
    signer,
  });

  console.log('✅ Upload complete:', results[0]);

  return results[0];
}

/**
 * Retrieve data from Walrus by blob ID
 */
export async function retrieveFromWalrus<T = any>(blobId: string): Promise<T> {
  try {
    console.log(`📥 Retrieving blob ${blobId} from Walrus`);
    
    const client = getWalrusClient();
    const files = await client.getFiles({ ids: [blobId] });
    const file = files[0];
    const bytes = await file.bytes();
    const jsonString = new TextDecoder().decode(bytes);
    const data = JSON.parse(jsonString);
    
    console.log('✅ Retrieved data successfully');
    return data as T;
  } catch (error) {
    console.error('❌ Failed to retrieve from Walrus:', error);
    throw error;
  }
}

/**
 * Legacy compatibility - Simple JSON upload using old API pattern
 */
export async function legacyUpload(data: any, epochs: number = WALRUS_CONFIG.epochs): Promise<{
  blobId: string;
  url: string;
  size: number;
  epochs: number;
}> {
  // Fallback to local storage if Walrus fails
  const fallbackId = `local_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  
  try {
    // Try to use the aggregator URL as fallback
    const jsonData = JSON.stringify(data);
    const blob = new Blob([jsonData], { type: 'application/json' });
    
    const response = await fetch(`${WALRUS_CONFIG.aggregator}/v1/store?epochs=${epochs}`, {
      method: 'PUT',
      body: blob,
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    const blobId = result.newlyCreated?.blobObject?.blobId || result.alreadyCertified?.blobId;

    if (blobId) {
      return {
        blobId,
        url: `${WALRUS_CONFIG.aggregator}/v1/${blobId}`,
        size: blob.size,
        epochs,
      };
    }
    
    throw new Error('No blob ID in response');
  } catch (error) {
    console.warn('⚠️ Walrus upload failed, using local storage:', error);
    
    // Store in localStorage as fallback
    localStorage.setItem(`walrus_blob_${fallbackId}`, JSON.stringify(data));
    
    return {
      blobId: fallbackId,
      url: `local://${fallbackId}`,
      size: JSON.stringify(data).length,
      epochs,
    };
  }
}

export default walrusClient;
