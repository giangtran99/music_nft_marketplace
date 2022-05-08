require('dotenv').config();

const HDWalletProvider = require('@truffle/hdwallet-provider');
const privateKeys = process.env.PRIVATE_KEYS || "";

module.exports = {

  networks: {
    development: {
      host: "0.0.0.0",
      port: 8545,
      network_id: "*" //match any network id
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(privateKeys.split(','), `https://eth-ropsten.alchemyapi.io/v2/${process.env.INFURA_API_KEY}`)
      },
      network_id: 3,
      gas: 5000000,
      gasPrice: 0,
      // networkCheckTimeout: 100000,
      // confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      // timeoutBlocks: 100000,  // # of blocks before a deployment times out  (minimum/default: 50)
      // skipDryRun: true 
    }
  },
  contracts_directory: './src/contracts',
  contracts_build_directory: './src/abis',

  // Configure your compilers
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      version: "^0.8.0"
    }
  }
};