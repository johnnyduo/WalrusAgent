// BlockBerry API Service for Sui Mainnet Data
// Documentation: https://docs.blockberry.one/reference/sui-rpc

const BLOCKBERRY_API_KEY = (import.meta as any).env.VITE_BLOCKBERRY_API_KEY;
const BLOCKBERRY_API_URL = (import.meta as any).env.VITE_BLOCKBERRY_API_URL || 'https://api.blockberry.one/sui/v1';

export interface BlockBerryTransaction {
  digest: string;
  timestampMs: number;
  checkpoint: number;
  effects: {
    status: {
      status: string;
      error?: string;
    };
    gasUsed: {
      computationCost: string;
      storageCost: string;
      storageRebate: string;
    };
  };
  events?: any[];
}

export interface BlockBerryBalance {
  coinType: string;
  balance: string;
  totalBalance: string;
  lockedBalance?: string;
}

export interface BlockBerryObject {
  objectId: string;
  version: string;
  digest: string;
  type: string;
  owner: any;
  previousTransaction: string;
  storageRebate: string;
  content?: any;
}

class BlockBerryService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = BLOCKBERRY_API_KEY || '';
    this.baseUrl = BLOCKBERRY_API_URL;
    
    if (!this.apiKey) {
      console.warn('⚠️ BlockBerry API key not configured');
    }
  }

  /**
   * Make RPC call to BlockBerry API
   */
  private async rpcCall(method: string, params: any[] = []): Promise<any> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method,
          params,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`BlockBerry API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      
      if (result.error) {
        throw new Error(`RPC Error: ${result.error.message}`);
      }

      return result.result;
    } catch (error) {
      console.error('BlockBerry RPC call failed:', error);
      throw error;
    }
  }

  /**
   * Get address balance
   */
  async getBalance(address: string): Promise<BlockBerryBalance[]> {
    const result = await this.rpcCall('suix_getAllBalances', [address]);
    console.log('💰 Retrieved balance from BlockBerry:', address);
    return result;
  }

  /**
   * Get SUI balance for address
   */
  async getSuiBalance(address: string): Promise<string> {
    const result = await this.rpcCall('suix_getBalance', [address]);
    console.log('💎 Retrieved SUI balance:', result.totalBalance);
    return result.totalBalance;
  }

  /**
   * Get transaction details
   */
  async getTransaction(digest: string): Promise<BlockBerryTransaction> {
    const result = await this.rpcCall('sui_getTransactionBlock', [
      digest,
      {
        showInput: true,
        showEffects: true,
        showEvents: true,
        showObjectChanges: true,
      },
    ]);
    console.log('📜 Retrieved transaction:', digest);
    return result;
  }

  /**
   * Get transactions for address
   */
  async getTransactions(
    address: string,
    cursor?: string,
    limit: number = 50,
    descending: boolean = true
  ): Promise<{
    data: BlockBerryTransaction[];
    nextCursor: string | null;
    hasNextPage: boolean;
  }> {
    const result = await this.rpcCall('suix_queryTransactionBlocks', [
      {
        filter: {
          FromOrToAddress: { addr: address },
        },
        options: {
          showInput: true,
          showEffects: true,
          showEvents: true,
        },
      },
      cursor,
      limit,
      descending,
    ]);
    
    console.log(`📊 Retrieved ${result.data.length} transactions for ${address}`);
    return result;
  }

  /**
   * Get owned objects for address
   */
  async getOwnedObjects(
    address: string,
    filter?: { Package?: string; Module?: string; StructType?: string }
  ): Promise<BlockBerryObject[]> {
    const result = await this.rpcCall('suix_getOwnedObjects', [
      address,
      {
        filter,
        options: {
          showType: true,
          showOwner: true,
          showPreviousTransaction: true,
          showContent: true,
          showStorageRebate: true,
        },
      },
    ]);
    
    console.log(`📦 Retrieved ${result.data.length} objects for ${address}`);
    return result.data.map((item: any) => item.data);
  }

  /**
   * Get object details by ID
   */
  async getObject(objectId: string): Promise<BlockBerryObject> {
    const result = await this.rpcCall('sui_getObject', [
      objectId,
      {
        showType: true,
        showOwner: true,
        showPreviousTransaction: true,
        showContent: true,
        showStorageRebate: true,
      },
    ]);
    
    console.log('🎯 Retrieved object:', objectId);
    return result.data;
  }

  /**
   * Get current epoch info
   */
  async getCurrentEpoch(): Promise<{
    epoch: string;
    epochStartTimestamp: string;
    epochDurationMs: string;
  }> {
    const result = await this.rpcCall('suix_getLatestSuiSystemState', []);
    console.log('⏰ Current epoch:', result.epoch);
    return {
      epoch: result.epoch,
      epochStartTimestamp: result.epochStartTimestampMs,
      epochDurationMs: result.epochDurationMs,
    };
  }

  /**
   * Get total transactions count
   */
  async getTotalTransactions(): Promise<string> {
    const result = await this.rpcCall('sui_getTotalTransactionBlocks', []);
    console.log('📈 Total transactions:', result);
    return result;
  }

  /**
   * Get reference gas price
   */
  async getReferenceGasPrice(): Promise<string> {
    const result = await this.rpcCall('suix_getReferenceGasPrice', []);
    console.log('⛽ Reference gas price:', result);
    return result;
  }

  /**
   * Get chain identifier
   */
  async getChainIdentifier(): Promise<string> {
    const result = await this.rpcCall('sui_getChainIdentifier', []);
    console.log('🔗 Chain ID:', result);
    return result;
  }

  /**
   * Get dynamic fields for object
   */
  async getDynamicFields(parentObjectId: string, cursor?: string, limit: number = 50): Promise<{
    data: any[];
    nextCursor: string | null;
    hasNextPage: boolean;
  }> {
    const result = await this.rpcCall('suix_getDynamicFields', [parentObjectId, cursor, limit]);
    console.log(`🔍 Retrieved ${result.data.length} dynamic fields for ${parentObjectId}`);
    return result;
  }

  /**
   * Get events by transaction digest
   */
  async getEvents(digest: string): Promise<any[]> {
    const tx = await this.getTransaction(digest);
    console.log(`🎪 Retrieved ${tx.events?.length || 0} events for ${digest}`);
    return tx.events || [];
  }

  /**
   * Query events by criteria
   */
  async queryEvents(
    query: {
      MoveEventType?: string;
      MoveEventModule?: { package: string; module: string };
      Sender?: string;
      Transaction?: string;
    },
    cursor?: string,
    limit: number = 50,
    descending: boolean = true
  ): Promise<{
    data: any[];
    nextCursor: string | null;
    hasNextPage: boolean;
  }> {
    const result = await this.rpcCall('suix_queryEvents', [query, cursor, limit, descending]);
    console.log(`🎭 Query returned ${result.data.length} events`);
    return result;
  }

  // ===== AGENT-SPECIFIC METHODS =====

  /**
   * Get agent registry data from on-chain
   */
  async getAgentRegistry(packageId: string, registryObjectId: string): Promise<any> {
    const object = await this.getObject(registryObjectId);
    console.log('🤖 Retrieved agent registry');
    return object.content;
  }

  /**
   * Get training rewards data
   */
  async getTrainingRewards(packageId: string, rewardsObjectId: string): Promise<any> {
    const object = await this.getObject(rewardsObjectId);
    console.log('🎁 Retrieved training rewards');
    return object.content;
  }

  /**
   * Get agent training history from events
   */
  async getAgentTrainingHistory(
    packageId: string,
    agentId: string,
    limit: number = 100
  ): Promise<any[]> {
    const result = await this.queryEvents(
      {
        MoveEventModule: {
          package: packageId,
          module: 'training_rewards',
        },
      },
      undefined,
      limit,
      true
    );
    
    // Filter by agent ID if needed
    const filtered = result.data.filter((event: any) => {
      return event.parsedJson?.agent_id === agentId;
    });
    
    console.log(`🏋️ Retrieved ${filtered.length} training events for agent ${agentId}`);
    return filtered;
  }

  /**
   * Get agent performance metrics from blockchain
   */
  async getAgentMetrics(address: string): Promise<{
    totalTransactions: number;
    successRate: number;
    totalGasUsed: string;
    recentActivity: BlockBerryTransaction[];
  }> {
    const txResult = await this.getTransactions(address, undefined, 100);
    const transactions = txResult.data;

    const successfulTx = transactions.filter(
      (tx) => tx.effects.status.status === 'success'
    );

    const totalGasUsed = transactions.reduce((sum, tx) => {
      const gas = BigInt(tx.effects.gasUsed.computationCost) + BigInt(tx.effects.gasUsed.storageCost);
      return sum + gas;
    }, BigInt(0));

    console.log(`📊 Agent metrics: ${transactions.length} transactions, ${(successfulTx.length / transactions.length * 100).toFixed(1)}% success rate`);

    return {
      totalTransactions: transactions.length,
      successRate: transactions.length > 0 ? successfulTx.length / transactions.length : 0,
      totalGasUsed: totalGasUsed.toString(),
      recentActivity: transactions.slice(0, 10),
    };
  }

  /**
   * Check if service is configured
   */
  isConfigured(): boolean {
    return Boolean(this.apiKey);
  }
}

// Export singleton instance
export const blockberryService = new BlockBerryService();

// Export helper functions
export const getSuiBalance = (address: string) => blockberryService.getSuiBalance(address);
export const getTransaction = (digest: string) => blockberryService.getTransaction(digest);
export const getAgentMetrics = (address: string) => blockberryService.getAgentMetrics(address);
