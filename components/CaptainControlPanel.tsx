import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Zap, Hand, DollarSign, TrendingUp, TrendingDown, Wallet, ChevronDown, ChevronUp, Brain } from 'lucide-react';
import { TrainingDashboard } from './TrainingDashboard';

interface CaptainControlPanelProps {
  mode: 'auto' | 'manual';
  onModeChange: (mode: 'auto' | 'manual') => void;
  isConnected: boolean;
  isCaptainRegistered: boolean;
  captainTokenId: number;
  showTraining?: boolean;
  onTrainingChange?: (show: boolean) => void;
}

export const CaptainControlPanel: React.FC<CaptainControlPanelProps> = ({
  mode,
  onModeChange,
  isConnected,
  isCaptainRegistered,
  captainTokenId,
  showTraining,
  onTrainingChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTrainingDashboard, setShowTrainingDashboard] = useState(false);
  
  // Use external control if provided, otherwise use internal state
  const isTrainingOpen = showTraining !== undefined ? showTraining : showTrainingDashboard;
  const setTrainingOpen = onTrainingChange || setShowTrainingDashboard;

  return (
    <div className={`
      relative bg-gradient-to-br from-black/90 via-walrus-teal/5 to-black/85 backdrop-blur-xl border rounded-lg shadow-xl transition-all duration-300
      ${isExpanded 
        ? 'border-walrus-teal/50 shadow-[0_0_20px_rgba(153,239,228,0.2)]' 
        : 'border-walrus-teal/20'
      }
    `}>
      {/* Ocean Wave Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-walrus-purple/20 via-walrus-teal/20 to-transparent"></div>
      </div>
      
      {/* Main Control Bar - Compact */}
      <div className="relative z-10 flex items-center gap-2 p-2">
        {/* Mode Toggle - Compact */}
        <div className="flex items-center gap-0.5 bg-black/60 rounded-lg p-0.5 border border-walrus-teal/20">
          <button
            onClick={() => onModeChange('manual')}
            className={`
              flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold font-mono transition-all
              ${mode === 'manual' 
                ? 'bg-gradient-to-r from-walrus-teal to-walrus-teal/80 text-black shadow-md' 
                : 'text-white/50 hover:text-white/80'
              }
            `}
            title="Manual Control"
          >
            <Hand size={10} />
            MANUAL
          </button>
          <button
            onClick={() => onModeChange('auto')}
            className={`
              flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold font-mono transition-all
              ${mode === 'auto' 
                ? 'bg-gradient-to-r from-walrus-teal to-walrus-teal/80 text-black shadow-md' 
                : 'text-white/50 hover:text-white/80'
              }
            `}
            title="Auto Mode"
          >
            <Zap size={10} />
            AUTO
          </button>
        </div>

        {/* Training Button - Only show when registered */}
        {isCaptainRegistered && isConnected && (
          <button
            onClick={() => setShowTrainingDashboard(true)}
            className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-walrus-teal/20 to-walrus-purple/20 hover:from-walrus-teal/30 hover:to-walrus-purple/30 border border-walrus-purple/30 rounded-md text-[10px] font-mono font-bold transition-all text-walrus-teal"
            title="Open Training Dashboard"
          >
            <Brain size={10} />
            🐋 Train
          </button>
        )}
      </div>

      {/* Training Dashboard Modal - Rendered via Portal to escape parent stacking context */}
      {showTrainingDashboard && isCaptainRegistered && createPortal(
        <TrainingDashboard
          agentId={String(captainTokenId)}
          agentName={`Captain #${captainTokenId}`}
          onClose={() => setShowTrainingDashboard(false)}
        />,
        document.body
      )}
    </div>
  );
};
