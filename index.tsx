import React from 'react';
import ReactDOM from 'react-dom/client';
import { WalletProvider, AllDefaultWallets, SuiWallet } from '@suiet/wallet-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import '@suiet/wallet-kit/style.css';
import './wallet-kit-theme.css';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 60000, // 1 minute
    },
  },
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Custom wallet order - Sui Wallet (Suiet) at top
const customWallets = [
  SuiWallet, // Suiet/Sui Wallet first
  ...AllDefaultWallets.filter(w => w.name !== 'Sui Wallet'),
];

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WalletProvider defaultWallets={customWallets}>
        <App />
      </WalletProvider>
    </QueryClientProvider>
  </React.StrictMode>
);