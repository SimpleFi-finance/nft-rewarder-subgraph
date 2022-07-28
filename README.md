# nft-rewarder-subgraph

Subgraph that tracks SimpleFi's NFT rewarder system

We're tracking 3 enitites:

- Rewards
- Users
- AccountBalance

In AccountBalance we store info abot user-reward connection. There are 3 main counters:

- amountWhitelisted - amount of tokens user is whitelisted for, for this reward
- amountClaimed - amount of tokens already claimed
- amountClaimable - amount of claimable tokens (= whitelisted - claimed)
- amountOwned - amount of owned tokens, also includes tokens that were purchased or received

Some useful queries:

- get claimable rewards for a user

```
      {
        accountBalances(where: {user: "${this.state.account}", amountClaimable_gt: 0}) {
          id
          user {
            id
          }
          reward {
            id
            name
            description
            image
            supply
            tokenAddress
            tokenId
          }
          amountClaimable
        }
      }
```

- get already claimed rewards

```
      {
        accountBalances(where: {user: "${this.state.account}", amountOwned_gt: 0}) {
          id
          reward {
            id
            name
            description
            image
            supply
            tokenAddress
            tokenId
          }
          amountOwned
        }
      }
```
