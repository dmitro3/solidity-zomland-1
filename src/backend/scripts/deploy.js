const { saveFrontendFiles } = require('./utils');
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

  let nonce = await deployer.getTransactionCount();
  console.log('Wallet Nonce', nonce);

  const LandNFT = await ethers.getContractFactory("LandNFTContract");
  const landNFT = await upgrades.deployProxy(LandNFT, [main.address], {
    initializer: "initialize",
    nonce: ++nonce
  })
  await landNFT.deployed();

  const LandNFTHelper = await ethers.getContractFactory("LandNFTHelperContract");
  const landNFTHelper = await upgrades.deployProxy(LandNFTHelper, [main.address], {
    initializer: "initialize",
    nonce: ++nonce
  })
  await landNFTHelper.deployed();

  const ZombieNFT = await ethers.getContractFactory("ZombieNFTContract");
  const zombieNFT = await upgrades.deployProxy(ZombieNFT, [main.address], {
    initializer: "initialize",
    nonce: ++nonce
  })
  await zombieNFT.deployed();

  const ZombieNFTHelper = await ethers.getContractFactory("ZombieNFTHelperContract");
  const zombieNFTHelper = await upgrades.deployProxy(ZombieNFTHelper, [main.address], {
    initializer: "initialize",
    nonce: ++nonce
  })
  await zombieNFTHelper.deployed();

  const MonsterNFT = await ethers.getContractFactory("MonsterNFTContract");
  const monsterNFT = await upgrades.deployProxy(MonsterNFT, [main.address], {
    initializer: "initialize",
    nonce: ++nonce
  })
  await monsterNFT.deployed();

  const MonsterNFTHelper = await ethers.getContractFactory("MonsterNFTHelperContract");
  const monsterNFTHelper = await upgrades.deployProxy(MonsterNFTHelper, [main.address], {
    initializer: "initialize",
    nonce: ++nonce
  })
  await monsterNFTHelper.deployed();

  const Collection = await ethers.getContractFactory("CollectionContract");
  const collection = await upgrades.deployProxy(Collection, [main.address, "bafybeievqbihc3hnsd7aw7anmuppu6h5url6a5pwgfgzrykzkoiqexnmru"], {
    initializer: "initialize",
    nonce: ++nonce
  })
  await collection.deployed();

  const TokenFT = await ethers.getContractFactory("TokenFTContract");
  const tokenFT = await upgrades.deployProxy(TokenFT, [main.address], {
    initializer: "initialize",
    nonce: ++nonce
  })
  await tokenFT.deployed();

  const Market = await ethers.getContractFactory("MarketContract");
  const market = await upgrades.deployProxy(Market, [main.address], {
    initializer: "initialize",
    nonce: ++nonce
  })
  await market.deployed();

  const MainContract = await ethers.getContractAt("MainContract", main.address);
  await MainContract.updateContractAddress(
    landNFT.address,
    landNFTHelper.address,
    zombieNFT.address,
    zombieNFTHelper.address,
    monsterNFT.address,
    monsterNFTHelper.address,
    tokenFT.address,
    collection.address,
    market.address,
    {
      nonce: ++nonce
    }
  );

  console.log("Main address", main.address);
  console.log("LandNFT address", landNFT.address);
  console.log("LandNFTHelper address", landNFTHelper.address);
  console.log("ZombieNFT address", zombieNFT.address);
  console.log("ZombieNFTHelper address", zombieNFTHelper.address);
  console.log("MonsterNFT address", monsterNFT.address);
  console.log("MonsterNFTHelper address", monsterNFTHelper.address);
  console.log("Collection address", collection.address);
  console.log("TokenFT address", tokenFT.address);
  console.log("Market address", market.address);

  saveFrontendFiles(main, "MainContract");
  saveFrontendFiles(landNFT, "LandNFTContract");
  saveFrontendFiles(landNFTHelper, "LandNFTHelperContract");
  saveFrontendFiles(zombieNFT, "ZombieNFTContract");
  saveFrontendFiles(zombieNFTHelper, "ZombieNFTHelperContract");
  saveFrontendFiles(monsterNFT, "MonsterNFTContract");
  saveFrontendFiles(monsterNFTHelper, "MonsterNFTHelperContract");
  saveFrontendFiles(collection, "CollectionContract");
  saveFrontendFiles(tokenFT, "TokenFTContract");
  saveFrontendFiles(market, "MarketContract");

  // Add Collections
  await collection.addCollection("Mummy", "bafkreigdcymxku7b6o4pcyfqqzf5dieviewhwndrknbggvhk6vokavfxwe", { nonce: ++nonce });
  await collection.addCollection("Pirate", "bafybeifq6clpc672vcln7l5iv4355ze6ludm7opcpldbgkwa7sfu5inysm", { nonce: ++nonce });
  await collection.addCollection("Punk", "bafybeid3p33trzeklhvblet72wmt2rfnfvgii6ezbvhdix4hc7p2uwuotu", { nonce: ++nonce });
  await collection.addCollection("Stylish", "bafybeifjiplwfr52wvogoxidckgpq2urq66cjrqfdvfsgn2y3kscxjlcu4", { nonce: ++nonce });
  await collection.addCollection("Combat", "bafybeico3paszepcemcprmsav47ntzy4cohqiw56m6o7pyi7oslhtf4ro4", { nonce: ++nonce });

  console.log("Collections added");

  // for (let i = 0; i < 5; i++) {
  //   await landNFT.connect(account1).safeMint({ value: ethers.utils.parseEther("0.33") });
  //   await zombieNFT.connect(account1).safeMint(i);
  //   console.log('+');
  // }
  // console.log("Seed data added");

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
