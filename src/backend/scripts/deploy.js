async function main() {

    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    // deploy contracts here:
    const Main = await ethers.getContractFactory("Main");
    const main = await Main.deploy();

    const ZombieNFT = await ethers.getContractFactory("ZombieNFT");
    const zombieNFT = await ZombieNFT.deploy(main.address);

    const LandNFT = await ethers.getContractFactory("LandNFT");
    const landNFT = await LandNFT.deploy(main.address);

    const MainContract = await ethers.getContractAt("Main", main.address);
    await MainContract.setContractAddresses(landNFT.address);
    await MainContract.setContractAddresses(zombieNFT.address);

    console.log("Main address", main.address);
    console.log("LandNFT address", landNFT.address);
    console.log("ZombieNFT address", zombieNFT.address);

    // For each contract, pass the deployed contract and name to this function to save a copy of the contract ABI and address to the front end.
    saveFrontendFiles(main, "Main");
    saveFrontendFiles(landNFT, "LandNFT");
    saveFrontendFiles(zombieNFT, "ZombieNFT");
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
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
