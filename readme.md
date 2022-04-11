## 1. Start local node:

```
yarn local
```

## 2. Deploy:

```
yarn deploy
```

## 3. Run frontend:

```
yarn start
```

## Run tests:

```
npx hardhat test
```

## Debug on local console:

```
yarn console
```

### Test your contracts in console:

**Init contracts**

```
const MainContract = await ethers.getContractAt("Main", "0x5FbDB2315678afecb367f032d93F642f64180aa3")
const LandContract = await ethers.getContractAt("LandNFT", "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0")
const ZombieContract = await ethers.getContractAt("ZombieNFT", "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512")
const TokenContract = await ethers.getContractAt("TokenFT", "0x9d4454B023096f34B160D6B654540c56A1F81688")
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
await TokenContract.balanceOf("0x9d4454B023096f34B160D6B654540c56A1F81688")

await TokenContract.withdraw("1000000000000000000")
await TokenContract.earned("0x90F79bf6EB2c4f870365E785982E1f101E93b906")
```