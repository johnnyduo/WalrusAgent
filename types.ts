export enum AgentRole {
  COMMANDER = 'Commander',
  NAVIGATOR = 'Navigator',
  ARCHIVIST = 'Archivist',
  MERCHANT = 'Merchant',
  SENTINEL = 'Sentinel',
  ORACLE = 'Oracle',
  GLITCH = 'Glitch',
}

export interface AgentPersonality {
  traits: string[];
  dialogues: string[];
}

export interface AgentMetadata {
  id: string;
  name: string;
  role: AgentRole;
  description: string;
  capabilities: string[];
  trustScore: number;
  spriteSeed: string;
  avatar: string; // Path to local animated sprite (GIF or Lottie JSON)
  avatarType?: 'gif' | 'lottie'; // Animation type
  status: 'idle' | 'negotiating' | 'streaming' | 'offline';
  personality?: AgentPersonality;
  suiObjectId?: string; // Sui NFT object ID (when minted)
  walrusBlobId?: string; // Walrus metadata storage ID
}

export interface AgentTaskResult {
  agentId: string;
  agentName: string;
  taskType: 'data_preprocessing' | 'model_architecture' | 'gradient_computation' | 'model_validation' | 'inference_optimization' | 'federated_aggregation' | 'training_coordination' | 'walrus_storage' | 'custom_operation';
  timestamp: number;
  status: 'success' | 'failed' | 'pending' | 'error';
  data?: any;
  summary: string;
  txHash?: string; // Transaction hash for on-chain operations
  txUrl?: string; // Full explorer URL for transaction
  blobId?: string; // Walrus blob ID for stored data
  blobUrl?: string; // Walrus scan URL
}

export interface LogMessage {
  id: string;
  timestamp: string;
  type: 'A2A' | 'WALRUS' | 'SYSTEM' | 'COMMANDER';
  content: string;
  agentId?: string;
}

export interface StreamState {
  id: string;
  source: string;
  target: string;
  rate: number; // wei per second
  totalStreamed: number;
  active: boolean;
}

export enum MessageType {
  SERVICE_REQUEST = 'SERVICE_REQUEST',
  SERVICE_OFFER = 'SERVICE_OFFER',
  STREAM_OPEN = 'STREAM_OPEN',
  STREAM_CLOSE = 'STREAM_CLOSE',
}