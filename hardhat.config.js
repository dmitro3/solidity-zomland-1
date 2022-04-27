require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
// task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
//   const accounts = await hre.ethers.getSigners();
//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });

// console.log(process.env.METER_TESTNET_PRIVATE_KEY);

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
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
    // meter_testnet: {
    //   url: "https://rpctest.meter.io",
    //   accounts: [`${process.env.METER_TESTNET_PRIVATE_KEY}`]
    // },
    // meter_mainnet: {
    //   url: "https://rpc.meter.io",
    //   accounts: [`${process.env.METER_MAINNET_PRIVATE_KEY}`]
    // }
  },
};