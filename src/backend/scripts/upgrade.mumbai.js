const { ethers, upgrades } = require("hardhat");
const { saveFrontendFiles } = require('./utils');

const MAIN_PROXY = "0x8169022cC5075e3049861E0F97443bfad5Ed960D";
const LAND_PROXY = "0x33F423A28361aC4C88eb0dD7d3b2aAf216209bB8";
const LAND_HELPER_PROXY = "0xd8e2dB4b10822986E4E49c94138aD6a4E74b0f85";
const ZOMBIE_PROXY = "0xb8304e90c92eA9F8b7802f5f282Fd8C4ef853839";
const ZOMBIE_HELPER_PROXY = "0x0296c3EF784f628470d16e2A481164b246Bca912";
const MONSTER_PROXY = "0x25Ff90BB51809D05bb50587fc2b6A8d348e80aFE";
const MONSTER_HELPER_PROXY = "0x17154A6919B4d132385E4b07ca9720D81B45860A";
const COLLECTION_PROXY = "0x2a46DE44ae38Bd218a4A157035677688F21b6638";
const TOKEN_PROXY = "0x122BFC0e66a527e071955F6Bd715e2444B23fc84";
const MARKET_PROXY = "0x12fe6e4E4Ef35163998F52C351472f7aD8b110D4";

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
