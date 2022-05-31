import { BigInt } from "@graphprotocol/graph-ts";
import {
  Claimed,
  RemovedFromWhitelist,
  TransferBatch,
  TransferSingle,
  URI,
  Whitelisted,
} from "../generated/NFTRewarder/NFTRewarder";
import { Reward } from "../generated/schema";
import {
  ADDRESS_ZERO,
  getOrCreateAccountBalance,
  getOrCreateReward,
  getOrCreateUser,
  updateBalances,
} from "./rewarderUtils";

/**
 * Create Reward entity when token URI is set
 * @param event
 */
export function handleURISet(event: URI): void {
  let tokenAddress = event.address.toHexString();
  let tokenId = event.params.id;
  let metadataUri = event.params.value;

  // create reward entity
  getOrCreateReward(tokenAddress, tokenId, metadataUri);
}

/**
 * Update account balance after user claims reward NFT
 * @param event
 */
export function handleClaimed(event: Claimed): void {
  let rewardId = event.address.toHexString() + "-" + event.params.tokenId.toString();
  let minter = getOrCreateUser(event.params.user.toHexString());
  let amount = event.params.amount;

  // update account balance
  let accountBalance = getOrCreateAccountBalance(rewardId, minter.id);
  accountBalance.amountClaimed = accountBalance.amountClaimed.plus(amount);
  accountBalance.amountOwned = accountBalance.amountOwned.plus(amount);
  accountBalance.amountClaimable = accountBalance.amountClaimable.minus(amount);
  accountBalance.save();

  // update reward supply
  let reward = Reward.load(rewardId) as Reward;
  reward.supply = reward.supply.plus(amount);
  reward.save();
}

/**
 * Update account balance when user is whitelisted for reward NFT
 * @param event
 */
export function handleWhitelisted(event: Whitelisted): void {
  let rewardId = event.address.toHexString() + "-" + event.params.tokenId.toString();
  let amount = event.params.amount;
  let user = getOrCreateUser(event.params.user.toHexString());

  let accountBalance = getOrCreateAccountBalance(rewardId, user.id);
  accountBalance.amountWhitelisted = accountBalance.amountWhitelisted.plus(amount);
  accountBalance.amountClaimable = accountBalance.amountClaimable.plus(amount);
  accountBalance.save();
}

/**
 * Update account balance when user is removed from whitelist for reward NFT
 * @param event
 */
export function handleRemovedFromWhitelist(event: RemovedFromWhitelist): void {
  let rewardId = event.address.toHexString() + "-" + event.params.tokenId.toString();
  let user = getOrCreateUser(event.params.user.toHexString());

  // reset amount of whitelisted tokens to the amount of already claimed tokens
  let accountBalance = getOrCreateAccountBalance(rewardId, user.id);
  accountBalance.amountWhitelisted = accountBalance.amountClaimed;
  accountBalance.amountClaimable = BigInt.fromI32(0);
  accountBalance.save();
}

/**
 * Handle transfer of NFT reward token.
 * @param event
 * @returns
 */
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

/**
 * Handle transfer of multiple NFT reward tokens
 * @param event
 */
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
