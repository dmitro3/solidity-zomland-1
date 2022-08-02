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
      mining: {
        auto: false,
        interval: 1000
      }
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
      url: "",
      accounts: process.env.BSC_TESTNET_PRIVATE_KEY !== undefined ? [process.env.BSC_TESTNET_PRIVATE_KEY] : [],
    },
    bsc_mainnet: {
      url: "https://rpc.ankr.com/bsc",
      accounts: { mnemonic: process.env.BSC_MAINNET_PRIVATE_KEY || "" }
    },
    mumbai_testnet: {
      url: "https://matic-mumbai.chainstacklabs.com",
      accounts: process.env.MUMBAI_TESTNET_PRIVATE_KEY !== undefined ? [process.env.MUMBAI_TESTNET_PRIVATE_KEY] : [],
    },
    polygon_mainnet: {
      url: "https://polygon-rpc.com",
      accounts: process.env.POLYGON_MAINNET_PRIVATE_KEY !== undefined ? [process.env.POLYGON_MAINNET_PRIVATE_KEY] : [],
    },
  },
};
