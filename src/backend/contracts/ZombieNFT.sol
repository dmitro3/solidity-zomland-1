// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

  error ZombiesMintError(string message);

interface ILandNFT is IERC721 {
  function getLandMintZombiesCount(uint) external view returns (uint8);

  function landSetMintTimestamp(uint) external;
}

contract ZombieNFT is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Burnable, Ownable {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIdCounter;
  address contractMain;
  address contractLands;

  enum CardRarity {
    Common,
    Uncommon,
    Rare,
    Epic
  }

  struct Zombie {
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
    uint8 speed;
    string nftType;
    address ownerId;
  }

  struct Collection {
    string title;
    string image;
    string[] zombieImages;
  }

  mapping(uint => Zombie) zombies;
  mapping(uint => Collection) public collections;
  uint public collectionCount;
  mapping(uint256 => string) public cardRarity;

  constructor(address _contractMain, address _contractLands) ERC721("ZomLand", "ZMLZ") {
    contractMain = _contractMain;
    contractLands = _contractLands;

    cardRarity[0] = "Common";
    cardRarity[1] = "Uncommon";
    cardRarity[2] = "Rare";
    cardRarity[3] = "Epic";
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

  function randomRarity(uint8 num) internal view returns (CardRarity) {
    uint _index = uint(keccak256(abi.encodePacked(num, block.difficulty, block.timestamp, uint(1)))) % 1000;
    if (_index <= 10) {
      return CardRarity.Epic;
    } else if (_index <= 60) {
      return CardRarity.Rare;
    } else if (_index <= 300) {
      return CardRarity.Uncommon;
    }
    return CardRarity.Common;
  }

  function randomZombieCollection(uint8 num) internal view returns (uint) {
    return uint(keccak256(abi.encodePacked(num, block.difficulty, block.timestamp, uint(1)))) % collectionCount;
  }

  function randomZombieMedia(uint8 num, uint _collectionIndex) internal view returns (string memory) {
    Collection storage _collection = collections[_collectionIndex];
    uint _index = uint(keccak256(abi.encodePacked(num, block.difficulty, block.timestamp, uint(1)))) % _collection.zombieImages.length;
    return _collection.zombieImages[_index];
  }

  function zombieRandomParam(uint8 num, uint8 max) internal view returns (uint8) {
    return uint8(uint(keccak256(abi.encodePacked(num, block.difficulty, block.timestamp, uint(1)))) % max) + 1;
  }

  function zombieKillTokens(CardRarity _rarity, uint8 health, uint8 attack, uint8 brain, uint8 speed) internal pure returns (uint) {
    uint multiplier = 1;
    if (_rarity == CardRarity.Epic) {
      multiplier = 21;
    } else if (_rarity == CardRarity.Rare) {
      multiplier = 9;
    } else if (_rarity == CardRarity.Uncommon) {
      multiplier = 3;
    }
    return multiplier * (uint((health + attack + brain + speed)) / 2) * 1e18;
  }

  // ---------------- Public methods ---------------

  function safeMint(uint landId) public {
    if (ILandNFT(contractLands).ownerOf(landId) != msg.sender) {
      revert ZombiesMintError({message : "You don't have this Land"});
    }
    uint8 _zombiesMintCount = ILandNFT(contractLands).getLandMintZombiesCount(landId);

    if (_zombiesMintCount > 0) {
      for (uint8 _i = 0; _i < _zombiesMintCount; _i++) {
        CardRarity _rarity = randomRarity(_i);
        uint _collectionIndex = randomZombieCollection(_i + 5);
        string memory _uri = randomZombieMedia(_i + 10, _collectionIndex);

        uint _tokenId = _tokenIdCounter.current();
        uint8 _health = zombieRandomParam(_i + 15, 49);
        uint8 _attack = zombieRandomParam(_i + 20, 24);
        uint8 _brain = zombieRandomParam(_i + 25, 24);
        uint8 _speed = zombieRandomParam(_i + 30, 19);
        uint _killTokens = zombieKillTokens(_rarity, _health, _attack, _brain, _speed);

        _tokenIdCounter.increment();
        _safeMint(msg.sender, _tokenId);
        _setTokenURI(_tokenId, _uri);
        zombies[_tokenId] = Zombie(_tokenId, _rarity, _collectionIndex, _killTokens, 0, block.timestamp, _uri, _health, _attack, _brain, _speed, "Zombie", msg.sender);
      }
      ILandNFT(contractLands).landSetMintTimestamp(landId);
    } else {
      revert ZombiesMintError({message : "You can't mint from this Land"});
    }
  }

  function userZombies(uint _startIndex, uint8 _count) public view returns (Zombie[] memory) {
    Zombie[] memory _resultZombies = new Zombie[](_count);
    uint _userBalance = super.balanceOf(msg.sender);

    for (uint _i = _startIndex; _i < _count; _i++) {
      if (_userBalance > _i) {
        uint _zombieId = super.tokenOfOwnerByIndex(msg.sender, _i);
        _resultZombies[_i] = zombies[_zombieId];
      }
    }
    return _resultZombies;
  }

  function tokenURI(uint _tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory){
    return super.tokenURI(_tokenId);
  }

  function supportsInterface(bytes4 _interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(_interfaceId);
  }

  function addCollection(string memory title, string memory image, string[] memory zombieImages) public onlyOwner {
    collections[collectionCount] = Collection(title, image, zombieImages);
    collectionCount += 1;
  }
}