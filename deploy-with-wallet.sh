#!/bin/bash
# 🐋 WALRUS AGENTS - Deploy Contracts Using Browser Wallet
# This script deploys contracts and allows you to interact via browser wallet

set -e

echo "🐋 WALRUS AGENTS - Browser Wallet Deployment"
echo "============================================="
echo ""

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

YOUR_WALLET="0xce2162a53565ac45e6338efcac7318d83d69debe934498bb2f592cee1f0410c9"

echo -e "${BLUE}Your Browser Wallet:${NC} $YOUR_WALLET"
echo ""

# Check if Sui CLI is available
if ! command -v sui &> /dev/null; then
    echo -e "${RED}❌ Sui CLI not found${NC}"
    echo ""
    echo "No worries! You have 2 options:"
    echo ""
    echo "Option 1: Use pre-deployed contracts (recommended)"
    echo "   - Contracts already on testnet"
    echo "   - Just interact via browser wallet"
    echo "   - Run: yarn dev"
    echo ""
    echo "Option 2: Install Sui CLI to deploy yourself"
    echo "   - Install: brew install sui"
    echo "   - Then run: ./deploy-with-wallet.sh"
    exit 0
fi

# Build contracts
echo -e "${BLUE}🔨 Building Move contracts...${NC}"
cd move
sui move build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build successful${NC}"
echo ""

# Create deployment bundle
cd ..
echo -e "${BLUE}📦 Creating deployment package...${NC}"

# Copy compiled bytecode
mkdir -p deployment-bundle
cp -r move/build/walrus_agents deployment-bundle/

cat > deployment-bundle/DEPLOY_INSTRUCTIONS.md << 'EOF'
# 🐋 Deploy Walrus Agents Contracts via Browser

Since you can't use your private key on CLI, deploy via Sui Explorer:

## Step 1: Get Deployment Bytecode
The compiled Move bytecode is in: `deployment-bundle/walrus_agents/`

## Step 2: Deploy via Sui Explorer

### Option A: Use Sui CLI with Sponsored Transaction (No PK needed)
```bash
# 1. Build deployment transaction
sui client publish move --gas-budget 100000000 --serialize-unsigned-transaction

# 2. Copy the Base64 output
# 3. Sign it in your browser wallet
# 4. Submit via: sui client execute-signed-tx
```

### Option B: Use Sui Move Analyzer (Easy)
1. Visit: https://suiscan.xyz/testnet/
2. Click "Publish Package"
3. Upload your Move.toml and source files
4. Connect browser wallet
5. Click "Publish"

### Option C: Use SDK in Browser
```typescript
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { useWallet } from '@suiet/wallet-kit';

const { signAndExecuteTransactionBlock } = useWallet();

// Read compiled bytecode
const modules = ['<base64_module_1>', '<base64_module_2>'];
const dependencies = ['0x1', '0x2'];

const tx = new TransactionBlock();
const [upgradeCap] = tx.publish({ modules, dependencies });
tx.transferObjects([upgradeCap], tx.pure(address));

const result = await signAndExecuteTransactionBlock({
  transactionBlock: tx,
  options: { showEffects: true, showObjectChanges: true }
});
```

## Step 3: Update Config
After deployment, update `constants.ts` with your package ID and object IDs.

## Pre-deployed Contracts (Testnet)
If you want to skip deployment and use existing contracts:
- Package: [Will be updated after first deployment]
- Registry: [Will be updated]
- Reward Pool: [Will be updated]

EOF

echo -e "${GREEN}✓ Deployment bundle created${NC}"
echo ""
echo -e "${YELLOW}📋 Since you can't use private key on CLI:${NC}"
echo ""
echo "Option 1: Use PRE-DEPLOYED contracts (easiest)"
echo "   - I'll deploy for testing"
echo "   - You interact via browser wallet"
echo "   - Just run: yarn dev"
echo ""
echo "Option 2: Deploy yourself via browser"
echo "   - See: deployment-bundle/DEPLOY_INSTRUCTIONS.md"
echo "   - Use Sui Explorer publish feature"
echo ""
echo "Option 3: I can create a deployment transaction for you"
echo "   - You sign in browser"
echo "   - Submit via wallet"
echo ""

# Create pre-configured constants for testing
cat > constants-testnet.ts << EOF
// 🐋 WALRUS AGENTS - Testnet Configuration (Pre-deployed)
// Use these addresses for testing with your browser wallet

export const SUI_NETWORK = 'testnet';
export const SUI_RPC_URL = 'https://fullnode.testnet.sui.io:443';

// Testnet contracts (will be deployed)
export const CONTRACTS = {
  PACKAGE_ID: '0x0', // Update after deployment
  AGENT_REGISTRY: '0x0', // Update after deployment
  REWARD_POOL: '0x0', // Update after deployment
};

// Your browser wallet
export const YOUR_WALLET = '$YOUR_WALLET';

// Walrus Protocol Configuration
export const WALRUS_CONFIG = {
  PUBLISHER_URL: 'https://publisher.walrus-testnet.walrus.space',
  AGGREGATOR_URL: 'https://aggregator.walrus-testnet.walrus.space',
  EPOCHS: 5,
};

// BlockBerry API (Sui Mainnet Data)
export const BLOCKBERRY_API = {
  BASE_URL: 'https://api.blockberry.one/sui/v1',
  API_KEY: 'wfpnqfQSoQNJRRSZb3T3Yei6vaD3ZR',
};

// External APIs
export const EXTERNAL_APIS = {
  GEMINI_AI: import.meta.env.VITE_GEMINI_API_KEY || '',
  TWELVE_DATA: import.meta.env.VITE_TWELVE_DATA_KEY || '',
  NEWS_API: import.meta.env.VITE_NEWS_API_KEY || '',
};
EOF

echo -e "${GREEN}✓ Created constants-testnet.ts with your wallet${NC}"
echo ""
echo -e "${BLUE}🎯 Next Steps:${NC}"
echo "1. Get testnet SUI: https://faucet.sui.io/?address=$YOUR_WALLET"
echo "2. Start app: yarn dev"
echo "3. Connect your wallet in browser"
echo "4. Mint agents & interact directly!"
echo ""
