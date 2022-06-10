// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "../interfaces/interface.sol";
import "../abstract/utils.sol";
import "../abstract/modifiers.sol";

  error ZombiesMintError(string message);
  error ZombiesKillError(string message);
  error MonsterMintError(string message, uint tokenId);
  error MonsterMintPaymentError(string message, uint get, uint expected);

contract ZombieNFTContract is Initializable, ERC721Upgradeable, ERC721EnumerableUpgradeable, ERC721URIStorageUpgradeable, ERC721BurnableUpgradeable, OwnableUpgradeable, UUPSUpgradeable, Utils, Modifiers {
  using CountersUpgradeable for CountersUpgradeable.Counter;
  CountersUpgradeable.Counter private _tokenIdCounter;
  uint killedZombies;
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

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  function initialize(address _mainContract) public initializer {
    __ERC721_init("ZomLand", "ZMLZ");
    __ERC721Enumerable_init();
    __ERC721URIStorage_init();
    __ERC721Burnable_init();
    __Ownable_init();
    __UUPSUpgradeable_init();

    mainContract = _mainContract;
  }

  function _authorizeUpgrade(address newImplementation) internal onlyOwner override {}

  // ---------------- Internal & Private methods ---------------

  function _baseURI() internal pure override returns (string memory) {
    return "https://ipfs.io/ipfs/";
  }

  function _beforeTokenTransfer(address _from, address _to, uint _tokenId) internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable) {
    super._beforeTokenTransfer(_from, _to, _tokenId);

    if (_from != NULL_ADDRESS) {
      Zombie storage _zombie = zombies[_tokenId];
      _zombie.ownerId = _to;

      removeZombieFromMarket(_tokenId);
      removeZombieCollectionRarity(_from, _tokenId, _zombie.collection, _zombie.cardRarity);
      addZombieCollectionRarity(_to, _tokenId, _zombie.collection, _zombie.cardRarity);
    }
  }

  function _burn(uint _tokenId) internal override(ERC721Upgradeable, ERC721URIStorageUpgradeable) {
    Zombie storage _zombie = zombies[_tokenId];
    removeZombieCollectionRarity(msg.sender, _tokenId, _zombie.collection, _zombie.cardRarity);
    removeZombieFromMarket(_tokenId);
    killedZombies += 1;

    super._burn(_tokenId);
  }

  function removeZombieFromMarket(uint _tokenId) internal {
    address _marketContract = IMain(mainContract).getContractMarket();
    IMarket(_marketContract).removeFromMarketExternal(_tokenId, "zombie");
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

  // ---------------- External Limited methods ---------------

  function checkAndBurnZombies(address _owner, uint[] memory _zombiesList, uint _payAmount) external onlyMonsterContract returns (uint, uint, uint, uint, uint) {
    MonsterResultMetadata memory _metadata = MonsterResultMetadata(0, 0, 0, 0, zombies[_zombiesList[0]].collection);
    uint _count = _zombiesList.length;
    uint _totalPayForMint = 0;
    address _zombieHelper = IMain(mainContract).getContractZombieNFTHelper();

    for (uint _i = 0; _i < _count; ++_i) {
      uint _index = _zombiesList[_i];
      Zombie storage zombie = zombies[_index];
      if (zombie.ownerId != _owner) {
        revert MonsterMintError({message : "You don't own this zombie", tokenId : zombie.tokenId});
      } else {
        _totalPayForMint += IZombieNFTHelper(_zombieHelper).getRarityTokenPrice(rarityToString(zombie.cardRarity));
        _metadata.health += zombie.health;
        _metadata.attack += zombie.attack;
        _metadata.brain += zombie.brain;
        _metadata.killTokens += zombie.killTokens;
        _burn(zombie.tokenId);
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

  function tokenURI(uint _tokenId) public view override(ERC721Upgradeable, ERC721URIStorageUpgradeable) returns (string memory) {
    return super.tokenURI(_tokenId);
  }

  function supportsInterface(bytes4 _interfaceId) public view override(ERC721Upgradeable, ERC721EnumerableUpgradeable) returns (bool) {
    return super.supportsInterface(_interfaceId);
  }

  function safeMint(uint _landId) public {
    address _landContract = IMain(mainContract).getContractLandNFT();
    address _zombieHelper = IMain(mainContract).getContractZombieNFTHelper();
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
        ZombieResultMetadata memory _meta = ZombieResultMetadata("", 0, 0, 0, 0, 0, 0, "");
        (_meta.rarityStr, _meta.health, _meta.attack, _meta.brain, _meta.speed, _meta.killTokens, _meta.collectionId, _meta.uri) = IZombieNFTHelper(_zombieHelper).generateMetadata(_i);
        CardRarity _rarity = rarityFromString(_meta.rarityStr);

        uint _tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, _tokenId);
        _setTokenURI(_tokenId, _meta.uri);

        zombies[_tokenId] = Zombie(
          _tokenId,
          _rarity,
          _meta.collectionId,
          _meta.killTokens,
          0,
          block.timestamp,
          _meta.uri,
          _meta.health,
          _meta.attack,
          _meta.brain,
          _meta.speed,
          "Zombie",
          msg.sender,
          new ModifierItems[](0),
          block.timestamp
        );

        addZombieCollectionRarity(msg.sender, _tokenId, _meta.collectionId, _rarity);
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

  function mapByList(uint[] memory _source, uint _innerListLength, uint _startIndex, uint _endIndex) private pure returns (uint[] memory, uint, uint){
    uint _innerIndex = 0;
    uint[] memory _innerList = new uint[](_endIndex - _startIndex);

    for (uint _i = _startIndex; _i < _endIndex; ++_i) {
      if (_innerListLength > _i) {
        _innerList[_innerIndex] = _source[_i];
        _innerIndex += 1;
      }
    }

    return (_innerList, _innerIndex, _innerListLength);
  }

  function filterCollectionRarity(uint _collectionFilter, string memory _rarityFilter, uint _startIndex, uint _endIndex) private view returns (uint[] memory, uint, uint){
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

  function getRandomRarityByZombies(uint[] memory _zombiesList) external view returns (string memory) {
    uint _rarityIndex = randomNumber(9, 1);
    uint _zombieByIndex = _zombiesList[_rarityIndex];
    CardRarity _rarity = zombies[_zombieByIndex].cardRarity;
    return rarityToString(_rarity);
  }

  function getUserCollectionZombieCount() external view returns (uint[] memory) {
    address _collectionContract = IMain(mainContract).getContractCollection();
    uint _collectionCount = ICollection(_collectionContract).getAllCollectionsCount();
    uint[] memory _result = new uint[](_collectionCount);

    uint _count = super.balanceOf(msg.sender);
    for (uint _i = 0; _i < _count; ++_i) {
      uint _zombieId = super.tokenOfOwnerByIndex(msg.sender, _i);
      uint _collection = zombies[_zombieId].collection;
      _result[_collection] += 1;
    }

    return _result;
  }

  function getMarketItems(uint _startIndex, uint8 _count, string memory _rarity, string memory _collection) public view returns (uint, Zombie[] memory) {
    Zombie[] memory _userZombies = new Zombie[](_count);
    address _marketContract = IMain(mainContract).getContractMarket();

    (uint _total, uint[] memory _saleIdList) = IMarket(_marketContract).getZombiesMonstersFromMarket(_startIndex, _count, "zombies", _rarity, _collection);
    for (uint _i = 0; _i < _count; ++_i) {
      if (_i < _total) {
        _userZombies[_i] = zombies[_saleIdList[_i]];
      }
    }
    return (_total, _userZombies);
  }

  function leaderboardStats() public view returns (uint, uint){
    return (_tokenIdCounter.current(), killedZombies);
  }

}
