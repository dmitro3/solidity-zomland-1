// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

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
import "../abstract/utils.sol";
import "../abstract/modifiers.sol";

  error MonsterMintCountError(string message, uint required);

contract MonsterNFTContract is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Burnable, Utils, Modifiers {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIdCounter;
  mapping(uint => Monster) monsters;
  mapping(address => mapping(CardRarity => uint[])) userRarityMonster;

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

  constructor(address _mainContract) ERC721("ZomLand", "ZMLM") {
    mainContract = _mainContract;
  }

  // ---------------- Internal & Private methods ---------------

  function _baseURI() internal pure override returns (string memory) {
    return "https://ipfs.io/ipfs/";
  }

  function _beforeTokenTransfer(address _from, address _to, uint _tokenId) internal override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(_from, _to, _tokenId);

    if (_from != NULL_ADDRESS) {
      Monster storage _monster = monsters[_tokenId];
      removeMonsterRarity(_from, _tokenId, _monster.cardRarity);
      addMonsterRarity(_to, _tokenId, _monster.cardRarity);
    }
  }

  function _burn(uint _tokenId) internal override(ERC721, ERC721URIStorage) {
    Monster storage _monster = monsters[_tokenId];
    removeMonsterRarity(msg.sender, _tokenId, _monster.cardRarity);

    super._burn(_tokenId);
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

  function setMonsterSalePrice(uint _tokenId, uint _price) external onlyMarketContract {
    monsters[_tokenId].salePrice = _price;
  }

  // ---------------- Public & External methods ---------------

  function tokenURI(uint _tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory){
    return super.tokenURI(_tokenId);
  }

  function supportsInterface(bytes4 _interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(_interfaceId);
  }

  function userMonsters(uint _startIndex, uint8 _count, string memory _rarityFilter) public view returns (uint, Monster[] memory) {
    uint[] memory _innerList = new uint[](_count);
    uint _endIndex = _startIndex + _count;
    uint _innerListLength;
    uint _innerIndex = 0;

    if (bytes(_rarityFilter).length != 0) {
      CardRarity _rarity = rarityFromString(_rarityFilter);
      uint[] memory rarityList = userRarityMonster[msg.sender][_rarity];
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

    Monster[] memory _resultMonsters = new Monster[](_innerListLength);
    for (uint _i = 0; _i < _innerIndex; ++_i) {
      _resultMonsters[_i] = monsters[_innerList[_i]];
    }
    return (_innerListLength, _resultMonsters);
  }

  function getMarketItems(uint _startIndex, uint8 _count) public view returns (uint, Monster[] memory) {
    Monster[] memory _userMonsters = new Monster[](_count);
    address _marketContract = IMain(mainContract).getContractMarket();

    (uint total, uint[] memory _saleIdList) = IMarket(_marketContract).getFromMarket(_startIndex, _count, "monster");
    for (uint _i = 0; _i < _count; ++_i) {
      if (_i < total) {
        _userMonsters[_i] = monsters[_saleIdList[_i]];
      }
    }
    return (total, _userMonsters);
  }

}

