import React, { useState, useEffect } from 'react';
import { AgentMetadata } from '../types';
import { Activity, Shield, Cpu, Hash, ExternalLink, Lock, Loader2 } from 'lucide-react';
import LottieAvatar from './LottieAvatar';

interface AgentCardProps {
  agent: AgentMetadata;
  isActive: boolean;
  onToggle: () => void;
  onClick: () => void;
  status?: 'idle' | 'negotiating' | 'streaming' | 'offline';
  isAutoMode?: boolean;
  isMinting?: boolean;
  isDeactivating?: boolean;
  isOnChain?: boolean;
  onChainTokenId?: number;
  customOrder?: string;
  onCustomOrderChange?: (order: string) => void;
  generatedSprite?: string;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, isActive, onToggle, onClick, status, isAutoMode, isMinting, isDeactivating, isOnChain, onChainTokenId, customOrder, onCustomOrderChange, generatedSprite }) => {
  const isLocked = isAutoMode && agent.id !== 'a0'; // Lock all except Commander in auto mode
  const isCommander = agent.id === 'a0';
  const [spriteLoaded, setSpriteLoaded] = useState(false);
  
  // Use local animated avatar
  const spriteUrl = agent.avatar;
  const currentStatus = status || agent.status;
  
  // Determine button text
  let buttonText = '';
  if (isLocked) {
    buttonText = 'AUTO';
  } else if (isMinting) {
    buttonText = 'Minting...';
  } else if (isDeactivating) {
    buttonText = 'Deactivating...';
  } else if (isOnChain) {
    buttonText = isActive ? 'Deactivate' : 'Activate';
  } else {
    buttonText = 'Register';
  }
  
  const getStatusColor = () => {
    if (!isActive) return 'bg-gray-500';
    switch (currentStatus) {
      case 'streaming': return 'bg-purple-500 animate-pulse';
      case 'negotiating': return 'bg-yellow-500 animate-pulse';
      case 'offline': return 'bg-red-500';
      default: return 'bg-walrus-teal animate-pulse';
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`
        relative group cursor-pointer transition-all duration-500
        rounded-2xl border backdrop-blur-xl overflow-hidden
        ${isActive 
          ? 'border-walrus-teal/60 bg-gradient-to-br from-walrus-teal/15 via-walrus-purple/10 to-black/40 shadow-[0_0_30px_rgba(153,239,228,0.4),0_0_60px_rgba(207,176,255,0.2)] animate-pulse-slow' 
          : 'border-white/5 bg-gradient-to-br from-white/5 to-black/20 hover:border-walrus-teal/40 hover:shadow-[0_0_20px_rgba(153,239,228,0.2)]'}
      `}
    >
      {/* Ocean Wave Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute -bottom-20 left-0 right-0 h-40 bg-gradient-to-t from-walrus-teal/20 to-transparent rounded-full blur-3xl animate-wave"></div>
      </div>
      {/* Status Indicator */}
      <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
        <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor()} shadow-lg`} />
        <span className="text-[10px] font-mono uppercase tracking-wider text-white/70 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
          {isActive ? currentStatus : 'offline'}
        </span>
      </div>
      
      {/* On-Chain Badge */}
      {isOnChain && (
        <div className="absolute top-3 left-3 bg-gradient-to-r from-walrus-teal/30 to-walrus-purple/20 border border-walrus-teal/60 rounded-lg px-2 py-1 flex items-center gap-1 backdrop-blur-md shadow-lg z-10">
          <span className="text-walrus-teal text-[9px] font-mono font-bold drop-shadow-glow">🐋 ON-CHAIN</span>
        </div>
      )}

      <div className="p-4 flex flex-col items-center text-center">
        {/* Sprite Avatar Container */}
        <div className="w-20 h-20 mb-4 relative z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-walrus-teal/30 via-walrus-purple/20 to-transparent rounded-full blur-2xl opacity-60 animate-pulse-slow"></div>
            <div className="absolute inset-0 bg-walrus-teal/10 rounded-full blur-xl animate-ping-slow"></div>
            {agent.avatarType === 'lottie' ? (
              <LottieAvatar 
                animationPath={spriteUrl}
                width={80}
                height={80}
                className="relative z-10 drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] transition-all group-hover:scale-110 duration-300"
              />
            ) : (
              <img 
                src={spriteUrl} 
                alt={agent.name} 
                className="w-full h-full object-contain relative z-10 drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] transition-all group-hover:scale-110 duration-300"
                style={{ imageRendering: 'pixelated' }}
                onLoad={() => setSpriteLoaded(true)}
              />
            )}
        </div>

        <h3 className="relative text-white font-bold font-display tracking-tight text-sm z-10 drop-shadow-lg">{agent.name}</h3>
        <p className="relative text-walrus-teal text-xs mb-3 font-mono z-10">{agent.role}</p>
        
        <div className="relative w-full grid grid-cols-2 gap-2 text-[10px] text-gray-400 font-mono mb-4 z-10">
          <div className="flex items-center gap-1 bg-gradient-to-br from-black/50 to-walrus-teal/10 p-1.5 rounded-lg justify-center border border-walrus-teal/20 backdrop-blur-sm">
            <Shield size={10} className="text-walrus-teal" />
            <span className="text-white">TS: {agent.trustScore}</span>
          </div>
          {onChainTokenId ? (
            <div className="flex items-center gap-1 bg-gradient-to-br from-walrus-teal/30 to-walrus-purple/20 border border-walrus-teal/50 p-1.5 rounded-lg justify-center backdrop-blur-sm shadow-lg">
              <Hash size={10} className="text-walrus-teal" />
              <span className="text-walrus-teal font-bold">ID: {onChainTokenId}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 bg-gradient-to-br from-black/50 to-walrus-purple/10 p-1.5 rounded-lg justify-center border border-white/10 backdrop-blur-sm">
              <Hash size={10} className="text-white/60" />
              <span className="text-white/60">#{agent.tokenId}</span>
            </div>
          )}
        </div>

        {/* Custom Order Input for Commander */}
        {isCommander && onCustomOrderChange && (
          <div className="w-full mb-3" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              value={customOrder || ''}
              onChange={(e) => onCustomOrderChange(e.target.value)}
              placeholder="Custom order (optional)..."
              className="w-full px-2 py-1.5 text-xs bg-black/40 border border-white/20 rounded text-white placeholder-white/40 focus:border-[#99efe4] focus:outline-none font-mono"
            />
            <div className="text-[9px] text-white/40 mt-1 text-left">
              {customOrder ? '📋 Will execute custom order' : '🤖 Default: portfolio & market analysis'}
            </div>
          </div>
        )}

        <div className="relative flex gap-2 w-full mt-auto z-10">
           <button 
            onClick={(e) => { e.stopPropagation(); onToggle(); }}
            disabled={isLocked || isMinting || isDeactivating}
            className={`
              flex-1 py-2 px-3 rounded-lg text-[10px] font-bold font-mono uppercase tracking-wider border transition-all duration-300 shadow-lg
              ${isLocked 
                ? 'border-gray-600 bg-gradient-to-r from-gray-700 to-gray-800 text-gray-500 cursor-not-allowed opacity-50'
                : isMinting
                  ? 'border-yellow-500/60 bg-gradient-to-r from-yellow-500/20 to-yellow-500/10 text-yellow-400 cursor-wait animate-pulse shadow-yellow-500/30'
                : isDeactivating
                  ? 'border-red-500/60 bg-gradient-to-r from-red-500/20 to-red-500/10 text-red-400 cursor-wait animate-pulse shadow-red-500/30'
                : isActive 
                  ? 'border-walrus-teal/80 bg-gradient-to-r from-walrus-teal to-walrus-teal/80 text-black hover:from-white hover:to-walrus-teal hover:border-white shadow-walrus-teal/50' 
                  : 'border-white/20 bg-gradient-to-r from-white/5 to-transparent text-white/60 hover:border-walrus-teal/50 hover:text-walrus-teal hover:from-walrus-teal/10'}
            `}
           >
             {isLocked ? (
               <><Lock size={10} className="inline mr-1" />{buttonText}</>
             ) : isMinting ? (
               <>⏳ {buttonText}</>
             ) : isDeactivating ? (
               <>⏳ {buttonText}</>
             ) : isOnChain ? (
               buttonText
             ) : (
               <>🔗 {buttonText}</>
             )}
           </button>
        </div>
      </div>
      
      {/* Auto Mode Lock Overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded px-2 py-1 flex items-center gap-1">
            <Lock size={12} className="text-yellow-500" />
            <span className="text-yellow-500 text-xs font-mono font-bold">AUTO</span>
          </div>
        </div>
      )}
      
      {/* Decorative corner accents with glow */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-walrus-teal/60 opacity-70 rounded-tl-lg"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-walrus-purple/60 opacity-70 rounded-br-lg"></div>
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-walrus-purple/40 opacity-50 rounded-tr-lg"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-walrus-teal/40 opacity-50 rounded-bl-lg"></div>
    </div>
  );
};

export default AgentCard;