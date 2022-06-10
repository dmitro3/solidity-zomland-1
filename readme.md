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

Deploy to testnet:
===============

#### 1. Set Account PRIVATE KEY in .env file

```
export BSC_TESTNET_PRIVATE_KEY="0x..."
```

#### 2. Deploy to testnet

```
yarn deploy:dev:bsc
```

#### 3. Build frontend

```
yarn build:dev:bsc
```

#### 4. Upload frontend files 
