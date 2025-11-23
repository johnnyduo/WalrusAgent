// Training Worker - Runs model training in a Web Worker
// Uses TensorFlow.js for lightweight model training in the browser

import * as tf from '@tensorflow/tfjs';

export interface TrainingConfig {
  agentId: string;
  modelArchitecture: 'simple' | 'complex';
  learningRate: number;
  batchSize: number;
  epochs: number;
}

export interface TrainingData {
  inputs: number[][];
  labels: number[][];
}

export interface TrainingResult {
  weights: number[];
  delta: number[];
  loss: number;
  accuracy: number;
  epoch: number;
}

/**
 * Simple feedforward neural network for agent training
 */
function createModel(inputSize: number, outputSize: number, architecture: 'simple' | 'complex'): tf.Sequential {
  const model = tf.sequential();
  
  if (architecture === 'simple') {
    // Simple architecture: input -> hidden(32) -> output
    model.add(tf.layers.dense({
      units: 32,
      activation: 'relu',
      inputShape: [inputSize]
    }));
    model.add(tf.layers.dense({
      units: outputSize,
      activation: 'softmax'
    }));
  } else {
    // Complex architecture: input -> hidden(64) -> hidden(32) -> output
    model.add(tf.layers.dense({
      units: 64,
      activation: 'relu',
      inputShape: [inputSize]
    }));
    model.add(tf.layers.dropout({ rate: 0.2 }));
    model.add(tf.layers.dense({
      units: 32,
      activation: 'relu'
    }));
    model.add(tf.layers.dense({
      units: outputSize,
      activation: 'softmax'
    }));
  }
  
  return model;
}

/**
 * Train a model on provided data
 */
export async function trainModel(
  config: TrainingConfig,
  data: TrainingData,
  initialWeights?: number[]
): Promise<TrainingResult> {
  console.log(`🤖 Training agent ${config.agentId}...`);
  
  // Convert data to tensors
  const xs = tf.tensor2d(data.inputs);
  const ys = tf.tensor2d(data.labels);
  
  const inputSize = data.inputs[0].length;
  const outputSize = data.labels[0].length;
  
  // Create or load model
  const model = createModel(inputSize, outputSize, config.modelArchitecture);
  
  // Load initial weights if provided
  if (initialWeights && initialWeights.length > 0) {
    const weights = model.getWeights();
    let offset = 0;
    
    const newWeights = weights.map(w => {
      const shape = w.shape;
      const size = w.size;
      const weightData = initialWeights.slice(offset, offset + size);
      offset += size;
      return tf.tensor(weightData, shape);
    });
    
    model.setWeights(newWeights);
  }
  
  // Compile model
  model.compile({
    optimizer: tf.train.adam(config.learningRate),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  });
  
  // Store initial weights for delta calculation
  const initialModelWeights = model.getWeights().map(w => Array.from(w.dataSync()));
  
  // Train model
  const history = await model.fit(xs, ys, {
    epochs: config.epochs,
    batchSize: config.batchSize,
    shuffle: true,
    verbose: 0,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        if (epoch % 10 === 0) {
          console.log(`Epoch ${epoch}: loss=${logs?.loss.toFixed(4)}, acc=${logs?.acc.toFixed(4)}`);
        }
      }
    }
  });
  
  // Get final weights
  const finalWeights = model.getWeights();
  const flatWeights: number[] = [];
  finalWeights.forEach(w => {
    flatWeights.push(...Array.from(w.dataSync()));
  });
  
  // Calculate delta (gradient update)
  const delta: number[] = [];
  let idx = 0;
  initialModelWeights.forEach(initWeights => {
    initWeights.forEach(w => {
      delta.push(flatWeights[idx] - w);
      idx++;
    });
  });
  
  // Get training metrics
  const loss = history.history.loss[history.history.loss.length - 1] as number;
  const accuracy = history.history.acc ? (history.history.acc[history.history.acc.length - 1] as number) : 0;
  
  // Cleanup
  xs.dispose();
  ys.dispose();
  model.dispose();
  
  console.log(`✅ Training complete: loss=${loss.toFixed(4)}, acc=${accuracy.toFixed(4)}`);
  
  return {
    weights: flatWeights,
    delta,
    loss,
    accuracy,
    epoch: config.epochs
  };
}

/**
 * Generate synthetic training data for demonstration
 */
export function generateSyntheticData(samples: number, inputSize: number, outputSize: number): TrainingData {
  const inputs: number[][] = [];
  const labels: number[][] = [];
  
  for (let i = 0; i < samples; i++) {
    // Random input
    const input = Array.from({ length: inputSize }, () => Math.random());
    inputs.push(input);
    
    // Random one-hot label
    const label = Array(outputSize).fill(0);
    label[Math.floor(Math.random() * outputSize)] = 1;
    labels.push(label);
  }
  
  return { inputs, labels };
}

/**
 * Aggregate multiple deltas into a single update
 */
export function aggregateDeltas(deltas: number[][]): number[] {
  if (deltas.length === 0) return [];
  
  const aggregated = new Array(deltas[0].length).fill(0);
  
  deltas.forEach(delta => {
    delta.forEach((value, idx) => {
      aggregated[idx] += value / deltas.length;
    });
  });
  
  return aggregated;
}

/**
 * Apply delta to weights
 */
export function applyDelta(weights: number[], delta: number[]): number[] {
  return weights.map((w, i) => w + (delta[i] || 0));
}
