// Decentralized AI Training Service
// Handles model training, delta aggregation, and contribution tracking

import { walrusService } from './walrusService';
import { AGENT_PACKAGE_ID, REWARD_POOL_ID, CONTRACTS_DEPLOYED } from '../config/suiWalletConfig';
import * as tf from '@tensorflow/tfjs';

export interface TrainingContribution {
  contributorAddress: string;
  agentId: string;
  deltaBlobId: string;
  epoch: number;
  timestamp: number;
  reward?: number;
  txDigest?: string; // Sui transaction digest
}

export interface ModelVersion {
  version: number;
  weightsBlobId: string;
  agentId: string;
  epoch: number;
  accuracy: number;
  loss: number;
  timestamp: number;
  contributors: string[];
}

export interface TrainingTask {
  taskId: string;
  agentId: string;
  datasetBlobId: string;
  currentVersion: number;
  status: 'active' | 'completed' | 'paused';
  totalEpochs: number;
  currentEpoch: number;
  participants: number;
}

class TrainingService {
  private contributions: Map<string, TrainingContribution[]> = new Map();
  private modelVersions: Map<string, ModelVersion[]> = new Map();
  private activeTasks: Map<string, TrainingTask> = new Map();

  constructor() {
    this.loadFromLocalStorage();
  }

  /**
   * Initialize a new training task for an agent
   */
  async createTrainingTask(
    agentId: string,
    datasetBlobId: string,
    totalEpochs: number = 100
  ): Promise<string> {
    const taskId = `task_${agentId}_${Date.now()}`;
    
    const task: TrainingTask = {
      taskId,
      agentId,
      datasetBlobId,
      currentVersion: 0,
      status: 'active',
      totalEpochs,
      currentEpoch: 0,
      participants: 0,
    };

    this.activeTasks.set(taskId, task);
    this.saveToLocalStorage();

    console.log(`🎯 Training task created: ${taskId}`);
    return taskId;
  }

  /**
   * Submit a training contribution (model delta)
   */
  async submitContribution(
    contributorAddress: string,
    agentId: string,
    delta: Float32Array | number[],
    epoch: number,
    learningRate: number = 0.001
  ): Promise<string> {
    // Upload delta to Walrus
    const deltaBlobId = await walrusService.uploadModelDelta(delta, {
      version: epoch,
      agentId,
      contributorAddress,
      epoch,
      learningRate,
    });

    // Track contribution
    const contribution: TrainingContribution = {
      contributorAddress,
      agentId,
      deltaBlobId,
      epoch,
      timestamp: Date.now(),
    };

    if (!this.contributions.has(agentId)) {
      this.contributions.set(agentId, []);
    }
    this.contributions.get(agentId)!.push(contribution);

    this.saveToLocalStorage();

    console.log(`✅ Contribution submitted: ${deltaBlobId}`);
    return deltaBlobId;
  }

  /**
   * Aggregate multiple deltas into a new model version
   */
  async aggregateDeltas(
    agentId: string,
    epoch: number,
    baseWeightsBlobId?: string
  ): Promise<string> {
    // Get contributions for this epoch
    const contributions = this.contributions.get(agentId) || [];
    const epochContributions = contributions.filter(c => c.epoch === epoch);

    if (epochContributions.length === 0) {
      throw new Error(`No contributions found for agent ${agentId} epoch ${epoch}`);
    }

    console.log(`📊 Aggregating ${epochContributions.length} deltas for ${agentId}`);

    // Load base weights
    let baseWeights: number[] = [];
    if (baseWeightsBlobId) {
      const baseModel = await walrusService.getModelWeights(baseWeightsBlobId);
      baseWeights = baseModel.weights;
    } else {
      // Initialize with zeros if no base
      const firstDelta = await walrusService.getModelDelta(epochContributions[0].deltaBlobId);
      baseWeights = new Array(firstDelta.delta.length).fill(0);
    }

    // Aggregate deltas using averaging
    const aggregatedWeights = [...baseWeights];
    
    for (const contribution of epochContributions) {
      const deltaData = await walrusService.getModelDelta(contribution.deltaBlobId);
      const delta = deltaData.delta;
      
      // Apply delta to weights
      for (let i = 0; i < aggregatedWeights.length && i < delta.length; i++) {
        aggregatedWeights[i] += delta[i] / epochContributions.length;
      }
    }

    // Upload aggregated weights to Walrus
    const newWeightsBlobId = await walrusService.uploadModelWeights(
      aggregatedWeights,
      {
        version: epoch,
        architecture: 'federated-avg',
        agentId,
        epoch,
      }
    );

    // Create model version record
    const version: ModelVersion = {
      version: epoch,
      weightsBlobId: newWeightsBlobId,
      agentId,
      epoch,
      accuracy: 0, // TODO: Evaluate on validation set
      loss: 0,
      timestamp: Date.now(),
      contributors: epochContributions.map(c => c.contributorAddress),
    };

    if (!this.modelVersions.has(agentId)) {
      this.modelVersions.set(agentId, []);
    }
    this.modelVersions.get(agentId)!.push(version);

    this.saveToLocalStorage();

    console.log(`💾 New model version created: ${newWeightsBlobId}`);
    return newWeightsBlobId;
  }

  /**
   * Get contributions for an agent
   */
  getContributions(agentId: string): TrainingContribution[] {
    return this.contributions.get(agentId) || [];
  }

  /**
   * Get model versions for an agent
   */
  getModelVersions(agentId: string): ModelVersion[] {
    return this.modelVersions.get(agentId) || [];
  }

  /**
   * Get latest model version for an agent
   */
  getLatestModelVersion(agentId: string): ModelVersion | null {
    const versions = this.modelVersions.get(agentId) || [];
    return versions.length > 0 ? versions[versions.length - 1] : null;
  }

  /**
   * Get active training tasks
   */
  getActiveTasks(): TrainingTask[] {
    return Array.from(this.activeTasks.values());
  }

  /**
   * Get training task by ID
   */
  getTask(taskId: string): TrainingTask | undefined {
    return this.activeTasks.get(taskId);
  }

  /**
   * Update training task status
   */
  updateTaskStatus(taskId: string, status: 'active' | 'completed' | 'paused'): void {
    const task = this.activeTasks.get(taskId);
    if (task) {
      task.status = status;
      this.saveToLocalStorage();
    }
  }

  /**
   * Calculate contributor rewards based on participation
   */
  calculateRewards(agentId: string, epoch: number): Map<string, number> {
    const contributions = this.contributions.get(agentId) || [];
    const epochContributions = contributions.filter(c => c.epoch === epoch);
    
    const rewards = new Map<string, number>();
    const baseReward = 100; // Base reward units per contribution
    
    for (const contribution of epochContributions) {
      const currentReward = rewards.get(contribution.contributorAddress) || 0;
      rewards.set(contribution.contributorAddress, currentReward + baseReward);
    }
    
    return rewards;
  }

  /**
   * Get training statistics for an agent
   */
  getTrainingStats(agentId: string): {
    totalContributions: number;
    totalVersions: number;
    uniqueContributors: number;
    latestEpoch: number;
    latestAccuracy: number;
    totalContributors: number;
    rewardsEarned: number;
    lastBlobId?: string;
  } {
    const contributions = this.contributions.get(agentId) || [];
    const versions = this.modelVersions.get(agentId) || [];
    const uniqueContributors = new Set(contributions.map(c => c.contributorAddress)).size;
    const latestVersion = versions.length > 0 ? versions[versions.length - 1] : null;

    return {
      totalContributions: contributions.length,
      totalVersions: versions.length,
      uniqueContributors,
      latestEpoch: latestVersion?.epoch || 0,
      latestAccuracy: latestVersion?.accuracy || 0,
      totalContributors: uniqueContributors,
      rewardsEarned: contributions.length * 50, // 50 SUI per contribution
      lastBlobId: latestVersion?.weightsBlobId,
    };
  }

  /**
   * Record a completed training session with updated metrics
   */
  recordTrainingSession(
    agentId: string,
    contributorAddress: string,
    blobId: string,
    metrics: {
      accuracy: number;
      loss: number;
      epoch: number;
      txDigest?: string;
    }
  ): void {
    // Create a new model version
    const version: ModelVersion = {
      version: metrics.epoch,
      weightsBlobId: blobId,
      agentId,
      epoch: metrics.epoch,
      accuracy: metrics.accuracy,
      loss: metrics.loss,
      timestamp: Date.now(),
      contributors: [contributorAddress],
    };

    if (!this.modelVersions.has(agentId)) {
      this.modelVersions.set(agentId, []);
    }
    this.modelVersions.get(agentId)!.push(version);

    // Record contribution
    const contribution: TrainingContribution = {
      contributorAddress,
      agentId,
      deltaBlobId: blobId,
      epoch: metrics.epoch,
      timestamp: Date.now(),
      reward: 50,
      txDigest: metrics.txDigest,
    };

    if (!this.contributions.has(agentId)) {
      this.contributions.set(agentId, []);
    }
    this.contributions.get(agentId)!.push(contribution);

    // Save to localStorage
    this.saveToLocalStorage();

    console.log(`✅ Training session recorded for agent ${agentId}, epoch ${metrics.epoch}`);
  }

  /**
   * Load data from localStorage
   */
  private loadFromLocalStorage(): void {
    try {
      const contributionsData = localStorage.getItem('training_contributions');
      if (contributionsData) {
        const parsed = JSON.parse(contributionsData);
        this.contributions = new Map(Object.entries(parsed));
      }

      const versionsData = localStorage.getItem('model_versions');
      if (versionsData) {
        const parsed = JSON.parse(versionsData);
        this.modelVersions = new Map(Object.entries(parsed));
      }

      const tasksData = localStorage.getItem('training_tasks');
      if (tasksData) {
        const parsed = JSON.parse(tasksData);
        this.activeTasks = new Map(Object.entries(parsed));
      }
    } catch (error) {
      console.error('Error loading training data from localStorage:', error);
    }
  }

  /**
   * Save data to localStorage
   */
  private saveToLocalStorage(): void {
    try {
      localStorage.setItem(
        'training_contributions',
        JSON.stringify(Object.fromEntries(this.contributions))
      );
      localStorage.setItem(
        'model_versions',
        JSON.stringify(Object.fromEntries(this.modelVersions))
      );
      localStorage.setItem(
        'training_tasks',
        JSON.stringify(Object.fromEntries(this.activeTasks))
      );
    } catch (error) {
      console.error('Error saving training data to localStorage:', error);
    }
  }
}

// Export singleton instance
export const trainingService = new TrainingService();
