const { ethers, upgrades } = require("hardhat");

const ZOMBIE_PROXY = "";

async function main() {
  const ZombieV2 = await ethers.getContractFactory("ZombieNFTContract");
  await upgrades.upgradeProxy(ZOMBIE_PROXY, ZombieV2);
  console.log('Zombie upgraded');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
