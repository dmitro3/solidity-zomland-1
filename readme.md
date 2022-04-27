# ZomLand

Play-To-Earn NFT Collectible Game.

### 1. Start local node:

```
yarn local
```

### 2. Deploy to local:

```
yarn deploy
```

### 3. Run frontend:

```
yarn start
```

## Run tests:

```
npx hardhat test
```

### Debug on local console:

```
yarn console
```

Test your contracts in console:
=================

**Init contracts**

```
const MainContract = await ethers.getContractAt("MainContract", "0x5FbDB2315678afecb367f032d93F642f64180aa3")
const LandContract = await ethers.getContractAt("LandNFTContract", "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0")
const ZombieContract = await ethers.getContractAt("ZombieNFTContract", "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512")
const TokenContract = await ethers.getContractAt("TokenFTContract", "0x9A676e781A523b5d0C0e43731313A708CB607508")
```

**Mint calls**

```
await LandContract.safeMint({value: "10000000000000000"})
await ZombieContract.safeMint({value: "5000000000000000000"})
```

**Check minted collections**

```
await LandContract.userLands(1,2)
await ZombieContract.userZombies(1,2)
```

**ZML Token & Staking**

```
await TokenContract.transfer("0x9d4454B023096f34B160D6B654540c56A1F81688", "1000000000000000000000")
await TokenContract.balanceOf("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC")

await TokenContract.withdraw("1000000000000000000")
await TokenContract.earned("0x90F79bf6EB2c4f870365E785982E1f101E93b906")
```

Deploy to testnet:
===============

#### 1. Set Account PRIVATE KEY

```
export METER_TESTNET_PRIVATE_KEY=
```

#### 2. Deploy to testnet

```
yarn deploy:dev
```

#### 3. Build frontend

```
yarn build:dev
```

#### 4. Upload frontend files 