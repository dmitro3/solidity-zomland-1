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
import "../library/utils.sol";

  error ZombiesMintError(string message);
  error ZombiesKillError(string message);
  error MonsterMintError(string message, uint tokenId);

contract ZombieNFTContract is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Burnable, Utils {
  address internal mainContract;
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIdCounter;
  mapping(uint => Zombie) zombies;
  mapping(address => mapping(uint => uint[])) userCollectionZombie;
  mapping(address => mapping(CardRarity => uint[])) userRarityZombie;
  address public constant NULL_ADDRESS = 0x0000000000000000000000000000000000000000;

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

    if (_from != NULL_ADDRESS) {
      Zombie storage _zombie = zombies[_tokenId];
      removeZombieCollectionRarity(_from, _tokenId, _zombie.collection, _zombie.cardRarity);
      addZombieCollectionRarity(_to, _tokenId, _zombie.collection, _zombie.cardRarity);
    }
  }

  function _burn(uint _tokenId) internal override(ERC721, ERC721URIStorage) {
    Zombie storage _zombie = zombies[_tokenId];
    removeZombieCollectionRarity(msg.sender, _tokenId, _zombie.collection, _zombie.cardRarity);

    super._burn(_tokenId);
  }

  function rarityToString(CardRarity _rarity) private pure returns (string memory) {
    if (_rarity == CardRarity.Common) {
      return "Common";
    } else if (_rarity == CardRarity.Uncommon) {
      return "Uncommon";
    } else if (_rarity == CardRarity.Rare) {
      return "Rare";
    }
    return "Epic";
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

  function randomNumber(uint _max, uint8 _shift) internal view returns (uint) {
    return uint(keccak256(abi.encodePacked(_shift, msg.sender, block.difficulty, block.timestamp, uint(1)))) % _max;
  }

  function randomNumberByRarity(uint _max, uint8 _shift, CardRarity _rarity) internal view returns (uint) {
    uint _from = 0;
    uint _to = _max;

    if (_rarity == CardRarity.Common) {
      _to = _max / 4;
    } else if (_rarity == CardRarity.Uncommon) {
      _from = _max / 5;
      _to = _max / 2;
    } else if (_rarity == CardRarity.Rare) {
      _from = _max * 2 / 5;
      _to = _max * 3 / 4;
    } else {
      _from = _max * 13 / 20;
    }

    uint _rand_range = _to - _from;
    if (_rand_range > 0) {
      uint _rand_divider = 1000 / (_rand_range + 1);
      uint _result = randomNumber(1000, _shift) / _rand_divider;
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
        (uint _collectionId, string memory _uri) = randomCollectionMedia(_collectionContract, _i + 8);
        uint _tokenId = _tokenIdCounter.current();
        uint8 _health = uint8(randomNumberByRarity(49, _i + 15, _rarity) + 1);
        uint8 _attack = uint8(randomNumberByRarity(24, _i + 20, _rarity) + 1);
        uint8 _brain = uint8(randomNumberByRarity(24, _i + 25, _rarity) + 1);
        uint8 _speed = uint8(randomNumberByRarity(19, _i + 30, _rarity) + 1);
        uint _killTokens = zombieKillTokens(_rarity, _health, _attack, _brain, _speed);

        _tokenIdCounter.increment();
        _safeMint(msg.sender, _tokenId);
        _setTokenURI(_tokenId, _uri);
        zombies[_tokenId] = Zombie(_tokenId, _rarity, _collectionId, _killTokens, 0, block.timestamp, _uri, _health, _attack, _brain, _speed, "Zombie", msg.sender);

        addZombieCollectionRarity(msg.sender, _tokenId, _collectionId, _rarity);
      }
      ILandNFT(_landContract).landSetMintTimestamp(_landId);
    } else {
      revert ZombiesMintError({message : "You can't mint from this Land"});
    }
  }

  function userZombies(uint _startIndex, uint8 _count, uint _collectionFilter, string memory _rarityFilter) public view returns (uint, Zombie[] memory) {
    uint[] memory _innerList = new uint[](_count);
    uint _endIndex = _startIndex + _count;
    uint _innerListLength;
    uint _innerIndex = 0;

    if (_collectionFilter != 0) {
      uint[] memory collectionList = userCollectionZombie[msg.sender][_collectionFilter - 1];
      _innerListLength = collectionList.length;
      for (uint _i = _startIndex; _i < _endIndex; ++_i) {
        if (_innerListLength > _i) {
          _innerList[_innerIndex] = collectionList[_i];
          _innerIndex += 1;
        }
      }
    } else if (bytes(_rarityFilter).length != 0) {
      CardRarity _rarity = rarityFromString(_rarityFilter);
      uint[] memory rarityList = userRarityZombie[msg.sender][_rarity];
      _innerListLength = rarityList.length;
      for (uint _i = _startIndex; _i < _endIndex; ++_i) {
        if (_innerListLength > _i) {
          _innerList[_innerIndex] = rarityList[_i];
          _innerIndex += 1;
        }
      }
    } else {
      _innerListLength = super.balanceOf(msg.sender);
      for (uint _i = _startIndex; _i < _endIndex; ++_i) {
        if (_innerListLength > _i) {
          _innerList[_innerIndex] = super.tokenOfOwnerByIndex(msg.sender, _i);
          _innerIndex += 1;
        }
      }
    }

    Zombie[] memory _resultZombies = new Zombie[](_innerListLength);
    for (uint _i = 0; _i < _innerIndex; ++_i) {
      _resultZombies[_i] = zombies[_innerList[_i]];
    }
    return (_innerListLength, _resultZombies);
  }

  function tokenURI(uint _tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
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

    removeZombieCollectionRarity(msg.sender, _tokenId, _zombie.collection, _zombie.cardRarity);
    _burn(_tokenId);

    ITokenFT(_contractTokenFT).transferOnKill(msg.sender, _zombie.killTokens);
  }

  function removeZombieCollectionRarity(address _owner, uint _tokenId, uint _collectionId, CardRarity _rarity) private {
    (uint _collectionIndex, bool _existCollection) = Utils.indexOf(userCollectionZombie[_owner][_collectionId], _tokenId);
    if (_existCollection) {
      uint[] storage collection = userCollectionZombie[_owner][_collectionId];
      collection[_collectionIndex] = collection[collection.length - 1];
      collection.pop();
    }

    (uint _rarityIndex, bool _existRarity) = Utils.indexOf(userRarityZombie[_owner][_rarity], _tokenId);
    if (_existRarity) {
      uint[] storage rarityList = userRarityZombie[_owner][_rarity];
      rarityList[_rarityIndex] = rarityList[rarityList.length - 1];
      rarityList.pop();
    }
  }

  function addZombieCollectionRarity(address _owner, uint _tokenId, uint _collectionId, CardRarity _rarity) private {
    userCollectionZombie[_owner][_collectionId].push(_tokenId);
    userRarityZombie[_owner][_rarity].push(_tokenId);
  }

  function checkAndBurnZombies(address _owner, uint[] memory zombiesList) external returns (uint, uint, uint, uint, uint) {
    uint _health = 0;
    uint _attack = 0;
    uint _brain = 0;
    uint _killTokens = 0;
    uint _collectionId = zombies[zombiesList[0]].collection;
    uint _count = zombiesList.length;

    for (uint _i = 0; _i < _count; ++_i) {
      uint _index = zombiesList[_i];
      Zombie storage _zombie = zombies[_index];
      if (_zombie.ownerId != _owner) {
        revert MonsterMintError({message : "You don't own this zombie", tokenId : _zombie.tokenId});
      } else {
        _health += _zombie.health;
        _attack += _zombie.attack;
        _brain += _zombie.brain;
        _killTokens += _zombie.killTokens;
        _burn(_zombie.tokenId);
      }
    }

    return (_health, _attack, _brain, _killTokens, _collectionId);
  }

  function getRandomRarityByZombies(uint[] memory zombiesList) external view returns (string memory) {
    uint _rarityIndex = randomNumber(9, 1);
    uint _zombieByIndex = zombiesList[_rarityIndex];
    CardRarity _rarity = zombies[_zombieByIndex].cardRarity;
    return rarityToString(_rarity);
  }

  function getUserCollectionZombieCount() external view returns (uint[] memory) {
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