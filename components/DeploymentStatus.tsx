import React, { useState } from 'react';
import { ExternalLink, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import { CONTRACTS_DEPLOYED, AGENT_PACKAGE_ID, AGENT_REGISTRY_ID, REWARD_POOL_ID } from '../config/suiWalletConfig';

export const DeploymentStatus: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (CONTRACTS_DEPLOYED) {
    return (
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle size={20} className="text-green-400" />
          <h3 className="text-green-400 font-bold font-display">Contracts Deployed</h3>
        </div>
        
        <div className="space-y-2 text-sm font-mono">
          <div className="flex items-center justify-between bg-black/30 p-2 rounded">
            <span className="text-gray-400">Package ID:</span>
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-xs">{AGENT_PACKAGE_ID.slice(0, 8)}...{AGENT_PACKAGE_ID.slice(-6)}</span>
              <button
                onClick={() => copyToClipboard(AGENT_PACKAGE_ID)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Copy size={12} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between bg-black/30 p-2 rounded">
            <span className="text-gray-400">Registry:</span>
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-xs">{AGENT_REGISTRY_ID.slice(0, 8)}...{AGENT_REGISTRY_ID.slice(-6)}</span>
              <button
                onClick={() => copyToClipboard(AGENT_REGISTRY_ID)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Copy size={12} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between bg-black/30 p-2 rounded">
            <span className="text-gray-400">Reward Pool:</span>
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-xs">{REWARD_POOL_ID.slice(0, 8)}...{REWARD_POOL_ID.slice(-6)}</span>
              <button
                onClick={() => copyToClipboard(REWARD_POOL_ID)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Copy size={12} />
              </button>
            </div>
          </div>
        </div>

        {copied && (
          <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
            <CheckCircle size={12} />
            Copied to clipboard!
          </div>
        )}

        <a
          href={`https://suiexplorer.com/object/${AGENT_PACKAGE_ID}?network=testnet`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center gap-2 text-xs text-green-400 hover:text-green-300 transition-colors"
        >
          View on Sui Explorer <ExternalLink size={12} />
        </a>
      </div>
    );
  }

  return (
    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle size={20} className="text-yellow-400" />
        <h3 className="text-yellow-400 font-bold font-display">Contracts Not Deployed</h3>
      </div>
      
      <p className="text-yellow-400/80 text-sm mb-4 font-sans">
        Deploy the Move contracts to Sui Testnet to enable on-chain features:
      </p>

      <ul className="space-y-2 text-sm text-yellow-400/70 mb-4 font-sans">
        <li>• Agent NFT minting</li>
        <li>• Training contribution tracking</li>
        <li>• SUI token rewards</li>
        <li>• Model version history</li>
      </ul>

      <div className="space-y-2">
        <a
          href="https://suiexplorer.com/publish?network=testnet"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded border border-yellow-500/40 text-yellow-400 font-display font-bold text-sm transition-colors"
        >
          Deploy via Sui Explorer <ExternalLink size={14} />
        </a>

        <a
          href="/DEPLOY_GUIDE.md"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-black/30 hover:bg-black/50 rounded border border-white/10 text-gray-400 hover:text-white font-mono text-xs transition-colors"
        >
          View Deployment Guide <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
};
