import { connect, Contract, keyStores, WalletConnection } from "near-api-js";
import { getConfig } from "./config";

const nearConfig = getConfig(process.env.NODE_ENV || "development");
// const nearConfig = getConfig("testnet"); // for Andrii testnet

// Initialize contract & set global variables
export async function initContract() {
  const near = await connect(
    Object.assign(
      { deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } },
      nearConfig
    )
  );

  window.walletConnection = new WalletConnection(near);
  window.accountId = window.walletConnection.getAccountId();

  // Initializing our contracts
  window.contract = await new Contract(
    window.walletConnection.account(),
    nearConfig.contractName,
    {
      viewMethods: [
        "user_lands",
        "user_zombies",
        "total_lands_count",
        "get_collections",
        "get_one_collection",
        "user_collection_counts",
        "get_lands_from_market",
        "get_zombies_from_market",
        "get_monsters_from_market",
        "user_monsters",
        "zombie_kill_tokens",
        "is_stake_monster",
      ],
      changeMethods: [
        "mint_land_nft",
        "mint_free_zombie_nft",
        "publish_lands_on_market",
        "publish_zombies_on_market",
        "publish_monsters_on_market",
        "remove_lands_from_market",
        "remove_zombies_from_market",
        "remove_monsters_from_market",
        "transfer_nft_on_market",
        "transfer_land",
        "transfer_zombie",
        "transfer_monster",
        "mint_collection",
        "kill_zombie",
        "kill_monster",
        "stake_monster",
        "unstake_monster",
      ],
    }
  );

  window.ftContract = await new Contract(
    window.walletConnection.account(),
    `ft.${nearConfig.contractName}`,
    {
      viewMethods: [
        "ft_balance_of",
        "get_user_earned",
        "get_user_stake",
        "get_stake_total_supply",
        "get_apr",
        "get_stake_monster_pct",
        "storage_balance_of",
        "get_total_supply",
      ],
      changeMethods: [
        "ft_mint",
        "ft_transfer",
        "ft_transfer_call",
        "withdraw_stake",
        "withdraw_reward",
      ],
    }
  );
}

export function logout() {
  window.walletConnection.signOut();
  window.location.replace(window.location.origin);
}

export function login() {
  window.walletConnection.requestSignIn(
    nearConfig.contractName,
    "",
    window.location.origin + "/lands"
  );
}
