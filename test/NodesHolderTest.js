const NodesHolder = artifacts.require("NodesHolder.sol");
const EpochContract = artifacts.require("EpochContract.sol");

contract('NodesHolder test', async (accounts)=>{

  it("Should top up node's balance by 100", async () => {
    let NodesHolderInstance = await NodesHolder.deployed();
    await NodesHolderInstance.topUpNodeBalance("12345", {from: accounts[0], value: 100});
    let nodeBalance = await NodesHolderInstance.getNodeBalance.call("12345");
    assert.equal(nodeBalance, 100);
  });

  it("Should withdraw 50 from node's balance", async () => {
    let NodesHolderInstance = await NodesHolder.deployed();
    await NodesHolderInstance.witdrawFromNode("12345", 50, {from: accounts[0]});
    let nodeBalance = await NodesHolderInstance.getNodeBalance("12345");
    assert.equal(nodeBalance, 50, "Node's balance should be withdrawn and equals to 50");
  });

  it("Should not start epoch with not contract owner's address", async () => {
    let NodesHolderInstance = await NodesHolder.deployed();
    try{
      await NodesHolderInstance.startEpoch({from: accounts[1]});
    } catch (error){
      assert(error.message.startsWith("VM Exception while processing transaction: revert"));
    }
  });

  it("Should start epoch with only owner's address", async () => {
    let NodesHolderInstance = await NodesHolder.deployed();
    await NodesHolderInstance.startEpoch({from: accounts[0]});
    let currentEpochAddress = await NodesHolderInstance.getCurrentEpoch.call();
    assert.notEqual(currentEpochAddress, "0x0000000000000000000000000000000000000000");
  });

  it("Fee amount of current epoch should be 0", async () => {
    let NodesHolderInstance = await NodesHolder.deployed();
    let currentEpochAddress = await NodesHolderInstance.getCurrentEpoch.call();
    let EpochContractInstance = EpochContract.at(currentEpochAddress);
    let feeAmount = await EpochContractInstance.getFeeAmount.call();
    assert.equal(feeAmount, 0);
  });

  it("Node quantity of current epoch should be 1", async () => {
    let NodesHolderInstance = await NodesHolder.deployed();
    let currentEpochAddress = await NodesHolderInstance.getCurrentEpoch.call();
    let EpochContractInstance = EpochContract.at(currentEpochAddress);
    let nodeQuantity = await EpochContractInstance.nodeQuantity.call();
    assert.equal(nodeQuantity, 1);
  });

  it("Node with 50 balance should have current epoch as unspent", async () => {
    let NodesHolderInstance = await NodesHolder.deployed();
    let currentEpochAddress = await NodesHolderInstance.getCurrentEpoch.call();
    let notCashedEpochs = await NodesHolderInstance.getNotCashedEpochs.call("12345");
    assert.equal(currentEpochAddress, notCashedEpochs[0]);
  });

  it("Should redirect fee from NodesHolder contract to current epoch and fee amount should be equal to 10eth now", async () => {
    let NodesHolderInstance = await NodesHolder.deployed();
    let currentEpochAddress = await NodesHolderInstance.getCurrentEpoch.call();
    let EpochContractInstance = EpochContract.at(currentEpochAddress);
    await NodesHolderInstance.redirectFee({from: accounts[1], value: 10000000000000000000});
    let feeAmount = await EpochContractInstance.getFeeAmount.call();
    assert.equal(feeAmount, 10000000000000000000);
  });

  it("Node should be able to withdraw epoch reward - 10eth", async () => {
    let NodesHolderInstance = await NodesHolder.deployed();
    let currentEpochAddress = await NodesHolderInstance.getCurrentEpoch.call();
    let EpochContractInstance = EpochContract.at(currentEpochAddress);
    let balanceBefore = await web3.eth.getBalance(accounts[0]);
    let isRewardWithdrawn = await EpochContractInstance.withdrawReward("12345", {from: accounts[0]});
    let balanceAfter = await web3.eth.getBalance(accounts[0]);
    assert(isRewardWithdrawn);
    let feeAmount = await EpochContractInstance.getFeeAmount.call();
    assert.equal(feeAmount, 0);
    let nodeQuantity = await EpochContractInstance.nodeQuantity.call();
    assert.equal(nodeQuantity, 0);
    assert.isBelow(web3.fromWei(balanceBefore.toNumber(), "ether" ), web3.fromWei(balanceAfter.toNumber(), "ether" ));
  });

  it("Fee amount of current epoch should be 0", async () => {
    let NodesHolderInstance = await NodesHolder.deployed();
    let currentEpochAddress = await NodesHolderInstance.getCurrentEpoch.call();
    let EpochContractInstance = EpochContract.at(currentEpochAddress);
    let feeAmount = await EpochContractInstance.getFeeAmount.call();
    assert.equal(feeAmount, 0);
  });

  it("Node quantity of current epoch should be 0", async () => {
    let NodesHolderInstance = await NodesHolder.deployed();
    let currentEpochAddress = await NodesHolderInstance.getCurrentEpoch.call();
    let EpochContractInstance = EpochContract.at(currentEpochAddress);
    let nodeQuantity = await EpochContractInstance.nodeQuantity.call();
    assert.equal(nodeQuantity, 0);
  });

  it("Node with 50 balance should not have unspent epochs", async () => {
    let NodesHolderInstance = await NodesHolder.deployed();
    let notCashedEpochs = await NodesHolderInstance.getNotCashedEpochs.call("12345");
    assert.equal(notCashedEpochs.length, 0);
  });

});
