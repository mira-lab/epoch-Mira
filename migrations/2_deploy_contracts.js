var NodesHolder = artifacts.require("./NodesHolder.sol");

module.exports = function (deployer) {
    //Deploy NodesHolder contract
    deployer.deploy(NodesHolder)
    .then(() => {
      console.log("NodesHolder contract succesfully deployed!");
    });
};
