const web3  = require('web3');
const CF = artifacts.require("CrowdFunding");

module.exports = function (deployer) {
  deployer.deploy(CF,
                  web3.utils.toBN(10000).toString(),//DEADLINE in sec.
                  web3.utils.toBN(web3.utils.toWei("0.03", "ether")).toString(),//GOAL
                  web3.utils.toBN(web3.utils.toWei("0.01", "ether")).toString()//MINIMUM CONTRIBUTION
                  ,);
};
