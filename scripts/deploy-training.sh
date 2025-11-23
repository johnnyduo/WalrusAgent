#!/bin/bash

# Deploy Training Rewards Contract to Sui Testnet
echo "🚀 Deploying Training Rewards Contract to Sui Testnet..."
echo ""

# Check if sui CLI is installed
if ! command -v sui &> /dev/null; then
    echo "❌ Sui CLI is not installed!"
    echo "   Please install it: cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui"
    exit 1
fi

# Switch to testnet
echo "📡 Switching to Sui testnet..."
sui client switch --env testnet

# Get active address
DEPLOYER=$(sui client active-address)
echo "👤 Deployer address: $DEPLOYER"
echo ""

# Build the Move package
echo "🔨 Building Move package..."
cd move
sui move build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Deploy the package
echo "🚀 Publishing to Sui testnet..."
DEPLOY_OUTPUT=$(sui client publish --gas-budget 100000000 --json)

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed!"
    exit 1
fi

echo "✅ Deployment successful!"
echo ""

# Parse deployment output
PACKAGE_ID=$(echo $DEPLOY_OUTPUT | jq -r '.objectChanges[] | select(.type == "published") | .packageId')
REWARD_POOL_ID=$(echo $DEPLOY_OUTPUT | jq -r '.objectChanges[] | select(.objectType | contains("RewardPool")) | .objectId')
ADMIN_CAP_ID=$(echo $DEPLOY_OUTPUT | jq -r '.objectChanges[] | select(.objectType | contains("RewardAdminCap")) | .objectId')
TX_DIGEST=$(echo $DEPLOY_OUTPUT | jq -r '.digest')

echo "📝 Deployment Details:"
echo "   Package ID: $PACKAGE_ID"
echo "   Reward Pool ID: $REWARD_POOL_ID"
echo "   Admin Cap ID: $ADMIN_CAP_ID"
echo "   Transaction: https://suiscan.xyz/testnet/tx/$TX_DIGEST"
echo ""

# Update deployed-addresses.json
cd ..
cat > deployed-addresses.json << EOF
{
  "network": "testnet",
  "deployedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "deployer": "$DEPLOYER",
  "packageId": "$PACKAGE_ID",
  "contracts": {
    "agentRegistry": {
      "moduleId": "0x0::agent_registry",
      "sharedObjectId": "0x0",
      "note": "NOT DEPLOYED - Using direct Sui object creation"
    },
    "trainingRewards": {
      "moduleId": "$PACKAGE_ID::training_rewards",
      "sharedObjectId": "$REWARD_POOL_ID",
      "adminCapId": "$ADMIN_CAP_ID",
      "note": "DEPLOYED - Training rewards pool ready"
    }
  },
  "explorer": {
    "package": "https://suiscan.xyz/testnet/object/$PACKAGE_ID",
    "registry": "https://suiscan.xyz/testnet/object/0x0",
    "pool": "https://suiscan.xyz/testnet/object/$REWARD_POOL_ID"
  },
  "transaction": {
    "digest": "$TX_DIGEST",
    "url": "https://suiscan.xyz/testnet/tx/$TX_DIGEST"
  }
}
EOF

echo "✅ Updated deployed-addresses.json"
echo ""
echo "🎉 Deployment complete! You can now:"
echo "   1. View package: https://suiscan.xyz/testnet/object/$PACKAGE_ID"
echo "   2. View reward pool: https://suiscan.xyz/testnet/object/$REWARD_POOL_ID"
echo "   3. Fund the pool with: yarn fund-pool <amount_in_sui>"
echo ""
echo "💡 Next steps:"
echo "   - Fund the reward pool to enable training rewards"
echo "   - Training dashboard will now submit real transactions to Sui"
echo ""
