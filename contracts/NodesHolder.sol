pragma solidity ^0.4.23;

import './EpochContract.sol';

contract NodesHolder{

    struct Node {
        uint balance;
        address owner;
        address[] notCashedEpochs;
    }
    
    EpochContract currentEpochInstance;
    
    uint nodesCount = 0;
    uint private nodeFreezeValue = 1;
    
    address private owner;
    address currentEpochAddress;
    address lastEpochAddress;
    
    mapping (uint => bytes32) nodesNumerator;
    mapping (bytes32 => Node) nodes;
    
    constructor() public{
        owner =  msg.sender;
    }
    
    modifier onlyOwner {
        require(owner == msg.sender);
        _;
    }
    
    function setNodeFreezeValue (uint newValue) public onlyOwner{
        nodeFreezeValue = newValue;
    }
    
    function getNodeBalance(string nodeId) public view returns(uint){
        bytes32 encodedNodeId = keccak256(abi.encodePacked(nodeId));
        return nodes[encodedNodeId].balance;
    }
    
    function getCurrentEpoch() public view returns(address){
        return currentEpochAddress;
    }
    
    function getNotCashedEpochs(string nodeId) public view returns(address[]){
        require(bytes(nodeId).length > 0);
        bytes32 encodedNodeId = keccak256(abi.encodePacked(nodeId));
        return nodes[encodedNodeId].notCashedEpochs;
    }
    
    function redirectFee() payable public{
        currentEpochInstance.getFee.value(msg.value)();
    }
    
    function topUpNodeBalance(string nodeId) payable public{
        require(bytes(nodeId).length > 0);
        bytes32 encodedNodeId = keccak256(abi.encodePacked(nodeId));
        if(nodes[encodedNodeId].owner == address(0)){
            nodes[encodedNodeId] = Node({
                balance: msg.value,
                owner: msg.sender,
                notCashedEpochs: new address[](0)
            });
            nodesNumerator[nodesCount] = encodedNodeId;
            nodesCount++;
        } else{
            nodes[encodedNodeId].balance += msg.value;
        }
    }

    function witdrawFromNode(string nodeId, uint amount) public{
        bytes32 encodedNodeId = keccak256(abi.encodePacked(nodeId));
        require(nodes[encodedNodeId].balance >= amount && amount > 0);
        if(nodes[encodedNodeId].owner == msg.sender){
            nodes[encodedNodeId].balance -= amount;
            msg.sender.transfer(amount);
        }
    }
    
    function startEpoch() public onlyOwner returns(uint){
        uint nodeQuantity = 0;
        currentEpochAddress = new EpochContract(address(this));
        currentEpochInstance = EpochContract(currentEpochAddress);
        for(uint i = 0; i < nodesCount; i++){
            if(nodes[nodesNumerator[i]].balance >= nodeFreezeValue){
                nodes[nodesNumerator[i]].notCashedEpochs.push(currentEpochAddress);
                nodeQuantity++;
            }
        }
        currentEpochInstance.setNodeQuantity(nodeQuantity);
        return nodeQuantity;
    }
    
    function withdrawEpochReward(string nodeId, address sender) public returns(bool){
        bytes32 encodedNodeId = keccak256(abi.encodePacked(nodeId));
        bool isEpochNotCashed = false;
        uint notCashedIndex;
        
        for(uint i = 0; i < nodes[encodedNodeId].notCashedEpochs.length; i++){
            if (msg.sender == nodes[encodedNodeId].notCashedEpochs[i]){
                isEpochNotCashed = true;
                notCashedIndex = i;
            }
        }
        
        if(nodes[encodedNodeId].owner == sender && isEpochNotCashed){
            uint notCashedLastEl = nodes[encodedNodeId].notCashedEpochs.length-1;
            nodes[encodedNodeId].notCashedEpochs[notCashedIndex] = nodes[encodedNodeId].notCashedEpochs[notCashedLastEl];
            delete (nodes[encodedNodeId].notCashedEpochs[notCashedLastEl]);
            nodes[encodedNodeId].notCashedEpochs.length--;
            return true;
        }
        
        return false;
    }
    
}
