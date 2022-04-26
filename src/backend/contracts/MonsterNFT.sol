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
import "../interfaces/interface.sol";

  error MonsterMintCountError(string message, uint required);

contract MonsterNFTContract is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Burnable {
  address internal mainContract;
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIdCounter;
  mapping(uint => Monster) monsters;

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
    uint health;
    uint attack;
    uint brain;
    string nftType;
    address ownerId;
  }

  constructor(address _mainContract) ERC721("ZomLand", "ZMLM") {
    mainContract = _mainContract;
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

  function safeMint(uint[] memory zombiesList) public {
    uint8 _collectionSize = 10;
    if (zombiesList.length != _collectionSize) {
      revert MonsterMintCountError({message : "You need to send more zombies for mint Monster", required : _collectionSize});
    }

    address _contractZombie = IMain(mainContract).getContractZombieNFT();
    string memory _rarityStr = IZombieNFT(_contractZombie).getRandomRarityByZombies(zombiesList);
    (uint _health, uint _attack, uint _brain, uint _killTokens, uint _collectionId) = IZombieNFT(_contractZombie).checkAndBurnZombies(msg.sender, zombiesList);

    CardRarity _rarity = rarityFromString(_rarityStr);
    address _contractCollection = IMain(mainContract).getContractCollection();
    string memory _uri = ICollection(_contractCollection).getCollectionImage(_collectionId);

    uint _tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(msg.sender, _tokenId);
    _setTokenURI(_tokenId, _uri);

    monsters[_tokenId] = Monster(_tokenId, _rarity, _collectionId, _killTokens, 0, block.timestamp, _uri, _health, _attack, _brain, "Monster", msg.sender);
  }

  function rarityFromString(string memory _rarity) private pure returns (CardRarity) {
    bytes32 _rarityHash = keccak256(abi.encodePacked(_rarity));
    if (_rarityHash == keccak256(abi.encodePacked("Common"))) {
      return CardRarity.Common;
    } else if (_rarityHash == keccak256(abi.encodePacked("Uncommon"))) {
      return CardRarity.Uncommon;
    } else if (_rarityHash == keccak256(abi.encodePacked("Rare"))) {
      return CardRarity.Rare;
    } else {
      return CardRarity.Epic;
    }
  }

  function tokenURI(uint _tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory){
    return super.tokenURI(_tokenId);
  }

  function supportsInterface(bytes4 _interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(_interfaceId);
  }

}

