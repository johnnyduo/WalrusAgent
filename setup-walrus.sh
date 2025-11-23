#!/bin/bash
# 🐋 WALRUS AGENTS - Walrus Protocol Setup Script
# This script helps you configure Walrus storage integration

set -e

echo "🐋 WALRUS AGENTS - Walrus Protocol Setup"
echo "========================================="
echo ""

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if Walrus CLI is installed
if ! command -v walrus &> /dev/null; then
    echo -e "${YELLOW}⚠️  Walrus CLI not found${NC}"
    echo ""
    echo "Walrus CLI is optional for browser-based usage."
    echo "The app uses Walrus HTTP API by default."
    echo ""
    echo "To install Walrus CLI (optional):"
    echo "  Visit: https://docs.walrus.site/usage/setup.html"
    echo ""
else
    echo -e "${GREEN}✓ Walrus CLI found: $(walrus --version)${NC}"
    echo ""
fi

# Test Walrus Publisher connection
echo -e "${BLUE}🧪 Testing Walrus Publisher connection...${NC}"
PUBLISHER_URL="https://publisher.walrus-testnet.walrus.space"

# Create a test file
TEST_DATA='{"test":"walrus-agents","timestamp":"'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"}'
echo "$TEST_DATA" > /tmp/walrus-test.json

# Upload test data
UPLOAD_RESPONSE=$(curl -s -X PUT "${PUBLISHER_URL}/v1/store?epochs=5" \
  -H "Content-Type: application/json" \
  --data-binary @/tmp/walrus-test.json)

if echo "$UPLOAD_RESPONSE" | grep -q "blobId"; then
    BLOB_ID=$(echo "$UPLOAD_RESPONSE" | grep -o '"blobId":"[^"]*"' | cut -d'"' -f4)
    echo -e "${GREEN}✓ Successfully stored test data on Walrus${NC}"
    echo -e "${GREEN}  Blob ID: $BLOB_ID${NC}"
    echo ""
    
    # Test retrieval
    echo -e "${BLUE}🔍 Testing Walrus Aggregator retrieval...${NC}"
    AGGREGATOR_URL="https://aggregator.walrus-testnet.walrus.space"
    
    RETRIEVE_RESPONSE=$(curl -s "${AGGREGATOR_URL}/v1/${BLOB_ID}")
    
    if [ ! -z "$RETRIEVE_RESPONSE" ]; then
        echo -e "${GREEN}✓ Successfully retrieved data from Walrus${NC}"
        echo -e "${GREEN}  Data: $RETRIEVE_RESPONSE${NC}"
        echo ""
    else
        echo -e "${RED}❌ Failed to retrieve data${NC}"
    fi
else
    echo -e "${RED}❌ Failed to store data on Walrus${NC}"
    echo "Response: $UPLOAD_RESPONSE"
    echo ""
    echo "This might be a temporary issue. The app will still work."
    echo ""
fi

# Clean up
rm -f /tmp/walrus-test.json

# Show Walrus configuration
echo -e "${BLUE}📋 Walrus Configuration${NC}"
echo "======================="
echo ""
echo "Publisher URL:  $PUBLISHER_URL"
echo "Aggregator URL: $AGGREGATOR_URL"
echo "Storage Epochs: 5-10 (configurable)"
echo "Network:        Testnet"
echo ""

# Create Walrus service test script
cat > test-walrus-api.ts << 'EOF'
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
EOF

echo -e "${GREEN}✓ Created test-walrus-api.ts${NC}"
echo ""

echo -e "${GREEN}🎉 Walrus setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Test Walrus API: npx tsx test-walrus-api.ts"
echo "2. Check deployed contracts: cat deployed-addresses.json"
echo "3. Start training: npm run dev"
echo ""
echo "📚 Documentation:"
echo "   Walrus Docs: https://docs.walrus.site"
echo "   Sui Docs: https://docs.sui.io"
echo ""
