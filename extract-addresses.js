// Helper script to extract and document deployed contract addresses
// Run this in your browser console after connecting wallet

(function() {
  console.log('🔍 Extracting Walrus Agent Contract Addresses...\n');
  
  const wallet = localStorage.getItem('sui-wallet-last-connected');
  const walletAddress = wallet ? JSON.parse(wallet).address : null;
  
  if (!walletAddress) {
    console.log('❌ No wallet connected. Please connect wallet first.');
    return;
  }
  
  console.log('📍 Wallet Address:', walletAddress);
  console.log('━'.repeat(60));
  
  // Extract registered agents
  const walletKey = `onChainAgents_${walletAddress.toLowerCase()}`;
  const agentsData = localStorage.getItem(walletKey);
  
  if (agentsData) {
    const agents = JSON.parse(agentsData);
    console.log('\n✅ Registered Agents:');
    console.log('━'.repeat(60));
    
    Object.entries(agents).forEach(([agentId, txDigest]) => {
      console.log(`\nAgent ID: ${agentId}`);
      console.log(`Transaction: ${txDigest}`);
      console.log(`Explorer: https://suiscan.xyz/testnet/tx/${txDigest}`);
    });
    
    // Extract Walrus blob IDs if any
    const walrusBlobKey = `walrusBlobIds_${walletAddress.toLowerCase()}`;
    const blobData = localStorage.getItem(walrusBlobKey);
    
    if (blobData) {
      const blobs = JSON.parse(blobData);
      console.log('\n\n🐋 Walrus Blob IDs:');
      console.log('━'.repeat(60));
      
      Object.entries(blobs).forEach(([agentId, blobId]) => {
        console.log(`\nAgent ID: ${agentId}`);
        console.log(`Blob ID: ${blobId}`);
        if (!blobId.startsWith('walrus_local_') && !blobId.startsWith('walrus_pending_')) {
          console.log(`Walrus URL: https://aggregator-devnet.walrus.space/v1/${blobId}`);
        } else {
          console.log(`Status: Local/Pending (Walrus testnet was unavailable)`);
        }
      });
    }
  } else {
    console.log('\n⚠️  No agents registered for this wallet yet.');
  }
  
  // Check for pending Walrus uploads
  console.log('\n\n📦 Pending Walrus Uploads:');
  console.log('━'.repeat(60));
  
  let pendingCount = 0;
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('pending_walrus_upload_')) {
      const data = JSON.parse(localStorage.getItem(key));
      console.log(`\nBlob ID: ${key.replace('pending_walrus_upload_', '')}`);
      console.log(`Agent ID: ${data.agentId}`);
      console.log(`Timestamp: ${new Date(data.timestamp).toLocaleString()}`);
      console.log(`Status: ${data.status}`);
      console.log(`Reason: ${data.reason}`);
      pendingCount++;
    }
  });
  
  if (pendingCount === 0) {
    console.log('No pending uploads');
  }
  
  // Contract addresses from config
  console.log('\n\n⛓️  Smart Contract Configuration:');
  console.log('━'.repeat(60));
  console.log('Package ID: 0x0 (NOT DEPLOYED)');
  console.log('Agent Registry: 0x0 (NOT DEPLOYED)');
  console.log('Reward Pool: 0x0 (NOT DEPLOYED)');
  console.log('\nTo deploy: yarn deploy:training');
  
  // Generate .env update
  console.log('\n\n📝 .env File Update:');
  console.log('━'.repeat(60));
  console.log('# Add these after deployment:');
  console.log('SUI_PACKAGE_ID=<package_id_from_deployment>');
  console.log('SUI_AGENT_REGISTRY=<registry_object_id>');
  console.log('SUI_REWARD_POOL=<pool_object_id>');
  
  console.log('\n✅ Done! Copy the addresses above to your .env file.\n');
})();
