// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "../interfaces/interface.sol";

  error ZombiesMintError(string message);
  error ZombiesKillError(string message);
  error MonsterMintError(string message, uint tokenId);

contract ZombieNFTContract is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Burnable {
  address internal mainContract;
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIdCounter;
  mapping(uint => Zombie) zombies;

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

  constructor(address _mainContract) ERC721("ZomLand", "ZMLZ") {
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

  function randomNumber(uint _max, uint8 _shift) internal view returns (uint) {
    return uint(keccak256(abi.encodePacked(_shift, msg.sender, block.difficulty, block.timestamp, uint(1)))) % _max;
  }

  function randomNumberByRarity(uint _max, uint8 _shift, CardRarity _rarity) internal view returns (uint) {
    uint _from = 0;
    uint _to = _max;

    if (_rarity == CardRarity.Common) {
      // from 0% to 25%
      _to = _max / 4;
    } else if (_rarity == CardRarity.Uncommon) {
      // from 20% to 50%
      _from = _max / 5;
      _to = _max / 2;
    } else if (_rarity == CardRarity.Rare) {
      // from 40% to 75%
      _from = _max * 2 / 5;
      _to = _max * 3 / 4;
    } else {
      // from 65% to 100%
      _from = _max * 13 / 20;
    }

    uint _rand_range = _to - _from;
    if (_rand_range > 0) {
      uint _rand_divider = 1000 / (_rand_range + 1);
      uint _result = (uint(keccak256(abi.encodePacked(_shift, msg.sender, block.difficulty, block.timestamp, uint(1)))) % 1000) / _rand_divider;
      return _to + _result;
    }

    return 0;
  }

  function randomRarity(uint8 _num) internal view returns (CardRarity) {
    uint _index = randomNumber(1000, _num);
    if (_index <= 10) {
      return CardRarity.Epic;
    } else if (_index <= 60) {
      return CardRarity.Rare;
    } else if (_index <= 300) {
      return CardRarity.Uncommon;
    }
    return CardRarity.Common;
  }

  function randomCollectionMedia(address _collectionContract, uint8 _shift) internal view returns (uint, string memory) {
    return ICollection(_collectionContract).getCollectionAndZombie(_shift);
  }

  function zombieKillTokens(CardRarity _rarity, uint8 _health, uint8 _attack, uint8 _brain, uint8 _speed) internal pure returns (uint) {
    uint _multiplier = 1;
    if (_rarity == CardRarity.Epic) {
      _multiplier = 21;
    } else if (_rarity == CardRarity.Rare) {
      _multiplier = 9;
    } else if (_rarity == CardRarity.Uncommon) {
      _multiplier = 3;
    }
    return _multiplier * (uint((_health + _attack + _brain + _speed)) / 4) * 1e18;
  }

  // ---------------- Public methods ---------------

  function safeMint(uint _landId) public {
    address _landContract = IMain(mainContract).getContractLandNFT();
    address _collectionContract = IMain(mainContract).getContractCollection();

    if (ILandNFT(_landContract).ownerOf(_landId) != msg.sender) {
      revert ZombiesMintError({message : "You don't have this Land"});
    }
    uint8 _zombiesMintCount = ILandNFT(_landContract).getLandMintZombiesCount(_landId);

    if (_zombiesMintCount > 0) {
      for (uint8 _i = 0; _i < _zombiesMintCount; ++_i) {
        CardRarity _rarity = randomRarity(_i);
        (uint _collectionIndex, string memory _uri) = randomCollectionMedia(_collectionContract, _i + 8);
        uint _tokenId = _tokenIdCounter.current();
        uint8 _health = uint8(randomNumberByRarity(49, _i + 15, _rarity) + 1);
        uint8 _attack = uint8(randomNumberByRarity(24, _i + 20, _rarity) + 1);
        uint8 _brain = uint8(randomNumberByRarity(24, _i + 25, _rarity) + 1);
        uint8 _speed = uint8(randomNumberByRarity(19, _i + 30, _rarity) + 1);
        uint _killTokens = zombieKillTokens(_rarity, _health, _attack, _brain, _speed);

        _tokenIdCounter.increment();
        _safeMint(msg.sender, _tokenId);
        _setTokenURI(_tokenId, _uri);
        zombies[_tokenId] = Zombie(_tokenId, _rarity, _collectionIndex, _killTokens, 0, block.timestamp, _uri, _health, _attack, _brain, _speed, "Zombie", msg.sender);
      }
      ILandNFT(_landContract).landSetMintTimestamp(_landId);
    } else {
      revert ZombiesMintError({message : "You can't mint from this Land"});
    }
  }

  function userZombies(uint _startIndex, uint8 _count) public view returns (Zombie[] memory) {
    Zombie[] memory _resultZombies = new Zombie[](_count);
    uint _userBalance = super.balanceOf(msg.sender);

    for (uint _i = _startIndex; _i < _count; ++_i) {
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

  function killZombie(uint _tokenId) public {
    address _contractTokenFT = IMain(mainContract).getContractTokenFT();
    Zombie storage _zombie = zombies[_tokenId];

    if (_zombie.ownerId != msg.sender) {
      revert ZombiesKillError({message : "You can't kill this Zombie"});
    }
    _burn(_tokenId);
    ITokenFT(_contractTokenFT).transferOnKill(msg.sender, _zombie.killTokens);
  }

  function checkAndBurnZombies(address owner, uint[] memory zombiesList) external returns (uint, uint, uint, uint, uint, CardRarity){
    uint _health = 0;
    uint _attack = 0;
    uint _brain = 0;
    uint _killTokens = 0;
    uint _collection = zombies[zombiesList[0]].collection;

    uint8 _count = zombiesList.length;
    uint8 rarityIndex = randomNumber(10, 1);
    CardRarity _rarity = zombies[zombiesList[rarityIndex]].cardRarity;

    for (uint _i = 0; _i < _count; ++_i) {
      Zombie storage _zombie = zombies[zombiesList[_i]];
      if (_zombie.ownerId != owner) {
        revert MonsterMintError({message : "You don't own this zombie", tokenId : _zombie.tokenId});
      } else {
        _health += _zombie.health;
        _attack += _zombie.attack;
        _brain += _zombie.brain;
        _killTokens += _zombie.killTokens;
        _burn(_zombie.tokenId);
      }
    }

    return (_health, _attack, _brain, _killTokens, _collection, _rarity);
  }

  //  function mintMonster(uint[] memory _zombiesList) public returns (uint) {
  //    uint8 _collectionSize = 10;
  //    if (_zombiesList.length != _collectionSize) {
  //      revert MonsterMintCountError({message : "You need to send more zombies for mint Monster", required : _collectionSize});
  //    }
  //    for (uint _i = 0; _i < _collectionSize; ++_i) {
  //      Zombie storage _zombie = zombies[_zombiesList[_i]];
  //      if (_zombie.ownerId != msg.sender) {
  //        revert MonsterMintError({message : "You don't own this zombie"});
  //      } else {
  //        _burn(_zombie.tokenId);
  //      }
  //    }
  //
  //    // Call monster contract...
  //
  //    return 0;
  //  }

  function getUserCollectionZombieCount() external view returns (uint[] memory){
    address _collectionContract = IMain(mainContract).getContractCollection();
    uint collectionCount = ICollection(_collectionContract).getAllCollectionsCount();
    uint[] memory _result = new uint[](collectionCount);

    uint _count = super.balanceOf(msg.sender);
    for (uint _i = 0; _i < _count; ++_i) {
      uint _zombieId = super.tokenOfOwnerByIndex(msg.sender, _i);
      uint collection = zombies[_zombieId].collection;
      _result[collection] += 1;
    }

    return _result;
  }

}