# 🐋 WALRUS - Tokenized AI Agents

## Decentralized AI Training Network with NFT-Based Multi-Agent Coordination

> 🏆 **Built for Walrus Haulout Hackathon**  
> 🎯 **Category**: AI x Decentralized Storage  
> ⛓️ **Blockchain**: Sui Network (Testnet)  
> 🐋 **Storage**: Walrus Protocol with Seal Certification

**A production-ready platform featuring tokenized AI agents as NFTs on Sui blockchain. Each agent coordinates decentralized training directly in your browser, with all training data cryptographically stored on Walrus Protocol and contributions tracked on-chain.**

[![Sui](https://img.shields.io/badge/Sui-Testnet-4DA2FF?logo=sui)](https://suiscan.xyz/testnet)
[![Walrus](https://img.shields.io/badge/Walrus-Protocol-99EFE4)](https://walruscan.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-4.22-FF6F00?logo=tensorflow)](https://www.tensorflow.org/js)

<img width="3456" height="3740" alt="image" src="https://github.com/user-attachments/assets/145debf9-ae0d-428e-be0d-078ff0b4cd9b" />

### 📦 Deployed Contracts

**Network**: Sui Testnet  
**Package ID**: `0x5784dcccc3c786420465afed5f820779e61d2f950e2bca6a943b58d0cc4fc0f6`  
**Deployer**: `0xbf9cf662405b0ddcb7ffb02d8779e48b49def5468e87004ba4ab16edd62fedb7`  
**Deployed**: November 23, 2025  
**Transaction**: `EV7nzeeVcHnDF7aWzf2syb2Kzxkr9ooyYyNPE7tPedib`

**Contracts**:
- **Agent Registry**: `0xf50fb987a2e47aa51996766f36ad8d497a10d5c271dec638fcd8c8955d8739b3`
- **Training Rewards**: `0xcbe93ec27a9364f210216028f5fbdc86e016ed5cd9325ca94b09910569be59f0`

**Walrus Protocol**:  
🐋 Aggregator: `https://aggregator.walrus-testnet.walrus.space`  
🐋 Publisher: `https://publisher.walrus-testnet.walrus.space`  
🐋 System Object: `0x98ebc47370603fe81d9e15491b2f1443d619d1dab720d586e429ed233e1255c1`

🔗 **Live Demo**: [walrus-agent.vercel.app](https://walrus-agent.vercel.app/)  
🐋 **Walrus Scan**: [walruscan.com/testnet](https://walruscan.com/testnet)  
🔗 **Sui Explorer**: [suiscan.xyz/testnet](https://suiscan.xyz/testnet)

---

## 📋 Table of Contents

1. [Overview](#-overview)
2. [The Problem & Solution](#-the-problem--solution)
3. [Architecture](#-architecture)
4. [Key Features](#-key-features)
5. [Technology Stack](#-technology-stack)
6. [Getting Started](#-getting-started)
7. [How It Works](#-how-it-works)
8. [Walrus Integration](#-walrus-integration)
9. [Smart Contracts](#-smart-contracts)
10. [Project Structure](#-project-structure)
11. [Future Roadmap](#-future-roadmap)

---

## 🎯 Overview

<img width="1728" height="2099" alt="screencapture-localhost-3000-2025-11-24-08_58_30" src="https://github.com/user-attachments/assets/11ed532a-632d-4e87-8680-2190c2b918e2" />

**WALRUS** is a tokenized AI agent platform where each agent is an NFT on Sui blockchain. Built for the Walrus Haulout Hackathon, this platform demonstrates how blockchain and decentralized storage revolutionize AI training by making it:

✅ **Tokenized** - Each AI agent is a unique NFT with on-chain identity  
✅ **Decentralized** - Train models directly in your browser with TensorFlow.js  
✅ **Verifiable** - All training data cryptographically certified on Walrus  
✅ **Tradeable** - Agents are on-chain assets that can be transferred  
✅ **Transparent** - Every training session links to Walrus Seal certificates  
✅ **Permanent** - Training data preserved with 10-epoch storage guarantee

### What Makes This Special?

This isn't just a demo—it's a fully functional tokenized AI agent ecosystem with:
- **NFT-Based Agents**: Mint AI agents as Sui NFTs with metadata on Walrus
- **Multi-Agent Training**: 7 specialized agents coordinate training pipeline
- **Real ML Training**: 41-parameter neural network with actual backpropagation
- **Seal Certification**: Training gradients uploaded with cryptographic proof
- **On-Chain Tracking**: Agent registry and rewards system (deployed to Sui testnet)
- **Live Metrics**: Real-time loss/accuracy improvements during training

---

## 🌟 The Problem & Solution

### The Problem

Current AI training is:
- 🏢 **Centralized**: Only big tech has GPU clusters
- 💰 **Expensive**: Cloud GPUs cost $1-5/hour
- 🔒 **Opaque**: No visibility into training data or processes
- 🚫 **Inaccessible**: Individual developers can't participate
- 📦 **Siloed**: Training data locked in proprietary systems

### Our Solution

**Decentralized AI Training on Walrus Protocol**

```
Browser (TensorFlow.js) → Walrus Protocol → Sui Blockchain
        ↓                       ↓                ↓
   Real Training         Permanent Storage    Contribution Tracking
   41 Parameters         Seal Certified       Verified Records
```
<img width="561" height="423" alt="Screenshot 2568-11-24 at 10 55 35" src="https://github.com/user-attachments/assets/054fd8da-e016-4239-8069-a02a52736733" />

**How It Works:**
1. 🧠 **Train** - Run real neural network training in your browser (1-2 seconds)
2. 🐋 **Store** - Upload gradients to Walrus with Seal certification (~2-4 seconds)
3. ⛓️ **Verify** - Track contribution with localStorage persistence

**Result:** A fully decentralized and transparent AI training network where every participant can contribute and verify

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                         │
│  ┌────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │ React 19 UI    │  │ TensorFlow.js   │  │ Suiet Wallet │ │
│  │ Live Metrics   │  │ 41-Parameter NN │  │ Integration  │ │
│  └────────┬───────┘  └────────┬────────┘  └──────┬───────┘ │
└───────────┼──────────────────┼───────────────────┼─────────┘
            │                  │                   │
            ▼                  ▼                   ▼
┌───────────────────┐  ┌──────────────────┐  ┌─────────────┐
│  Walrus Protocol  │  │  Training Data   │  │ Sui Network │
│  ┌─────────────┐  │  │  ┌────────────┐  │  │ ┌─────────┐ │
│  │ 5 Publishers│  │  │  │ Model Wts  │  │  │ │Registry │ │
│  │ Failover    │  │  │  │ Gradients  │  │  │ │Rewards  │ │
│  │ Seal Cert   │  │  │  │ Embeddings │  │  │ │Metadata │ │
│  │ 10 Epochs   │  │  │  └────────────┘  │  │ └─────────┘ │
│  └─────────────┘  │  └──────────────────┘  └─────────────┘
└───────────────────┘                                        
     Permanent             Cryptographic          Immutable
     Storage               Verification           Records
```

### Complete End-to-End Flow

#### 1. **Agent Registration Flow**
```
User clicks "REGISTER AGENT"
    ↓
1. Upload metadata to Walrus
   - Agent name, role, description, capabilities
   - Returns: Walrus Blob ID (e.g., zUJ7BpeH3H8G...5-vTdDo8)
    ↓
2. Mint Agent NFT on Sui
   - Call: agent_registry::mint_agent(registry, name, role, blob_id)
   - Transaction creates Agent object
   - Returns: Sui Object ID (e.g., 0xBuewHaajoM...)
    ↓
3. Update UI
   - Display Agent Object ID in "On-Chain Identity" section
   - Display Walrus Blob ID in "Registration Details"
   - Show links to Suiscan and Walruscan explorers
   - Save to localStorage with wallet address as key
    ↓
✅ Agent registered and ready for training!
```

<img width="1728" height="4013" alt="screencapture-localhost-3000-2025-11-24-10_55_12" src="https://github.com/user-attachments/assets/67111cf8-ae9b-44de-9426-0e18c556f331" />

#### 2. **Training Contribution Flow**
```
User clicks "INITIATE TRAINING" or "Train" button
    ↓
1. Local Training (1-2 seconds)
   - TensorFlow.js trains 41-parameter neural network
   - 10 epochs × 100 samples
   - Live metrics: loss ↓, accuracy ↑
   - Extract model weights/gradients
    ↓
2. Upload to Walrus (2-4 seconds)
   - Package: weights + metadata (version, accuracy, timestamp)
   - Walrus SDK uploads to 5 publishers with failover
   - Seal certification for 10 epochs
   - Returns: Gradient Blob ID
    ↓
3. Record on Sui (Optional, 3-5 seconds)
   - Call: training_rewards::record_contribution(pool, agent_id, blob_id, epoch)
   - Creates TrainingContribution object
   - Allocates 0.001 SUI reward
   - Emits ContributionRecorded event
   - Returns: Transaction digest
    ↓
4. Persist Results
   - Save to localStorage: {walletAddress}_{agentId}_contributions
   - Display in Training History with blob links
   - Update agent's training_contributions count
    ↓
✅ Training contribution complete and verifiable!
```

#### 3. **Verification Flow**
```
Anyone can verify training history:
    ↓
1. Query Sui Blockchain
   - Get Agent object by Object ID
   - Read: metadata_blob_id, training_contributions, performance_score
    ↓
2. Retrieve from Walrus
   - Fetch agent metadata: walruscan.com/blob/{metadata_blob_id}
   - Fetch training gradients: walruscan.com/blob/{gradient_blob_id}
    ↓
3. Verify Integrity
   - Check Seal certification (cryptographic proof)
   - Validate epoch range (10 epochs = ~2 months storage)
   - Cross-reference with ContributionRecorded events
    ↓
✅ Fully transparent and verifiable training history!
```

4. **Retrieval Phase**
   ```
   Blob ID → Walrus Aggregator → Decompress → Load Model Weights
   ```

---

## ⚡ Key Features

### 🧠 Real Machine Learning
- **41-Parameter Neural Network**: 3→4→4→1 architecture with ReLU/Sigmoid
- **Actual Training**: Real backpropagation with Adam optimizer (not simulated)
- **Binary Classification**: Predicts agent task success probability
- **Live Metrics**: Watch loss decrease from ~0.7 to ~0.3 in real-time
- **Progressive Versioning**: Model version increments based on 60-100% accuracy threshold
- **Tensor Memory Management**: Proper cleanup to prevent memory leaks

### 🐋 Advanced Walrus Integration
**Production-ready Walrus Protocol features:**
- **Seal Certification** 🔏 - Every upload includes cryptographic integrity proof
- **10-Epoch Storage** - ~20 days of guaranteed data availability
- **5 Publisher Failover** - Automatic retry across multiple endpoints:
  - `walrus-testnet-publisher.nodes.guru:443`
  - `publisher.testnet.sui.rpcpool.com:443`
  - `walrus-testnet-publisher.bartestnet.com:443`
  - `walrus.krates.ai:443`
  - `wal-publisher-testnet.staketab.org:443`
- **4x Redundancy** - Data replicated across storage nodes
- **Rich Metadata** - Training metrics, model config, contributor address
- **Walrus Scan Links** - Direct explorer integration at `walruscan.com`
- **HTTP API** - `@mysten/walrus` SDK v0.8.4

**Storage Operations:**
```typescript
// Upload trained model weights with metadata
const result = await walrusService.uploadModelWeights(
  weights,        // Float32Array of model parameters
  modelVersion,   // Progressive version number
  accuracy,       // Normalized 60-100% threshold
  loss,          // Cross-entropy loss value
  walletAddress  // Contributor address
);
// Returns: { blobId, info: { certifiedEpoch, endEpoch } }
```

### 🤖 7 AI Agent Specialists
Each agent has a unique role in the distributed training pipeline:
- 🐋 **Walrus Commander** (a0) - Distributed training coordination & epoch management
- 🐟 **Flying Fish Scout** (a1) - Data preprocessing & feature engineering
- 🐙 **Octopus Architect** (a2) - Model architecture design & optimization
- 🐬 **Dolphin Trainer** (a3) - Gradient computation & backpropagation
- 🐢 **Sea Turtle Guardian** (a4) - Model validation & quality assurance
- 🪼 **Jellyfish Mystic** (a5) - Inference optimization & quantization
- 🦈 **Manta Ray Messenger** (a6) - Federated aggregation & consensus

### ⛓️ Sui Blockchain Integration
**Smart Contracts (DEPLOYED ✅):**

1. **Agent Registry** (`move/sources/agent_registry.move`)
   ```move
   public fun mint_agent(
     registry: &mut AgentRegistry,
     name: vector<u8>,
     role: vector<u8>,
     metadata_blob_id: vector<u8>,
     ctx: &mut TxContext
   ): Agent
   ```
   - Mints Agent NFTs with metadata stored on Walrus
   - Tracks agent profiles as on-chain objects with unique Object IDs
   - References Walrus blob IDs for agent metadata
   - Emits `AgentCreated` events with timestamp
   - Tracks model versions and training contributions
   - Registry Object: `0xf50fb987a2e47aa51996766f36ad8d497a10d5c271dec638fcd8c8955d8739b3`

2. **Training Rewards** (`move/sources/training_rewards.move`)
   ```move
   public fun record_contribution(
     pool: &mut RewardPool,
     agent_id: ID,
     delta_blob_id: vector<u8>,
     epoch: u64,
     ctx: &mut TxContext
   ): ID
   ```
   - Records training contributions with Walrus blob IDs
   - Creates TrainingContribution objects with rewards
   - Base reward: 0.001 SUI per contribution
   - Emits `ContributionRecorded` events
   - Supports reward claiming mechanism
   - Reward Pool: `0xcbe93ec27a9364f210216028f5fbdc86e016ed5cd9325ca94b09910569be59f0`

**Integration Flow:**
1. **Agent Registration**: Upload metadata to Walrus → Mint NFT on Sui → Store Object ID
2. **Training Session**: Train model → Upload gradients to Walrus → Record contribution on-chain
3. **Verification**: Query Sui for agent Object ID → Retrieve metadata from Walrus blob

### 📊 Production UI Features
- **React 19** - Latest concurrent rendering features
- **Live Training Metrics** - Real-time loss/accuracy with 600ms smooth animations
- **Toast Notifications** - Professional feedback system with Walrus/Sui links
- **Wallet Integration** - Suiet Wallet Kit with custom theme
- **Token Balances** - Display WAL + SUI with divider
- **Z-Index Management** - Proper dropdown layering (z-index: 9999)
- **Responsive Design** - Mobile and desktop optimized
- **LocalStorage Persistence** - Training stats saved across sessions
---

## 🛠️ Technology Stack

### Frontend
- **React 19** - Latest concurrent rendering features
- **TypeScript 5.6** - Type-safe development
- **Vite 5.4** - Lightning-fast build tool
- **TailwindCSS** - Utility-first styling
- **Framer Motion** - Smooth animations (600ms ease-out)
- **React Hot Toast** - Professional notifications

### Machine Learning
- **TensorFlow.js 4.22** - Browser-based neural networks
- **Custom Architecture**: 3→4→4→1 (41 parameters)
  - Input: trustScore, taskComplexity, networkLatency
  - Hidden: ReLU activation
  - Output: Sigmoid (success probability)
- **Adam Optimizer** - Adaptive learning rate
- **Binary Cross-Entropy Loss** - Classification objective

### Blockchain & Storage
- **Sui Blockchain** - Move smart contracts
- **Walrus Protocol** - Decentralized storage (@mysten/walrus v0.8.4)
- **Suiet Wallet Kit** - Wallet integration with custom theme

### Development Tools
- **ESLint + Prettier** - Code quality
- **TypeScript Strict Mode** - Type safety
- **Git** - Version control

---

## 🚀 Getting Started

### Prerequisites
```bash
# Node.js 20+ and npm
node --version  # v20.0.0+
npm --version   # 10.0.0+

# Git
git --version
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/walrus-agents.git
   cd walrus-agents
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional)
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```

### Quick Start Guide

**Step 1: Connect Your Wallet**
- Click "Connect Wallet" in the top right
- Select "Sui Wallet" from the list
- Approve the connection in your wallet extension

**Step 2: Register an Agent**
- Click "Create First Agent" on the landing page
- Choose a specialty (e.g., "Walrus Commander")
- Agent data is saved to localStorage with wallet address

**Step 3: Start Training**
- Navigate to Training Dashboard
- Click "Start Training" button
- Watch live metrics: Loss, Accuracy, Model Version, Contributors
- Training takes 1-2 seconds (10 epochs, 100 samples)

**Step 4: Upload to Walrus**
- After training completes, gradients upload automatically
- Upload takes 2-4 seconds with progress indicator
- Receive Walrus blob ID with Seal certification
- View on Walrus Scan explorer (link in toast)

**Step 5: View Results**
- Check "Training History" section for all sessions
- See model version increments (1 → 2 → 3...)
- View blob IDs with Walrus Scan links
- Training stats persist across browser sessions

---

## 📦 Walrus Integration Deep Dive

### Upload Operations

**1. Upload Model Weights**
```typescript
async uploadModelWeights(
  weights: Float32Array,
  modelVersion: number,
  accuracy: number,
  loss: number,
  contributorAddress: string
): Promise<WalrusUploadResult>
```
- Serializes Float32Array to JSON with metadata
- Adds Seal certification request
- Sets 10-epoch storage duration
- Returns blob ID and certification info

**2. Upload Model Delta (Gradients)**
```typescript
async uploadModelDelta(
  delta: Float32Array,
  baseVersion: number,
  contributorAddress: string
): Promise<WalrusUploadResult>
```
- Stores gradient updates for federated learning
- Includes base version reference
- Enables aggregation across multiple contributors

**3. Upload Dataset Chunk**
```typescript
async uploadDatasetChunk(
  data: TrainingData[],
  chunkIndex: number
): Promise<WalrusUploadResult>
```
- Shards large datasets across multiple blobs
- Enables distributed training data storage

### Download Operations

**Retrieve Blob by ID**
```typescript
const blob = await walrusService.downloadBlob(blobId);
const data = JSON.parse(blob);
const weights = new Float32Array(data.data);
```

### Walrus Scan Integration

Every upload links directly to Walrus Scan for transparency:
```
https://walruscan.com/testnet/blob/{blobId}
```

Users can verify:
- ✅ Seal certification status
- ✅ Storage duration (epochs)
- ✅ Redundancy level (4x)
- ✅ Upload timestamp
- ✅ Blob size and encoding
---

## ⛓️ Smart Contracts

### Agent Registry (`move/sources/agent_registry.move`)

**Purpose**: Manage AI agent profiles as on-chain NFTs

**Key Functions**:
```move
// Mint new agent NFT with Walrus metadata
public fun mint_agent(
  registry: &mut AgentRegistry,
  name: vector<u8>,
  role: vector<u8>,
  metadata_blob_id: vector<u8>,
  ctx: &mut TxContext
): Agent  // Returns Agent object to be transferred

// Update agent model after training
public fun update_model(
  agent: &mut Agent,
  new_weights_blob_id: vector<u8>,
  ctx: &mut TxContext
)

// Update agent performance score
public fun update_performance(
  agent: &mut Agent,
  new_score: u64,
  ctx: &mut TxContext
)
```

**Data Structures**:
```move
struct Agent has key, store {
  id: UID,
  name: String,
  role: String,
  owner: address,
  metadata_blob_id: String,           // Walrus blob for metadata
  model_version: u64,
  current_weights_blob_id: String,    // Walrus blob for weights
  training_contributions: u64,
  performance_score: u64,
  created_at: u64,
  updated_at: u64
}

struct AgentRegistry has key {
  id: UID,
  total_agents: u64,
  active_agents: u64
}
```

### Training Rewards (`move/sources/training_rewards.move`)

**Purpose**: Distribute SUI tokens for training contributions

**Key Functions**:
```move
// Record training contribution with Walrus blob
public fun record_contribution(
  pool: &mut RewardPool,
  agent_id: ID,
  delta_blob_id: vector<u8>,
  epoch: u64,
  ctx: &mut TxContext
): ID  // Returns TrainingContribution object ID

// Claim earned reward
public fun claim_reward(
  contribution: &mut TrainingContribution,
  ctx: &mut TxContext
): Coin<SUI>

// Fund the reward pool (admin only)
public fun fund_pool(
  _admin_cap: &RewardAdminCap,
  pool: &mut RewardPool,
  payment: Coin<SUI>
)

// Update reward rate (admin only)
public fun update_reward_rate(
  _admin_cap: &RewardAdminCap,
  pool: &mut RewardPool,
  new_rate: u64
)
```

**Data Structures**:
```move
struct TrainingContribution has key, store {
  id: UID,
  agent_id: ID,
  contributor: address,
  delta_blob_id: String,      // Walrus blob with gradients
  epoch: u64,
  reward_amount: u64,
  claimed: bool,
  timestamp: u64
}

struct RewardPool has key {
  id: UID,
  balance: Balance<SUI>,
  total_contributions: u64,
  total_rewards_claimed: u64,
  reward_per_contribution: u64  // 1_000_000 = 0.001 SUI
}
```

**Reward System**:
- Base reward: **0.001 SUI** per training contribution
- Rewards claimable after contribution is recorded
- Pool managed by admin with RewardAdminCap

**Deployment Status**: ✅ **DEPLOYED TO SUI TESTNET**
- Package: `0x5784dcccc3c786420465afed5f820779e61d2f950e2bca6a943b58d0cc4fc0f6`
- Agent Registry: `0xf50fb987a2e47aa51996766f36ad8d497a10d5c271dec638fcd8c8955d8739b3`
- Training Rewards: `0xcbe93ec27a9364f210216028f5fbdc86e016ed5cd9325ca94b09910569be59f0`
- [View on Suiscan](https://suiscan.xyz/testnet/object/0x5784dcccc3c786420465afed5f820779e61d2f950e2bca6a943b58d0cc4fc0f6)

---

## 🔮 Future Roadmap

### Q4 2025 - Foundation ✅
**Status**: Completed (November 2025)
- [x] Smart contracts deployed on Sui Testnet
- [x] Agent NFT minting with Walrus metadata storage
- [x] Real neural network training (41-parameter model)
- [x] Multi-agent coordination pipeline
- [x] Seal certification integration
- [x] Training dashboard with live metrics

### Q1 2026 - Mainnet Launch 🚀
**Target**: January - March 2026
- [ ] Deploy contracts to Sui Mainnet
- [ ] Token reward distribution system
- [ ] Enhanced training analytics dashboard
- [ ] Agent marketplace (buy/sell/trade NFT agents)
- [ ] Contributor leaderboard with rankings
- [ ] Mobile-responsive training interface

### Q2 2026 - Advanced Features 🔬
**Target**: April - June 2026
- [ ] Multi-agent federated learning coordination
- [ ] Custom dataset upload via Walrus
- [ ] Model versioning and rollback capabilities
- [ ] GPU acceleration with WebGPU
- [ ] Privacy-preserving training (differential privacy)
- [ ] Real-time agent collaboration visualization

### Q3 2026 - Ecosystem Growth 🌍
**Target**: July - September 2026
- [ ] SDK for third-party integration
- [ ] Cross-chain bridge (Ethereum, Solana)
- [ ] Enterprise training dashboard with team management
- [ ] Academic partnerships and research grants
- [ ] Developer documentation and tutorials
- [ ] Community governance via DAO

### Q4 2026 - Scale & Innovation 🌟
**Target**: October - December 2026
- [ ] Layer-2 scaling solution for high-volume training
- [ ] AI model marketplace with revenue sharing
- [ ] Advanced model architectures (transformers, CNNs)
- [ ] Integration with Sui DeFi protocols
- [ ] Global training competitions with prizes
- [ ] White-label solutions for enterprises

---

## 🏆 Hackathon Submission

**Track**: AI x Data  
**Repository**: [github.com/johnnyduo/WalrusAgent](https://github.com/johnnyduo/WalrusAgent)  
**Network**: Sui Testnet  
**Package ID**: `0x5784dcccc3c786420465afed5f820779e61d2f950e2bca6a943b58d0cc4fc0f6`  
**Deployer**: `0xbf9cf662405b0ddcb7ffb02d8779e48b49def5468e87004ba4ab16edd62fedb7`  
**Explorer**: [View on Suiscan](https://suiscan.xyz/testnet/object/0x5784dcccc3c786420465afed5f820779e61d2f950e2bca6a943b58d0cc4fc0f6)

**Built with ❤️ for the Walrus Haulout Hackathon** 🐋

3. **Blockchain-Coordinated AI**
   - Sui smart contracts manage agent registry and contributions
   - On-chain rewards incentivize quality training data
   - Transparent model evolution recorded on blockchain

4. **Democratized AI Training**
   - Anyone with a browser can contribute compute
   - No expensive GPU clusters required
   - Federated learning preserves data privacy

5. **Real-Time On-Chain Intelligence**
   - AI agents react to validator performance, network load, token prices
   - Market data widget shows live blockchain metrics
   - Training features derived from Sui ecosystem data

---

<div align="center">

© 2025 WALRUS AGENTS - Tokenized AI Agents. All rights reserved.

</div>
