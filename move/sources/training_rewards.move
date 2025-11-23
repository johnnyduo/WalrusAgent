/// Walrus Agents - Training Rewards Module
/// Manages rewards for training contributions
module walrus_agents::training_rewards {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::event;
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};
    use std::string::{Self, String};

    /// Training contribution record
    public struct TrainingContribution has key, store {
        id: UID,
        agent_id: ID,
        contributor: address,
        delta_blob_id: String, // Walrus blob ID for model delta
        epoch: u64,
        reward_amount: u64,
        claimed: bool,
        timestamp: u64,
    }

    /// Reward pool for distributing training rewards
    public struct RewardPool has key {
        id: UID,
        balance: Balance<SUI>,
        total_contributions: u64,
        total_rewards_claimed: u64,
        reward_per_contribution: u64, // Base reward in MIST
    }

    /// Admin capability for managing reward pool
    public struct RewardAdminCap has key, store {
        id: UID,
    }

    // ===== Events =====

    public struct ContributionRecorded has copy, drop {
        contribution_id: ID,
        agent_id: ID,
        contributor: address,
        epoch: u64,
        reward_amount: u64,
        timestamp: u64,
    }

    public struct RewardClaimed has copy, drop {
        contribution_id: ID,
        contributor: address,
        amount: u64,
        timestamp: u64,
    }

    public struct RewardPoolFunded has copy, drop {
        amount: u64,
        new_balance: u64,
        timestamp: u64,
    }

    // ===== Error Codes =====

    const ENotAuthorized: u64 = 1;
    const EAlreadyClaimed: u64 = 2;
    const EInsufficientFunds: u64 = 3;
    const EInvalidAmount: u64 = 4;

    /// Initialize reward pool
    fun init(ctx: &mut TxContext) {
        let pool = RewardPool {
            id: object::new(ctx),
            balance: balance::zero(),
            total_contributions: 0,
            total_rewards_claimed: 0,
            reward_per_contribution: 1_000_000, // 0.001 SUI per contribution
        };
        transfer::share_object(pool);

        // Create admin capability
        let admin_cap = RewardAdminCap {
            id: object::new(ctx),
        };
        transfer::transfer(admin_cap, tx_context::sender(ctx));
    }

    /// Record a training contribution
    public fun record_contribution(
        pool: &mut RewardPool,
        agent_id: ID,
        delta_blob_id: vector<u8>,
        epoch: u64,
        ctx: &mut TxContext
    ): ID {
        let contribution_id = object::new(ctx);
        let contributor = tx_context::sender(ctx);
        let timestamp = tx_context::epoch(ctx);
        let reward_amount = pool.reward_per_contribution;

        let contribution = TrainingContribution {
            id: contribution_id,
            agent_id,
            contributor,
            delta_blob_id: string::utf8(delta_blob_id),
            epoch,
            reward_amount,
            claimed: false,
            timestamp,
        };

        let contribution_inner_id = object::uid_to_inner(&contribution.id);

        pool.total_contributions = pool.total_contributions + 1;

        event::emit(ContributionRecorded {
            contribution_id: contribution_inner_id,
            agent_id,
            contributor,
            epoch,
            reward_amount,
            timestamp,
        });

        transfer::public_transfer(contribution, contributor);
        contribution_inner_id
    }

    /// Claim reward for a contribution
    public fun claim_reward(
        pool: &mut RewardPool,
        contribution: &mut TrainingContribution,
        ctx: &mut TxContext
    ): Coin<SUI> {
        assert!(contribution.contributor == tx_context::sender(ctx), ENotAuthorized);
        assert!(!contribution.claimed, EAlreadyClaimed);
        assert!(balance::value(&pool.balance) >= contribution.reward_amount, EInsufficientFunds);

        contribution.claimed = true;
        pool.total_rewards_claimed = pool.total_rewards_claimed + contribution.reward_amount;

        let reward_balance = balance::split(&mut pool.balance, contribution.reward_amount);
        let reward_coin = coin::from_balance(reward_balance, ctx);

        event::emit(RewardClaimed {
            contribution_id: object::uid_to_inner(&contribution.id),
            contributor: contribution.contributor,
            amount: contribution.reward_amount,
            timestamp: tx_context::epoch(ctx),
        });

        reward_coin
    }

    /// Fund the reward pool (admin only)
    public fun fund_pool(
        pool: &mut RewardPool,
        _admin_cap: &RewardAdminCap,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        let amount = coin::value(&payment);
        let payment_balance = coin::into_balance(payment);
        balance::join(&mut pool.balance, payment_balance);

        event::emit(RewardPoolFunded {
            amount,
            new_balance: balance::value(&pool.balance),
            timestamp: tx_context::epoch(ctx),
        });
    }

    /// Update reward per contribution (admin only)
    public fun update_reward_rate(
        pool: &mut RewardPool,
        _admin_cap: &RewardAdminCap,
        new_rate: u64,
        _ctx: &mut TxContext
    ) {
        assert!(new_rate > 0, EInvalidAmount);
        pool.reward_per_contribution = new_rate;
    }

    // ===== View Functions =====

    public fun get_contribution_agent_id(contribution: &TrainingContribution): ID {
        contribution.agent_id
    }

    public fun get_contribution_contributor(contribution: &TrainingContribution): address {
        contribution.contributor
    }

    public fun get_contribution_epoch(contribution: &TrainingContribution): u64 {
        contribution.epoch
    }

    public fun get_contribution_reward(contribution: &TrainingContribution): u64 {
        contribution.reward_amount
    }

    public fun is_contribution_claimed(contribution: &TrainingContribution): bool {
        contribution.claimed
    }

    public fun get_pool_balance(pool: &RewardPool): u64 {
        balance::value(&pool.balance)
    }

    public fun get_total_contributions(pool: &RewardPool): u64 {
        pool.total_contributions
    }

    public fun get_total_rewards_claimed(pool: &RewardPool): u64 {
        pool.total_rewards_claimed
    }

    public fun get_reward_rate(pool: &RewardPool): u64 {
        pool.reward_per_contribution
    }

    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(ctx);
    }
}
