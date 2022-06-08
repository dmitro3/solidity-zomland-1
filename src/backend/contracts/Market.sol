// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "hardhat/console.sol";
import "../interfaces/interface.sol";
import "../abstract/utils.sol";
import "../abstract/modifiers.sol";

  error MarketError(string message);

contract MarketContract is Utils, Modifiers {
  uint[] lands;
  uint[] zombies;
  uint[] monsters;
  HistoryItem[] marketHistory;
  mapping(string => uint) public currentSaleIndex;
  uint public constant ITEMS_LIMIT = 5;

  struct HistoryItem {
    address fromUser;
    address toUser;
    string nftType;
    uint price;
    uint tokenId;
    uint timestamp;
  }

  constructor(address _mainContract) {
    mainContract = _mainContract;
    currentSaleIndex["land"] = 0;
    currentSaleIndex["zombie"] = 0;
    currentSaleIndex["monster"] = 0;
  }

  // ---------------- Public & External methods ---------------

  function publishOnMarket(uint[] calldata idList, uint[] calldata priceList, string memory typeNFT) public {
    address _sourceContract;
    uint[] storage _source;
    if (string_equal(typeNFT, "land")) {
      _sourceContract = IMain(mainContract).getContractLandNFT();
      _source = lands;
    } else if (string_equal(typeNFT, "zombie")) {
      _sourceContract = IMain(mainContract).getContractZombieNFT();
      _source = zombies;
    } else if (string_equal(typeNFT, "monster")) {
      _sourceContract = IMain(mainContract).getContractMonsterNFT();
      _source = monsters;
    } else {
      revert MarketError({message : "Wrong typeNFT param"});
    }

    for (uint _i = 0; _i < idList.length; _i++) {
      bool _exist = Utils.has(_source, idList[_i]);
      if (!_exist) {
        if (string_equal(typeNFT, "land")) {
          ILandNFT(_sourceContract).setMarketSalePrice(idList[_i], priceList[_i], msg.sender);
          if (_source.length > currentSaleIndex[typeNFT]) {
            ILandNFT(_sourceContract).setMarketSalePrice(_source[currentSaleIndex[typeNFT]], 0, msg.sender);
          }
        } else if (string_equal(typeNFT, "zombie")) {
          IZombieNFT(_sourceContract).setMarketSalePrice(idList[_i], priceList[_i], msg.sender);
          if (_source.length > currentSaleIndex[typeNFT]) {
            IZombieNFT(_sourceContract).setMarketSalePrice(_source[currentSaleIndex[typeNFT]], 0, msg.sender);
          }
        } else if (string_equal(typeNFT, "monster")) {
          IMonsterNFT(_sourceContract).setMarketSalePrice(idList[_i], priceList[_i], msg.sender);
          if (_source.length > currentSaleIndex[typeNFT]) {
            IMonsterNFT(_sourceContract).setMarketSalePrice(_source[currentSaleIndex[typeNFT]], 0, msg.sender);
          }
        }

        if (_source.length > currentSaleIndex[typeNFT]) {
          _source[currentSaleIndex[typeNFT]] = idList[_i];
        } else {
          _source.push(idList[_i]);
        }
        currentSaleIndex[typeNFT] += 1;
        if (currentSaleIndex[typeNFT] >= ITEMS_LIMIT) {
          currentSaleIndex[typeNFT] = 0;
        }
      }
    }
  }

  function removeFromMarket(uint tokenId, string memory typeNFT) public {
    uint[] storage _source;
    address _sourceContract;

    if (string_equal(typeNFT, "land")) {
      _source = lands;
      _sourceContract = IMain(mainContract).getContractLandNFT();
    } else if (string_equal(typeNFT, "zombie")) {
      _source = zombies;
      _sourceContract = IMain(mainContract).getContractZombieNFT();
    } else if (string_equal(typeNFT, "monster")) {
      _source = monsters;
      _sourceContract = IMain(mainContract).getContractMonsterNFT();
    } else {
      revert MarketError({message : "Wrong typeNFT param"});
    }

    (uint _index, bool _exist) = Utils.indexOf(_source, tokenId);
    if (_exist) {
      if (string_equal(typeNFT, "land")) {
        ILandNFT(_sourceContract).setMarketSalePrice(tokenId, 0, msg.sender);
      } else if (string_equal(typeNFT, "zombie")) {
        IZombieNFT(_sourceContract).setMarketSalePrice(tokenId, 0, msg.sender);
      } else if (string_equal(typeNFT, "monster")) {
        IMonsterNFT(_sourceContract).setMarketSalePrice(tokenId, 0, msg.sender);
      }

      _source[_index] = _source[_source.length - 1];
      _source.pop();
    }
  }

  function getLandsFromMarket(uint _startIndex, uint8 _count, string memory filterLandType) external view returns (uint, uint[] memory){
    uint[] memory source = new uint[](lands.length);
    uint[] memory _innerList = new uint[](_count);

    uint _innerListLength;
    if (bytes(filterLandType).length == 0) {
      source = lands;
      _innerListLength = lands.length;
    } else {
      address _landContract = IMain(mainContract).getContractLandNFT();
      uint landsCount = lands.length;

      uint _index = 0;
      for (uint _i = 0; _i < landsCount; ++_i) {
        string memory landType = ILandNFT(_landContract).landInfoType(lands[_i]);
        if (string_equal(landType, filterLandType)) {
          source[_index] = lands[_i];
          _index += 1;
        }
      }
      _innerListLength = _index;
    }

    uint _index = 0;
    uint _endIndex = _startIndex + _count;
    for (uint _i = _startIndex; _i < _endIndex; ++_i) {
      if (_innerListLength > _i) {
        _innerList[_index] = source[_i];
        _index += 1;
      }
    }

    return (_innerListLength, _innerList);
  }

  function filterZombieMonster(uint[] storage source, string memory nftType, string memory _filterRarity, string memory _filterCollection) internal view returns (uint, uint[] memory) {
    uint _index = 0;
    uint _itemsCount = source.length;
    uint[] memory _itemsSource = new uint[](_itemsCount);
    address _sourceContract = string_equal(nftType, "zombies") ? IMain(mainContract).getContractZombieNFT() : IMain(mainContract).getContractMonsterNFT();

    for (uint _i = 0; _i < _itemsCount; ++_i) {
      bool canAdd = false;
      (string memory rarity, uint collection) = string_equal(nftType, "zombies") ? IZombieNFT(_sourceContract).getRarityCollection(source[_i]) : IMonsterNFT(_sourceContract).getRarityCollection(source[_i]);
      if (bytes(_filterRarity).length != 0 && bytes(_filterCollection).length != 0) {
        if (string_equal(rarity, _filterRarity) && string_equal(Strings.toString(collection), _filterCollection)) {
          canAdd = true;
        }
      } else if (bytes(_filterRarity).length != 0) {
        if (string_equal(rarity, _filterRarity)) {
          canAdd = true;
        }
      } else if (bytes(_filterCollection).length != 0) {
        if (string_equal(Strings.toString(collection), _filterCollection)) {
          canAdd = true;
        }
      }

      if (canAdd) {
        _itemsSource[_index] = source[_i];
        _index += 1;
      }
    }

    return (_index, _itemsSource);
  }

  function getZombiesMonstersFromMarket(uint _startIndex, uint8 _count, string memory nftType, string memory _filterRarity, string memory _filterCollection) external view returns (uint, uint[] memory){
    uint[] storage source = string_equal(nftType, "zombies") ? zombies : monsters;
    uint[] memory _innerList = new uint[](_count);

    uint _innerListLength;
    uint[] memory _itemsSource = new uint[](source.length);
    if (bytes(_filterRarity).length != 0 || bytes(_filterCollection).length != 0) {
      (_innerListLength, _itemsSource) = filterZombieMonster(source, nftType, _filterRarity, _filterCollection);
    } else {
      _itemsSource = source;
      _innerListLength = source.length;
    }

    uint _index = 0;
    uint _endIndex = _startIndex + _count;
    for (uint _i = _startIndex; _i < _endIndex; ++_i) {
      if (_innerListLength > _i) {
        _innerList[_index] = _itemsSource[_i];
        _index += 1;
      }
    }

    return (_innerListLength, _innerList);
  }

  function buyNFT(uint tokenId, string memory typeNFT) payable public {
    uint[] storage _source;
    address _sourceContract;

    if (string_equal(typeNFT, "land")) {
      _source = lands;
      _sourceContract = IMain(mainContract).getContractLandNFT();
    } else if (string_equal(typeNFT, "zombie")) {
      _source = zombies;
      _sourceContract = IMain(mainContract).getContractZombieNFT();
    } else if (string_equal(typeNFT, "monster")) {
      _source = monsters;
      _sourceContract = IMain(mainContract).getContractMonsterNFT();
    } else {
      revert MarketError({message : "Wrong typeNFT param"});
    }

    // Add history
  }

}
