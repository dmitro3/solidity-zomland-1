const { ethers, upgrades } = require("hardhat");
const { saveFrontendFiles } = require('./utils');

const MAIN_PROXY = "0xcbEAF3BDe82155F56486Fb5a1072cb8baAf547cc";
const LAND_PROXY = "0x1429859428C0aBc9C2C47C8Ee9FBaf82cFA0F20f";
const ZOMBIE_PROXY = "0xB0D4afd8879eD9F52b28595d31B441D079B2Ca07";
const ZOMBIE_HELPER_PROXY = "0x162A433068F51e18b7d13932F27e66a3f99E6890";
const MONSTER_PROXY = "0x5081a39b8A5f0E35a8D959395a630b68B74Dd30f";
const MONSTER_HELPER_PROXY = "0x1fA02b2d6A771842690194Cf62D91bdd92BfE28d";
const COLLECTION_PROXY = "0xdbC43Ba45381e02825b14322cDdd15eC4B3164E6";
const TOKEN_PROXY = "0x04C89607413713Ec9775E14b954286519d836FEf";
const MARKET_PROXY = "0x4C4a2f8c81640e47606d3fd77B353E87Ba015584";

async function main() {
  const [deployer] = await ethers.getSigners();

  // console.log("Deploying contracts with the account:", deployer.address);
  // console.log("Account balance:", (await deployer.getBalance()).toString());
  //
  // const LandV2 = await ethers.getContractFactory("LandNFTContract");
  // await upgrades.upgradeProxy(LAND_PROXY, LandV2);
  //
  // const LandContract = await ethers.getContractAt("LandNFTContract", LAND_PROXY, deployer);
  // const transaction = await LandContract.provider.getBalance(LAND_PROXY);
  // console.log('transaction', transaction);
  //
  // const transaction2 = await LandContract.withdrawToken(ethers.utils.parseEther("19.1"), {
  //   gasLimit: 50000
  // });
  // await transaction2.wait().then(result => {
  //   console.log('result', result);
  // })

  const MainV2 = await ethers.getContractFactory("MainContract");
  const main = await upgrades.upgradeProxy(MAIN_PROXY, MainV2);

  const LandV2 = await ethers.getContractFactory("LandNFTContract");
  const landNFT = await upgrades.upgradeProxy(LAND_PROXY, LandV2);

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
