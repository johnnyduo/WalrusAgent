// Walrus Protocol Service for Decentralized Storage
// Handles agent metadata, task results, and other data storage on Walrus

import { WALRUS_CONFIG } from '../config/suiWalletConfig';

export interface WalrusUploadResult {
  blobId: string;
  url: string;
  size: number;
  epochs: number;
  cost?: string;
}

export interface WalrusBlob {
  blobId: string;
  data: any;
  metadata?: {
    uploadedAt: number;
    size: number;
    contentType: string;
  };
}

class WalrusService {
  private publisherUrl: string;
  private aggregatorUrl: string;

  constructor() {
    this.publisherUrl = WALRUS_CONFIG.publisher;
    this.aggregatorUrl = WALRUS_CONFIG.aggregator;
  }

  /**
   * Upload data to Walrus
   * @param data - Data to upload (will be JSON stringified)
   * @param epochs - Number of epochs to store (default: 1)
   * @returns Upload result with blobId and URL
   */
  async upload(data: any, epochs: number = WALRUS_CONFIG.epochs): Promise<WalrusUploadResult> {
    try {
      const jsonData = JSON.stringify(data);
      const blob = new Blob([jsonData], { type: 'application/json' });
      
      // Check size limit
      if (blob.size > WALRUS_CONFIG.maxBlobSize) {
        throw new Error(`Data size ${blob.size} exceeds maximum ${WALRUS_CONFIG.maxBlobSize} bytes`);
      }

      // Upload to Walrus Publisher with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${this.publisherUrl}/v1/store?epochs=${epochs}`, {
        method: 'PUT',
        body: blob,
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'No response body');
        console.error('Walrus upload failed:', {
          status: response.status,
          statusText: response.statusText,
          url: `${this.publisherUrl}/v1/store?epochs=${epochs}`,
          error: errorText
        });
        throw new Error(`Walrus testnet unavailable (${response.status}). Using local fallback.`);
      }

      const result = await response.json();
      
      // Walrus returns structure: { newlyCreated: { blobObject: { id, ... }, ... } } or { alreadyCertified: { ... } }
      let blobId: string;
      let cost: string | undefined;

      if (result.newlyCreated) {
        blobId = result.newlyCreated.blobObject.blobId;
        cost = result.newlyCreated.cost;
      } else if (result.alreadyCertified) {
        blobId = result.alreadyCertified.blobId;
      } else {
        throw new Error('Unexpected Walrus response format');
      }

      return {
        blobId,
        url: `${this.aggregatorUrl}/v1/${blobId}`,
        size: blob.size,
        epochs,
        cost,
      };
    } catch (error: any) {
      console.error('Walrus upload error:', error);
      if (error.name === 'AbortError') {
        throw new Error('Walrus upload timeout - testnet may be down');
      }
      throw error;
    }
  }

  /**
   * Retrieve data from Walrus
   * @param blobId - Blob ID to retrieve
   * @returns Parsed JSON data
   */
  async retrieve<T = any>(blobId: string): Promise<T> {
    try {
      const response = await fetch(`${this.aggregatorUrl}/v1/${blobId}`);

      if (!response.ok) {
        throw new Error(`Retrieve failed: ${response.status}`);
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error('Walrus retrieve error:', error);
      throw error;
    }
  }

  /**
   * Check if a blob exists
   * @param blobId - Blob ID to check
   * @returns True if blob exists
   */
  async exists(blobId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.aggregatorUrl}/v1/${blobId}`, {
        method: 'HEAD',
      });
      return response.ok;
    } catch (error) {
      console.error('Walrus exists check error:', error);
      return false;
    }
  }

  /**
   * Upload agent metadata to Walrus
   * @param agentData - Agent metadata
   * @returns BlobId for the uploaded metadata
   */
  async uploadAgentMetadata(agentData: {
    name: string;
    role: string;
    description: string;
    capabilities: string[];
    avatar?: string;
    personality?: any;
  }): Promise<string> {
    const metadata = {
      ...agentData,
      uploadedAt: Date.now(),
      version: '1.0',
    };

    try {
      const result = await this.upload(metadata);
      console.log('✅ Agent metadata uploaded to Walrus:', result.blobId);
      return result.blobId;
    } catch (error: any) {
      console.error('❌ Walrus upload failed:', error.message);
      // Re-throw with more context
      throw new Error(`Walrus testnet unavailable (${error.message}). Using local fallback.`);
    }
  }

  /**
   * Upload task result to Walrus
   * @param taskResult - Task result data
   * @returns BlobId for the uploaded task result
   */
  async uploadTaskResult(taskResult: any): Promise<string> {
    const result = await this.upload(taskResult);
    console.log('✅ Task result uploaded to Walrus:', result.blobId);
    return result.blobId;
  }

  /**
   * Retrieve agent metadata from Walrus
   * @param blobId - BlobId of the agent metadata
   * @returns Agent metadata
   */
  async getAgentMetadata(blobId: string): Promise<any> {
    return this.retrieve(blobId);
  }

  /**
   * Retrieve task result from Walrus
   * @param blobId - BlobId of the task result
   * @returns Task result data
   */
  async getTaskResult(blobId: string): Promise<any> {
    return this.retrieve(blobId);
  }

  /**
   * Get the URL for a blob
   * @param blobId - Blob ID
   * @returns Full URL to access the blob
   */
  getBlobUrl(blobId: string): string {
    return `${this.aggregatorUrl}/v1/${blobId}`;
  }

  // ===== AI TRAINING METHODS =====

  /**
   * Upload model weights/parameters to Walrus
   * @param weights - Model weights (Float32Array or number array)
   * @param metadata - Model metadata (version, architecture, etc.)
   * @returns BlobId for the uploaded weights
   */
  async uploadModelWeights(
    weights: Float32Array | number[],
    metadata: {
      version: number;
      architecture: string;
      agentId: string;
      epoch?: number;
      accuracy?: number;
      loss?: number;
    }
  ): Promise<string> {
    const weightsArray = weights instanceof Float32Array ? Array.from(weights) : weights;
    
    const modelData = {
      weights: weightsArray,
      metadata: {
        ...metadata,
        uploadedAt: Date.now(),
        size: weightsArray.length,
      },
    };

    const result = await this.upload(modelData, 5); // Store for 5 epochs for model weights
    console.log('🧠 Model weights uploaded to Walrus:', result.blobId);
    return result.blobId;
  }

  /**
   * Upload model delta (gradient update) to Walrus
   * @param delta - Gradient update
   * @param metadata - Update metadata
   * @returns BlobId for the uploaded delta
   */
  async uploadModelDelta(
    delta: Float32Array | number[],
    metadata: {
      version: number;
      agentId: string;
      contributorAddress: string;
      epoch: number;
      learningRate?: number;
    }
  ): Promise<string> {
    const deltaArray = delta instanceof Float32Array ? Array.from(delta) : delta;
    
    const deltaData = {
      delta: deltaArray,
      metadata: {
        ...metadata,
        uploadedAt: Date.now(),
        size: deltaArray.length,
      },
    };

    const result = await this.upload(deltaData, 2); // Store deltas for 2 epochs
    console.log('📊 Model delta uploaded to Walrus:', result.blobId);
    return result.blobId;
  }

  /**
   * Upload training dataset chunk to Walrus
   * @param data - Training data chunk
   * @param metadata - Dataset metadata
   * @returns BlobId for the uploaded dataset
   */
  async uploadDatasetChunk(
    data: any[],
    metadata: {
      chunkId: number;
      totalChunks: number;
      datasetName: string;
      agentId?: string;
    }
  ): Promise<string> {
    const datasetData = {
      data,
      metadata: {
        ...metadata,
        uploadedAt: Date.now(),
        size: data.length,
      },
    };

    const result = await this.upload(datasetData, 10); // Store datasets longer
    console.log('📦 Dataset chunk uploaded to Walrus:', result.blobId);
    return result.blobId;
  }

  /**
   * Upload embeddings to Walrus
   * @param embeddings - Vector embeddings
   * @param metadata - Embedding metadata
   * @returns BlobId for the uploaded embeddings
   */
  async uploadEmbeddings(
    embeddings: number[][],
    metadata: {
      agentId: string;
      embeddingDim: number;
      modelVersion: number;
      context?: string;
    }
  ): Promise<string> {
    const embeddingData = {
      embeddings,
      metadata: {
        ...metadata,
        uploadedAt: Date.now(),
        count: embeddings.length,
      },
    };

    const result = await this.upload(embeddingData, 5);
    console.log('🎯 Embeddings uploaded to Walrus:', result.blobId);
    return result.blobId;
  }

  /**
   * Upload training snapshot (checkpoint) to Walrus
   * @param snapshot - Complete model snapshot
   * @returns BlobId for the uploaded snapshot
   */
  async uploadTrainingSnapshot(snapshot: {
    weights: Float32Array | number[];
    optimizer?: any;
    metadata: {
      version: number;
      agentId: string;
      epoch: number;
      accuracy: number;
      loss: number;
      timestamp: number;
    };
  }): Promise<string> {
    const weightsArray = snapshot.weights instanceof Float32Array 
      ? Array.from(snapshot.weights) 
      : snapshot.weights;
    
    const snapshotData = {
      ...snapshot,
      weights: weightsArray,
      uploadedAt: Date.now(),
    };

    const result = await this.upload(snapshotData, 10); // Store snapshots longer
    console.log('💾 Training snapshot uploaded to Walrus:', result.blobId);
    return result.blobId;
  }

  /**
   * Retrieve model weights from Walrus
   * @param blobId - BlobId of the model weights
   * @returns Model weights and metadata
   */
  async getModelWeights(blobId: string): Promise<{
    weights: number[];
    metadata: any;
  }> {
    return this.retrieve(blobId);
  }

  /**
   * Retrieve model delta from Walrus
   * @param blobId - BlobId of the model delta
   * @returns Model delta and metadata
   */
  async getModelDelta(blobId: string): Promise<{
    delta: number[];
    metadata: any;
  }> {
    return this.retrieve(blobId);
  }

  /**
   * Retrieve dataset chunk from Walrus
   * @param blobId - BlobId of the dataset chunk
   * @returns Dataset chunk and metadata
   */
  async getDatasetChunk(blobId: string): Promise<{
    data: any[];
    metadata: any;
  }> {
    return this.retrieve(blobId);
  }

  /**
   * Retrieve embeddings from Walrus
   * @param blobId - BlobId of the embeddings
   * @returns Embeddings and metadata
   */
  async getEmbeddings(blobId: string): Promise<{
    embeddings: number[][];
    metadata: any;
  }> {
    return this.retrieve(blobId);
  }

  /**
   * Retrieve training snapshot from Walrus
   * @param blobId - BlobId of the snapshot
   * @returns Complete training snapshot
   */
  async getTrainingSnapshot(blobId: string): Promise<{
    weights: number[];
    optimizer?: any;
    metadata: any;
  }> {
    return this.retrieve(blobId);
  }
}

// Export singleton instance
export const walrusService = new WalrusService();

// Export helper functions
export const uploadToWalrus = (data: any, epochs?: number) => walrusService.upload(data, epochs);
export const retrieveFromWalrus = <T = any>(blobId: string) => walrusService.retrieve<T>(blobId);
export const checkWalrusBlob = (blobId: string) => walrusService.exists(blobId);
