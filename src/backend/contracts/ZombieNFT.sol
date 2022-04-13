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
import "./Main.sol";

  error ZombiesMintError(string message);
  error ZombiesKillError(string message);
  error MonsterMintError(string message);
  error MonsterMintCountError(string message, uint8 required);

interface ILandNFT is IERC721 {
  function getLandMintZombiesCount(uint) external view returns (uint8);

  function landSetMintTimestamp(uint) external;
}

interface ITokenFT is IERC20 {
  function transferOnKill(address, uint) external;
}

interface ICollection {
  function getCollectionAndZombie() external view returns (uint, string memory);
}

contract ZombieNFTContract is MainContract, ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Burnable {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIdCounter;

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

  mapping(uint => Zombie) zombies;

  constructor() ERC721("ZomLand", "ZMLZ") {
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

  function randomNumber(uint max, uint8 shift) internal view returns (uint) {
    return uint(keccak256(abi.encodePacked(shift, msg.sender, block.difficulty, block.timestamp, uint(1)))) % max;
  }

  function randomRarity(uint8 num) internal view returns (CardRarity) {
    uint _index = randomNumber(1000, num);
    if (_index <= 10) {
      return CardRarity.Epic;
    } else if (_index <= 60) {
      return CardRarity.Rare;
    } else if (_index <= 300) {
      return CardRarity.Uncommon;
    }
    return CardRarity.Common;
  }

  function randomCollectionMedia() internal view returns (uint, string memory) {
    return ICollection(MainContract.contractCollection).getCollectionAndZombie();
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
    console.log("Start mint...", MainContract.contractLandNFT);
    if (ILandNFT(MainContract.contractLandNFT).ownerOf(landId) != msg.sender) {
      revert ZombiesMintError({message : "You don't have this Land"});
    }
    console.log("1...");
    uint8 _zombiesMintCount = ILandNFT(MainContract.contractLandNFT).getLandMintZombiesCount(landId);

    console.log("2...");
    if (_zombiesMintCount > 0) {
      console.log("3...");
      for (uint8 _i = 0; _i < _zombiesMintCount; ++_i) {
        CardRarity _rarity = randomRarity(_i);
        console.log("x4");
        (uint _collectionIndex, string memory _uri) = randomCollectionMedia();
        console.log("x5");
        uint _tokenId = _tokenIdCounter.current();
        console.log("x6");
        uint8 _health = uint8(randomNumber(49, _i + 15) + 1);
        uint8 _attack = uint8(randomNumber(24, _i + 20) + 1);
        uint8 _brain = uint8(randomNumber(24, _i + 25) + 1);
        uint8 _speed = uint8(randomNumber(19, _i + 30) + 1);
        uint _killTokens = zombieKillTokens(_rarity, _health, _attack, _brain, _speed);

        console.log("x7");
        _tokenIdCounter.increment();
        _safeMint(msg.sender, _tokenId);
        _setTokenURI(_tokenId, _uri);
        zombies[_tokenId] = Zombie(_tokenId, _rarity, _collectionIndex, _killTokens, 0, block.timestamp, _uri, _health, _attack, _brain, _speed, "Zombie", msg.sender);
      }
      ILandNFT(MainContract.contractLandNFT).landSetMintTimestamp(landId);
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

  function killZombie(uint tokenId) public {
    Zombie storage zombie = zombies[tokenId];
    if (zombie.ownerId != msg.sender) {
      revert ZombiesKillError({message : "You can't kill this Zombie"});
    }
    _burn(tokenId);
    ITokenFT(MainContract.contractTokenFT).transferOnKill(msg.sender, zombie.killTokens);
  }

  function mintMonster(uint[] memory zombiesList) public returns (uint) {
    uint8 _collectionSize = 10;
    if (zombiesList.length != _collectionSize) {
      revert MonsterMintCountError({message : "You need to send more zombies for mint Monster", required : _collectionSize});
    }
    for (uint _i = 0; _i < _collectionSize; ++_i) {
      Zombie storage _zombie = zombies[zombiesList[_i]];
      if (_zombie.ownerId != msg.sender) {
        revert MonsterMintError({message : "You don't own this zombie"});
      } else {
        _burn(_zombie.tokenId);
      }
    }

    // Call monster contract...

    return 0;
  }

}