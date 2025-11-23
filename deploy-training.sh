#!/bin/bash
# Deploy Training Rewards Contract to Sui Testnet

echo "🚀 Deploying Walrus Agents Training Rewards to Sui Testnet..."
echo ""

# Check if sui CLI is installed
if ! command -v sui &> /dev/null; then
    echo "❌ Sui CLI not found. Please install it first:"
    echo "   cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui"
    exit 1
fi

# Check active address
ACTIVE_ADDRESS=$(sui client active-address)
echo "📍 Active Address: $ACTIVE_ADDRESS"
echo ""

# Build the contract
echo "🔨 Building Move contracts..."
cd move
sui move build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi
cd ..

echo "✅ Build successful"
echo ""

# Deploy to testnet
echo "📤 Publishing to Sui Testnet..."
DEPLOY_OUTPUT=$(sui client publish --gas-budget 100000000 move 2>&1)

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed"
    echo "$DEPLOY_OUTPUT"
    exit 1
fi

echo "$DEPLOY_OUTPUT"
echo ""

# Parse deployment output
PACKAGE_ID=$(echo "$DEPLOY_OUTPUT" | grep "Published Objects:" -A 20 | grep "PackageID" | awk '{print $2}')
REWARD_POOL=$(echo "$DEPLOY_OUTPUT" | grep "RewardPool" -A 5 | grep "ObjectID" | awk '{print $2}')
AGENT_REGISTRY=$(echo "$DEPLOY_OUTPUT" | grep "AgentRegistry" -A 5 | grep "ObjectID" | awk '{print $2}')

echo "✅ Deployment Complete!"
echo ""
echo "📦 Package ID: $PACKAGE_ID"
echo "🎁 Reward Pool: $REWARD_POOL"
echo "📋 Agent Registry: $AGENT_REGISTRY"
echo ""

# Update deployed-addresses.json
cat > deployed-addresses.json << EOF
{
  "network": "testnet",
  "deployedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "deployer": "$ACTIVE_ADDRESS",
  "packageId": "$PACKAGE_ID",
  "contracts": {
    "agentRegistry": {
      "moduleId": "${PACKAGE_ID}::agent_registry",
      "sharedObjectId": "$AGENT_REGISTRY"
    },
    "trainingRewards": {
      "moduleId": "${PACKAGE_ID}::training_rewards",
      "sharedObjectId": "$REWARD_POOL"
    }
  },
  "explorer": {
    "package": "https://suiscan.xyz/testnet/object/$PACKAGE_ID",
    "registry": "https://suiscan.xyz/testnet/object/$AGENT_REGISTRY",
    "pool": "https://suiscan.xyz/testnet/object/$REWARD_POOL"
  }
}
EOF

echo "💾 Contract addresses saved to deployed-addresses.json"
echo ""
echo "🔗 View on Explorer:"
echo "   Package: https://suiscan.xyz/testnet/object/$PACKAGE_ID"
echo "   Reward Pool: https://suiscan.xyz/testnet/object/$REWARD_POOL"
echo ""
echo "⚠️  IMPORTANT: Fund the reward pool to enable training rewards!"
echo "   Run: sui client call --package $PACKAGE_ID --module training_rewards --function fund_pool --args $REWARD_POOL <COIN_OBJECT> --gas-budget 10000000"
