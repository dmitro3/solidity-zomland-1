const { ethers, upgrades } = require("hardhat");
const { saveFrontendFiles } = require('./utils');

const MAIN_PROXY = "0x59b670e9fA9D0A427751Af201D676719a970857b";
const LAND_PROXY = "0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1";
const LAND_HELPER_PROXY = "0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44";
const ZOMBIE_PROXY = "0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f";
const ZOMBIE_HELPER_PROXY = "0x4A679253410272dd5232B3Ff7cF5dbB88f295319";
const MONSTER_PROXY = "0x7a2088a1bFc9d81c55368AE168C2C02570cB814F";
const MONSTER_HELPER_PROXY = "0x09635F643e140090A9A8Dcd712eD6285858ceBef";
const COLLECTION_PROXY = "0xc5a5C42992dECbae36851359345FE25997F5C42d";
const TOKEN_PROXY = "0x67d269191c92Caf3cD7723F116c85e6E9bf55933";
const MARKET_PROXY = "0xE6E340D132b5f46d1e472DebcD681B2aBc16e57E";

async function main() {
  const MainV2 = await ethers.getContractFactory("MainContract");
  const main = await upgrades.upgradeProxy(MAIN_PROXY, MainV2);

  const LandV2 = await ethers.getContractFactory("LandNFTContract");
  const landNFT = await upgrades.upgradeProxy(LAND_PROXY, LandV2);

  const LandHelperV2 = await ethers.getContractFactory("LandNFTHelperContract");
  const landHelperNFT = await upgrades.upgradeProxy(LAND_HELPER_PROXY, LandHelperV2);

  const ZombieV2 = await ethers.getContractFactory("ZombieNFTContract");
  const zombieNFT = await upgrades.upgradeProxy(ZOMBIE_PROXY, ZombieV2);

  const ZombieHelperV2 = await ethers.getContractFactory("ZombieNFTHelperContract");
  const zombieHelperNFT = await upgrades.upgradeProxy(ZOMBIE_HELPER_PROXY, ZombieHelperV2);

  const MonsterV2 = await ethers.getContractFactory("MonsterNFTContract");
  const monsterNFT = await upgrades.upgradeProxy(MONSTER_PROXY, MonsterV2);

  const CollectionV2 = await ethers.getContractFactory("CollectionContract");
  const collection = await upgrades.upgradeProxy(COLLECTION_PROXY, CollectionV2);

  const TokenV2 = await ethers.getContractFactory("TokenFTContract");
  const token = await upgrades.upgradeProxy(TOKEN_PROXY, TokenV2);

  const MarketV2 = await ethers.getContractFactory("MarketContract");
  const market = await upgrades.upgradeProxy(MARKET_PROXY, MarketV2);

  const MonsterHelperV2 = await ethers.getContractFactory("MonsterNFTHelperContract");
  const monsterHelperNFT = await upgrades.upgradeProxy(MONSTER_HELPER_PROXY, MonsterHelperV2);

  console.log('Contract upgraded');

  saveFrontendFiles(main, "MainContract");
  saveFrontendFiles(landNFT, "LandNFTContract");
  saveFrontendFiles(landHelperNFT, "LandNFTHelperContract");
  saveFrontendFiles(zombieNFT, "ZombieNFTContract");
  saveFrontendFiles(zombieHelperNFT, "ZombieNFTHelperContract");
  saveFrontendFiles(monsterNFT, "MonsterNFTContract");
  saveFrontendFiles(collection, "CollectionContract");
  saveFrontendFiles(token, "TokenFTContract");
  saveFrontendFiles(market, "MarketContract");
  saveFrontendFiles(monsterHelperNFT, "MonsterNFTHelperContract");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
