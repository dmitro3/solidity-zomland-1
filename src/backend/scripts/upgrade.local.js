const { ethers, upgrades } = require("hardhat");
const { saveFrontendFiles } = require('./utils');

const MAIN_PROXY = "0x5eb3Bc0a489C5A8288765d2336659EbCA68FCd00";
const LAND_PROXY = "0x36C02dA8a0983159322a80FFE9F24b1acfF8B570";
const LAND_HELPER_PROXY = "0x809d550fca64d94Bd9F66E60752A544199cfAC3D";
const ZOMBIE_PROXY = "0x4c5859f0F772848b2D91F1D83E2Fe57935348029";
const ZOMBIE_HELPER_PROXY = "0x1291Be112d480055DaFd8a610b7d1e203891C274";
const MONSTER_PROXY = "0x5f3f1dBD7B74C6B46e8c44f98792A1dAf8d69154";
const MONSTER_HELPER_PROXY = "0xb7278A61aa25c888815aFC32Ad3cC52fF24fE575";
const COLLECTION_PROXY = "0xCD8a1C3ba11CF5ECfa6267617243239504a98d90";
const TOKEN_PROXY = "0x82e01223d51Eb87e16A03E24687EDF0F294da6f1";
const MARKET_PROXY = "0x2bdCC0de6bE1f7D2ee689a0342D76F52E8EFABa3";

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
