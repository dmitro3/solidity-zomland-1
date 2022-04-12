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
  solidity: "0.8.4",
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
      accounts: [`1b5cb167f1cfd45bf677cf4b6756e7fceb6688acf98b9dcdb441eaef03435fa7`]
    },
    // meter_mainnet: {
    //   url: "https://rpc.meter.io",
    //   accounts: [`${process.env.METER_MAINNET_PRIVATE_KEY}`]
    // }
  },
};