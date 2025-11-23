import React, { useState } from 'react';
import { Zap, Hand, DollarSign } from 'lucide-react';

interface ModeControlProps {
  mode: 'auto' | 'manual';
  budget: number;
  onModeChange: (mode: 'auto' | 'manual') => void;
  onBudgetChange: (budget: number) => void;
}

export const ModeControl: React.FC<ModeControlProps> = ({ 
  mode, 
  budget, 
  onModeChange, 
  onBudgetChange 
}) => {
  const [budgetInput, setBudgetInput] = useState(budget.toString());

  const handleBudgetSubmit = () => {
    const value = parseFloat(budgetInput);
    if (!isNaN(value) && value >= 0) {
      onBudgetChange(value);
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-black/90 via-walrus-purple/5 to-black/80 backdrop-blur-xl border border-walrus-purple/40 rounded-2xl p-5 mb-4 shadow-[0_0_30px_rgba(207,176,255,0.15)] overflow-hidden">
      {/* Ocean Wave Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -bottom-10 left-0 right-0 h-32 bg-gradient-to-t from-walrus-teal/30 to-transparent rounded-full blur-3xl animate-wave"></div>
      </div>
      <div className="relative flex items-center justify-between mb-4 z-10">
        <h3 className="text-walrus-teal font-bold font-mono text-sm flex items-center gap-2 drop-shadow-glow">
          <Zap size={16} className="animate-pulse-slow" />
          🐋 OPERATION MODE
        </h3>
        <div className="flex items-center gap-2 bg-gradient-to-r from-black/60 to-walrus-purple/10 rounded-xl p-1 border border-walrus-teal/20 backdrop-blur-sm">
          <button
            onClick={() => onModeChange('manual')}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs transition-all duration-300
              ${mode === 'manual' 
                ? 'bg-gradient-to-r from-walrus-teal to-walrus-teal/80 text-black font-bold shadow-lg shadow-walrus-teal/50' 
                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }
            `}
          >
            <Hand size={14} />
            MANUAL
          </button>
          <button
            onClick={() => onModeChange('auto')}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs transition-all duration-300
              ${mode === 'auto' 
                ? 'bg-gradient-to-r from-walrus-teal to-walrus-teal/80 text-black font-bold shadow-lg shadow-walrus-teal/50' 
                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }
            `}
          >
            <Zap size={14} />
            AUTO
          </button>
        </div>
      </div>

      {mode === 'auto' && (
        <div className="border-t border-white/10 pt-4 space-y-3">
          <div className="flex items-center gap-2">
            <DollarSign size={14} className="text-[#99efe4]" />
            <span className="text-white/70 font-mono text-xs">COMMANDER BUDGET (USDC)</span>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              onBlur={handleBudgetSubmit}
              onKeyPress={(e) => e.key === 'Enter' && handleBudgetSubmit()}
              min="0"
              step="0.01"
              className="flex-1 bg-black/50 border border-walrus-purple/30 rounded px-3 py-2 text-[#99efe4] font-mono text-sm focus:outline-none focus:border-[#99efe4] transition-colors"
              placeholder="Enter budget amount"
            />
            <button
              onClick={handleBudgetSubmit}
              className="px-4 py-2 bg-[#99efe4]/10 hover:bg-[#99efe4]/20 border border-walrus-purple/30 rounded text-[#99efe4] font-mono text-xs font-bold transition-colors"
            >
              SET
            </button>
          </div>

          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-white/50">Current Budget:</span>
            <span className="text-[#99efe4] font-bold">{budget.toFixed(2)} USDC</span>
          </div>

          <div className="bg-walrus-purple/10 border border-walrus-purple/30 rounded p-2 text-walrus-purple/80 text-xs font-mono">
            ⚡ Auto mode: Commander will activate agents and execute distributed training within budget limit
          </div>
        </div>
      )}

      {mode === 'manual' && (
        <div className="border-t border-white/10 pt-4">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded p-2 text-blue-500/80 text-xs font-mono">
            ✋ Manual mode: Click agents to activate. Full control over operations.
          </div>
        </div>
      )}
    </div>
  );
};
