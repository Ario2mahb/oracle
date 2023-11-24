import "module-alias/register";

import "@nomicfoundation/hardhat-chai-matchers";
import "@nomiclabs/hardhat-etherscan";
import "@openzeppelin/hardhat-upgrades";
import "@typechain/hardhat";
import * as dotenv from "dotenv";
import "hardhat-deploy";
import "hardhat-gas-reporter";
import { HardhatUserConfig } from "hardhat/config";
import "solidity-coverage";
import "solidity-docgen";

dotenv.config();

function isFork() {
  return process.env.FORK === "true"
    ? {
        allowUnlimitedContractSize: false,
        loggingEnabled: false,
        forking: {
          url: process.env[`ARCHIVE_NODE_${process.env.FORKED_NETWORK}`],
          blockNumber: 26349263,
        },
        accounts: {
          accountsBalance: "1000000000000000000",
        },
        live: false,
      }
    : {
        allowUnlimitedContractSize: true,
        loggingEnabled: false,
        live: false,
      };
}

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.13",
        settings: {
          optimizer: {
            enabled: true,
            details: {
              yul: !process.env.CI,
            },
          },
          outputSelection: {
            "*": {
              "*": ["storageLayout"],
            },
          },
        },
      },
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            details: {
              yul: !process.env.CI,
            },
          },
          outputSelection: {
            "*": {
              "*": ["storageLayout"],
            },
          },
        },
      },
    ],
  },
  networks: {
    hardhat: isFork(),
    development: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
      live: false,
    },
    bsctestnet: {
      url: process.env.ARCHIVE_NODE_bsctestnet || "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      live: true,
      gasPrice: 20000000000,
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [`0x${process.env.DEPLOYER_PRIVATE_KEY}`] : [],
    },
    // Mainnet deployments are done through Frame wallet RPC
    bscmainnet: {
      url: process.env.ARCHIVE_NODE_bscmainnet || "https://bsc-dataseed.binance.org/",
      chainId: 56,
      live: true,
      timeout: 1200000, // 20 minutes
    },
    sepolia: {
      url: process.env.ARCHIVE_NODE_sepolia || "https://ethereum-sepolia.blockpi.network/v1/rpc/public",
      chainId: 11155111,
      live: true,
      gasPrice: 20000000000,
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [`0x${process.env.DEPLOYER_PRIVATE_KEY}`] : [],
    },
    ethereum: {
      url: process.env.ARCHIVE_NODE_ethereum || "https://ethereum.blockpi.network/v1/rpc/public",
      chainId: 1,
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [`0x${process.env.DEPLOYER_PRIVATE_KEY}`] : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: {
      bscmainnet: process.env.ETHERSCAN_API_KEY || "ETHERSCAN_API_KEY",
      bsctestnet: process.env.ETHERSCAN_API_KEY || "ETHERSCAN_API_KEY",
      sepolia: process.env.ETHERSCAN_API_KEY || "ETHERSCAN_API_KEY",
      ethereum: process.env.ETHERSCAN_API_KEY || "ETHERSCAN_API_KEY",
    },
    customChains: [
      {
        network: "bscmainnet",
        chainId: 56,
        urls: {
          apiURL: "https://api.bscscan.com/api",
          browserURL: "https://bscscan.com",
        },
      },
      {
        network: "bsctestnet",
        chainId: 97,
        urls: {
          apiURL: "https://api-testnet.bscscan.com/api",
          browserURL: "https://testnet.bscscan.com",
        },
      },
      {
        network: "sepolia",
        chainId: 11155111,
        urls: {
          apiURL: "https://api-sepolia.etherscan.io/api",
          browserURL: "https://sepolia.etherscan.io",
        },
      },
      {
        network: "ethereum",
        chainId: 1,
        urls: {
          apiURL: "https://api.etherscan.io/api",
          browserURL: "https://etherscan.io",
        },
      },
    ],
  },
  paths: {
    tests: "./test",
  },
  // Hardhat deploy
  namedAccounts: {
    deployer: 0,
  },
  docgen: {
    outputDir: "./docs",
    pages: "files",
    templates: "./docgen-templates",
  },
};

export default config;
