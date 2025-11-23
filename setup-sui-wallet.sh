#!/bin/bash
# 🐋 Quick Sui Wallet Setup (No Downloads Required)

echo "🐋 WALRUS AGENTS - Quick Sui Setup"
echo "==================================="
echo ""
echo "This connects to Sui testnet via RPC (no node download needed)"
echo ""

# Create Sui config directory if it doesn't exist
mkdir -p ~/.sui/sui_config

# Create basic client.yaml
cat > ~/.sui/sui_config/client.yaml << 'EOF'
---
keystore:
  File: ~/.sui/sui_config/sui.keystore
envs:
  - alias: testnet
    rpc: "https://fullnode.testnet.sui.io:443"
    ws: ~
active_env: testnet
active_address: ""
EOF

echo "✅ Created Sui config"
echo ""

# Generate new address
echo "🔑 Generating new wallet address..."
sui client new-address ed25519 2>/dev/null || true

ACTIVE_ADDRESS=$(sui client active-address 2>/dev/null)

if [ ! -z "$ACTIVE_ADDRESS" ]; then
    echo ""
    echo "✅ Wallet setup complete!"
    echo ""
    echo "📍 Your Address: $ACTIVE_ADDRESS"
    echo ""
    echo "💰 Get testnet tokens:"
    echo "   1. Visit: https://faucet.testnet.sui.io/"
    echo "   2. Paste your address: $ACTIVE_ADDRESS"
    echo "   3. Click 'Request SUI'"
    echo ""
    echo "Or run: sui client faucet"
    echo ""
    echo "Then run: ./deploy.sh"
else
    echo "⚠️  Please run: sui client new-address ed25519"
fi
