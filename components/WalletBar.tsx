import React, { useState, useEffect, useCallback } from 'react';
import { Layers, TrendingUp } from 'lucide-react';
import { WalletConnect } from './WalletConnect';
import { useSuiWallet } from '../hooks/useSuiWallet';

// Helper function to format SUI amounts (SUI uses 9 decimals, but we'll format to 6 for display)
const formatUnits = (value: bigint, decimals: number): string => {
  const divisor = BigInt(10 ** decimals);
  const whole = value / divisor;
  const remainder = value % divisor;
  const remainderStr = remainder.toString().padStart(decimals, '0');
  return `${whole}.${remainderStr}`;
};

interface WalletBarProps {
  onLogoClick?: () => void;
}

// Component to track a single stream's accumulated balance (from withdraw modal data)
const StreamBalanceTracker: React.FC<{
  streamId: number;
  onBalanceUpdate: (id: number, balance: bigint, closed: boolean) => void;
}> = ({ streamId, onBalanceUpdate }) => {
  // TODO: Implement Sui-based stream balance tracking
  const owedAmount = undefined;
  const streamData = undefined;

  useEffect(() => {
    // Only process if owedAmount is defined and is a valid value
    if (owedAmount !== undefined && owedAmount !== null) {
      try {
        const balance = typeof owedAmount === 'bigint' ? owedAmount : BigInt(String(owedAmount));
        // Check if stream is closed (if streamData available)
        const isClosed = (streamData && Array.isArray(streamData) && streamData[8]) ? Boolean(streamData[8]) : false;
        onBalanceUpdate(streamId, balance, isClosed);
      } catch (error) {
        console.error(`[WalletBar] Error processing stream ${streamId}:`, error);
      }
    }
  }, [owedAmount, streamData, streamId, onBalanceUpdate]);

  return null;
};

const WalletBar: React.FC<WalletBarProps> = ({ onLogoClick }) => {
  const { isConnected } = useSuiWallet();
  const [totalBalance, setTotalBalance] = useState('0.00');
  const [streamIds, setStreamIds] = useState<number[]>([]);
  const [streamBalances, setStreamBalances] = useState<Map<number, { balance: bigint, closed: boolean }>>(new Map());
  const [isUpdating, setIsUpdating] = useState(false);

  // Load stream IDs from localStorage
  useEffect(() => {
    const loadStreams = () => {
      const stored = localStorage.getItem('userStreams');
      
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Filter to only valid, reasonable stream IDs (< 1 million)
          const ids = Array.isArray(parsed) 
            ? parsed
                .map((id: string) => Number(id))
                .filter((id: number) => !isNaN(id) && id > 0 && id < 1000000 && Number.isFinite(id))
            : [];
          
          // Clean up localStorage if we found invalid IDs
          if (ids.length !== parsed.length) {
            localStorage.setItem('userStreams', JSON.stringify(ids.map(String)));
          }
          
          if (ids.length > 0) {
            setStreamIds(ids);
          }
        } catch (err) {
          console.error('[WalletBar] Error loading streams:', err);
        }
      }
    };

    loadStreams();
    const interval = setInterval(loadStreams, 3000);
    return () => clearInterval(interval);
  }, []);

  // Callback to update individual stream balances (memoized to prevent re-renders)
  const handleBalanceUpdate = useCallback((id: number, balance: bigint, closed: boolean) => {
    setStreamBalances(prev => {
      const newMap = new Map(prev);
      newMap.set(id, { balance, closed });
      return newMap;
    });
  }, []);

  // Calculate total accumulated balance from all streams (same as withdraw modal)
  useEffect(() => {
    let total = 0n;
    
    streamBalances.forEach(({ balance, closed }) => {
      if (!closed) {
        total += balance;
      }
    });

    const formatted = formatUnits(total, 6);
    const display = parseFloat(formatted).toFixed(6);
    const oldBalance = totalBalance;
    
    // Trigger blink effect when balance updates
    if (display !== oldBalance && parseFloat(display) > 0) {
      setIsUpdating(true);
      setTimeout(() => setIsUpdating(false), 600);
    }
    
    setTotalBalance(display);
  }, [streamBalances, totalBalance]);
  return (
    <div className="relative h-14 bg-gradient-to-r from-black/95 via-walrus-teal/5 to-black/90 backdrop-blur-2xl border-b border-walrus-teal/20 flex items-center px-4 justify-between z-50 sticky top-0 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        {/* Ocean Wave Overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-walrus-purple/20 via-walrus-teal/20 to-transparent animate-wave"></div>
        </div>
        
        {/* Left: Logo */}
        <div className="relative z-10 flex items-center">
            <h1 
              className={`text-walrus-teal font-bold font-mono text-sm tracking-wider flex items-center gap-2 ${onLogoClick ? 'cursor-pointer hover:text-walrus-teal/80 transition-colors' : ''}`}
              onClick={onLogoClick}
            >
                <Layers size={16} className="drop-shadow-glow" /> 
                WALRUS AGENTS 
                <span className="text-white/30 text-[10px] font-normal ml-1">v1.0</span>
            </h1>
        </div>

        {/* Right: Wallet & Balance */}
        <div className="relative z-10 flex items-center gap-2">
            {/* Invisible stream balance trackers */}
            {streamIds.map(id => (
              <StreamBalanceTracker key={id} streamId={id} onBalanceUpdate={handleBalanceUpdate} />
            ))}
            
            {/* Compact Balance Display - Only show if > 0 */}
            {parseFloat(totalBalance) > 0 && (
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border transition-all duration-300 ${
                isUpdating
                  ? 'bg-walrus-teal/20 border-walrus-teal/50 shadow-[0_0_12px_rgba(153,239,228,0.4)]'
                  : 'bg-walrus-teal/10 border-walrus-teal/30'
              }`}>
                  <TrendingUp 
                    size={11} 
                    className={`transition-all duration-300 text-walrus-teal ${isUpdating ? 'scale-110' : ''}`} 
                  />
                  <span className="text-[10px] text-white/60 font-mono">BAL:</span>
                  <span className={`text-xs font-bold font-mono transition-all duration-300 text-walrus-teal ${
                    isUpdating ? 'scale-105' : ''
                  }`}>{totalBalance}</span>
              </div>
            )}

            <WalletConnect />
        </div>
    </div>
  );
};

export default WalletBar;