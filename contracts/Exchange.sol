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
    mapping(uint256 => bool) public orderCancelled;
    mapping(uint256 => bool) public orderFilled;

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
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );

    event Cancel(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );
    event Trade(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        address creator,
        uint256 timestamp
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
        uint256 _amountGive
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
        emit Order(
            ordersCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp);
    }

    function cancelOrder(uint256 _id) public {
        //Fetch order
        _Order storage _order = orders[_id];
        require(address(_order.user) == msg.sender);
        require(_order.id == _id);
        //Cancel the order
        orderCancelled[_id] = true;

        emit Cancel(
            _order.id,
            msg.sender,
            _order.tokenGet,
            _order.amountGet,
            _order.tokenGive,
            _order.amountGive,
            block.timestamp);
    }

    function fillOrder(uint256 _id) public {

        require(!orderCancelled[_id]);
        require(!orderFilled[_id]);
        require(_id>0 && _id<=ordersCount,"Order does not");

        //fetch order
        _Order storage _order = orders[_id];

        // swapping Tokens(trading)
        _trader(
            _order.id,
            _order.user,
            _order.tokenGet,
            _order.amountGet,
            _order.tokenGive,
            _order.amountGive);
        orderFilled[_order.id] = true;
    }

    function _trader(
        uint256 _orderId,
        address _user,
        address _tokenGet,
        uint256 _amountGet,
        address _tokenGive,
        uint256 _amountGive
    ) internal {

        uint256 _feeAmount = (_amountGet * feePercent) / 100;
        
        tokens[_tokenGet][msg.sender] = tokens[_tokenGet][msg.sender] - (_amountGet + _feeAmount);
        tokens[_tokenGet][_user] = tokens[_tokenGet][_user] + _amountGet;

        //Charge fees
        tokens[_tokenGet][feeAccount] = tokens[_tokenGet][feeAccount] + _feeAmount;

        tokens[_tokenGive][msg.sender] = tokens[_tokenGive][msg.sender] + _amountGive;
        tokens[_tokenGive][_user] = tokens[_tokenGive][_user] - _amountGive;

        emit Trade(
            _orderId,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            _user,
            block.timestamp
        );
    }
}