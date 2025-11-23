#!/bin/bash

# Fund the Training Rewards Pool
AMOUNT=${1:-1}  # Default 1 SUI if not specified

if [ -z "$AMOUNT" ]; then
    echo "Usage: ./scripts/fund-pool.sh <amount_in_sui>"
    echo "Example: ./scripts/fund-pool.sh 10"
    exit 1
fi

echo "💰 Funding Training Rewards Pool with $AMOUNT SUI..."
echo ""

# Load deployed addresses
PACKAGE_ID=$(jq -r '.packageId' deployed-addresses.json)
REWARD_POOL_ID=$(jq -r '.contracts.trainingRewards.sharedObjectId' deployed-addresses.json)
ADMIN_CAP_ID=$(jq -r '.contracts.trainingRewards.adminCapId' deployed-addresses.json)

if [ "$PACKAGE_ID" == "0x0" ] || [ "$REWARD_POOL_ID" == "0x0" ]; then
    echo "❌ Contracts not deployed yet!"
    echo "   Run: yarn deploy:training"
    exit 1
fi

echo "📋 Contract Details:"
echo "   Package: $PACKAGE_ID"
echo "   Pool: $REWARD_POOL_ID"
echo "   Admin Cap: $ADMIN_CAP_ID"
echo ""

# Convert SUI to MIST (1 SUI = 1,000,000,000 MIST)
AMOUNT_MIST=$(echo "$AMOUNT * 1000000000" | bc)

# Create and execute transaction
sui client call \
    --package "$PACKAGE_ID" \
    --module "training_rewards" \
    --function "fund_pool" \
    --args "$REWARD_POOL_ID" "$ADMIN_CAP_ID" \
    --gas-budget 10000000

echo ""
echo "✅ Pool funded with $AMOUNT SUI!"
echo ""
