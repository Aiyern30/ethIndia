// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Marketplace {
    struct Item {
        uint256 id;
        address seller;
        address owner;
        string name;
        uint256 price;
        bool forSale;
    }

    uint256 public itemCount;
    mapping(uint256 => Item) public items;

    event ItemListed(uint256 id, address seller, string name, uint256 price);
    event ItemBought(uint256 id, address buyer, uint256 price);
    event ItemTransferred(uint256 id, address from, address to);

    function listItem(string memory name, uint256 price) public {
        itemCount++;
        items[itemCount] = Item(itemCount, msg.sender, msg.sender, name, price, true);
        emit ItemListed(itemCount, msg.sender, name, price);
    }

    function buyItem(uint256 id) public payable {
        Item storage item = items[id];
        require(item.forSale, "Item not for sale");
        require(msg.value >= item.price, "Insufficient payment");
        require(item.owner != msg.sender, "Cannot buy your own item");
        address seller = item.owner;
        item.owner = msg.sender;
        item.forSale = false;
        payable(seller).transfer(item.price);
        emit ItemBought(id, msg.sender, item.price);
    }

    function transferItem(uint256 id, address to) public {
        Item storage item = items[id];
        require(item.owner == msg.sender, "Not the owner");
        item.owner = to;
        emit ItemTransferred(id, msg.sender, to);
    }

    function setForSale(uint256 id, bool forSale, uint256 price) public {
        Item storage item = items[id];
        require(item.owner == msg.sender, "Not the owner");
        item.forSale = forSale;
        item.price = price;
    }
}
