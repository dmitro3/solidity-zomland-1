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

const MainContract = await ethers.getContractAt("Main", "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853")
await MainContract.land_media_hash(0)

```