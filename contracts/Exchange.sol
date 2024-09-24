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
    uint256 public ordersCount; //0
    mapping(address => mapping(address=>uint256)) public tokens;
    //Order mapping
    mapping(uint256 => _Order) public orders;
    event Deposit(
        address indexed token, 
        address indexed user, 
        uint256 _value,
        uint256 balance
    );

    event Withdraw(
        address indexed token, 
        address indexed user, 
        uint256 _value,
        uint256 balance
    );

    event Order(
        uint256 id;
        address user;
        address tokenGet;
        uint256 amountGet;
        address tokenGive;
        uint256 amountGive;
        uint256 timestamp;
    );

    struct _Order {
        // Attributes of an order
        uint256 id;
        address user;
        address tokenGet;
        uint256 amountGet;
        address tokenGive;
        uint256 amountGive;
        uint256 timestamp;
    }
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

    function withdrawToken(address _token,uint256 _amount) public{
        require(tokens[_token][msg.sender]>=_amount);
        //update user balance
        Token(_token).transfer(msg.sender, _amount);
        // Transfer tokens to user
        tokens[_token][msg.sender] = tokens[_token][msg.sender]- _amount;

        // emit event
        emit Withdraw(_token,msg.sender,_amount,tokens[_token][msg.sender]);
    }

    //check balances
    function balanceOf(address _token,address _user)
        public
        view
        returns (uint256)
    {
        return tokens[_token][_user];
    }
    //Token give(the token they want to spend) - which token,and how much?
    //Token Get(the token they want to receive) - which token,and how much?
    function makeOrder(
        address _tokenGet,
        uint256 _amountGet,
        address _tokenGive,
        address _amountGive
    )public 
    {
        require(balanceOf(_tokenGive,msg.sender) >= _amountGive);
        ordersCount = ordersCount+1;
        orders[ordersCount] = _Order(
            ordersCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp);
        emit Order(ordersCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp)
    }
}