// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard {
    struct Listing {
        address seller;
        uint256 price;
    }

    // marketplace[nftAddress][tokenId] = Listing
    mapping(address => mapping(uint256 => Listing)) public listings;

    // EVENTS
    event Listed(
        address indexed nft,
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price
    );

    event Sale(
        address indexed nft,
        uint256 indexed tokenId,
        address seller,
        address buyer,
        uint256 price
    );

    event ListingCanceled(
        address indexed nft,
        uint256 indexed tokenId,
        address seller
    );

    event TransferHistory(
        address indexed nft,
        uint256 indexed tokenId,
        address from,
        address to
    );

    // -----------------------------------------------------
    //                  LIST NFT
    // -----------------------------------------------------

    function listItem(address nft, uint256 tokenId, uint256 price) external {
        require(price > 0, "Price must be > 0");

        IERC721 token = IERC721(nft);
        require(token.ownerOf(tokenId) == msg.sender, "Not owner");

        // Transfer NFT to marketplace escrow
        token.transferFrom(msg.sender, address(this), tokenId);

        listings[nft][tokenId] = Listing(msg.sender, price);

        emit Listed(nft, tokenId, msg.sender, price);
        emit TransferHistory(nft, tokenId, msg.sender, address(this));
    }

    // -----------------------------------------------------
    //                  BUY NFT
    // -----------------------------------------------------

    function buyItem(
        address nft,
        uint256 tokenId
    ) external payable nonReentrant {
        Listing memory item = listings[nft][tokenId];
        require(item.price > 0, "Not listed");
        require(msg.value == item.price, "Incorrect price");

        // delete listing first to prevent reentrancy
        delete listings[nft][tokenId];

        // pay seller
        payable(item.seller).transfer(msg.value);

        // transfer NFT to buyer
        IERC721(nft).transferFrom(address(this), msg.sender, tokenId);

        emit Sale(nft, tokenId, item.seller, msg.sender, msg.value);
        emit TransferHistory(nft, tokenId, address(this), msg.sender);
    }

    // -----------------------------------------------------
    //                  CANCEL LISTING
    // -----------------------------------------------------

    function cancelListing(address nft, uint256 tokenId) external {
        Listing memory item = listings[nft][tokenId];
        require(item.price > 0, "Not listed");
        require(item.seller == msg.sender, "Not seller");

        delete listings[nft][tokenId];

        // return NFT to owner
        IERC721(nft).transferFrom(address(this), msg.sender, tokenId);

        emit ListingCanceled(nft, tokenId, msg.sender);
        emit TransferHistory(nft, tokenId, address(this), msg.sender);
    }
}
