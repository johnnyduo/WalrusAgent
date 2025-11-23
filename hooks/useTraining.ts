// React hook for managing agent training
import { useState, useCallback } from 'react';
import { useSuiWallet } from './useSuiWallet';
import { trainingService } from '../services/trainingService';
import { walrusService } from '../services/walrusService';
import { CONTRACTS_DEPLOYED, REWARD_POOL_ID } from '../config/suiWalletConfig';

export interface UseTrainingReturn {
  startTraining: (agentId: string, datasetBlobId?: string) => Promise<string>;
  submitContribution: (agentId: string, delta: number[], epoch: number) => Promise<string>;
  aggregateEpoch: (agentId: string, epoch: number) => Promise<string>;
  getTrainingStats: (agentId: string) => ReturnType<typeof trainingService.getTrainingStats>;
  isTraining: boolean;
  error: Error | null;
}

export const useTraining = (): UseTrainingReturn => {
  const { address } = useSuiWallet();
  const [isTraining, setIsTraining] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const startTraining = useCallback(async (
    agentId: string,
    datasetBlobId?: string
  ): Promise<string> => {
    try {
      setIsTraining(true);
      setError(null);

      // Demo Mode: Skip Walrus upload if contracts not deployed
      let blobId = datasetBlobId;
      if (!blobId) {
        if (!CONTRACTS_DEPLOYED) {
          // Demo mode - use local simulated blob ID
          console.log('🎮 Demo Mode: Simulating training without Walrus upload');
          blobId = `demo_training_${agentId}_${Date.now()}`;
          
          // Store synthetic data locally
          const syntheticData = {
            inputs: Array.from({ length: 100 }, () => 
              Array.from({ length: 10 }, () => Math.random())
            ),
            labels: Array.from({ length: 100 }, () => {
              const label = Array(3).fill(0);
              label[Math.floor(Math.random() * 3)] = 1;
              return label;
            })
          };
          localStorage.setItem(`training_dataset_${blobId}`, JSON.stringify(syntheticData));
        } else {
          // Production mode - upload to Walrus
          console.log('📦 Generating synthetic dataset for Walrus...');
          const syntheticData = {
            inputs: Array.from({ length: 100 }, () => 
              Array.from({ length: 10 }, () => Math.random())
            ),
            labels: Array.from({ length: 100 }, () => {
              const label = Array(3).fill(0);
              label[Math.floor(Math.random() * 3)] = 1;
              return label;
            })
          };

          blobId = await walrusService.uploadDatasetChunk(syntheticData.inputs, {
            chunkId: 0,
            totalChunks: 1,
            datasetName: `${agentId}_synthetic`,
            agentId
          });
        }
      }

      // Create training task
      const taskId = await trainingService.createTrainingTask(agentId, blobId, 10);
      
      console.log(`🎯 Training task created: ${taskId}`);
      setIsTraining(false);
      return taskId;
    } catch (err) {
      const error = err as Error;
      setError(error);
      setIsTraining(false);
      throw error;
    }
  }, []);

  const submitContribution = useCallback(async (
    agentId: string,
    delta: number[],
    epoch: number
  ): Promise<string> => {
    try {
      if (!address) {
        throw new Error('Wallet not connected');
      }

      setIsTraining(true);
      setError(null);

      const blobId = await trainingService.submitContribution(
        address,
        agentId,
        delta,
        epoch
      );

      console.log(`✅ Contribution submitted: ${blobId}`);
      setIsTraining(false);
      return blobId;
    } catch (err) {
      const error = err as Error;
      setError(error);
      setIsTraining(false);
      throw error;
    }
  }, [address]);

  const aggregateEpoch = useCallback(async (
    agentId: string,
    epoch: number
  ): Promise<string> => {
    try {
      setIsTraining(true);
      setError(null);

      // Get latest model version
      const latestVersion = trainingService.getLatestModelVersion(agentId);
      const baseWeightsBlobId = latestVersion?.weightsBlobId;

      const newWeightsBlobId = await trainingService.aggregateDeltas(
        agentId,
        epoch,
        baseWeightsBlobId
      );

      console.log(`💾 New model version: ${newWeightsBlobId}`);
      setIsTraining(false);
      return newWeightsBlobId;
    } catch (err) {
      const error = err as Error;
      setError(error);
      setIsTraining(false);
      throw error;
    }
  }, []);

  const getTrainingStats = useCallback((agentId: string) => {
    return trainingService.getTrainingStats(agentId);
  }, []);

  return {
    startTraining,
    submitContribution,
    aggregateEpoch,
    getTrainingStats,
    isTraining,
    error
  };
};
