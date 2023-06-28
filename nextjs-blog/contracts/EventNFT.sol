// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract EventNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    uint256 tokenCounter;
    address private _owner;

    constructor() ERC721("BlockEventNFT", "NFT") {
        _owner = msg.sender;
        tokenCounter = 0;
    }

    function mintNFT(address recipient, string memory tokenURI, uint256 price) external payable returns (uint256) {
        require(msg.value == price, "Not enough ETH");
        uint256 newItemId = tokenCounter;
        _mint(recipient, newItemId); //function inherited from ERC721 library
        _setTokenURI(newItemId, tokenURI); //function inherited from ERC721 library
        payable(_owner).transfer(msg.value);
        tokenCounter += 1;
        return newItemId;
    }

    function sendToFriend(address from, address to, uint256 _tokenId) external {
        require(ownerOf(_tokenId) == from, "Your are not the owner of the NFT");
        _transfer(from, to, _tokenId); //function inherited from ERC721 library
    }
}
