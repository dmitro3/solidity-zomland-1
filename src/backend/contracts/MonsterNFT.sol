// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
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

  error MonsterKillError(string message);
  error MonsterStakeError(string message);
  error MonsterMintCountError(string message, uint required);

contract MonsterNFTContract is Initializable, ERC721Upgradeable, ERC721EnumerableUpgradeable, ERC721URIStorageUpgradeable, ERC721BurnableUpgradeable, OwnableUpgradeable, UUPSUpgradeable, Utils, Modifiers {
  using CountersUpgradeable for CountersUpgradeable.Counter;
  CountersUpgradeable.Counter private _tokenIdCounter;
  mapping(uint => Monster) monsters;
  mapping(address => mapping(CardRarity => uint[])) userRarityMonster;
  uint killedMonsters;
  mapping(address => StakedMonster) stakedMonsters;

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
    uint nextLandDiscovery;
    uint nextBattle;
  }

  struct StakedMonster {
    bool exists;
    uint tokenId;
    uint rewardPct;
  }

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  function initialize(address _mainContract) public initializer {
    __ERC721_init("ZomLand", "ZMLM");
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

  function getMonsterStakingReward(uint _tokenId) private view returns (uint){
    Monster storage monster = monsters[_tokenId];
    if (monster.cardRarity == CardRarity.Common) {
      return 2;
    } else if (monster.cardRarity == CardRarity.UnCommon) {
      return 5;
    } else if (monster.cardRarity == CardRarity.Rare) {
      return 12;
    }
    return 22;
  }

  function _beforeTokenTransfer(address _from, address _to, uint _tokenId) internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable) {
    super._beforeTokenTransfer(_from, _to, _tokenId);

    if (_from != NULL_ADDRESS) {
      Monster storage _monster = monsters[_tokenId];
      _monster.ownerId = _to;

      removeMonsterFromMarket(_tokenId);
      removeMonsterRarity(_from, _tokenId, _monster.cardRarity);
      addMonsterRarity(_to, _tokenId, _monster.cardRarity);

      // sent to staking
      if (_to == IMain(mainContract).getContractTokenFT()) {
        if (stakedMonsters[_from].exists) {
          revert MonsterStakeError({message : "You already have staked Monster"});
        }

        stakedMonsters[_from] = StakedMonster(true, _tokenId, getMonsterStakingReward(_tokenId));
      }
    }
  }

  function _burn(uint _tokenId) internal override(ERC721Upgradeable, ERC721URIStorageUpgradeable) {
    Monster storage _monster = monsters[_tokenId];
    removeMonsterRarity(msg.sender, _tokenId, _monster.cardRarity);
    removeMonsterFromMarket(_tokenId);
    killedMonsters += 1;

    super._burn(_tokenId);
  }

  function removeMonsterFromMarket(uint _tokenId) internal {
    address _marketContract = IMain(mainContract).getContractMarket();
    IMarket(_marketContract).removeFromMarketExternal(_tokenId, "monster");
  }

  function addMonsterRarity(address _owner, uint _tokenId, CardRarity _rarity) private {
    userRarityMonster[_owner][_rarity].push(_tokenId);
  }

  function removeMonsterRarity(address _owner, uint _tokenId, CardRarity _rarity) private {
    (uint _rarityIndex, bool _existRarity) = Utils.indexOf(userRarityMonster[_owner][_rarity], _tokenId);
    if (_existRarity) {
      uint[] storage rarityList = userRarityMonster[_owner][_rarity];
      rarityList[_rarityIndex] = rarityList[rarityList.length - 1];
      rarityList.pop();
    }
  }

  // ---------- External Limited methods -----------

  function safeMint(uint payAmount, uint[] memory _zombiesList, address _owner) external onlyTokenContract returns (uint) {
    uint8 _collectionSize = 10;
    if (_zombiesList.length != _collectionSize) {
      revert MonsterMintCountError({message : "You need to send more zombies for mint Monster", required : _collectionSize});
    }

    address _contractZombie = IMain(mainContract).getContractZombieNFT();
    string memory _rarityStr = IZombieNFT(_contractZombie).getRandomRarityByZombies(_zombiesList);
    MonsterResultMetadata memory _metadata = MonsterResultMetadata(0, 0, 0, 0, 0);
    (_metadata.health, _metadata.attack, _metadata.brain, _metadata.killTokens, _metadata.collectionId) = IZombieNFT(_contractZombie).checkAndBurnZombies(_owner, _zombiesList, payAmount);

    CardRarity _rarity = rarityFromString(_rarityStr);
    address _contractCollection = IMain(mainContract).getContractCollection();
    string memory _uri = ICollection(_contractCollection).getCollectionImage(_metadata.collectionId);

    uint _tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(_owner, _tokenId);
    _setTokenURI(_tokenId, _uri);

    monsters[_tokenId] = Monster(
      _tokenId,
      _rarity,
      _metadata.collectionId,
      _metadata.killTokens,
      0,
      block.timestamp,
      _uri,
      _metadata.health,
      _metadata.attack,
      _metadata.brain,
      "Monster",
      _owner,
      block.timestamp,
      block.timestamp
    );
    addMonsterRarity(_owner, _tokenId, _rarity);

    return _tokenId;
  }

  function setMarketSalePrice(uint _tokenId, uint _price, address _ownerId) external onlyMarketContract {
    require(monsters[_tokenId].ownerId == _ownerId, "You can't change price for this NFT");
    monsters[_tokenId].salePrice = _price;
  }

  function buyToken(uint _id, uint _payAmount, address _newOwner) external onlyMarketContract returns (address) {
    Monster storage monster = monsters[_id];
    require(monster.salePrice > 0, "Wrong payment amount");
    require(monster.salePrice == _payAmount, "Wrong payment amount");
    require(monster.ownerId != _newOwner, "Can't sell for the same account");

    address _seller = monster.ownerId;
    monster.ownerId = _newOwner;
    monster.salePrice = 0;

    // Transfer NFT
    _transfer(_seller, _newOwner, _id);

    return _seller;
  }

  // ---------------- Public & External methods ---------------

  function isStakeMonster(address _owner) public view returns (Monster memory, uint, bool) {
    StakedMonster memory stakedMonster = stakedMonsters[_owner];
    return (monsters[stakedMonster.tokenId], stakedMonster.rewardPct, stakedMonster.exists);
  }

  function stakeMonsterRewardPct(address _owner) external view returns (uint, bool) {
    StakedMonster storage stakedMonster = stakedMonsters[_owner];
    return (stakedMonster.rewardPct, stakedMonster.exists);
  }

  function unStakeMonster() public {
    if (!stakedMonsters[msg.sender].exists) {
      revert MonsterStakeError({message : "You don't have staked Monster"});
    }

    address _currentOwner = IMain(mainContract).getContractTokenFT();
    _transfer(_currentOwner, msg.sender, stakedMonsters[msg.sender].tokenId);
    delete stakedMonsters[msg.sender];
  }

  function getListById(uint[] memory _listId) public view returns (Monster[] memory) {
    Monster[] memory _result = new Monster[](_listId.length);
    for (uint _i = 0; _i < _listId.length; ++_i) {
      _result[_i] = monsters[_listId[_i]];
    }
    return _result;
  }

  function killNftList(uint[] memory _tokenList) public {
    address _contractTokenFT = IMain(mainContract).getContractTokenFT();
    uint _totalKillTokens = 0;

    for (uint _i = 0; _i < _tokenList.length; ++_i) {
      uint _tokenId = _tokenList[_i];
      Monster storage _monster = monsters[_tokenId];
      if (_monster.ownerId != msg.sender) {
        revert MonsterKillError({message : "You can't kill this Monster"});
      }

      _totalKillTokens += _monster.killTokens;
      _burn(_tokenId);
    }

    ITokenFT(_contractTokenFT).transferOnKill(msg.sender, _totalKillTokens);
  }

  function getRarityCollection(uint _id) external view returns (string memory, uint) {
    Monster storage monster = monsters[_id];
    return (rarityToString(monster.cardRarity), monster.collection);
  }

  function getUserMonsterRarity(address _owner, string memory _rarityFilter) external view returns (uint[] memory){
    return userRarityMonster[_owner][rarityFromString(_rarityFilter)];
  }

  function tokenURI(uint _tokenId) public view override(ERC721Upgradeable, ERC721URIStorageUpgradeable) returns (string memory){
    return super.tokenURI(_tokenId);
  }

  function supportsInterface(bytes4 _interfaceId) public view override(ERC721Upgradeable, ERC721EnumerableUpgradeable) returns (bool) {
    return super.supportsInterface(_interfaceId);
  }

  function userMonsters(uint _page, uint8 _count, string memory _rarityFilter) public view returns (uint, Monster[] memory) {
    uint[] memory _innerList = new uint[](_count);
    uint _innerListLength;
    uint _innerLength;

    address _monsterHelper = IMain(mainContract).getContractMonsterNFTHelper();
    (_innerList, _innerLength, _innerListLength) = IMonsterNFTHelper(_monsterHelper).getPageIdList(_page, _count, _rarityFilter, msg.sender);

    Monster[] memory _resultMonsters = new Monster[](_innerListLength);
    for (uint _i = 0; _i < _innerLength; ++_i) {
      _resultMonsters[_i] = monsters[_innerList[_i]];
    }
    return (_innerListLength, _resultMonsters);
  }

  function getMarketItems(uint _startIndex, uint8 _count, string memory _rarity, string memory _collection) public view returns (uint, Monster[] memory) {
    Monster[] memory _userMonsters = new Monster[](_count);
    address _marketContract = IMain(mainContract).getContractMarket();

    (uint _total, uint[] memory _saleIdList) = IMarket(_marketContract).getZombiesMonstersFromMarket(_startIndex, _count, "monsters", _rarity, _collection);
    for (uint _i = 0; _i < _count; ++_i) {
      if (_i < _total) {
        _userMonsters[_i] = monsters[_saleIdList[_i]];
      }
    }
    return (_total, _userMonsters);
  }

  function leaderboardStats() public view returns (uint, uint){
    return (_tokenIdCounter.current(), killedMonsters);
  }

}

