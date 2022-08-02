const { ethers, upgrades } = require("hardhat");
const { saveFrontendFiles } = require('./utils');

const MAIN_PROXY = "0x7a2088a1bFc9d81c55368AE168C2C02570cB814F";
const LAND_PROXY = "0x09635F643e140090A9A8Dcd712eD6285858ceBef";
const LAND_HELPER_PROXY = "0xc5a5C42992dECbae36851359345FE25997F5C42d";
const ZOMBIE_PROXY = "0x67d269191c92Caf3cD7723F116c85e6E9bf55933";
const ZOMBIE_HELPER_PROXY = "0xE6E340D132b5f46d1e472DebcD681B2aBc16e57E";
const MONSTER_PROXY = "0xc3e53F4d16Ae77Db1c982e75a937B9f60FE63690";
const MONSTER_HELPER_PROXY = "0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB";
const COLLECTION_PROXY = "0x9E545E3C0baAB3E08CdfD552C960A1050f373042";
const TOKEN_PROXY = "0x1613beB3B2C4f22Ee086B2b38C1476A3cE7f78E8";
const MARKET_PROXY = "0x851356ae760d987E095750cCeb3bC6014560891C";

// env $(cat .env) npx hardhat verify '' --network mumbai_testnet

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
