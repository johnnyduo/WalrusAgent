// 🐋 WALRUS AGENTS - Browser Wallet Deployment Helper
// Run with: yarn tsx deploy-browser.ts

import { TransactionBlock } from '@mysten/sui.js/transactions';
import { SuiClient } from '@mysten/sui.js/client';
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

const YOUR_WALLET = '0xce2162a53565ac45e6338efcac7318d83d69debe934498bb2f592cee1f0410c9';
const RPC_URL = 'https://fullnode.testnet.sui.io:443';

async function createDeploymentTransaction() {
  console.log('🐋 WALRUS AGENTS - Browser Deployment Helper\n');
  console.log(`Your Wallet: ${YOUR_WALLET}\n`);

  // Step 1: Build the Move package
  console.log('📦 Building Move package...');
  try {
    execSync('cd move && sui move build', { stdio: 'inherit' });
    console.log('✅ Build successful\n');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }

  // Step 2: Create serialized deployment transaction
  console.log('📝 Creating deployment transaction...');
  try {
    const output = execSync(
      'cd move && sui client publish --gas-budget 100000000 --serialize-unsigned-transaction --skip-dependency-verification',
      { encoding: 'utf-8' }
    );

    const txBytes = output.trim();
    
    // Save transaction bytes
    writeFileSync('deployment-tx.txt', txBytes);
    
    console.log('✅ Transaction created\n');
    console.log('📋 Deployment Transaction (Base64):');
    console.log(txBytes);
    console.log('\n');

    // Create instructions
    const instructions = `
🐋 WALRUS AGENTS - Deploy via Browser Wallet

Step 1: Get testnet SUI tokens
   Visit: https://faucet.sui.io/?address=${YOUR_WALLET}
   Request tokens, wait for confirmation

Step 2: Deploy via Sui Explorer
   A) Visit: https://suiscan.xyz/testnet/home
   B) Click your wallet icon (top right)
   C) Go to "Transactions" → "Execute Transaction"
   D) Paste the Base64 transaction (saved in deployment-tx.txt)
   E) Click "Execute"
   
   OR use this direct link:
   https://suiscan.xyz/testnet/tx/execute?data=${encodeURIComponent(txBytes)}

Step 3: After deployment
   A) Copy the Package ID from transaction result
   B) Copy the Shared Object IDs (Registry & Pool)
   C) Update deployed-addresses.json:
   
   {
     "network": "testnet",
     "deployedAt": "${new Date().toISOString()}",
     "deployer": "${YOUR_WALLET}",
     "packageId": "0x...",
     "agentRegistryId": "0x...",
     "rewardPoolId": "0x..."
   }

Step 4: Start the app
   yarn dev

Alternative: Deploy via Wallet Connect
   1. yarn dev
   2. Connect your wallet
   3. Use the "Deploy Contracts" button (if implemented)

Transaction saved to: deployment-tx.txt
`;

    console.log(instructions);
    writeFileSync('DEPLOY_VIA_BROWSER.md', instructions);
    console.log('✅ Instructions saved to DEPLOY_VIA_BROWSER.md\n');

  } catch (error: any) {
    if (error.message?.includes('No wallet')) {
      console.log('\n⚠️  No CLI wallet configured (expected)\n');
      console.log('Alternative: Deploy manually\n');
      console.log('1. Build: cd move && sui move build');
      console.log('2. Visit: https://suiscan.xyz/testnet/');
      console.log('3. Click "Publish Package"');
      console.log('4. Upload your Move files');
      console.log('5. Connect wallet & deploy\n');
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Alternative: Create a ready-to-use transaction block
async function createTxBlock() {
  console.log('\n📦 Creating Transaction Block (for SDK usage)...\n');
  
  const code = `
// Use this in your React app with @suiet/wallet-kit

import { TransactionBlock } from '@mysten/sui.js/transactions';
import { useWallet } from '@suiet/wallet-kit';

function DeployContracts() {
  const { signAndExecuteTransactionBlock } = useWallet();
  
  async function deployContracts() {
    // Read compiled modules (you need to base64 encode them)
    const modules = []; // Array of base64 module bytecode
    const dependencies = ['0x1', '0x2']; // Sui framework dependencies
    
    const tx = new TransactionBlock();
    const [upgradeCap] = tx.publish({ modules, dependencies });
    tx.transferObjects([upgradeCap], tx.pure('${YOUR_WALLET}'));
    
    try {
      const result = await signAndExecuteTransactionBlock({
        transactionBlock: tx,
        options: {
          showEffects: true,
          showObjectChanges: true
        }
      });
      
      console.log('Deployed!', result);
      
      // Extract package ID and object IDs from result
      const packageId = result.objectChanges?.find(c => c.type === 'published')?.packageId;
      const sharedObjects = result.objectChanges?.filter(c => c.type === 'created');
      
      return { packageId, sharedObjects };
    } catch (error) {
      console.error('Deployment failed:', error);
    }
  }
  
  return <button onClick={deployContracts}>Deploy Contracts</button>;
}
`;

  writeFileSync('deploy-sdk-example.tsx', code);
  console.log('✅ SDK example saved to deploy-sdk-example.tsx\n');
}

createDeploymentTransaction().then(() => createTxBlock());
