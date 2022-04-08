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

const LandContract = await ethers.getContractAt("LandNFT", "0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE")
await LandContract.balanceOf("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266")
await LandContract.landTypeCount(0)

await LandContract.safeMint({value: "10000000000000000"})
await LandContract.safeMint({value: "5000000000000000000"})

```