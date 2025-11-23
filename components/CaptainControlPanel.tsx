import React, { useState } from 'react';
import { Zap, Hand, DollarSign, TrendingUp, TrendingDown, Wallet, ChevronDown, ChevronUp, Brain } from 'lucide-react';
import { TrainingDashboard } from './TrainingDashboard';

interface CaptainControlPanelProps {
  mode: 'auto' | 'manual';
  onModeChange: (mode: 'auto' | 'manual') => void;
  isConnected: boolean;
  isCaptainRegistered: boolean;
  captainTokenId: number;
}

export const CaptainControlPanel: React.FC<CaptainControlPanelProps> = ({
  mode,
  onModeChange,
  isConnected,
  isCaptainRegistered,
  captainTokenId
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTrainingDashboard, setShowTrainingDashboard] = useState(false);

  return (
    <div className={`
      bg-black/90 backdrop-blur-md border rounded-lg shadow-lg overflow-hidden transition-all duration-200
      ${isExpanded 
        ? 'border-walrus-teal/50 shadow-walrus-teal/20' 
        : 'border-walrus-teal/30 shadow-walrus-teal/10'
      }
    `}>
      {/* Main Control Bar - Always Visible */}
      <div className="flex items-center gap-2 p-2">
        {/* Mode Toggle */}
        <div className="flex items-center gap-1 bg-black/50 rounded-lg p-0.5 border border-white/10">
          <button
            onClick={() => onModeChange('manual')}
            className={`
              flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-bold font-mono transition-all
              ${mode === 'manual' 
                ? 'bg-walrus-teal text-black shadow-sm' 
                : 'text-white/50 hover:text-white/80'
              }
            `}
            title="Manual Control"
          >
            <Hand size={12} />
            MANUAL
          </button>
          <button
            onClick={() => onModeChange('auto')}
            className={`
              flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-bold font-mono transition-all
              ${mode === 'auto' 
                ? 'bg-walrus-teal text-black shadow-sm' 
                : 'text-white/50 hover:text-white/80'
              }
            `}
            title="Auto Mode"
          >
            <Zap size={12} />
            AUTO
          </button>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-white/10"></div>

        {/* Captain Info */}
        {isCaptainRegistered ? (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-walrus-teal/10 border border-walrus-teal/30 rounded text-xs">
            <Wallet size={12} className="text-walrus-teal" />
            <span className="text-walrus-teal font-mono font-bold">CAPTAIN #{captainTokenId}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-red-500/10 border border-red-500/30 rounded text-xs">
            <Wallet size={12} className="text-red-400" />
            <span className="text-red-400 font-mono text-[10px]">NOT REGISTERED</span>
          </div>
        )}

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          disabled={!isConnected}
          className={`
            ml-auto flex items-center gap-1 px-2 py-1 rounded text-xs font-mono transition-all
            ${isExpanded 
              ? 'bg-walrus-teal/20 text-walrus-teal border border-walrus-teal/30' 
              : 'text-white/50 hover:text-white/80 border border-white/10'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          title={isConnected ? (isExpanded ? 'Hide x402 Controls' : 'Show x402 Controls') : 'Connect wallet first'}
        >
          <DollarSign size={12} />
          x402
          {isExpanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
        </button>
      </div>

      {/* Expanded Section - AI Training Dashboard */}
      {isExpanded && isConnected && (
        <div className="border-t border-white/10 bg-black/40 p-3 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-1.5 mb-2">
            <Zap size={12} className="text-walrus-teal" />
            <span className="text-walrus-teal/70 font-mono text-[10px] uppercase tracking-wider">
              AI TRAINING STATUS
            </span>
          </div>

          {isCaptainRegistered && (
            <div className="mt-2 space-y-2">
              <div className="text-[9px] text-walrus-teal/60 font-mono text-center">
                🧠 Training Captain #{captainTokenId}
              </div>
              <div className="flex items-center justify-center gap-1 text-[8px] text-white/40 font-mono mb-2">
                <div className="w-1 h-1 rounded-full bg-walrus-teal animate-pulse"></div>
                Walrus Protocol Connected
              </div>
              
              {/* Open Training Dashboard Button */}
              <button
                onClick={() => setShowTrainingDashboard(true)}
                className="w-full py-2 bg-gradient-to-r from-walrus-teal/20 to-walrus-purple/20 hover:from-walrus-teal/30 hover:to-walrus-purple/30 border border-walrus-purple/30 text-white rounded text-xs font-mono font-bold transition-all flex items-center justify-center gap-2"
              >
                <Brain size={14} />
                Open Training Dashboard
              </button>
            </div>
          )}
        </div>
      )}

      {/* Training Dashboard Modal */}
      {showTrainingDashboard && isCaptainRegistered && (
        <TrainingDashboard
          agentId={String(captainTokenId)}
          agentName={`Captain #${captainTokenId}`}
          onClose={() => setShowTrainingDashboard(false)}
        />
      )}
    </div>
  );
};
