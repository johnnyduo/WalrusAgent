import { AgentRole, AgentMetadata } from './types';

export const AGENTS: AgentMetadata[] = [
  {
    id: 'a0',
    name: 'Walrus Commander',
    role: AgentRole.COMMANDER,
    description: 'Supreme orchestrator. Majestic leader who coordinates all agents, manages distributed training, and makes strategic decisions. Model deltas stored on Walrus Protocol.',
    capabilities: ['Strategic Planning', 'Agent Coordination', 'Risk Management', 'Decision Making'],
    trustScore: 100,
    spriteSeed: 'lion-king-crown-golden-majestic',
    avatar: '/lottie/Lion - Breath.json',
    avatarType: 'lottie' as const,
    status: 'idle',
    personality: {
      traits: ['Coordinating', 'Strategic', 'Decisive', 'Distributed'],
      dialogues: [
        '🐋 Initializing distributed training epoch. All agents sync model deltas to Walrus...',
        '📊 Coordinating compute across network. Training loss: 0.234, convergence optimal.',
        '✅ Model checkpoint stored on Walrus. Blob ID: 0x7f4a... Agents proceed to next batch.',
        '🔄 Aggregating gradients from 6 nodes. Consensus achieved. Pushing to Walrus storage.',
        '⚡ Training efficiency: 94%. Network utilizes decentralized compute perfectly.',
        '🎯 Next objective: Fine-tune embeddings. Allocate resources across agent swarm.'
      ]
    }
  },
  {
    id: 'a1',
    name: 'Eagleton Skywatcher',
    role: AgentRole.NAVIGATOR,
    description: 'Data Preprocessing Agent. Sharp-eyed eagle who collects real-time market data, performs feature engineering, normalizes datasets, and stores training batches on Walrus.',
    capabilities: ['Data Collection', 'Feature Engineering', 'Normalization', 'Batch Storage'],
    trustScore: 98,
    spriteSeed: 'eagle-bird-scout-teal-wings',
    avatar: '/lottie/running pigeon.json',
    avatarType: 'lottie' as const,
    status: 'idle',
    personality: {
      traits: ['Data-focused', 'Precise', 'Preprocessing', 'Storage-efficient'],
      dialogues: [
        '📊 Preprocessing 12,847 data points. Feature extraction: 94% complete.',
        '🐋 Training batch normalized. Storing to Walrus... Blob ID: 0xa3f2...',
        '✅ Dataset chunk uploaded: 5.2MB. Checksum verified on Walrus storage.',
        '⚡ Real-time data pipeline: 340 samples/sec. Buffering for next epoch.',
        '🔄 Feature engineering complete. 128-dim embeddings ready for training.',
        '📦 Data quality high: 98.7%. Pushing preprocessed batch to distributed nodes.'
      ]
    }
  },
  {
    id: 'a2',
    name: 'Athena Nightwing',
    role: AgentRole.ARCHIVIST,
    description: 'Model Architecture Specialist. Wise owl who designs neural networks, optimizes layer configurations, implements attention mechanisms, and stores architectures on Walrus.',
    capabilities: ['Network Design', 'Layer Optimization', 'Attention Mechanisms', 'Architecture Storage'],
    trustScore: 99,
    spriteSeed: 'owl-wise-indigo-scholar',
    avatar: '/lottie/Duo Attack.json',
    avatarType: 'lottie' as const,
    status: 'idle',
    personality: {
      traits: ['Architectural', 'Deep-thinking', 'Optimization-focused', 'Design-savvy'],
      dialogues: [
        '🧠 Model architecture optimized: 12-layer transformer. Parameters: 89M.',
        '📐 Attention heads reconfigured: 8→16. Gradient flow improved 34%.',
        '🐋 Architecture snapshot stored on Walrus. Blob ID: 0xb7c4...',
        '⚡ Layer pruning complete. Model size reduced 40%, accuracy maintained.',
        '✅ Hyperparameter sweep finished: Learning rate 0.0003 optimal.',
        '🔄 Network topology updated. Pushing new architecture to distributed nodes.'
      ]
    }
  },
  {
    id: 'a3',
    name: 'Reynard Swift',
    role: AgentRole.MERCHANT,
    description: 'Gradient Computation Agent. Cunning fox who calculates model gradients, performs backpropagation, optimizes batch sizes, and stores deltas on Walrus.',
    capabilities: ['Gradient Calculation', 'Backpropagation', 'Batch Optimization', 'Delta Storage'],
    trustScore: 85,
    spriteSeed: 'fox-trader-purple-clever',
    avatar: '/lottie/Happy Unicorn Dog.json',
    avatarType: 'lottie' as const,
    status: 'idle',
    personality: {
      traits: ['Fast-computing', 'Gradient-focused', 'Optimization-aware', 'Swift'],
      dialogues: [
        '⚡ Computing gradients: 2.3M parameters. Backprop speed: 847ms/batch.',
        '🐋 Gradient delta stored on Walrus. Size: 18.4MB. Blob ID: 0xc9e1...',
        '✅ Batch size optimized: 64→128. Training throughput +42%.',
        '🔄 Loss gradient calculated: ∂L/∂θ = 0.0034. Pushing to aggregator.',
        '📊 Gradient norm: 2.47. Clipping applied. Stable convergence ensured.',
        '⚡ Swift computation: 340 gradient updates/sec. Efficiency: 96%.'
      ]
    }
  },
  {
    id: 'a4',
    name: 'Ursus Guardian',
    role: AgentRole.SENTINEL,
    description: 'Model Validation Agent. Protective bear who validates training convergence, detects overfitting, monitors loss metrics, and ensures model quality before Walrus storage.',
    capabilities: ['Convergence Validation', 'Overfitting Detection', 'Loss Monitoring', 'Quality Assurance'],
    trustScore: 100,
    spriteSeed: 'bear-guardian-black-strong',
    avatar: '/lottie/Cute bear dancing.json',
    avatarType: 'lottie' as const,
    status: 'idle',
    personality: {
      traits: ['Protective', 'Quality-focused', 'Validation-driven', 'Duty-bound'],
      dialogues: [
        '⚠️ Overfitting detected! Validation loss diverging. I halt the training.',
        '✅ Model validation passed: Train loss 0.234, Val loss 0.241. Safe to store.',
        '🐋 Checkpoint verified. Quality score: 94%. Approving Walrus upload.',
        '🔍 Monitoring convergence: Epoch 47/100. Loss decreasing steadily.',
        '⚡ Early stopping triggered: No improvement for 15 epochs. Best model saved.',
        '📊 Gradient explosion detected! Norm: 847.3. I guard against instability.'
      ]
    }
  },
  {
    id: 'a5',
    name: 'Luna Mysticfang',
    role: AgentRole.ORACLE,
    description: 'Inference Optimization Agent. Mystical wolf who quantizes models, optimizes inference speed, implements model compression, and predicts with stored Walrus models.',
    capabilities: ['Model Quantization', 'Inference Acceleration', 'Model Compression', 'Prediction Optimization'],
    trustScore: 96,
    spriteSeed: 'wolf-mystic-violet-prophecy',
    avatar: '/lottie/happy fox.json',
    avatarType: 'lottie' as const,
    status: 'idle',
    personality: {
      traits: ['Performance-focused', 'Predictive', 'Optimization-driven', 'Speed-augmented'],
      dialogues: [
        '🚀 Model quantized to INT8. Inference speed: 12ms → 3ms. Accuracy: 98.4%.',
        '🐋 Loading model from Walrus blob 0xd4f2... Inference pipeline ready.',
        '⚡ Prediction complete: 847 samples/sec. Latency optimized 76%.',
        '🔮 Model compression: 342MB → 89MB. Knowledge distillation applied.',
        '✅ Batch inference: 10,000 predictions in 4.2s. Distributed across nodes.',
        '📊 Runtime optimization: ONNX export complete. Edge deployment ready.'
      ]
    }
  },
  {
    id: 'a6',
    name: 'Corvus Messenger',
    role: AgentRole.GLITCH,
    description: 'Federated Aggregation Agent. Swift raven who aggregates model updates from distributed nodes, applies federated averaging, coordinates consensus, and publishes to Walrus.',
    capabilities: ['Model Aggregation', 'Federated Averaging', 'Consensus Coordination', 'Update Publishing'],
    trustScore: 42,
    spriteSeed: 'raven-messenger-black-alert',
    avatar: '/lottie/Dragon.json',
    avatarType: 'lottie' as const,
    status: 'idle',
    personality: {
      traits: ['Aggregating', 'Fast-coordinating', 'Consensus-driven', 'Distributed'],
      dialogues: [
        '🔄 Aggregating updates from 6 nodes. Weighted averaging in progress...',
        '🐋 Federated model published to Walrus! Blob ID: 0xe5a7... Consensus: 94%.',
        '⚡ Received gradient from Reynard. 5/6 nodes synchronized. Awaiting Ursus...',
        '✅ Convergence achieved! Global model updated. Broadcasting to swarm.',
        '📊 Node contributions weighted: Eagleton 23%, Athena 19%, Others 58%.',
        '🚨 Synchronization delay detected! Node a4 lagging. Adjusting timeout.'
      ]
    }
  }
];

// Detailed agent abilities and API configurations
export const AGENT_ABILITIES = {
  'a0': { // Walrus Commander
    primary: 'Distributed Training Coordination',
    apis: ['Gemini AI', 'Walrus Protocol', 'BlockBerry API'],
    operations: ['Agent orchestration', 'Training coordination', 'Model aggregation', 'Resource allocation'],
    canExecute: ['coordinate_training', 'approve_checkpoints', 'manage_epochs', 'strategic_planning'],
    apiEndpoints: {
      'Gemini AI': 'https://generativelanguage.googleapis.com/v1beta',
      'Walrus Protocol': 'https://aggregator.walrus-testnet.walrus.space',
      'BlockBerry API': 'https://api.blockberry.one/sui/v1'
    }
  },
  'a1': { // Eagleton Skywatcher - Data Preprocessing
    primary: 'Data Preprocessing',
    apis: ['TwelveData API', 'Walrus Protocol'],
    operations: ['Data collection', 'Feature engineering', 'Normalization', 'Batch storage'],
    canExecute: ['preprocess_data', 'store_dataset', 'feature_extraction'],
    taskType: 'data_preprocessing',
    dataSource: 'Real-time market feeds',
    apiEndpoints: {
      'TwelveData API': 'https://api.twelvedata.com',
      'Walrus Protocol': 'https://aggregator.walrus-testnet.walrus.space'
    }
  },
  'a2': { // Athena Nightwing - Model Architecture
    primary: 'Model Architecture Design',
    apis: ['Gemini AI', 'Walrus Protocol'],
    operations: ['Network design', 'Layer optimization', 'Attention mechanisms', 'Architecture storage'],
    canExecute: ['design_network', 'optimize_layers', 'store_architecture'],
    taskType: 'model_architecture',
    dataSource: 'Neural architecture search',
    apiEndpoints: {
      'Gemini AI': 'https://generativelanguage.googleapis.com/v1beta',
      'Walrus Protocol': 'https://aggregator.walrus-testnet.walrus.space'
    }
  },
  'a3': { // Reynard Swift - Gradient Computation
    primary: 'Gradient Computation',
    apis: ['Walrus Protocol', 'BlockBerry API'],
    operations: ['Gradient calculation', 'Backpropagation', 'Batch optimization', 'Delta storage'],
    canExecute: ['compute_gradients', 'store_delta', 'optimize_batch'],
    taskType: 'gradient_computation',
    dataSource: 'Training batches',
    network: 'Sui Testnet',
    explorer: 'https://suiscan.xyz/testnet',
    apiEndpoints: {
      'Walrus Protocol': 'https://aggregator.walrus-testnet.walrus.space',
      'BlockBerry API': 'https://api.blockberry.one/sui/v1'
    }
  },
  'a4': { // Ursus Guardian - Model Validation
    primary: 'Model Validation',
    apis: ['Walrus Protocol', 'Gemini AI'],
    operations: ['Convergence validation', 'Overfitting detection', 'Loss monitoring', 'Quality assurance'],
    canExecute: ['validate_model', 'detect_overfitting', 'monitor_convergence'],
    taskType: 'model_validation',
    apiEndpoints: {
      'Walrus Protocol': 'https://aggregator.walrus-testnet.walrus.space',
      'Gemini AI': 'https://generativelanguage.googleapis.com/v1beta'
    }
  },
  'a5': { // Luna Mysticfang - Inference Optimization
    primary: 'Inference Optimization',
    apis: ['Gemini AI', 'Walrus Protocol'],
    operations: ['Model quantization', 'Inference acceleration', 'Model compression', 'Prediction optimization'],
    canExecute: ['quantize_model', 'optimize_inference', 'compress_model'],
    taskType: 'inference_optimization',
    dataSource: 'Trained models',
    apiEndpoints: {
      'Gemini AI': 'https://generativelanguage.googleapis.com/v1beta',
      'Walrus Protocol': 'https://aggregator.walrus-testnet.walrus.space'
    }
  },
  'a6': { // Corvus Messenger - Federated Aggregation
    primary: 'Federated Aggregation',
    apis: ['Walrus Protocol', 'BlockBerry API'],
    operations: ['Model aggregation', 'Federated averaging', 'Consensus coordination', 'Update publishing'],
    canExecute: ['aggregate_models', 'coordinate_consensus', 'publish_global_model'],
    taskType: 'federated_aggregation',
    apiEndpoints: {
      'Walrus Protocol': 'https://aggregator.walrus-testnet.walrus.space',
      'BlockBerry API': 'https://api.blockberry.one/sui/v1'
    }
  }
};

export const INITIAL_LOGS: any[] = [
  { id: 'sys-1', timestamp: '10:00:00', type: 'SYSTEM', content: '🐋 WALRUS AGENTS: Distributed Training Network Initialized' },
  { id: 'sys-2', timestamp: '10:00:01', type: 'SYSTEM', content: '✅ Walrus Protocol Storage: Connected to Testnet' },
  { id: 'sys-3', timestamp: '10:00:02', type: 'SYSTEM', content: '🔗 Sui Network (Testnet): Agent Registry Loaded' },
  { id: 'sys-4', timestamp: '10:00:03', type: 'SYSTEM', content: '📊 BlockBerry API: Mainnet Data Pipeline Active' },
  { id: 'sys-5', timestamp: '10:00:04', type: 'WALRUS', content: '🤖 7 Agents Ready for Federated Learning' },
];