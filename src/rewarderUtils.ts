import { AccountBalance, Reward, User } from "../generated/schema";
import { BigInt } from "@graphprotocol/graph-ts";

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

/**
 * Create Reward entity, store metadata and update balances
 * @param tokenAddress
 * @param tokenId
 * @param minter
 * @returns
 */
export function getOrCreateReward(tokenAddress: string, tokenId: BigInt, uri: string): Reward {
  let id = tokenAddress + "-" + tokenId.toString();
  let reward = Reward.load(id);
  if (reward != null) {
    return reward as Reward;
  }

  reward = new Reward(id);
  reward.tokenAddress = tokenAddress;
  reward.tokenId = tokenId;
  reward.metadataUri = uri;

  // TODO parse metadata stuff

  reward.save();
  return reward;
}

/**
 * Create user entity
 * @param account
 * @returns
 */
export function getOrCreateUser(account: string): User {
  let user = User.load(account);
  if (user != null) {
    return user as User;
  }

  user = new User(account);
  user.save();

  return user;
}

/**
 * Create AccountBalance entity which tracks user's holdings of reward NFTs
 * @param reward
 * @param user
 * @returns
 */
export function getOrCreateAccountBalance(reward: string, user: string): AccountBalance {
  let id = reward + "-" + user;
  let accountBalance = AccountBalance.load(id);
  if (accountBalance != null) {
    return accountBalance as AccountBalance;
  }

  accountBalance = new AccountBalance(id);
  accountBalance.reward = reward;
  accountBalance.user = user;
  accountBalance.amountWhitelisted = BigInt.fromI32(0);
  accountBalance.amountClaimed = BigInt.fromI32(0);
  accountBalance.amountClaimable = BigInt.fromI32(0);
  accountBalance.amountOwned = BigInt.fromI32(0);
  accountBalance.save();

  return accountBalance;
}

/**
 * Update account balances after NFT reward transfer
 * @param rewardId
 * @param from
 * @param to
 * @param amount
 */
export function updateBalances(rewardId: string, from: string, to: string, amount: BigInt) {
  let fromAccountBalance = getOrCreateAccountBalance(rewardId, from);
  fromAccountBalance.amountOwned = fromAccountBalance.amountOwned.minus(amount);
  fromAccountBalance.save();

  let toAccountBalance = getOrCreateAccountBalance(rewardId, to);
  toAccountBalance.amountOwned = toAccountBalance.amountOwned.plus(amount);
  toAccountBalance.save();
}
