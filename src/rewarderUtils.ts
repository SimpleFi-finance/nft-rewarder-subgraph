import { Reward, User } from "../generated/schema";
import { BigInt } from "@graphprotocol/graph-ts";

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

/**
 * Create Reward entity, store metadata and update balances
 * @param tokenAddress
 * @param tokenId
 * @param minter
 * @returns
 */
export function getOrCreateReward(tokenAddress: string, tokenId: BigInt, minter: string): Reward {
  let id = tokenAddress + "-" + tokenId.toString();
  let reward = Reward.load(id);
  if (reward != null) {
    return reward as Reward;
  }

  reward = new Reward(id);
  reward.tokenAddress = tokenAddress;
  reward.tokenId = tokenId;
  // TODO add metadata stuff

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
