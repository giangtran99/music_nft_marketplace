require('dotenv').config();

const HDWalletProvider = require('@truffle/hdwallet-provider');
const privateKeys = process.env.PRIVATE_KEYS || "";

module.exports = {

  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" //match any network id
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(privateKeys.split(','), `https://rinkeby.infura.io/v3/${process.env.RINKEBY_API_KEY}` // Url to an Ethereum node
        )
      },
      gas: 5000000,
      gasPrice: 25000000000,
      network_id: 4
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(privateKeys.split(','), `wss://ropsten.infura.io/ws/v3/${process.env.INFURA_API_KEY}`)
      },
      network_id: 3,
      gas: 7000000,
      gasPrice: 2000000000,
      confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 4000,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true 
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