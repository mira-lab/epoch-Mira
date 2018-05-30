pragma solidity ^0.4.23;

import './NodesHolder.sol';

contract EpochContract{
    
    NodesHolder nodesHolder;
    address nodesHolderAddress;
    
    uint public miraCoins = 0;
    uint public nodeQuantity = 0;
    uint public epochEndTime;
    
    constructor (address _nodesHolderAddress) public{
        nodesHolder = NodesHolder(_nodesHolderAddress);
        nodesHolderAddress = _nodesHolderAddress;
        epochEndTime = now;// + 12 hours; // UNCOMMENT THIS BEFORE RELEASE
    }
    
    function () payable public{
        miraCoins += msg.value;
    }
    
    function getFee() payable public{
        miraCoins += msg.value;
    }
    
    function getFeeAmount() public view returns(uint){
        return miraCoins;
    }
    
    function withdrawReward(string nodeId) public returns(bool){
        if(nodesHolder.withdrawEpochReward(nodeId, msg.sender) && now >= epochEndTime){
            uint rewardValue = miraCoins/nodeQuantity;
            msg.sender.transfer(rewardValue);
            miraCoins -= rewardValue;
            nodeQuantity -= 1;
            return true;
        }
        return false;
    }
    
    function setNodeQuantity(uint _nodeQuantity) public{
        require(msg.sender == nodesHolderAddress);
        nodeQuantity = _nodeQuantity;
    }
}
