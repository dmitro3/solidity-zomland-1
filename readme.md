## Run frontend:
```
yarn start
```

## Create local accounts:
```
npx hardhat node
```

## Deploy:
```
npx hardhat run src/backend/scripts/deploy.js --network localhost
```

## Run tests:
```
npx hardhat test
```

## Console:
```
npx hardhat console --network localhost

const MainContract = await ethers.getContractAt("Main", "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1")

const LandContract = await ethers.getContractAt("LandNFT", "0xc3e53F4d16Ae77Db1c982e75a937B9f60FE63690")
await LandContract.balanceOf("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
await LandContract.landTypeCount(0)

await LandContract.safeMint({value: "10000000000000000"})
await LandContract.safeMint({value: "5000000000000000000"})

```