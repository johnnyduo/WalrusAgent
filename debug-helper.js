// Debug helper - paste this in browser console to check agent registration state
// Usage: Just paste and run, or call debugAgentState() or debugAgentState('your_address')

function debugAgentState(customAddress) {
  // Try to get address from wallet or use provided one
  const address = customAddress || 
                  window.localStorage.getItem('suiet.wallet.connected-address') ||
                  '0xce2162a53565ac45e6338efcac7318d83d69debe934498bb2f592cee1f0410c9';
  
  const walletKey = `onChainAgents_${address.toLowerCase()}`;
  
  console.log('=== AGENT REGISTRATION DEBUG ===');
  console.log('Wallet:', address);
  console.log('Storage Key:', walletKey);
  
  const stored = localStorage.getItem(walletKey);
  console.log('Raw stored value:', stored);
  
  if (stored) {
    const parsed = JSON.parse(stored);
    console.log('Parsed agents:', parsed);
    console.log('Registered agent IDs:', Object.keys(parsed));
    console.log('Total registered:', Object.keys(parsed).length);
    
    Object.entries(parsed).forEach(([id, tx]) => {
      console.log(`  - ${id} → ${tx}`);
    });
  } else {
    console.log('❌ No agents registered for this wallet');
    
    // Check for old format
    const oldData = localStorage.getItem('onChainAgents');
    if (oldData) {
      console.log('⚠️ Found old format data:', oldData);
      console.log('Run migration: migrateAgentsToWallet("' + address + '")');
    }
  }
  
  // Check active agents
  const activeAgents = localStorage.getItem('activeAgents');
  console.log('\nActive agents:', activeAgents);
  
  // Check transactions
  const transactions = localStorage.getItem('agentTransactions');
  console.log('Agent transactions:', transactions);
  
  console.log('================================');
}

// Helper to manually register an agent (if needed for testing)
function manuallyRegisterAgent(agentId, txDigest, walletAddress) {
  const address = walletAddress || window.localStorage.getItem('suiet.wallet.connected-address');
  if (!address) {
    console.error('❌ No wallet address provided or found');
    return;
  }
  
  const walletKey = `onChainAgents_${address.toLowerCase()}`;
  const stored = localStorage.getItem(walletKey);
  const agents = stored ? JSON.parse(stored) : {};
  
  agents[agentId] = txDigest;
  localStorage.setItem(walletKey, JSON.stringify(agents));
  
  console.log('✅ Manually registered agent:', agentId, '→', txDigest);
  console.log('🔄 Reload page to see changes');
  
  return agents;
}

// Run it automatically
debugAgentState();
