import { Claimed, TransferSingle } from "../generated/NFTRewarder/NFTRewarder";
import { ADDRESS_ZERO, getOrCreateReward } from "./rewarderUtils";

export function handleClaimed(event: Claimed): void {
  let tokenAddress = event.address.toHexString();
  let tokenId = event.params.tokenId;
  let minter = event.params.user.toHexString();

  // create Reward entity if it's a first mint of this reward
  getOrCreateReward(tokenAddress, tokenId, minter);
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
