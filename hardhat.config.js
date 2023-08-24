require("@nomicfoundation/hardhat-toolbox");
const GOERLI_TESTNET_PRIVATE_KEY = 'fea80bc4aa399e14490968adb065d69825f112a2a4d37a754a9624f7638ae52e'
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // solidity: "0.8.17",
  // hardhat: {
  //   chainId: 1337,
  // },
  // arbitrumGoerli: {
  //   url: 'https://goerli-rollup.arbitrum.io/rpc',
  //   chainId: 421613,
  //   accounts: [0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC]
  // },
  // arbitrumOne: {
  //   url: 'https://arb1.arbitrum.io/rpc',
  //   //accounts: [ARBITRUM_MAINNET_TEMPORARY_PRIVATE_KEY]
  // },
  // networks: {
  //   arbitrum: {
  //     url:"https://goerli-rollup.arbitrum.io/rpc",
  //     accounts: ["0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"],
  //     gasPrice: 0,
  //   }
  // }
  solidity: '0.8.18',
  networks: {
    hardhat: {
      chainId: 1337,
    },
    arbitrumGoerli: {
      url: 'https://goerli-rollup.arbitrum.io/rpc',
      chainId: 421613,
      accounts: [GOERLI_TESTNET_PRIVATE_KEY]
    },
    arbitrumOne: {
      url: 'https://arb1.arbitrum.io/rpc',
      //accounts: [ARBITRUM_MAINNET_TEMPORARY_PRIVATE_KEY]
    },
  },
};
