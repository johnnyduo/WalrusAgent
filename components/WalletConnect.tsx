import React, { useEffect, useState, useRef } from 'react';
import { useSuiWallet } from '../hooks/useSuiWallet';
import { useTokenBalances } from '../hooks/useTokenBalances';
import { ConnectButton } from '@suiet/wallet-kit';
import { suiClient, CONTRACTS_DEPLOYED } from '../config/suiWalletConfig';
import { Wallet, Droplet, AlertCircle, CheckCircle, Coins } from 'lucide-react';
import { withReact19Compat } from './React19CompatWrapper';

const WalletConnectComponent: React.FC = () => {
  const { address, isConnected } = useSuiWallet();
  const { balances, isLoading } = useTokenBalances();
  const [mounted, setMounted] = useState(false);
  const [showTokens, setShowTokens] = useState(false);
  const [suiBalance, setSuiBalance] = useState<string>('0.0000');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowTokens(false);
      }
    };

    if (showTokens) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showTokens]);

  // Fetch SUI balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (!address) return;
      
      try {
        const balance = await suiClient.getBalance({
          owner: address,
          coinType: '0x2::sui::SUI'
        });
        
        // Convert from MIST to SUI (1 SUI = 10^9 MIST)
        const suiAmount = (Number(balance.totalBalance) / 1_000_000_000).toFixed(4);
        setSuiBalance(suiAmount);
      } catch (error) {
        console.error('Error fetching SUI balance:', error);
        setSuiBalance('0.0000');
      }
    };

    if (isConnected && address) {
      fetchBalance();
      // Refresh balance every 10 seconds
      const interval = setInterval(fetchBalance, 10000);
      return () => clearInterval(interval);
    }
  }, [address, isConnected]);

  if (!mounted) return null;

  const hasZeroBalance = parseFloat(suiBalance) === 0;

  // Get token balances
  const usdcBalance = balances.USDC?.balance || '0';
  const walBalance = balances.WAL?.balance || '0';
  const hasUSDC = parseFloat(usdcBalance) > 0;
  const hasWAL = parseFloat(walBalance) > 0;

  return (
    <div className="flex items-center gap-2">
      {isConnected && address ? (
        <>
          {/* Token Balances Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowTokens(!showTokens)}
              className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-md border border-white/10 hover:border-walrus-teal/30 transition-all"
              title="View token balances"
              aria-expanded={showTokens}
              aria-haspopup="true"
            >
              <Coins size={11} className="text-walrus-teal" />
              <span className="text-white/50 text-[10px] font-mono">SUI:</span>
              <span className="text-white font-bold text-xs font-mono">{suiBalance}</span>
            </button>
            
            {/* Token Dropdown */}
            {showTokens && (
              <div 
                className="absolute top-full right-0 mt-1 bg-black/95 border border-walrus-teal/30 rounded-lg shadow-xl backdrop-blur-xl min-w-[140px] z-50"
                role="menu"
                aria-label="Token balances"
              >
                <div className="p-2 space-y-1">
                  <div className="text-[9px] text-walrus-teal/70 font-mono uppercase px-1">Balances</div>
                  <div className="flex items-center justify-between px-1 py-0.5" role="menuitem">
                    <span className="text-white/50 text-[10px] font-mono">SUI:</span>
                    <span className="text-white font-bold text-[10px] font-mono">{suiBalance}</span>
                  </div>
                  <div className="flex items-center justify-between px-1 py-0.5" role="menuitem">
                    <span className="text-white/50 text-[10px] font-mono">USDC:</span>
                    <span className={`font-bold text-[10px] font-mono ${hasUSDC ? 'text-green-400' : 'text-white/30'}`}>
                      {parseFloat(usdcBalance).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-1 py-0.5" role="menuitem">
                    <span className="text-white/50 text-[10px] font-mono">WAL:</span>
                    <span className={`font-bold text-[10px] font-mono ${hasWAL ? 'text-walrus-teal' : 'text-white/30'}`}>
                      {parseFloat(walBalance).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Faucet Button - Compact, show when balance is 0 */}
          {hasZeroBalance && (
            <a
              href="https://faucet.sui.io/?address=0xce2162a53565ac45e6338efcac7318d83d69debe934498bb2f592cee1f0410c9"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 bg-blue-500/10 hover:bg-blue-500/20 px-2 py-1 rounded-md border border-blue-500/30 transition-all group"
              title="Get free testnet SUI"
            >
              <Droplet size={11} className="text-blue-400 group-hover:animate-bounce" />
              <span className="text-blue-400 font-bold text-[10px]">Faucet</span>
            </a>
          )}

          {/* Connected Address - Compact */}
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-walrus-teal/10 to-walrus-purple/10 px-2 py-1 rounded-md border border-walrus-purple/30 shadow-sm">
            <Wallet size={11} className="text-walrus-purple" />
            <span className="text-walrus-purple font-bold text-[10px] font-mono">
              {address.slice(0, 4)}...{address.slice(-4)}
            </span>
          </div>
          
          {/* Contract Status - Only show icon when not deployed */}
          {!CONTRACTS_DEPLOYED && (
            <button
              onClick={() => window.open('DEPLOY_YOUR_WALLET.md', '_blank')}
              className="flex items-center gap-1 bg-yellow-500/10 hover:bg-yellow-500/20 px-2 py-1 rounded-md border border-yellow-500/30 transition-all group"
              title="Deploy Contracts"
            >
              <AlertCircle size={11} className="text-yellow-400" />
              <span className="text-yellow-400 font-bold text-[10px]">Deploy</span>
            </button>
          )}

          {/* Use Suiet Wallet Kit's ConnectButton for disconnect - styled to match theme */}
          <div className="wallet-kit-button-wrapper" role="group" aria-label="Wallet controls">
            <ConnectButton key={`wallet-${address}`} />
          </div>
        </>
      ) : (
        <div className="wallet-kit-button-wrapper" role="group" aria-label="Connect wallet">
          <ConnectButton key="wallet-connect">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-walrus-teal to-walrus-purple hover:from-walrus-teal/90 hover:to-walrus-purple/90 text-black font-bold text-xs rounded-lg transition-all duration-300 cursor-pointer shadow-lg hover:shadow-walrus-purple-glow hover:scale-105 active:scale-95">
              <Wallet size={14} />
              <span>Connect Wallet</span>
            </div>
          </ConnectButton>
        </div>
      )}
    </div>
  );
};

// Export with React 19 compatibility wrapper
export const WalletConnect = withReact19Compat(WalletConnectComponent);
