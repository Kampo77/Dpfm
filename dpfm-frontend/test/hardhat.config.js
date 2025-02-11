require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.0", // для контрактов, использующих 0.8.0
      },
      {
        version: "0.8.28", // для контрактов, использующих 0.8.28, например Lock.sol
      },
    ],
  },
  paths: {
    sources: "./contracts", // Исправляем путь
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/7YYv_vbrvi_fkKxJFOkr0k28OqtPMBg2",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || "",
  },
};
