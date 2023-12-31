// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Dappazon {
    address public owner;
    uint256 public itemCount;
    constructor() {
        owner = msg.sender;
        itemCount = 0;
    }

    struct Item {
        uint256 id;
        address owner;
        string name;
        string category;
        string image;
        uint256 cost;
        uint256 rating;
        uint256 stock;
    }

    struct Order {
        uint256 time;
        Item item;
    }

    mapping(uint256 => Item) public items;
    mapping(address => uint256) public orderCount;
    mapping(address => mapping(uint256 => Order)) public orders;
    
    event List(string name, uint256 cost, uint256 stock);
    event Buy(address buyer, uint256 orderId, uint256 itemId); 
    event GetItemCount();

    // List of products
    function list(
        uint256 _id,
        string memory _name,
        string memory _category,
        string memory _image,
        uint256 _cost,
        uint256 _rating,
        uint256 _stock
    ) public {
        Item memory item = Item(
            _id,
            msg.sender,
            _name,
            _category,
            _image,
            _cost,
            _rating,
            _stock
        );
        items[_id] = item;
        itemCount += 1;
        // Emit Event
        emit List(_name, _cost, _stock);
    }

    // Buy a product
    function buy(uint256 _id) public payable {
        // Fetch Item
        Item memory item = items[_id];

        // Require Enough Ether to Buy Item
        require(msg.value >= item.cost);

        // Require Item in Stock
        require(item.stock > 0);

        payable(item.owner).transfer(item.cost);

        if(msg.value > item.cost) {
            payable(msg.sender).transfer(msg.value - item.cost);
        }

        // Create Order
        Order memory order = Order(block.timestamp, item);

        // Add Order
        orderCount[msg.sender] += 1;
        orders[msg.sender][orderCount[msg.sender]] = order;

        // Subtract Stock
        items[_id].stock = item.stock - 1;

        // Emit Event
        emit Buy(msg.sender, orderCount[msg.sender], item.id);
    }

    function getItemCount() public view returns(uint256){
        return itemCount;
    }
}
