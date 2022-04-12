// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

interface ITokenFT is IERC20 {
  function transferOnKill(address account, uint amount) external;
}

contract MonsterNFT is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Burnable, Ownable {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIdCounter;
  address contractMain;
  address contractTokenFT;

  enum CardRarity {
    Common,
    Uncommon,
    Rare,
    Epic
  }

  struct Monster {
    uint tokenId;
    CardRarity cardRarity;
    uint collection;
    uint killTokens;
    uint salePrice;
    uint mintDate;
    string media;
    uint8 health;
    uint8 attack;
    uint8 brain;
    string nftType;
    address ownerId;
  }

  mapping(uint => Monster) monsters;

  constructor(address _contractMain, address _contractTokenFT) ERC721("ZomLand", "ZMLM") {
    contractMain = _contractMain;
    contractTokenFT = _contractTokenFT;
  }

  function _baseURI() internal pure override returns (string memory) {
    return "https://ipfs.io/ipfs/";
  }

  function _beforeTokenTransfer(address _from, address _to, uint _tokenId) internal override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(_from, _to, _tokenId);
  }

  function _burn(uint _tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(_tokenId);
  }


  // ---------------- Public methods ---------------

  function safeMint() public {
    //    _tokenIdCounter.increment();
    //    _safeMint(msg.sender, _tokenId);
    //    _setTokenURI(_tokenId, _uri);
  }

  function tokenURI(uint _tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory){
    return super.tokenURI(_tokenId);
  }

  function supportsInterface(bytes4 _interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(_interfaceId);
  }

}

