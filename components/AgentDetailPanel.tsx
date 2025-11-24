import React, { useState } from 'react';
import { AgentMetadata } from '../types';
import { X, Copy, Zap, Loader2 } from 'lucide-react';
import { AGENT_ABILITIES } from '../constants';
import { useSuiWallet } from '../hooks/useSuiWallet';
import { useMintAgent } from '../hooks/useAgentSui';
import LottieAvatar from './LottieAvatar';
import { DeploymentStatus } from './DeploymentStatus';
import { toast } from 'react-toastify';

interface AgentDetailPanelProps {
  agent: AgentMetadata | null;
  onClose: () => void;
  onChainTokenId?: number; // Real on-chain token ID from blockchain
  onAgentMinted?: (agentId: string, suiObjectId: string, walrusBlobId: string) => void;
  onInitiateTraining?: () => void;
}

const AgentDetailPanel: React.FC<AgentDetailPanelProps> = ({ agent, onClose, onChainTokenId, onAgentMinted, onInitiateTraining }) => {
  const { address, isConnected } = useSuiWallet();
  const { mintAgent, isPending, error } = useMintAgent();
  const [walrusBlobId, setWalrusBlobId] = useState<string | null>(null);
  const [suiTxDigest, setSuiTxDigest] = useState<string | null>(null);
  
  const handleMintAgent = async () => {
    if (!agent || !isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      toast.info('🐋 Step 1/2: Uploading metadata to Walrus...');
      
      // Call mintAgent which handles both Walrus upload and Sui minting
      const result = await mintAgent({
        name: agent.name,
        role: agent.role.toString(),
        description: agent.description,
        capabilities: agent.capabilities,
        avatar: agent.avatar,
        personality: agent.personality,
      });

      setSuiTxDigest(result.suiTxDigest);
      setWalrusBlobId(result.walrusBlobId);
      
      // Check if successful
      if (result.suiTxDigest && !result.suiTxDigest.startsWith('local_')) {
        // Real transaction
        toast.success(
          <div>
            <div className="font-bold">✅ Agent Registered!</div>
            <div className="text-xs mt-1 space-y-1">
              <div>🐋 Walrus Blob: {result.walrusBlobId.slice(0, 10)}...</div>
              <div>📦 Object ID: {result.suiObjectId.slice(0, 10)}...</div>
              <div>⛓️ Sui TX: {result.suiTxDigest.slice(0, 10)}...</div>
              <a 
                href={`https://walruscan.com/testnet/blob/${result.walrusBlobId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-walrus-teal hover:underline block"
              >
                View on Walruscan →
              </a>
              <a 
                href={`https://suiscan.xyz/testnet/tx/${result.suiTxDigest}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-walrus-purple hover:underline block"
              >
                View on Suiscan →
              </a>
            </div>
          </div>,
          { autoClose: 10000 }
        );
        
        // Notify parent component with all IDs
        if (onAgentMinted) {
          onAgentMinted(agent.id, result.suiObjectId, result.walrusBlobId);
        }
      }
      
    } catch (error: any) {
      console.error('Mint error:', error);
      toast.error(
        <div>
          <div className="font-bold">❌ Registration Failed</div>
          <div className="text-xs mt-1">{error.message}</div>
        </div>
      );
    }
  };
  
  if (!agent) return null;

  return (
    <div className="absolute right-0 top-10 bottom-0 w-96 bg-gradient-to-br from-black/98 via-walrus-teal/5 to-black/95 border-l border-walrus-teal/40 backdrop-blur-2xl shadow-[0_0_60px_rgba(153,239,228,0.3)] z-[60] transform transition-transform duration-300 flex flex-col overflow-hidden">
      {/* Ocean Wave Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-walrus-purple/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-walrus-teal/20 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
      </div>
      <div className="relative p-4 border-b border-walrus-teal/20 flex items-center justify-between bg-gradient-to-r from-walrus-teal/10 to-walrus-purple/5 backdrop-blur-sm z-10">
        <h2 className="text-walrus-teal font-bold font-mono flex items-center gap-2 drop-shadow-glow">
          <span className="text-xs bg-gradient-to-r from-walrus-teal to-walrus-teal/80 text-black px-2 py-0.5 rounded-lg shadow-lg">🐋 WALRUS</span>
          AGENT DETAILS
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Avatar Header */}
        <div className="flex flex-col items-center mb-6">
           <div className="relative w-32 h-32 border-2 border-walrus-teal/40 rounded-2xl p-2 bg-gradient-to-br from-black via-walrus-teal/5 to-black overflow-hidden group shadow-[0_0_30px_rgba(153,239,228,0.3)]">
             <div className="absolute inset-0 bg-gradient-to-br from-walrus-teal/30 via-walrus-purple/20 to-transparent blur-2xl opacity-60 animate-pulse-slow"></div>
             <div className="absolute inset-0 bg-walrus-teal/10 blur-xl animate-ping-slow"></div>
             {agent.avatarType === 'lottie' ? (
               <LottieAvatar 
                 animationPath={agent.avatar}
                 width={112}
                 height={112}
                 className="relative z-10 drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]"
               />
             ) : (
               <img 
                  src={agent.avatar} 
                  className="w-full h-full object-cover relative z-10 drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] rounded-2xl"
                  alt={agent.name}
                  onError={(e) => {
                    console.error('Avatar failed to load:', agent.name, agent.avatar);
                    e.currentTarget.src = '/lottie/walrusagent.gif';
                  }}
                  onLoad={() => console.log('Avatar loaded:', agent.name, agent.avatar)}
                  crossOrigin="anonymous"
               />
             )}
             <div className="absolute bottom-0 left-0 right-0 bg-walrus-teal/20 h-1/3 blur-xl"></div>
           </div>
           <h1 className="text-2xl font-bold text-white mt-4 font-mono">{agent.name}</h1>
           <span className="text-walrus-teal text-sm font-mono tracking-wider">{agent.role}</span>
        </div>

        {/* Identity Data */}
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-xs text-gray-500 font-mono uppercase">Description</label>
                <p className="text-sm text-gray-300 leading-relaxed">{agent.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-3 rounded border border-white/10">
                    <label className="text-[10px] text-gray-500 font-mono uppercase block mb-1">Token ID</label>
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-mono text-white">#{agent.id}</span>
                        {!agent.suiObjectId && (
                            <span className="text-[9px] text-yellow-500 font-mono">(Not Minted)</span>
                        )}
                    </div>
                </div>
                <div className="bg-white/5 p-3 rounded border border-white/10">
                    <label className="text-[10px] text-gray-500 font-mono uppercase block mb-1">Trust Score</label>
                    <span className="text-lg font-mono text-walrus-teal">{agent.trustScore}/100</span>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs text-gray-500 font-mono uppercase">Capabilities</label>
                <div className="flex flex-wrap gap-2">
                    {agent.capabilities.map(cap => (
                        <span key={cap} className="px-2 py-1 bg-white/5 border border-white/20 rounded text-xs text-gray-300 hover:border-walrus-teal/50 transition-colors cursor-help">
                            {cap}
                        </span>
                    ))}
                </div>
            </div>

            {/* API Integrations */}
            {AGENT_ABILITIES[agent.id as keyof typeof AGENT_ABILITIES]?.apis && AGENT_ABILITIES[agent.id as keyof typeof AGENT_ABILITIES].apis.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs text-gray-500 font-mono uppercase flex items-center gap-2">
                  <Zap size={12} className="text-walrus-teal" />
                  API Integrations
                </label>
                <div className="flex flex-wrap gap-2">
                  {AGENT_ABILITIES[agent.id as keyof typeof AGENT_ABILITIES].apis.map((api: string) => (
                    <span 
                      key={api} 
                      className="px-2 py-1 bg-walrus-teal/10 border border-walrus-teal/30 rounded text-xs text-walrus-teal font-mono hover:bg-walrus-teal/20 transition-colors cursor-help"
                      title={AGENT_ABILITIES[agent.id as keyof typeof AGENT_ABILITIES].apiEndpoints?.[api] || api}
                    >
                      ⚡ {api}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
                <label className="text-xs text-gray-500 font-mono uppercase">On-Chain Identity</label>
                {agent.suiObjectId ? (
                  <div 
                    className="flex items-center gap-2 bg-black p-2 rounded border border-white/10 font-mono text-xs break-all cursor-pointer hover:bg-white/5 transition-colors group"
                    onClick={() => {
                      navigator.clipboard.writeText(agent.suiObjectId!);
                    }}
                    title="Click to copy agent on-chain identifier"
                  >
                      <div className="flex-1">
                        <div className="text-gray-500 text-[10px] mb-0.5">
                          {agent.suiObjectId.startsWith('0x') ? 'Sui Object ID' : 'Sui Transaction'}
                        </div>
                        <div className="text-walrus-teal">
                          {agent.suiObjectId.length > 20 
                            ? `${agent.suiObjectId.slice(0, 10)}...${agent.suiObjectId.slice(-8)}`
                            : agent.suiObjectId}
                        </div>
                        <div className="text-gray-400 mt-0.5 text-[10px]">Token #{onChainTokenId || agent.id}</div>
                        <a
                          href={agent.suiObjectId.startsWith('0x') 
                            ? `https://suiscan.xyz/testnet/object/${agent.suiObjectId}`
                            : `https://suiscan.xyz/testnet/tx/${agent.suiObjectId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-walrus-purple hover:text-walrus-teal text-[10px] mt-1 inline-block"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View on Suiscan →
                        </a>
                      </div>
                      <Copy size={12} className="ml-auto text-walrus-teal opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                ) : (
                  <div 
                    className="flex items-center gap-2 bg-yellow-500/10 p-2 rounded border border-yellow-500/30 font-mono text-xs"
                  >
                    <div className="flex-1">
                      <div className="text-gray-500 text-[10px] mb-0.5">Agent Address</div>
                      <div className="text-walrus-teal">
                        {(() => {
                          const storedAddresses = localStorage.getItem('agentAddresses');
                          const addresses = storedAddresses ? JSON.parse(storedAddresses) : {};
                          const agentAddress = addresses[agent.id] || `0x650665fdf08EeE72e84953D5a99AbC8196C56E77-${onChainTokenId || agent.id}`;
                          return agentAddress.length > 30 
                            ? `${agentAddress.slice(0, 10)}...${agentAddress.slice(-8)}`
                            : agentAddress;
                        })()}
                      </div>
                      <div className="text-yellow-400 mt-0.5 text-[10px]">⚠️ Not Minted - Agent exists in UI only</div>
                    </div>
                  </div>
                )}
                {address && !agent.suiObjectId && (
                  <div className="text-[10px] text-gray-500 font-mono mt-1 px-2">
                    Connected: {address.slice(0, 6)}...{address.slice(-4)}
                  </div>
                )}
            </div>

            {/* Registration Transactions */}
            {(walrusBlobId || agent.walrusBlobId) && (
              <div className="space-y-3">
                <label className="text-xs text-gray-500 font-mono uppercase">Registration Details</label>
                
                {/* Walrus Blob ID */}
                {(walrusBlobId || agent.walrusBlobId) && (
                  <div 
                    className="flex items-center gap-2 bg-black p-2 rounded border border-walrus-teal/20 font-mono text-xs break-all cursor-pointer hover:bg-white/5 transition-colors group"
                    onClick={() => {
                      navigator.clipboard.writeText(walrusBlobId || agent.walrusBlobId || '');
                    }}
                    title="Click to copy Walrus blob ID"
                  >
                      <div className="flex-1">
                        <div className="text-gray-500 text-[10px] mb-0.5">🐋 Walrus Metadata Blob</div>
                        <div className="text-walrus-teal">
                          {(walrusBlobId || agent.walrusBlobId || '').length > 20 
                            ? `${(walrusBlobId || agent.walrusBlobId || '').slice(0, 12)}...${(walrusBlobId || agent.walrusBlobId || '').slice(-8)}`
                            : (walrusBlobId || agent.walrusBlobId)}
                        </div>
                        <a
                          href={`https://walruscan.com/testnet/blob/${walrusBlobId || agent.walrusBlobId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-walrus-purple hover:text-walrus-teal text-[10px] mt-1 inline-block"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View on Walruscan →
                        </a>
                      </div>
                      <Copy size={12} className="ml-auto text-walrus-teal opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}

                {/* Sui Transaction - only show if different from On-Chain Identity */}
                {suiTxDigest && suiTxDigest !== agent.suiObjectId && (
                  <div 
                    className="flex items-center gap-2 bg-black p-2 rounded border border-walrus-purple/20 font-mono text-xs break-all cursor-pointer hover:bg-white/5 transition-colors group"
                    onClick={() => {
                      navigator.clipboard.writeText(suiTxDigest || agent.suiObjectId || '');
                    }}
                    title="Click to copy Sui transaction digest"
                  >
                      <div className="flex-1">
                        <div className="text-gray-500 text-[10px] mb-0.5">⛓️ Sui Registration TX</div>
                        <div className="text-walrus-purple">
                          {(suiTxDigest || agent.suiObjectId || '').length > 20 
                            ? `${(suiTxDigest || agent.suiObjectId || '').slice(0, 12)}...${(suiTxDigest || agent.suiObjectId || '').slice(-8)}`
                            : (suiTxDigest || agent.suiObjectId)}
                        </div>
                        <a
                          href={`https://suiscan.xyz/testnet/tx/${suiTxDigest || agent.suiObjectId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-walrus-teal hover:text-walrus-purple text-[10px] mt-1 inline-block"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View on Suiscan →
                        </a>
                      </div>
                      <Copy size={12} className="ml-auto text-walrus-purple opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}
              </div>
            )}

            {/* Deployment Status */}
            <div className="mt-6">
              <DeploymentStatus />
            </div>

        </div>
      </div>

      <div className="p-4 border-t border-white/10 bg-black/50 backdrop-blur space-y-2">
          {!agent.suiObjectId && !suiTxDigest ? (
            <button 
              onClick={handleMintAgent}
              disabled={isPending || !isConnected}
              className="w-full py-3 bg-gradient-to-r from-walrus-teal to-walrus-purple hover:from-walrus-teal/80 hover:to-walrus-purple/80 text-black font-bold font-mono rounded transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  REGISTERING...
                </>
              ) : !isConnected ? (
                '🔌 CONNECT WALLET'
              ) : (
                <>
                  🐋 REGISTER AGENT
                  <span className="text-xs opacity-80">(Walrus + Sui)</span>
                </>
              )}
            </button>
          ) : (
            <button 
              disabled
              className="w-full py-3 bg-green-500/20 border border-green-500/50 text-green-400 font-bold font-mono rounded shadow-lg cursor-not-allowed"
            >
              ✅ AGENT REGISTERED
            </button>
          )}
          
          {(agent.suiObjectId || suiTxDigest) && (
            <button 
              onClick={() => {
                if (onInitiateTraining) {
                  onInitiateTraining();
                  onClose(); // Close the detail panel
                }
              }}
              className="w-full py-3 bg-gradient-to-r from-walrus-purple to-walrus-teal hover:from-walrus-purple/80 hover:to-walrus-teal/80 text-black font-bold font-mono rounded transition-all shadow-lg"
            >
              🚀 INITIATE TRAINING
            </button>
          )}
      </div>
    </div>
  );
};

export default AgentDetailPanel;