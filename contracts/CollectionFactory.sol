// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/* -------------------------------------------------------------------------- */
/*                             COLLECTION CONTRACT                             */
/* -------------------------------------------------------------------------- */

contract Collection is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;
    string public collectionMetadataURI; // ✅ ADD THIS

    constructor(
        string memory name,
        string memory symbol,
        address owner
    ) ERC721(name, symbol) {
        transferOwnership(owner);
    }

    function mint(string memory tokenURI) external onlyOwner {
        uint256 tokenId = nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
    }

    function burn(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not NFT owner");
        _burn(tokenId);
    }

    function setCollectionMetadata(
        string memory _metadataURI
    ) external onlyOwner {
        collectionMetadataURI = _metadataURI;
    }
}

/* -------------------------------------------------------------------------- */
/*                              FACTORY CONTRACT                               */
/* -------------------------------------------------------------------------- */

contract CollectionFactory {
    // List of all collections deployed
    address[] public allCollections;

    // Creator => their collections
    mapping(address => address[]) public userCollections;

    event CollectionCreated(
        address indexed creator,
        address indexed collection,
        string name,
        string symbol
    );

    event CollectionMetadataSet(address indexed collection, string metadataURI);

    /* ---------------------------------------------------------------------- */
    /*                           CREATE NEW COLLECTION                        */
    /* ---------------------------------------------------------------------- */

    function createCollection(
        string memory name,
        string memory symbol
    ) external returns (address) {
        Collection newCollection = new Collection(name, symbol, msg.sender);

        address collectionAddr = address(newCollection);

        allCollections.push(collectionAddr);
        userCollections[msg.sender].push(collectionAddr);

        emit CollectionCreated(msg.sender, collectionAddr, name, symbol);

        return collectionAddr;
    }

    /* ---------------------------------------------------------------------- */
    /*                               VIEW FUNCTIONS                           */
    /* ---------------------------------------------------------------------- */

    function getUserCollections(
        address user
    ) external view returns (address[] memory) {
        return userCollections[user];
    }

    function getAllCollections() external view returns (address[] memory) {
        return allCollections;
    }
}
