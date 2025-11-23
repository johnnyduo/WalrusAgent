// 🐋 WALRUS AGENTS - Walrus API Test Script
// Run with: npx tsx test-walrus-api.ts

import { walrusService } from './services/walrusService';

async function testWalrusIntegration() {
  console.log('🐋 Testing Walrus Protocol Integration\n');

  try {
    // Test 1: Upload model weights
    console.log('📤 Test 1: Uploading model weights...');
    const weights = new Float32Array([0.5, 0.3, 0.8, 0.2]);
    const metadata = {
      version: '1.0.0',
      accuracy: 0.85,
      loss: 0.15,
      timestamp: Date.now()
    };
    
    const weightsBlobId = await walrusService.uploadModelWeights(weights, metadata);
    console.log(`✅ Weights uploaded: ${weightsBlobId}\n`);

    // Test 2: Upload model delta
    console.log('📤 Test 2: Uploading model delta...');
    const delta = new Float32Array([0.01, -0.02, 0.03, -0.01]);
    const deltaBlobId = await walrusService.uploadModelDelta(delta, 'agent_001', 1);
    console.log(`✅ Delta uploaded: ${deltaBlobId}\n`);

    // Test 3: Upload embeddings
    console.log('📤 Test 3: Uploading embeddings...');
    const embeddings = [[0.1, 0.2, 0.3], [0.4, 0.5, 0.6]];
    const embeddingsBlobId = await walrusService.uploadEmbeddings(embeddings, 'test-agent');
    console.log(`✅ Embeddings uploaded: ${embeddingsBlobId}\n`);

    // Test 4: Retrieve data
    console.log('📥 Test 4: Retrieving data...');
    const retrievedWeights = await walrusService.retrieveBlob(weightsBlobId);
    console.log(`✅ Retrieved data: ${retrievedWeights.substring(0, 100)}...\n`);

    // Test 5: Check storage info
    console.log('ℹ️  Test 5: Storage info...');
    const info = await walrusService.getStorageInfo(weightsBlobId);
    console.log(`✅ Storage epochs: ${info.epochs || 'N/A'}`);
    console.log(`✅ Size: ${info.size || 'N/A'} bytes\n`);

    console.log('🎉 All tests passed!\n');
    console.log('Walrus Explorer:');
    console.log(`- Weights: https://aggregator.walrus-testnet.walrus.space/v1/${weightsBlobId}`);
    console.log(`- Delta: https://aggregator.walrus-testnet.walrus.space/v1/${deltaBlobId}`);
    console.log(`- Embeddings: https://aggregator.walrus-testnet.walrus.space/v1/${embeddingsBlobId}`);

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testWalrusIntegration();
