import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Users, Zap, Database, Award, AlertCircle } from 'lucide-react';
import { useTraining } from '../hooks/useTraining';
import { useSuiWallet } from '../hooks/useSuiWallet';
import { CONTRACTS_DEPLOYED } from '../config/suiWalletConfig';

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
  const [stats, setStats] = useState<ReturnType<typeof getTrainingStats> | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'contribute' | 'history'>('overview');

  useEffect(() => {
    if (agentId) {
      const agentStats = getTrainingStats(agentId);
      setStats(agentStats);
    }
  }, [agentId, getTrainingStats]);

  const handleStartTraining = async () => {
    try {
      await startTraining(agentId);
      // Refresh stats
      const agentStats = getTrainingStats(agentId);
      setStats(agentStats);
    } catch (error) {
      console.error('Training error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900/95 border border-walrus-purple/30 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-walrus-teal/10 to-walrus-purple/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-walrus-purple/20 rounded-lg">
                <Brain className="text-walrus-purple" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-mono">
                  {agentName} Training
                </h2>
                <p className="text-xs text-gray-400 font-mono">
                  Decentralized AI Training on Walrus
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            {['overview', 'contribute', 'history'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 rounded font-mono text-xs font-bold uppercase transition-all ${
                  activeTab === tab
                    ? 'bg-walrus-purple/30 text-walrus-purple border border-walrus-purple/50'
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Contract Status Warning */}
              {!CONTRACTS_DEPLOYED && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle size={20} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-yellow-400 font-bold font-display mb-1">Contracts Not Deployed</h4>
                    <p className="text-yellow-400/80 text-sm font-sans">
                      Deploy the Move contracts to Sui Testnet to enable on-chain rewards. 
                      See <code className="font-mono text-xs bg-black/30 px-1 py-0.5 rounded">DEPLOY_GUIDE.md</code> for instructions.
                    </p>
                    <p className="text-yellow-400/60 text-xs mt-2 font-mono">
                      Training will work in simulation mode until contracts are deployed.
                    </p>
                  </div>
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <div className="bg-black/40 border border-walrus-purple/20 rounded-lg p-6">
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
                    <p className="text-gray-400 text-sm mb-4">
                      No training data yet. Start training to contribute!
                    </p>
                    <button
                      onClick={handleStartTraining}
                      disabled={isTraining}
                      className="px-6 py-3 bg-gradient-to-r from-walrus-teal to-walrus-purple text-black font-bold rounded font-mono text-sm hover:opacity-80 transition-opacity disabled:opacity-50"
                    >
                      {isTraining ? 'Initializing...' : 'Start Training'}
                    </button>
                  </div>
                )}
              </div>

              {/* Walrus Storage Info */}
              <div className="bg-black/40 border border-walrus-teal/20 rounded-lg p-6">
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
                className="px-8 py-4 bg-gradient-to-r from-walrus-teal to-walrus-purple text-black font-bold rounded-lg font-mono hover:opacity-80 transition-opacity disabled:opacity-50"
              >
                {!isConnected ? 'Connect Wallet First' : isTraining ? 'Training...' : 'Start Contributing'}
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
    ? 'border-walrus-purple/30 bg-walrus-purple/5 text-walrus-purple'
    : 'border-walrus-teal/30 bg-walrus-teal/5 text-walrus-teal';

  return (
    <div className={`border rounded-lg p-4 ${colorClasses}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-gray-400 font-mono uppercase">
          {label}
        </span>
      </div>
      <div className="text-2xl font-bold font-mono">
        {value}
      </div>
    </div>
  );
};
