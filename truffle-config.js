require('dotenv').config()
const web3  = require('web3');
const HDWalletProvider = require("@truffle/hdwallet-provider");



module.exports = {

    networks: {
        development: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "*" // any netowrk id
        },
        kovan: {
            provider: function () {

                return new HDWalletProvider(process.env.MNEMONIC, "https://kovan.infura.io/v3/" + process.env.INFURAKOV )
                },
            network_id: 42,
            gas: 3000000,
            gasPrice:web3.utils.toWei("10", "gwei"),
            skipDryRun: true,
            from:""
        },

    },


    contracts_directory: "./src/contracts/",
    contracts_build_directory: "./src/build_ABIS/",

    compilers: {
        solc: {

            version: "^0.8.7",
            optimizer: {
                enabled: true,
                runs: 200
            }
        },


    }

}
