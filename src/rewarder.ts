import { Claimed, TransferSingle } from "../generated/NFTRewarder/NFTRewarder";
import {
  ADDRESS_ZERO,
  getOrCreateAccountBalance,
  getOrCreateReward,
  getOrCreateUser,
} from "./rewarderUtils";

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

  let fromAccountBalance = getOrCreateAccountBalance(rewardId, from.id);
  fromAccountBalance.amountOwned = fromAccountBalance.amountOwned.minus(value);
  fromAccountBalance.save();

  let toAccountBalance = getOrCreateAccountBalance(rewardId, to.id);
  toAccountBalance.amountOwned = toAccountBalance.amountOwned.plus(value);
  toAccountBalance.save();
}
