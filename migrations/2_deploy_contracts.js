var creator = artifacts.require("InitialCreator");

module.exports = function(deployer, network, accounts) {
    deployer.deploy(creator, {from: accounts[0]});
};
