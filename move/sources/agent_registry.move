/// Walrus Agents - Agent Registry Module
/// Manages AI agent NFTs on Sui blockchain
module walrus_agents::agent_registry {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::event;
    use std::string::{Self, String};
    use std::vector;

    /// Agent NFT object
    public struct Agent has key, store {
        id: UID,
        name: String,
        role: String,
        owner: address,
        metadata_blob_id: String, // Walrus blob ID for agent metadata
        model_version: u64,
        current_weights_blob_id: String, // Walrus blob ID for latest model weights
        training_contributions: u64,
        performance_score: u64,
        created_at: u64,
        updated_at: u64,
    }

    /// Agent Registry - tracks all agents
    public struct AgentRegistry has key {
        id: UID,
        total_agents: u64,
        active_agents: u64,
    }

    /// Capability for registry admin operations
    public struct RegistryAdminCap has key, store {
        id: UID,
    }

    // ===== Events =====

    public struct AgentCreated has copy, drop {
        agent_id: ID,
        owner: address,
        name: String,
        role: String,
        timestamp: u64,
    }

    public struct AgentUpdated has copy, drop {
        agent_id: ID,
        model_version: u64,
        weights_blob_id: String,
        timestamp: u64,
    }

    public struct PerformanceUpdated has copy, drop {
        agent_id: ID,
        old_score: u64,
        new_score: u64,
        timestamp: u64,
    }

    // ===== Error Codes =====

    const EInvalidOwner: u64 = 1;
    const EInvalidScore: u64 = 2;
    const EAgentNotFound: u64 = 3;

    /// Initialize the agent registry (called once on deployment)
    fun init(ctx: &mut TxContext) {
        let registry = AgentRegistry {
            id: object::new(ctx),
            total_agents: 0,
            active_agents: 0,
        };
        transfer::share_object(registry);

        // Create admin capability for deployer
        let admin_cap = RegistryAdminCap {
            id: object::new(ctx),
        };
        transfer::transfer(admin_cap, tx_context::sender(ctx));
    }

    /// Mint a new agent NFT
    public fun mint_agent(
        registry: &mut AgentRegistry,
        name: vector<u8>,
        role: vector<u8>,
        metadata_blob_id: vector<u8>,
        ctx: &mut TxContext
    ): Agent {
        let agent_id = object::new(ctx);
        let sender = tx_context::sender(ctx);
        let timestamp = tx_context::epoch(ctx);

        let agent = Agent {
            id: agent_id,
            name: string::utf8(name),
            role: string::utf8(role),
            owner: sender,
            metadata_blob_id: string::utf8(metadata_blob_id),
            model_version: 0,
            current_weights_blob_id: string::utf8(b""),
            training_contributions: 0,
            performance_score: 0,
            created_at: timestamp,
            updated_at: timestamp,
        };

        registry.total_agents = registry.total_agents + 1;
        registry.active_agents = registry.active_agents + 1;

        event::emit(AgentCreated {
            agent_id: object::uid_to_inner(&agent.id),
            owner: sender,
            name: agent.name,
            role: agent.role,
            timestamp,
        });

        agent
    }

    /// Update agent model weights (after training)
    public fun update_model(
        agent: &mut Agent,
        new_weights_blob_id: vector<u8>,
        ctx: &mut TxContext
    ) {
        assert!(agent.owner == tx_context::sender(ctx), EInvalidOwner);
        
        let timestamp = tx_context::epoch(ctx);
        agent.model_version = agent.model_version + 1;
        agent.current_weights_blob_id = string::utf8(new_weights_blob_id);
        agent.updated_at = timestamp;

        event::emit(AgentUpdated {
            agent_id: object::uid_to_inner(&agent.id),
            model_version: agent.model_version,
            weights_blob_id: agent.current_weights_blob_id,
            timestamp,
        });
    }

    /// Record a training contribution
    public fun record_contribution(
        agent: &mut Agent,
        ctx: &mut TxContext
    ) {
        assert!(agent.owner == tx_context::sender(ctx), EInvalidOwner);
        agent.training_contributions = agent.training_contributions + 1;
        agent.updated_at = tx_context::epoch(ctx);
    }

    /// Update agent performance score
    public fun update_performance(
        agent: &mut Agent,
        new_score: u64,
        ctx: &mut TxContext
    ) {
        assert!(agent.owner == tx_context::sender(ctx), EInvalidOwner);
        assert!(new_score <= 10000, EInvalidScore); // Max score 10000 (100.00%)
        
        let old_score = agent.performance_score;
        agent.performance_score = new_score;
        agent.updated_at = tx_context::epoch(ctx);

        event::emit(PerformanceUpdated {
            agent_id: object::uid_to_inner(&agent.id),
            old_score,
            new_score,
            timestamp: tx_context::epoch(ctx),
        });
    }

    /// Transfer agent to new owner
    public fun transfer_agent(
        agent: Agent,
        recipient: address,
        _ctx: &mut TxContext
    ) {
        transfer::public_transfer(agent, recipient);
    }

    // ===== View Functions =====

    public fun get_name(agent: &Agent): String {
        agent.name
    }

    public fun get_role(agent: &Agent): String {
        agent.role
    }

    public fun get_owner(agent: &Agent): address {
        agent.owner
    }

    public fun get_metadata_blob_id(agent: &Agent): String {
        agent.metadata_blob_id
    }

    public fun get_model_version(agent: &Agent): u64 {
        agent.model_version
    }

    public fun get_weights_blob_id(agent: &Agent): String {
        agent.current_weights_blob_id
    }

    public fun get_training_contributions(agent: &Agent): u64 {
        agent.training_contributions
    }

    public fun get_performance_score(agent: &Agent): u64 {
        agent.performance_score
    }

    public fun get_total_agents(registry: &AgentRegistry): u64 {
        registry.total_agents
    }

    public fun get_active_agents(registry: &AgentRegistry): u64 {
        registry.active_agents
    }

    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(ctx);
    }
}
