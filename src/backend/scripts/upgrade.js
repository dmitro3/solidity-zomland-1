const { ethers, upgrades } = require("hardhat");
const { saveFrontendFiles } = require('./utils');

const ZOMBIE_PROXY = "";

async function main() {
  const ZombieV2 = await ethers.getContractFactory("ZombieNFTContract");
  const zombieNFT = await upgrades.upgradeProxy(ZOMBIE_PROXY, ZombieV2);
  console.log('Contract upgraded');

  saveFrontendFiles(zombieNFT, "ZombieNFTContract");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
