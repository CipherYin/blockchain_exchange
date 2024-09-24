// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";

/**
1. Deposit Tokens
2. Withdraw Tokens
3. Check Balances
4. Make Orders
5. Cancel Orders
6. Fill Orders
7. Charge Fees
8. Track Fee Account
 */
contract Exchange {
    address public feeAccount;
    uint256 public feePercent;
    mapping(address => mapping(address=>uint256)) public tokens;
    event Deposit(
        address indexed token, 
        address indexed user, 
        uint256 _value,
        uint256 balance
    );
    constructor(address _feeAccount,uint256 _feePercent){
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }
    

    function depositToken(address _token,uint256 _amount) public{
        // Transfer token to exchange
        require(Token(_token).transferFrom(msg.sender,address(this),_amount));
        // update user balance
        tokens[_token][msg.sender] = tokens[_token][msg.sender]+ _amount;
        //emit an event
        emit Deposit(_token,msg.sender,_amount,tokens[_token][msg.sender]);
    }

    //check balances
    function balanceOf(address _token,address _user)
        public
        view
        returns (uint256)
    {
        return tokens[_token][_user];
    }
}