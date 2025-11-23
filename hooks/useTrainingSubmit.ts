// Hook for submitting training contributions to Sui blockchain
import { useState, useCallback } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { useSuiWallet } from './useSuiWallet';
import { AGENT_PACKAGE_ID, REWARD_POOL_ID } from '../config/suiWalletConfig';

export interface TrainingSubmission {
  agentTokenId: string;
  deltaBlobId: string;
  epoch: number;
}

export interface UseTrainingSubmitReturn {
  submitToChain: (submission: TrainingSubmission) => Promise<string>;
  isSubmitting: boolean;
  error: Error | null;
}

export const useTrainingSubmit = (): UseTrainingSubmitReturn => {
  const { signAndExecute } = useSuiWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submitToChain = useCallback(async (submission: TrainingSubmission): Promise<string> => {
    try {
      setIsSubmitting(true);
      setError(null);

      console.log('📤 Submitting training contribution to Sui blockchain:', submission);

      // Create transaction
      const tx = new Transaction();

      // Convert deltaBlobId to bytes
      const blobIdBytes = Array.from(new TextEncoder().encode(submission.deltaBlobId));

      // Call record_contribution function
      tx.moveCall({
        target: `${AGENT_PACKAGE_ID}::training_rewards::record_contribution`,
        arguments: [
          tx.object(REWARD_POOL_ID), // pool
          tx.pure.id(submission.agentTokenId), // agent_id
          tx.pure.vector('u8', blobIdBytes), // delta_blob_id
          tx.pure.u64(submission.epoch), // epoch
        ],
      });

      // Execute transaction
      const result = await signAndExecute({
        transaction: tx,
      });

      if (!result?.digest) {
        throw new Error('Transaction failed - no digest returned');
      }

      console.log('✅ Training contribution recorded on-chain:', result.digest);
      setIsSubmitting(false);
      return result.digest;

    } catch (err) {
      const error = err as Error;
      console.error('❌ Training submission failed:', error);
      setError(error);
      setIsSubmitting(false);
      throw error;
    }
  }, [signAndExecute]);

  return {
    submitToChain,
    isSubmitting,
    error,
  };
};
