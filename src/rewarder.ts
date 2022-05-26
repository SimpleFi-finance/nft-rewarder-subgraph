import { Claimed, TransferBatch, TransferSingle } from "../generated/NFTRewarder/NFTRewarder";
import { ADDRESS_ZERO, getOrCreateReward, getOrCreateUser, updateBalances } from "./rewarderUtils";

export function handleClaimed(event: Claimed): void {
  let tokenAddress = event.address.toHexString();
  let tokenId = event.params.tokenId;
  let minter = getOrCreateUser(event.params.user.toHexString());
  let amount = event.params.amount;

  // create Reward entity if it's a first mint of this reward
  getOrCreateReward(tokenAddress, tokenId, minter.id, amount);
}

export function handleTransferSingle(event: TransferSingle): void {
  if (event.params.from.toHexString() == ADDRESS_ZERO) {
    //  handled in Claimed
    return;
  }

  let rewardId = event.address.toHexString() + "-" + event.params.id.toString();
  let from = getOrCreateUser(event.params.from.toHexString());
  let to = getOrCreateUser(event.params.to.toHexString());
  let value = event.params.value;

  updateBalances(rewardId, from.id, to.id, value);
}

export function handleTransferBatch(event: TransferBatch): void {
  let from = getOrCreateUser(event.params.from.toHexString());
  let to = getOrCreateUser(event.params.to.toHexString());

  let numOfTransfers = event.params.ids.length;

  for (let i = 0; i < numOfTransfers; i++) {
    let rewardId = event.address.toHexString() + "-" + event.params.ids[i].toString();
    let value = event.params.values[i];
    updateBalances(rewardId, from.id, to.id, value);
  }
}
