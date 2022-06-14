const { ethers, upgrades } = require("hardhat");
const { saveFrontendFiles } = require('./utils');

const ZOMBIE_PROXY = "";
const MONSTER_PROXY = "0x4ea0Be853219be8C9cE27200Bdeee36881612FF2";
const MONSTER_HELPER_PROXY = "0x46d4674578a2daBbD0CEAB0500c6c7867999db34";
const ZOMBIE_HELPER_PROXY = "0xC6c5Ab5039373b0CBa7d0116d9ba7fb9831C3f42";

async function main() {
  // const ZombieV2 = await ethers.getContractFactory("ZombieNFTContract");
  // const zombieNFT = await upgrades.upgradeProxy(ZOMBIE_PROXY, ZombieV2);
  // console.log('Contract upgraded');

  const MonsterV2 = await ethers.getContractFactory("MonsterNFTContract");
  const monsterNFT = await upgrades.upgradeProxy(MONSTER_PROXY, MonsterV2);

  const MonsterHelperV2 = await ethers.getContractFactory("MonsterNFTHelperContract");
  const monsterHelperNFT = await upgrades.upgradeProxy(MONSTER_HELPER_PROXY, MonsterHelperV2);

  const ZombieHelperV2 = await ethers.getContractFactory("ZombieNFTHelperContract");
  const zombieHelperNFT = await upgrades.upgradeProxy(ZOMBIE_HELPER_PROXY, ZombieHelperV2);
  console.log('Contract upgraded');

  saveFrontendFiles(monsterNFT, "MonsterNFTContract");
  saveFrontendFiles(monsterHelperNFT, "MonsterNFTHelperContract");
  saveFrontendFiles(zombieHelperNFT, "ZombieNFTHelperContract");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
