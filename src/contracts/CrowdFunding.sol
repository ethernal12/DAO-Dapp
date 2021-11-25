// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
pragma experimental ABIEncoderV2;

contract CrowdFunding{
    
    address public admin;
    uint public noOfContributors;
    uint public goal;
    uint public deadline;
    uint public minContribution;
    uint public raisedAmount;
    uint public id;
    
    
    struct Request {
        uint id;
        string title;
        string description;
        uint value;
        address payable recepient;
        uint noOfVOters;
        bool completed;
        mapping (address => bool) voters;
  
    }
    
   
    mapping(address => uint) public contributors;
    mapping(uint => Request) public spendingRequests;
    mapping(address => bool) public voted;
    
    
    
    constructor (uint _deadline, uint _goal, uint _minContribution) {
        minContribution = _minContribution;
        deadline = block.timestamp + _deadline;
        goal = _goal;
        admin = msg.sender;
        
    }
    
    
    function contribute () public payable {
        require(deadline > block.timestamp, " The campaign contribution deadline ended!");
        require(msg.value >= minContribution, "Minimum contribution not met!");
        if(contributors[msg.sender] == 0){
            
            noOfContributors ++;
            
        }
        contributors[msg.sender] += msg.value;
        raisedAmount += msg.value;
  
    }
    
    
    receive ()payable external {
        contribute();
        
    }
    
    
    
    function getContractBalance () public returns (uint){
        
        
        return address(this).balance;
    }
    
    
    function getRefund () public payable {
        
        require(deadline < block.timestamp && raisedAmount < goal, "The campaign deadline has not passed yet, or the funding goal has not been met!");
        require(contributors[msg.sender] > 0, "You have not contributed to the campaign, cannot refund!");
        address payable recepient = payable(msg.sender);
        uint value = contributors[msg.sender];
        contributors[msg.sender] = 0;
        recepient.transfer(value);

    }

     
    function spendingRequest(string memory _title, string memory _description, address payable _recepient, uint _value) public onlyOwner {
        
      
      Request storage newRequest = spendingRequests[id];
      newRequest.id = id;
      newRequest.description = _description;
      newRequest.title = _title;
      newRequest.recepient = _recepient;
      newRequest.value = _value;
      newRequest.noOfVOters = 0;

      id++;
      
 
    }

    function getSpendingRequest(uint _id) public view returns(uint, string memory, string memory, uint, address, uint, bool){
        
        Request storage r = spendingRequests[_id];
        
        return(r.id, r.title, r.description, r.value, r.recepient, r.noOfVOters, r.completed);


    }
    
    function vote(uint _id) public contributorRights {
        
        Request storage request = spendingRequests[_id];
        require(msg.sender != admin,"Admin cannot cast a vote! ");
        require(request.voters[msg.sender] == false, "You have allready voted for this spending request!");
        request.voters[msg.sender] = true;
        request.noOfVOters += 1;
        voted[msg.sender] = true;
 
    }


    function hasVoted(address _voter) public view returns (bool){

        return voted[_voter];
    }

    function checkReequestApproved(uint  _id) public view returns (bool){
        bool requestApproved;
        Request storage request = spendingRequests[_id];
        if(/*deadline < block.timestamp &&*/ raisedAmount >= goal && request.noOfVOters > noOfContributors / 2){
           requestApproved = true;
        }
        else{
            requestApproved = false;
        }

        return(requestApproved);

    }

    function deadline_ () public view returns(bool){

        bool isDeadline = false;

        if(deadline < block.timestamp){

            isDeadline = true;
        }

        return isDeadline;

    }

    function raisedAmount_ () public view returns(bool){
        bool isRaised = false;

        if(raisedAmount >= goal ){

            isRaised = true;
        }

        return isRaised;

    }

    function goal_ () public view returns(uint){


        return goal;
    }


    function transferRequestFunds(uint  _id)  public payable onlyOwner requestApproved(_id){
        require(raisedAmount >= goal, "The funding funds goal has not been reached!");
        Request storage request = spendingRequests[_id];
        request.completed = true;
        request.recepient.transfer(request.value);
        
        
    }

        function completedRequests(uint _id) public returns(bool, uint){

        Request storage request = spendingRequests[_id];
            
   
            return(request.completed, _id);
        }
        
    
    modifier requestApproved (uint  _id) {
        Request storage request = spendingRequests[_id];
        require(request.noOfVOters > noOfContributors / 2, "The request has not received more than half of votes!" );
        _;
        
    }
    
    
    modifier contributorRights() {
        require(contributors[msg.sender] > 0,"No right to vote!");
        _;
        
    }
    
    modifier onlyOwner() {
        
        require (msg.sender == admin,"Only admin!");
        _;
        
    }
}