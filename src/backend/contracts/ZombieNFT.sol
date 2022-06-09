// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "../interfaces/interface.sol";
import "../abstract/utils.sol";
import "../abstract/modifiers.sol";

  error ZombiesMintError(string message);
  error ZombiesKillError(string message);
  error MonsterMintError(string message, uint tokenId);
  error MonsterMintPaymentError(string message, uint get, uint expected);

contract ZombieNFTContract is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Burnable, Utils, Modifiers {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIdCounter;
  mapping(uint => Zombie) zombies;
  mapping(address => mapping(uint => uint[])) userCollectionZombie;
  mapping(address => mapping(CardRarity => uint[])) userRarityZombie;

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
    ModifierItems[] modifier_items;
    uint next_battle;
  }

  constructor(address _mainContract) ERC721("ZomLand", "ZMLZ") {
    mainContract = _mainContract;
  }

  // ---------------- Internal & Private methods ---------------

  function _baseURI() internal pure override returns (string memory) {
    return "https://ipfs.io/ipfs/";
  }

  function _beforeTokenTransfer(address _from, address _to, uint _tokenId) internal override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(_from, _to, _tokenId);

    if (_from != NULL_ADDRESS) {
      Zombie storage _zombie = zombies[_tokenId];
      _zombie.ownerId = _to;

      removeZombieFromMarket(_tokenId);
      removeZombieCollectionRarity(_from, _tokenId, _zombie.collection, _zombie.cardRarity);
      addZombieCollectionRarity(_to, _tokenId, _zombie.collection, _zombie.cardRarity);
    }
  }

  function _burn(uint _tokenId) internal override(ERC721, ERC721URIStorage) {
    Zombie storage _zombie = zombies[_tokenId];
    removeZombieCollectionRarity(msg.sender, _tokenId, _zombie.collection, _zombie.cardRarity);
    removeZombieFromMarket(_tokenId);
    super._burn(_tokenId);
  }

  function removeZombieFromMarket(uint _tokenId) internal {
    address _marketContract = IMain(mainContract).getContractMarket();
    IMarket(_marketContract).removeFromMarketExternal(_tokenId, "zombie");
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
      return _from + _result;
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

  function zombieKillTokens(CardRarity _rarity, uint8 _health, uint8 _attack, uint8 _brain, uint8 _speed) internal pure returns (uint) {
    uint _multiplier = 1;
    if (_rarity == CardRarity.Epic) {
      _multiplier = 21;
    } else if (_rarity == CardRarity.Rare) {
      _multiplier = 9;
    } else if (_rarity == CardRarity.Uncommon) {
      _multiplier = 3;
    }
    return _multiplier * (uint((_health + _attack + _brain + _speed * 10)) / 7) * 1e18;
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

  function getRarityTokenPrice(CardRarity cardRarity) internal pure returns (uint){
    if (cardRarity == CardRarity.Common) {
      return 5 * 1e18;
    } else if (cardRarity == CardRarity.Uncommon) {
      return 10 * 1e18;
    } else if (cardRarity == CardRarity.Rare) {
      return 20 * 1e18;
    }
    return 40 * 1e18;
  }

  // ---------------- External Limited methods ---------------

  function checkAndBurnZombies(address _owner, uint[] memory _zombiesList, uint _payAmount) external onlyMonsterContract returns (uint, uint, uint, uint, uint) {
    MonsterResultMetadata memory _metadata = MonsterResultMetadata(0, 0, 0, 0, zombies[_zombiesList[0]].collection);
    uint _count = _zombiesList.length;
    uint _totalPayForMint = 0;

    for (uint _i = 0; _i < _count; ++_i) {
      uint _index = _zombiesList[_i];
      Zombie storage _zombie = zombies[_index];
      if (_zombie.ownerId != _owner) {
        revert MonsterMintError({message : "You don't own this zombie", tokenId : _zombie.tokenId});
      } else {
        _totalPayForMint += getRarityTokenPrice(_zombie.cardRarity);
        _metadata.health += _zombie.health;
        _metadata.attack += _zombie.attack;
        _metadata.brain += _zombie.brain;
        _metadata.killTokens += _zombie.killTokens;
        _burn(_zombie.tokenId);
      }
    }

    // check pay amount
    if (_totalPayForMint != _payAmount) {
      revert MonsterMintPaymentError({message : "Wrong ZML payment amount", get : _payAmount, expected : _totalPayForMint});
    }

    return (_metadata.health, _metadata.attack, _metadata.brain, _metadata.killTokens, _metadata.collectionId);
  }

  function setMarketSalePrice(uint _tokenId, uint _price, address ownerId) external onlyMarketContract {
    require(zombies[_tokenId].ownerId == ownerId, "You can't change price for this NFT");
    zombies[_tokenId].salePrice = _price;
  }

  function buyToken(uint _id, uint _payAmount, address _newOwner) external onlyMarketContract returns (address) {
    Zombie storage zombie = zombies[_id];
    require(zombie.salePrice > 0, "Wrong payment amount");
    require(zombie.salePrice == _payAmount, "Wrong payment amount");
    require(zombie.ownerId != _newOwner, "Can't sell for the same account");

    address _seller = zombie.ownerId;
    zombie.ownerId = _newOwner;
    zombie.salePrice = 0;

    // Transfer NFT
    _transfer(_seller, _newOwner, _id);

    return _seller;
  }

  // ---------------- Public & External methods ---------------

  function getListById(uint[] memory _listId) public view returns (Zombie[] memory) {
    Zombie[] memory result = new Zombie[](_listId.length);
    for (uint _i = 0; _i < _listId.length; ++_i) {
      result[_i] = zombies[_listId[_i]];
    }
    return result;
  }

  function getRarityCollection(uint _id) external view returns (string memory, uint) {
    Zombie storage zombie = zombies[_id];
    return (rarityToString(zombie.cardRarity), zombie.collection);
  }

  function tokenURI(uint _tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(_tokenId);
  }

  function supportsInterface(bytes4 _interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(_interfaceId);
  }

  function safeMint(uint _landId) public {
    address _landContract = IMain(mainContract).getContractLandNFT();
    address _collectionContract = IMain(mainContract).getContractCollection();
    (address _ownerId, string memory _landType, uint _landMintedZombies) = ILandNFT(_landContract).landInfo(_landId);

    if (_ownerId != msg.sender) {
      revert ZombiesMintError({message : "You don't have this Land"});
    }
    if (string_equal(_landType, "Micro") && _landMintedZombies == 30) {
      revert ZombiesMintError({message : "Land resource is depleted: you minted all zombies."});
    }

    uint8 _zombiesMintCount = ILandNFT(_landContract).getLandMintZombiesCount(_landId);
    if (_zombiesMintCount > 0) {
      for (uint8 _i = 0; _i < _zombiesMintCount; ++_i) {
        CardRarity _rarity = randomRarity(_i);
        (uint _collectionId, string memory _uri) = ICollection(_collectionContract).getCollectionAndZombie(_i + 8);
        uint _tokenId = _tokenIdCounter.current();
        uint8 _health = uint8(randomNumberByRarity(49, _i + 15, _rarity) + 1);
        uint8 _attack = uint8(randomNumberByRarity(24, _i + 20, _rarity) + 1);
        uint8 _brain = uint8(randomNumberByRarity(24, _i + 25, _rarity) + 1);
        uint8 _speed = uint8(randomNumberByRarity(1, _i + 30, _rarity) + 1);
        uint _killTokens = zombieKillTokens(_rarity, _health, _attack, _brain, _speed);

        _tokenIdCounter.increment();
        _safeMint(msg.sender, _tokenId);
        _setTokenURI(_tokenId, _uri);

        zombies[_tokenId] = Zombie(
          _tokenId,
          _rarity,
          _collectionId,
          _killTokens,
          0,
          block.timestamp,
          _uri,
          _health,
          _attack,
          _brain,
          _speed,
          "Zombie",
          msg.sender,
          new ModifierItems[](0),
          block.timestamp
        );

        addZombieCollectionRarity(msg.sender, _tokenId, _collectionId, _rarity);
      }
      ILandNFT(_landContract).landSetMintTimestamp(_landId);
    } else {
      revert ZombiesMintError({message : "You can't mint on this Land, wait 24 hours!"});
    }
  }

  function userZombies(uint _startIndex, uint8 _count, uint _collectionFilter, string memory _rarityFilter) public view returns (uint, Zombie[] memory) {
    uint[] memory _innerList = new uint[](_count);
    uint _endIndex = _startIndex + _count;
    uint _totalListLength;
    uint _innerIndex;

    if (_collectionFilter != 0 && bytes(_rarityFilter).length != 0) {
      (_innerList, _innerIndex, _totalListLength) = filterCollectionRarity(_collectionFilter, _rarityFilter, _startIndex, _endIndex);
    } else if (_collectionFilter != 0) {
      uint[] memory collectionList = userCollectionZombie[msg.sender][_collectionFilter - 1];
      (_innerList, _innerIndex, _totalListLength) = mapByList(collectionList, collectionList.length, _startIndex, _endIndex);
    } else if (bytes(_rarityFilter).length != 0) {
      uint[] memory rarityList = userRarityZombie[msg.sender][rarityFromString(_rarityFilter)];
      (_innerList, _innerIndex, _totalListLength) = mapByList(rarityList, rarityList.length, _startIndex, _endIndex);
    } else {
      _totalListLength = super.balanceOf(msg.sender);
      for (uint _i = _startIndex; _i < _endIndex; ++_i) {
        if (_totalListLength > _i) {
          _innerList[_innerIndex] = super.tokenOfOwnerByIndex(msg.sender, _i);
          _innerIndex += 1;
        }
      }
    }

    Zombie[] memory _resultZombies = new Zombie[](_innerIndex);
    for (uint _i = 0; _i < _innerIndex; ++_i) {
      _resultZombies[_i] = zombies[_innerList[_i]];
    }
    return (_totalListLength, _resultZombies);
  }

  function filterCollectionRarity(uint _collectionFilter, string memory _rarityFilter, uint _startIndex, uint _endIndex) internal view returns (uint[] memory, uint, uint){
    uint[] memory collectionList = userCollectionZombie[msg.sender][_collectionFilter - 1];
    uint[] memory rarityList = userRarityZombie[msg.sender][rarityFromString(_rarityFilter)];

    uint _innerIndex = 0;
    uint collectionLength = collectionList.length;
    uint[] memory collectionRarityList = new uint[](collectionLength);
    for (uint _i = 0; _i < collectionLength; ++_i) {
      if (Utils.has(rarityList, collectionList[_i])) {
        collectionRarityList[_innerIndex] = collectionList[_i];
        _innerIndex += 1;
      }
    }

    return mapByList(collectionRarityList, _innerIndex, _startIndex, _endIndex);
  }

  function mapByList(uint[] memory source, uint _innerListLength, uint _startIndex, uint _endIndex) private pure returns (uint[] memory, uint, uint){
    uint _innerIndex = 0;
    uint[] memory _innerList = new uint[](_endIndex - _startIndex);

    for (uint _i = _startIndex; _i < _endIndex; ++_i) {
      if (_innerListLength > _i) {
        _innerList[_innerIndex] = source[_i];
        _innerIndex += 1;
      }
    }

    return (_innerList, _innerIndex, _innerListLength);
  }

  function killNftList(uint[] memory _tokenList) public {
    address _contractTokenFT = IMain(mainContract).getContractTokenFT();
    uint _totalKillTokens = 0;

    for (uint _i = 0; _i < _tokenList.length; ++_i) {
      uint _tokenId = _tokenList[_i];
      Zombie storage _zombie = zombies[_tokenId];
      if (_zombie.ownerId != msg.sender) {
        revert ZombiesKillError({message : "You can't kill this Zombie"});
      }

      _totalKillTokens += _zombie.killTokens;
      _burn(_tokenId);
    }

    ITokenFT(_contractTokenFT).transferOnKill(msg.sender, _totalKillTokens);
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

  function getMarketItems(uint _startIndex, uint8 _count, string memory rarity, string memory collection) public view returns (uint, Zombie[] memory) {
    Zombie[] memory _userZombies = new Zombie[](_count);
    address _marketContract = IMain(mainContract).getContractMarket();

    (uint total, uint[] memory _saleIdList) = IMarket(_marketContract).getZombiesMonstersFromMarket(_startIndex, _count, "zombies", rarity, collection);
    for (uint _i = 0; _i < _count; ++_i) {
      if (_i < total) {
        _userZombies[_i] = zombies[_saleIdList[_i]];
      }
    }
    return (total, _userZombies);
  }

}
