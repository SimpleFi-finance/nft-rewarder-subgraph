import { Claimed, TransferSingle } from "../generated/NFTRewarder/NFTRewarder";
import { ADDRESS_ZERO, getOrCreateReward, getOrCreateUser } from "./rewarderUtils";

export function handleClaimed(event: Claimed): void {
  let tokenAddress = event.address.toHexString();
  let tokenId = event.params.tokenId;
  let minter = getOrCreateUser(event.params.user.toHexString());
  let amount = event.params.amount;

  // create Reward entity if it's a first mint of this reward
  getOrCreateReward(tokenAddress, tokenId, minter.id, amount);
}

export function handleTransferSingle(event: TransferSingle): void {
  let rewarder = event.address;
  let from = event.params.from;
  let to = event.params.to;
  let tokenId = event.params.id;
  let value = event.params.value;
  let operator = event.params.operator;

  if (from.toHexString() == ADDRESS_ZERO) {
    // create reward
  }
}
