const { ethers, upgrades } = require("hardhat");
const { saveFrontendFiles } = require('./utils');

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
  // const transaction2 = await LandContract.withdrawToken(ethers.utils.parseEther("1"), {
  //   gasLimit: 50000
  // });
  // await transaction2.wait().then(result => {
  //   console.log('result', result);
  // })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
