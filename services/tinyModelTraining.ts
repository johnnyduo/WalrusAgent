// Tiny Neural Network for Real Browser Training
// Uses TensorFlow.js to train a small model that predicts agent performance

import * as tf from '@tensorflow/tfjs';

export interface TrainingResult {
  loss: number;
  accuracy: number;
  weights: number[];
  deltaWeights: number[];
  epoch: number;
  computeTime: number;
}

export interface ModelMetrics {
  trainingLoss: number[];
  validationLoss: number[];
  accuracy: number[];
  epochCount: number;
}

/**
 * Tiny Agent Performance Predictor
 * Predicts agent success rate based on: trust score, task complexity, network conditions
 */
export class TinyAgentModel {
  private model: tf.LayersModel | null = null;
  private previousWeights: number[] = [];
  
  /**
   * Create a tiny 3-layer neural network
   * Input: [trustScore, taskComplexity, networkLatency] (3 features)
   * Hidden: 4 neurons
   * Output: 1 neuron (success probability)
   */
  async initializeModel(): Promise<void> {
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({
          inputShape: [3],
          units: 4,
          activation: 'relu',
          kernelInitializer: 'randomNormal',
        }),
        tf.layers.dense({
          units: 4,
          activation: 'relu',
        }),
        tf.layers.dense({
          units: 1,
          activation: 'sigmoid',
        }),
      ],
    });

    this.model.compile({
      optimizer: tf.train.adam(0.01),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy'],
    });

    // Store initial weights
    this.previousWeights = await this.getWeightsAsArray();
    console.log('🧠 Tiny model initialized:', {
      totalParams: this.model.countParams(),
      layers: this.model.layers.length,
      weightSize: this.previousWeights.length,
    });
  }

  /**
   * Generate synthetic training data
   * Simulates agent task outcomes based on features
   */
  private generateTrainingData(batchSize: number = 32): {
    features: tf.Tensor2D;
    labels: tf.Tensor2D;
  } {
    const features: number[][] = [];
    const labels: number[][] = [];

    for (let i = 0; i < batchSize; i++) {
      // Features: [trustScore (0-1), taskComplexity (0-1), networkLatency (0-1)]
      const trustScore = Math.random();
      const taskComplexity = Math.random();
      const networkLatency = Math.random();

      // Success probability: higher trust + lower complexity + lower latency = higher success
      const successProb =
        0.4 * trustScore +
        0.3 * (1 - taskComplexity) +
        0.3 * (1 - networkLatency) +
        (Math.random() - 0.5) * 0.1; // Add noise

      features.push([trustScore, taskComplexity, networkLatency]);
      labels.push([successProb > 0.5 ? 1 : 0]);
    }

    return {
      features: tf.tensor2d(features),
      labels: tf.tensor2d(labels),
    };
  }

  /**
   * Train the model for one epoch
   * Returns real training metrics and weight deltas
   */
  async trainOneEpoch(
    batchSize: number = 32,
    onProgress?: (progress: number) => void
  ): Promise<TrainingResult> {
    if (!this.model) {
      throw new Error('Model not initialized');
    }

    const startTime = Date.now();

    // Generate training data
    const { features, labels } = this.generateTrainingData(batchSize);

    // Store weights before training
    const weightsBefore = await this.getWeightsAsArray();

    // Train for 1 epoch
    const history = await this.model.fit(features, labels, {
      epochs: 1,
      batchSize: 8,
      verbose: 0,
      callbacks: {
        onBatchEnd: (batch, logs) => {
          if (onProgress) {
            const progress = (batch / (batchSize / 8)) * 100;
            onProgress(Math.min(progress, 100));
          }
        },
      },
    });

    // Get weights after training
    const weightsAfter = await this.getWeightsAsArray();

    // Calculate weight deltas (gradient updates)
    const deltaWeights = weightsAfter.map(
      (w, i) => w - (weightsBefore[i] || 0)
    );

    // Calculate accuracy on validation set
    const validationData = this.generateTrainingData(16);
    const evalResult = this.model.evaluate(
      validationData.features,
      validationData.labels
    ) as tf.Scalar[];
    const accuracy = (await evalResult[1].data())[0];

    // Clean up tensors
    features.dispose();
    labels.dispose();
    validationData.features.dispose();
    validationData.labels.dispose();
    evalResult.forEach((t) => t.dispose());

    const computeTime = Date.now() - startTime;

    return {
      loss: history.history.loss[0] as number,
      accuracy: accuracy || 0,
      weights: weightsAfter,
      deltaWeights,
      epoch: 0,
      computeTime,
    };
  }

  /**
   * Get current model weights as flat array
   */
  private async getWeightsAsArray(): Promise<number[]> {
    if (!this.model) return [];

    const weights = this.model.getWeights();
    const arrays = await Promise.all(weights.map((w) => w.data()));
    const flat = arrays.reduce(
      (acc, arr) => acc.concat(Array.from(arr)),
      [] as number[]
    );

    // Dispose weight tensors
    weights.forEach((w) => w.dispose());

    return flat;
  }

  /**
   * Get model summary for display
   */
  getModelSummary(): {
    totalParams: number;
    layers: number;
    architecture: string;
  } {
    if (!this.model) {
      return { totalParams: 0, layers: 0, architecture: 'Not initialized' };
    }

    return {
      totalParams: this.model.countParams(),
      layers: this.model.layers.length,
      architecture: '3→4→4→1 (Agent Performance Predictor)',
    };
  }

  /**
   * Predict agent success probability
   */
  async predict(
    trustScore: number,
    taskComplexity: number,
    networkLatency: number
  ): Promise<number> {
    if (!this.model) return 0.5;

    const input = tf.tensor2d([[trustScore, taskComplexity, networkLatency]]);
    const prediction = this.model.predict(input) as tf.Tensor;
    const result = (await prediction.data())[0];

    input.dispose();
    prediction.dispose();

    return result;
  }

  /**
   * Dispose model and free memory
   */
  dispose(): void {
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }
  }
}

// Global instance for the app
let globalModel: TinyAgentModel | null = null;

export async function getGlobalModel(): Promise<TinyAgentModel> {
  if (!globalModel) {
    globalModel = new TinyAgentModel();
    await globalModel.initializeModel();
  }
  return globalModel;
}

export function disposeGlobalModel(): void {
  if (globalModel) {
    globalModel.dispose();
    globalModel = null;
  }
}
