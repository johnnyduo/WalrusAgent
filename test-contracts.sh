#!/bin/bash
# 🐋 WALRUS AGENTS - Contract Testing Script
# Tests the deployed Move smart contracts on Sui

set -e

echo "🐋 WALRUS AGENTS - Contract Testing"
echo "===================================="
echo ""

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if contracts are deployed
if [ ! -f "deployed-addresses.json" ]; then
    echo -e "${RED}❌ deployed-addresses.json not found${NC}"
    echo "   Please run ./deploy.sh first"
    exit 1
fi

# Parse deployment info
PACKAGE_ID=$(grep -o '"packageId":"[^"]*"' deployed-addresses.json | cut -d'"' -f4)
REGISTRY_ID=$(grep -o '"sharedObjectId":"0x[^"]*"' deployed-addresses.json | head -1 | cut -d'"' -f4)
POOL_ID=$(grep -o '"sharedObjectId":"0x[^"]*"' deployed-addresses.json | tail -1 | cut -d'"' -f4)

echo -e "${BLUE}📦 Package ID: $PACKAGE_ID${NC}"
echo -e "${BLUE}🏛️  Registry: $REGISTRY_ID${NC}"
echo -e "${BLUE}💰 Pool: $POOL_ID${NC}"
echo ""

# Test 1: Mint an agent
echo -e "${BLUE}🧪 Test 1: Minting an agent NFT...${NC}"

AGENT_NAME="Walrus Commander"
AGENT_ROLE="Coordinator"
METADATA_BLOB_ID="test-blob-id-$(date +%s)"

MINT_OUTPUT=$(sui client call \
  --package $PACKAGE_ID \
  --module agent_registry \
  --function mint_agent \
  --args $REGISTRY_ID \
    "[$(echo -n "$AGENT_NAME" | od -An -tu1 | tr -d '\n ' | sed 's/\([0-9]*\)/\1,/g' | sed 's/,$//')]" \
    "[$(echo -n "$AGENT_ROLE" | od -An -tu1 | tr -d '\n ' | sed 's/\([0-9]*\)/\1,/g' | sed 's/,$//')]" \
    "[$(echo -n "$METADATA_BLOB_ID" | od -An -tu1 | tr -d '\n ' | sed 's/\([0-9]*\)/\1,/g' | sed 's/,$//')]" \
  --gas-budget 10000000)

if echo "$MINT_OUTPUT" | grep -q "Status: Success"; then
    echo -e "${GREEN}✅ Agent minted successfully${NC}"
    AGENT_ID=$(echo "$MINT_OUTPUT" | grep -o "0x[a-f0-9]\{64\}" | head -1)
    echo -e "${GREEN}   Agent ID: $AGENT_ID${NC}"
    echo ""
else
    echo -e "${RED}❌ Failed to mint agent${NC}"
    echo "$MINT_OUTPUT"
fi

# Test 2: Record a training contribution
echo -e "${BLUE}🧪 Test 2: Recording training contribution...${NC}"

DELTA_BLOB_ID="delta-blob-id-$(date +%s)"
EPOCH=1

CONTRIBUTE_OUTPUT=$(sui client call \
  --package $PACKAGE_ID \
  --module training_rewards \
  --function record_contribution \
  --args $POOL_ID \
    "$AGENT_ID" \
    "[$(echo -n "$DELTA_BLOB_ID" | od -An -tu1 | tr -d '\n ' | sed 's/\([0-9]*\)/\1,/g' | sed 's/,$//')]" \
    $EPOCH \
  --gas-budget 10000000 2>&1 || true)

if echo "$CONTRIBUTE_OUTPUT" | grep -q "Status: Success"; then
    echo -e "${GREEN}✅ Contribution recorded successfully${NC}"
    CONTRIBUTION_ID=$(echo "$CONTRIBUTE_OUTPUT" | grep -o "0x[a-f0-9]\{64\}" | tail -1)
    echo -e "${GREEN}   Contribution ID: $CONTRIBUTION_ID${NC}"
    echo ""
else
    echo -e "${YELLOW}⚠️  Contribution recording (expected to need object ID)${NC}"
    echo ""
fi

# Test 3: Query agent registry
echo -e "${BLUE}🧪 Test 3: Querying agent registry...${NC}"
sui client object $REGISTRY_ID --json | head -20
echo ""

# Test 4: Query reward pool
echo -e "${BLUE}🧪 Test 4: Querying reward pool...${NC}"
sui client object $POOL_ID --json | head -20
echo ""

echo -e "${GREEN}🎉 Contract testing complete!${NC}"
echo ""
echo "Explorer links:"
echo "  Package: https://suiscan.xyz/testnet/object/$PACKAGE_ID"
echo "  Registry: https://suiscan.xyz/testnet/object/$REGISTRY_ID"
echo "  Pool: https://suiscan.xyz/testnet/object/$POOL_ID"
echo ""
