import React from 'react';
import { TrendingUp, TrendingDown, Users, Database, Activity } from 'lucide-react';
import { useOnChainData } from '../hooks/useOnChainData';

interface MarketDataWidgetProps {
  compact?: boolean;
}

export const MarketDataWidget: React.FC<MarketDataWidgetProps> = ({ compact = false }) => {
  const { marketData, isLoading } = useOnChainData();

  if (isLoading || !marketData) {
    return (
      <div className="bg-black/40 border border-white/10 rounded-lg p-3">
        <div className="flex items-center gap-2 text-gray-400 text-xs">
          <Activity size={14} className="animate-pulse" />
          <span>Loading market data...</span>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="bg-black/40 border border-walrus-teal/20 rounded-lg p-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-sm">
              ${marketData.price.price.toFixed(2)}
            </span>
            {marketData.price.change24h >= 0 ? (
              <TrendingUp size={12} className="text-green-500" />
            ) : (
              <TrendingDown size={12} className="text-red-500" />
            )}
            <span className={`text-xs ${
              marketData.price.change24h >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {marketData.price.change24h >= 0 ? '+' : ''}
              {marketData.price.change24h.toFixed(1)}%
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Activity size={10} />
            <span>{marketData.network.tps} TPS</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-black/60 via-walrus-purple/10 to-black/40 border border-walrus-purple/30 rounded-2xl p-4 space-y-3 backdrop-blur-xl shadow-[0_0_30px_rgba(207,176,255,0.2)] overflow-hidden">
      {/* Ocean Wave Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -bottom-10 left-0 right-0 h-32 bg-gradient-to-t from-walrus-teal/30 to-transparent rounded-full blur-3xl animate-wave"></div>
      </div>
      <div className="relative flex items-center justify-between z-10">
        <h3 className="text-white font-bold font-mono text-sm flex items-center gap-2 drop-shadow-glow">
          <Database size={14} className="text-walrus-teal animate-pulse-slow" />
          🐋 On-Chain Data
        </h3>
        <span className="flex items-center gap-1 text-xs text-walrus-teal bg-walrus-teal/10 px-2 py-0.5 rounded-full border border-walrus-teal/30">
          <div className="w-1.5 h-1.5 bg-walrus-teal rounded-full animate-pulse"></div>
          Live
        </span>
      </div>

      {/* SUI Price */}
      <div className="relative bg-gradient-to-br from-black/60 via-walrus-teal/10 to-black/40 rounded-xl p-3 border border-walrus-teal/30 backdrop-blur-sm shadow-lg z-10">
        <div className="flex items-center justify-between mb-1">
          <span className="text-gray-400 text-xs">SUI/USD</span>
          {marketData.price.change24h >= 0 ? (
            <TrendingUp size={12} className="text-green-500" />
          ) : (
            <TrendingDown size={12} className="text-red-500" />
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-white font-bold text-xl">
            ${marketData.price.price.toFixed(2)}
          </span>
          <span className={`text-sm ${
            marketData.price.change24h >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {marketData.price.change24h >= 0 ? '+' : ''}
            {marketData.price.change24h.toFixed(2)}%
          </span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Vol: ${(marketData.price.volume24h / 1000000).toFixed(1)}M
        </div>
      </div>

      {/* Network Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-black/40 rounded p-2 border border-white/10">
          <div className="flex items-center gap-1 mb-1">
            <Activity size={10} className="text-walrus-purple" />
            <span className="text-gray-400 text-[10px] uppercase">TPS</span>
          </div>
          <span className="text-walrus-purple font-bold text-sm">
            {marketData.network.tps}
          </span>
        </div>

        <div className="bg-black/40 rounded p-2 border border-white/10">
          <div className="flex items-center gap-1 mb-1">
            <Users size={10} className="text-walrus-teal" />
            <span className="text-gray-400 text-[10px] uppercase">Active</span>
          </div>
          <span className="text-walrus-teal font-bold text-sm">
            {(marketData.network.activeAddresses24h / 1000).toFixed(1)}K
          </span>
        </div>
      </div>

      {/* Validators */}
      <div className="bg-black/40 rounded p-2 border border-white/10">
        <div className="text-gray-400 text-[10px] uppercase mb-2">
          Top Validators
        </div>
        <div className="space-y-1">
          {marketData.validators.slice(0, 3).map((validator, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <span className="text-gray-500 truncate max-w-[120px]">
                {validator.name}
              </span>
              <span className="text-walrus-purple font-mono">
                {validator.apy.toFixed(1)}% APY
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* NFT Stats */}
      <div className="bg-black/40 rounded p-2 border border-white/10">
        <div className="text-gray-400 text-[10px] uppercase mb-1">
          {marketData.nft.collection}
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Floor:</span>
          <span className="text-walrus-teal font-bold">
            {marketData.nft.floorPrice.toFixed(1)} SUI
          </span>
        </div>
        <div className="flex items-center justify-between text-xs mt-1">
          <span className="text-gray-500">24h Sales:</span>
          <span className="text-white font-mono">
            {marketData.nft.sales24h}
          </span>
        </div>
      </div>
    </div>
  );
};
