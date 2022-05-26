import { Reward } from "../generated/schema";
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
