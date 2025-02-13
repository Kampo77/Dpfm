require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  paths: {
    artifacts: "./artifacts",
    sources: "./contracts",
    cache: "./cache",
    tests: "./test"
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 100000000,  // 0.1 gwei
      gas: 1500000,         // уменьшенный лимит газа
      maxFeePerGas: 100000000,
      maxPriorityFeePerGas: 100000000
    },
    hardhat: {
      chainId: 1337
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 1337
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
