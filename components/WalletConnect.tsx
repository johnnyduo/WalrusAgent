import React, { useEffect, useState } from 'react';
import { useSuiWallet } from '../hooks/useSuiWallet';
import { ConnectButton } from '@suiet/wallet-kit';
import { suiClient, CONTRACTS_DEPLOYED } from '../config/suiWalletConfig';
import { Wallet, Droplet, AlertCircle, CheckCircle } from 'lucide-react';

export const WalletConnect: React.FC = () => {
  const { address, isConnected } = useSuiWallet();
  const [mounted, setMounted] = useState(false);
  const [suiBalance, setSuiBalance] = useState<string>('0.0000');

  useEffect(() => {
    setMounted(true);
  }, []);

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

  return (
    <div className="flex items-center gap-3">
      {/* Contract Deployment Status */}
      <div className={`flex items-center gap-2 px-3 py-1 rounded border text-xs ${
        CONTRACTS_DEPLOYED 
          ? 'bg-green-500/10 border-green-500/30 text-green-400' 
          : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
      }`}>
        {CONTRACTS_DEPLOYED ? (
          <>
            <CheckCircle size={12} />
            <span className="font-mono">Contracts Live</span>
          </>
        ) : (
          <>
            <AlertCircle size={12} />
            <span className="font-mono">Deploy Contracts</span>
          </>
        )}
      </div>

      {isConnected && address ? (
        <>
          {/* SUI Balance */}
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded border border-white/10">
            <span className="text-gray-400 text-xs font-mono">SUI:</span>
            <span className="text-white font-bold text-xs font-mono">
              {suiBalance}
            </span>
          </div>

          {/* Faucet Button - Show when balance is 0 */}
          {hasZeroBalance && (
            <a
              href="https://faucet.testnet.sui.io"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1 rounded border border-blue-500/30 transition-colors group"
              title="Get free testnet SUI"
            >
              <Droplet size={14} className="text-blue-400 group-hover:animate-bounce" />
              <span className="text-blue-400 font-bold text-xs">Get SUI</span>
            </a>
          )}

          {/* Connected Address */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-walrus-teal/10 to-walrus-purple/10 px-3 py-1 rounded border border-walrus-purple/30">
            <Wallet size={14} className="text-walrus-purple" />
            <span className="text-walrus-purple font-bold text-xs">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
          </div>

          {/* Use Suiet Wallet Kit's ConnectButton for disconnect */}
          <ConnectButton />
        </>
      ) : (
        <ConnectButton>
          <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-walrus-teal to-walrus-purple hover:from-walrus-teal/80 hover:to-walrus-purple/80 text-black font-bold text-xs rounded transition-all duration-300 cursor-pointer shadow-lg hover:shadow-walrus-purple-glow">
            <Wallet size={14} />
            Connect Wallet
          </div>
        </ConnectButton>
      )}
    </div>
  );
};
