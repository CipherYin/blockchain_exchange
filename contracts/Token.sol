// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;



contract Token {
    string public name;    
    string public symbol;
    uint256 public decimals = 18;
    uint256 public totalSupply;//https://eth-converter.com/

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );
    event Approval(
        address indexed _owner, 
        address indexed _spender, 
        uint256 _value
    );

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply
    ){
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply *(10**decimals);
        balanceOf[msg.sender] = totalSupply;
        
    }


    function transfer(address _to,uint256 _value) 
        public 
        returns (bool success)
    {
        //require that sender has enough tokens to spend;
        require(balanceOf[msg.sender] >= _value);
        require(_to != address(0));
        //deduct tokens from spender
        balanceOf[msg.sender] = balanceOf[msg.sender] - _value;
        // credit tokens to receiver
        balanceOf[_to] = balanceOf[_to] + _value;
        //Emit event
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) 
        public 
        returns (bool success) 
    {
        require(_spender != address(0));
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender,_spender,_value);
        return true;
    }

    // function allowance(address _owner, address _spender) public view returns (uint256 remaining){

    // }



}