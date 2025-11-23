import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'import.meta.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'import.meta.env.TWELVEDATA_API_KEY': JSON.stringify(env.TWELVEDATA_API_KEY),
        'import.meta.env.NEWS_API_KEY': JSON.stringify(env.NEWS_API_KEY),
        'import.meta.env.BLOCKBERRY_API_KEY': JSON.stringify(env.BLOCKBERRY_API_KEY),
        'import.meta.env.BLOCKBERRY_API_URL': JSON.stringify(env.BLOCKBERRY_API_URL || 'https://api.blockberry.one/sui/v1'),
        'import.meta.env.WALRUS_AGGREGATOR_URL': JSON.stringify(env.WALRUS_AGGREGATOR_URL || 'https://aggregator.walrus-testnet.walrus.space'),
        'import.meta.env.WALRUS_PUBLISHER_URL': JSON.stringify(env.WALRUS_PUBLISHER_URL || 'https://publisher.walrus-testnet.walrus.space'),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
