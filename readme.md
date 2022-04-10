## Run frontend:
```
yarn start
```

## Start local node:
```
yarn local
```

## Deploy:
```
yarn deploy
```

## Run tests:
```
npx hardhat test
```

## Debug on local console:
```
yarn local
```

### Test your contracts in console:
**Init contracts**
```
const MainContract = await ethers.getContractAt("Main", "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1")
const LandContract = await ethers.getContractAt("LandNFT", "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0")
const ZombieContract = await ethers.getContractAt("ZombieNFT", "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512")
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