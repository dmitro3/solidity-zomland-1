// require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");
require("@nomiclabs/hardhat-etherscan");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

module.exports = {
  solidity: {
    version: "0.8.12",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  paths: {
    artifacts: "./src/backend/artifacts",
    sources: "./src/backend/contracts",
    cache: "./src/backend/cache",
    tests: "./src/backend/test"
  },
  networks: {
    hardhat: {
      // mining: {
      //   auto: false,
      //   interval: 1000
      // }
    },
    meter_testnet: {
      url: "https://rpctest.meter.io",
      accounts: process.env.METER_TESTNET_PRIVATE_KEY !== undefined ? [process.env.METER_TESTNET_PRIVATE_KEY] : [],
    },
    meter_mainnet: {
      url: "https://rpc.meter.io",
      accounts: process.env.METER_MAINNET_PRIVATE_KEY !== undefined ? [process.env.METER_MAINNET_PRIVATE_KEY] : [],
    },
    bsc_testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: { mnemonic: process.env.BSC_TESTNET_PRIVATE_KEY || "" }
    },
    bsc_mainnet: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      gasPrice: 20000000000,
      accounts: { mnemonic: process.env.BSC_MAINNET_PRIVATE_KEY || "" }
    },
    emerald_testnet: {
      url: "https://testnet.emerald.oasis.dev",
      accounts: process.env.OASIS_TESTNET_PRIVATE_KEY !== undefined ? [process.env.OASIS_TESTNET_PRIVATE_KEY] : [],
    },
    emerald_mainnet: {
      url: "https://emerald.oasis.dev",
      accounts: process.env.OASIS_MAINNET_PRIVATE_KEY !== undefined ? [process.env.OASIS_MAINNET_PRIVATE_KEY] : [],
    },
  },
};
