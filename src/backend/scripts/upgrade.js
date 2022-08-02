const { ethers, upgrades } = require("hardhat");
const { saveFrontendFiles } = require('./utils');

const MAIN_PROXY = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const LAND_PROXY = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
const LAND_HELPER_PROXY = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
const ZOMBIE_PROXY = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";
const ZOMBIE_HELPER_PROXY = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318";
const MONSTER_PROXY = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";
const MONSTER_HELPER_PROXY = "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82";
const COLLECTION_PROXY = "0x0B306BF915C4d645ff596e518fAf3F9669b97016";
const TOKEN_PROXY = "0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE";
const MARKET_PROXY = "0x3Aa5ebB10DC797CAC828524e59A333d0A371443c";

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
