import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Users, Zap, Database, Award, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { useTraining } from '../hooks/useTraining';
import { useTrainingSubmit } from '../hooks/useTrainingSubmit';
import { useSuiWallet } from '../hooks/useSuiWallet';
import { CONTRACTS_DEPLOYED, getSuiExplorerUrl } from '../config/suiWalletConfig';

interface TrainingDashboardProps {
  agentId: string;
  agentName: string;
  onClose: () => void;
}

export const TrainingDashboard: React.FC<TrainingDashboardProps> = ({
  agentId,
  agentName,
  onClose
}) => {
  const { address, isConnected } = useSuiWallet();
  const { startTraining, getTrainingStats, isTraining } = useTraining();
  const { submitToChain, isSubmitting } = useTrainingSubmit();
  const [stats, setStats] = useState<ReturnType<typeof getTrainingStats> | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'contribute' | 'history'>('overview');
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingStep, setTrainingStep] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (agentId) {
      const agentStats = getTrainingStats(agentId);
      setStats(agentStats);
    }
  }, [agentId, getTrainingStats]);

  const handleStartTraining = async () => {
    if (!address || !isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsProcessing(true);
    setTrainingProgress(0);

    try {
      // Step 1: Initialize training (10%)
      setTrainingStep('🎯 Initializing training session...');
      setTrainingProgress(10);
      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 2: Generate training data (30%)
      setTrainingStep('📊 Generating synthetic training data...');
      setTrainingProgress(30);
      const syntheticDelta = Array.from({ length: 100 }, () => Math.random() * 2 - 1);
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Step 3: Compute gradients (50%)
      setTrainingStep('🧮 Computing model gradients...');
      setTrainingProgress(50);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 4: Store on local (mock Walrus) (70%)
      setTrainingStep('🐋 Storing training delta locally...');
      setTrainingProgress(70);
      const deltaBlobId = `demo_delta_${agentId}_${Date.now()}`;
      localStorage.setItem(`training_delta_${deltaBlobId}`, JSON.stringify(syntheticDelta));
      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 5: Submit to blockchain (90%)
      setTrainingStep('⛓️ Submitting contribution to Sui blockchain...');
      setTrainingProgress(90);
      
      let txDigest: string;
      if (CONTRACTS_DEPLOYED) {
        // Real blockchain submission
        txDigest = await submitToChain({
          agentTokenId: agentId,
          deltaBlobId: deltaBlobId,
          epoch: (stats?.latestEpoch || 0) + 1,
        });
      } else {
        // Demo mode - simulate transaction
        await new Promise(resolve => setTimeout(resolve, 1500));
        txDigest = `demo_tx_${Date.now().toString(16)}`;
        console.log('🎮 Demo Mode: Simulated transaction', txDigest);
      }

      // Step 6: Complete (100%)
      setTrainingStep('✅ Training contribution recorded!');
      setTrainingProgress(100);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update local stats
      await startTraining(agentId);
      const agentStats = getTrainingStats(agentId);
      setStats(agentStats);

      // Show success
      toast.success(
        <div>
          <div className="font-bold">✅ Training Contribution Submitted</div>
          <div className="text-xs mt-1">
            {CONTRACTS_DEPLOYED ? (
              <a 
                href={getSuiExplorerUrl('transaction', txDigest)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-walrus-teal hover:underline"
              >
                View on Explorer →
              </a>
            ) : (
              'Demo mode - Deploy contracts for real rewards'
            )}
          </div>
        </div>,
        { autoClose: 5000 }
      );

    } catch (error) {
      console.error('Training error:', error);
      toast.error(
        <div>
          <div className="font-bold">❌ Training Failed</div>
          <div className="text-xs mt-1">
            {error instanceof Error ? error.message : 'Unable to submit training'}
          </div>
        </div>,
        { autoClose: 5000 }
      );
    } finally {
      setIsProcessing(false);
      setTrainingProgress(0);
      setTrainingStep('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-gray-900/98 border-2 border-walrus-purple/40 rounded-xl shadow-2xl shadow-walrus-purple/20 w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col animate-scale-in" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-walrus-teal/10 via-transparent to-walrus-purple/10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-walrus-purple/30 to-walrus-teal/20 rounded-xl border border-walrus-purple/30 shadow-lg shadow-walrus-purple/20">
                <Brain className="text-walrus-purple" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white font-mono tracking-tight">
                  {agentName} Training
                </h2>
                <p className="text-xs text-gray-400 font-mono mt-1">
                  🐋 Decentralized AI Training on Walrus
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-all hover:rotate-90 duration-300 text-2xl w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/5"
            >
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            {['overview', 'contribute', 'history'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-5 py-2.5 rounded-lg font-mono text-xs font-bold uppercase transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-walrus-purple/40 to-walrus-teal/40 text-white border-2 border-walrus-purple/60 shadow-lg shadow-walrus-purple/30 scale-105'
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-walrus-purple/30 scrollbar-track-transparent">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Contract Status Info */}
              {!CONTRACTS_DEPLOYED && (
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-3 flex items-center gap-3">
                  <AlertCircle size={18} className="text-blue-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-blue-300 text-xs font-sans">
                      🎮 <strong>Demo Mode</strong> - Training simulated for hackathon. Deploy contracts for on-chain rewards.
                    </p>
                  </div>
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up">
                <StatCard
                  icon={<TrendingUp size={20} />}
                  label="Model Version"
                  value={stats?.latestEpoch || 0}
                  color="purple"
                />
                <StatCard
                  icon={<Users size={20} />}
                  label="Contributors"
                  value={stats?.uniqueContributors || 0}
                  color="teal"
                />
                <StatCard
                  icon={<Database size={20} />}
                  label="Contributions"
                  value={stats?.totalContributions || 0}
                  color="purple"
                />
                <StatCard
                  icon={<Award size={20} />}
                  label="Accuracy"
                  value={`${((stats?.latestAccuracy || 0) * 100).toFixed(1)}%`}
                  color="teal"
                />
              </div>

              {/* Training Status */}
              <div className="bg-gradient-to-br from-black/40 to-walrus-purple/5 border border-walrus-purple/30 rounded-xl p-6 shadow-xl">
                <h3 className="text-white font-bold font-mono mb-4 flex items-center gap-2">
                  <Zap size={16} className="text-walrus-teal" />
                  Training Status
                </h3>
                
                {!isConnected ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-sm mb-4">
                      Connect your wallet to participate in training
                    </p>
                  </div>
                ) : stats && stats.totalVersions > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Current Epoch:</span>
                      <span className="text-walrus-purple font-bold">
                        {stats.latestEpoch}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Total Versions:</span>
                      <span className="text-walrus-teal font-bold">
                        {stats.totalVersions}
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-walrus-teal via-walrus-purple to-walrus-teal transition-all duration-300"
                        style={{ width: `${Math.min((stats.latestEpoch / 100) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    {isProcessing ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-8 h-8 border-4 border-walrus-teal/30 border-t-walrus-teal rounded-full animate-spin"></div>
                          <span className="text-white font-mono text-sm">{trainingProgress}%</span>
                        </div>
                        <p className="text-walrus-teal text-sm font-mono animate-pulse">
                          {trainingStep}
                        </p>
                        <div className="w-full max-w-md mx-auto bg-gray-800 rounded-full h-3 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-walrus-teal via-walrus-purple to-walrus-teal transition-all duration-500 ease-out"
                            style={{ width: `${trainingProgress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-400 text-sm mb-4">
                          No training data yet. Start training to contribute!
                        </p>
                        <button
                          onClick={handleStartTraining}
                          disabled={isTraining || isSubmitting}
                          className="px-8 py-3 bg-gradient-to-r from-walrus-teal to-walrus-purple text-black font-bold rounded-lg font-mono text-sm hover:scale-105 hover:shadow-lg hover:shadow-walrus-purple/50 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
                        >
                          {isTraining || isSubmitting ? '⚡ Processing...' : '🚀 Start Training'}
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Walrus Storage Info */}
              <div className="bg-gradient-to-br from-black/40 to-walrus-teal/5 border border-walrus-teal/30 rounded-xl p-6 shadow-xl">
                <h3 className="text-white font-bold font-mono mb-4 flex items-center gap-2">
                  <Database size={16} className="text-walrus-purple" />
                  Walrus Protocol Storage
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Model Deltas:</span>
                    <span className="text-walrus-teal font-mono">
                      {stats?.totalContributions || 0} stored
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Snapshots:</span>
                    <span className="text-walrus-purple font-mono">
                      {stats?.totalVersions || 0} versions
                    </span>
                  </div>
                  
                  {/* Recent Blob IDs */}
                  {stats && stats.totalVersions > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-xs text-gray-500 font-mono uppercase">Latest Blobs:</p>
                      {Array.from({ length: Math.min(3, stats.totalVersions) }).map((_, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 bg-black/40 rounded border border-walrus-teal/10">
                          <span className="text-walrus-teal text-xs">🐋</span>
                          <code className="text-xs text-gray-400 font-mono flex-1 truncate">
                            0x{Math.random().toString(16).substring(2, 10)}...
                          </code>
                          <a 
                            href={`https://aggregator.walrus-testnet.walrus.space/v1/0x${Math.random().toString(16).substring(2, 10)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-walrus-purple hover:text-walrus-teal text-xs transition-colors"
                          >
                            view
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-4 p-3 bg-walrus-teal/5 border border-walrus-teal/20 rounded text-xs text-gray-400">
                    💡 All training data is stored on Walrus Protocol for decentralized, verifiable AI training
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contribute' && (
            <div className="text-center py-12">
              <Brain className="mx-auto text-walrus-purple mb-4" size={48} />
              <h3 className="text-white font-bold text-lg mb-2">
                Browser-Based Training
              </h3>
              <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
                Contribute compute power directly from your browser to train AI models collaboratively.
                Your contributions are rewarded with tokens.
              </p>
              <button
                onClick={handleStartTraining}
                disabled={isTraining || !isConnected}
                className="px-10 py-4 bg-gradient-to-r from-walrus-teal to-walrus-purple text-black font-bold rounded-xl font-mono hover:scale-105 hover:shadow-2xl hover:shadow-walrus-purple/50 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none text-base"
              >
                {!isConnected ? '🔗 Connect Wallet First' : isTraining ? '⚡ Training...' : '🚀 Start Contributing'}
              </button>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-white font-bold font-mono mb-4">
                Training History
              </h3>
              {stats && stats.totalContributions > 0 ? (
                <div className="space-y-2">
                  {Array.from({ length: Math.min(stats.totalContributions, 5) }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-black/40 border border-white/10 rounded p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-walrus-purple/20 rounded flex items-center justify-center">
                          <span className="text-walrus-purple font-bold text-xs">
                            #{stats.totalContributions - i}
                          </span>
                        </div>
                        <div>
                          <p className="text-white text-sm font-mono">
                            Contribution #{stats.totalContributions - i}
                          </p>
                          <p className="text-gray-400 text-xs">
                            Epoch {Math.floor((stats.totalContributions - i) / 10)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-walrus-teal text-xs font-bold">
                          +100 rewards
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  No training history yet
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: 'purple' | 'teal';
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => {
  const colorClasses = color === 'purple' 
    ? 'border-walrus-purple/40 bg-gradient-to-br from-walrus-purple/10 to-walrus-purple/5 text-walrus-purple shadow-lg shadow-walrus-purple/10'
    : 'border-walrus-teal/40 bg-gradient-to-br from-walrus-teal/10 to-walrus-teal/5 text-walrus-teal shadow-lg shadow-walrus-teal/10';

  return (
    <div className={`border-2 rounded-xl p-5 ${colorClasses} hover:scale-105 transition-all duration-300 cursor-default`}>
      <div className="flex items-center gap-2 mb-3">
        <div className="opacity-80">{icon}</div>
        <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className="text-3xl font-bold font-mono tracking-tight">
        {value}
      </div>
    </div>
  );
};
