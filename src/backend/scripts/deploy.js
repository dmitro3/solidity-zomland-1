const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer, account1] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // deploy contracts here:
  const Main = await ethers.getContractFactory("MainContract");
  const main = await upgrades.deployProxy(Main, [], {
    initializer: "initialize"
  })
  await main.deployed();

  const LandNFT = await ethers.getContractFactory("LandNFTContract");
  const landNFT = await upgrades.deployProxy(LandNFT, [main.address], {
    initializer: "initialize"
  })
  await landNFT.deployed();

  const ZombieNFT = await ethers.getContractFactory("ZombieNFTContract");
  const zombieNFT = await upgrades.deployProxy(ZombieNFT, [main.address], {
    initializer: "initialize"
  })
  await zombieNFT.deployed();

  const ZombieNFTHelper = await ethers.getContractFactory("ZombieNFTHelperContract");
  const zombieNFTHelper = await upgrades.deployProxy(ZombieNFTHelper, [main.address], {
    initializer: "initialize"
  })
  await zombieNFTHelper.deployed();

  const MonsterNFT = await ethers.getContractFactory("MonsterNFTContract");
  const monsterNFT = await upgrades.deployProxy(MonsterNFT, [main.address], {
    initializer: "initialize"
  })
  await monsterNFT.deployed();

  const Collection = await ethers.getContractFactory("CollectionContract");
  const collection = await upgrades.deployProxy(Collection, [main.address, "bafybeigm2p2cm3pqrlel326s6kjfh4x22ne5sfrlvpgouq7tltatulbqru"], {
    initializer: "initialize"
  })
  await collection.deployed();

  const TokenFT = await ethers.getContractFactory("TokenFTContract");
  const tokenFT = await upgrades.deployProxy(TokenFT, [main.address], {
    initializer: "initialize"
  })
  await tokenFT.deployed();

  const Market = await ethers.getContractFactory("MarketContract");
  const market = await upgrades.deployProxy(Market, [main.address], {
    initializer: "initialize"
  })
  await market.deployed();

  const MainContract = await ethers.getContractAt("MainContract", main.address);
  await MainContract.updateContractAddress(
    landNFT.address,
    zombieNFT.address,
    zombieNFTHelper.address,
    monsterNFT.address,
    tokenFT.address,
    collection.address,
    market.address,
  );

  console.log("Main address", main.address);
  console.log("LandNFT address", landNFT.address);
  console.log("ZombieNFT address", zombieNFT.address);
  console.log("ZombieNFTHelper address", zombieNFTHelper.address);
  console.log("MonsterNFT address", monsterNFT.address);
  console.log("Collection address", collection.address);
  console.log("TokenFT address", tokenFT.address);
  console.log("Market address", market.address);

  // Add Collections
  await collection.addCollection("Mummy", "bafkreigdcymxku7b6o4pcyfqqzf5dieviewhwndrknbggvhk6vokavfxwe");
  await collection.addCollection("Pirate", "bafybeifq6clpc672vcln7l5iv4355ze6ludm7opcpldbgkwa7sfu5inysm");
  await collection.addCollection("Punk", "bafybeid3p33trzeklhvblet72wmt2rfnfvgii6ezbvhdix4hc7p2uwuotu");
  await collection.addCollection("Stylish", "bafybeifjiplwfr52wvogoxidckgpq2urq66cjrqfdvfsgn2y3kscxjlcu4");
  await collection.addCollection("Combat", "bafybeico3paszepcemcprmsav47ntzy4cohqiw56m6o7pyi7oslhtf4ro4");

  console.log("Collections added");

  // for (let i = 0; i < 5; i++) {
  //   await landNFT.connect(account1).safeMint({ value: ethers.utils.parseEther("0.33") });
  //   await zombieNFT.connect(account1).safeMint(i);
  //   console.log('+');
  // }
  // console.log("Seed data added");

  // For each contract, pass the deployed contract and name to this function to save a copy of the contract ABI and address to the front end.
  saveFrontendFiles(main, "MainContract");
  saveFrontendFiles(landNFT, "LandNFTContract");
  saveFrontendFiles(zombieNFT, "ZombieNFTContract");
  saveFrontendFiles(zombieNFTHelper, "ZombieNFTHelperContract");
  saveFrontendFiles(monsterNFT, "MonsterNFTContract");
  saveFrontendFiles(collection, "CollectionContract");
  saveFrontendFiles(tokenFT, "TokenFTContract");
  saveFrontendFiles(market, "MarketContract");
}

function saveFrontendFiles(contract, name) {
  console.log('process.env.network', process.env.network);

  const fs = require("fs");
  const contractsDir = __dirname + "/../../frontend/contractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
