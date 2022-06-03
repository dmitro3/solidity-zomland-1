async function main() {
  const [deployer, account1] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // deploy contracts here:
  const Main = await ethers.getContractFactory("MainContract");
  const main = await Main.deploy();

  const LandNFT = await ethers.getContractFactory("LandNFTContract");
  const landNFT = await LandNFT.deploy(main.address);

  const ZombieNFT = await ethers.getContractFactory("ZombieNFTContract");
  const zombieNFT = await ZombieNFT.deploy(main.address);

  const MonsterNFT = await ethers.getContractFactory("MonsterNFTContract");
  const monsterNFT = await MonsterNFT.deploy(main.address);

  const Collection = await ethers.getContractFactory("CollectionContract");
  const collection = await Collection.deploy(main.address);

  const TokenFT = await ethers.getContractFactory("TokenFTContract");
  const tokenFT = await TokenFT.deploy(main.address);

  const Market = await ethers.getContractFactory("MarketContract");
  const market = await Market.deploy(main.address);

  const MainContract = await ethers.getContractAt("MainContract", main.address);
  await MainContract.updateContractAddress(
    landNFT.address,
    zombieNFT.address,
    monsterNFT.address,
    tokenFT.address,
    collection.address,
    market.address,
  );

  console.log("Main address", main.address);
  console.log("LandNFT address", landNFT.address);
  console.log("ZombieNFT address", zombieNFT.address);
  console.log("MonsterNFT address", monsterNFT.address);
  console.log("Collection address", collection.address);
  console.log("TokenFT address", tokenFT.address);
  console.log("Market address", market.address);

  // Add Collections
  await collection.addCollection("Mummy", "bafkreigdcymxku7b6o4pcyfqqzf5dieviewhwndrknbggvhk6vokavfxwe");
  await collection.addCollection("Pirate", "bafybeifq6clpc672vcln7l5iv4355ze6ludm7opcpldbgkwa7sfu5inysm");
  // await collection.addCollection("Punk", "bafybeid3p33trzeklhvblet72wmt2rfnfvgii6ezbvhdix4hc7p2uwuotu");
  // await collection.addCollection("Stylish", "bafybeifjiplwfr52wvogoxidckgpq2urq66cjrqfdvfsgn2y3kscxjlcu4");
  await collection.addCollection("Combat", "bafybeico3paszepcemcprmsav47ntzy4cohqiw56m6o7pyi7oslhtf4ro4");

  console.log("Collections added");

  // await landNFT.connect(account1).safeMint();
  // await zombieNFT.connect(account1).safeMint(0);

  // For each contract, pass the deployed contract and name to this function to save a copy of the contract ABI and address to the front end.
  saveFrontendFiles(main, "MainContract");
  saveFrontendFiles(landNFT, "LandNFTContract");
  saveFrontendFiles(zombieNFT, "ZombieNFTContract");
  saveFrontendFiles(monsterNFT, "MonsterNFTContract");
  saveFrontendFiles(collection, "CollectionContract");
  saveFrontendFiles(tokenFT, "TokenFTContract");
  saveFrontendFiles(market, "MarketContract");
}

function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../../frontend/contractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({address: contract.address}, undefined, 2)
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
