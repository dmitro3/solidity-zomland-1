// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "hardhat/console.sol";
import "../interfaces/interface.sol";
import "../abstract/utils.sol";
import "../abstract/modifiers.sol";

  error MarketError(string message);

contract MarketContract is Initializable, UUPSUpgradeable, OwnableUpgradeable, Utils, Modifiers {
  uint public constant ITEMS_LIMIT = 500;
  uint public constant HISTORY_LIMIT = 50;
  uint[] lands;
  uint[] zombies;
  uint[] monsters;
  uint historySaleIndex;
  mapping(uint => HistoryItem) public marketHistory;
  mapping(string => uint) public currentSaleIndex;

  struct HistoryItem {
    address fromUser;
    address toUser;
    string nftType;
    uint price;
    uint tokenId;
    uint timestamp;
  }

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  function initialize(address _mainContract) public initializer {
    __Ownable_init();
    __UUPSUpgradeable_init();

    mainContract = _mainContract;
    currentSaleIndex["land"] = 0;
    currentSaleIndex["zombie"] = 0;
    currentSaleIndex["monster"] = 0;
  }

  function _authorizeUpgrade(address newImplementation) internal onlyOwner override {}

  // ---------------- Internal & Private methods ---------------

  function removeFromMarketInternal(uint _tokenId, uint[] storage _source) internal {
    (uint _index, bool _exist) = Utils.indexOf(_source, _tokenId);
    if (_exist) {
      _source[_index] = _source[_source.length - 1];
      _source.pop();
    }
  }

  // ---------------- External Limited methods ---------------

  function removeFromMarketExternal(uint _tokenId, string memory _typeNFT) external onlyNFTContract {
    uint[] storage source;
    if (string_equal(_typeNFT, "land")) {
      source = lands;
    } else if (string_equal(_typeNFT, "zombie")) {
      source = zombies;
    } else if (string_equal(_typeNFT, "monster")) {
      source = monsters;
    } else {
      revert MarketError({message : "Wrong typeNFT param"});
    }

    removeFromMarketInternal(_tokenId, source);
  }


  // ---------------- Public & External methods ---------------

  function publishOnMarket(uint[] calldata _idList, uint[] calldata _priceList, string memory _typeNFT) public {
    address _sourceContract;
    uint[] storage source;
    if (string_equal(_typeNFT, "land")) {
      _sourceContract = IMain(mainContract).getContractLandNFT();
      source = lands;
    } else if (string_equal(_typeNFT, "zombie")) {
      _sourceContract = IMain(mainContract).getContractZombieNFT();
      source = zombies;
    } else if (string_equal(_typeNFT, "monster")) {
      _sourceContract = IMain(mainContract).getContractMonsterNFT();
      source = monsters;
    } else {
      revert MarketError({message : "Wrong typeNFT param"});
    }

    for (uint _i = 0; _i < _idList.length; ++_i) {
      bool _exist = Utils.has(source, _idList[_i]);
      if (!_exist) {
        INFT(_sourceContract).setMarketSalePrice(_idList[_i], _priceList[_i], msg.sender);

        if (source.length > currentSaleIndex[_typeNFT]) {
          INFT(_sourceContract).setMarketSalePrice(source[currentSaleIndex[_typeNFT]], 0, msg.sender);
          source[currentSaleIndex[_typeNFT]] = _idList[_i];
        } else {
          source.push(_idList[_i]);
        }

        currentSaleIndex[_typeNFT] += 1;
        if (currentSaleIndex[_typeNFT] >= ITEMS_LIMIT) {
          currentSaleIndex[_typeNFT] = 0;
        }
      }
    }
  }

  function removeFromMarket(uint _tokenId, string memory _typeNFT) public {
    uint[] storage source;
    address _sourceContract;

    if (string_equal(_typeNFT, "land")) {
      source = lands;
      _sourceContract = IMain(mainContract).getContractLandNFT();
    } else if (string_equal(_typeNFT, "zombie")) {
      source = zombies;
      _sourceContract = IMain(mainContract).getContractZombieNFT();
    } else if (string_equal(_typeNFT, "monster")) {
      source = monsters;
      _sourceContract = IMain(mainContract).getContractMonsterNFT();
    } else {
      revert MarketError({message : "Wrong typeNFT param"});
    }

    INFT(_sourceContract).setMarketSalePrice(_tokenId, 0, msg.sender);
    removeFromMarketInternal(_tokenId, source);
  }

  function getLandsFromMarket(uint _startIndex, uint8 _count, string memory _filterLandType) external view returns (uint, uint[] memory){
    uint[] memory source = new uint[](lands.length);
    uint[] memory _innerList = new uint[](_count);

    uint _innerListLength;
    if (bytes(_filterLandType).length == 0) {
      source = lands;
      _innerListLength = lands.length;
    } else {
      address _landContract = IMain(mainContract).getContractLandNFT();
      uint _landsCount = lands.length;

      uint _indexList = 0;
      for (uint _i = 0; _i < _landsCount; ++_i) {
        string memory _landType = ILandNFT(_landContract).landInfoType(lands[_i]);
        if (string_equal(_landType, _filterLandType)) {
          source[_indexList] = lands[_i];
          _indexList += 1;
        }
      }
      _innerListLength = _indexList;
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

  function filterZombieMonster(uint[] storage source, string memory _nftType, string memory _filterRarity, string memory _filterCollection) internal view returns (uint, uint[] memory) {
    uint _index = 0;
    uint _itemsCount = source.length;
    uint[] memory _itemsSource = new uint[](_itemsCount);
    address _sourceContract = string_equal(_nftType, "zombies") ? IMain(mainContract).getContractZombieNFT() : IMain(mainContract).getContractMonsterNFT();

    for (uint _i = 0; _i < _itemsCount; ++_i) {
      bool _canAdd = false;
      (string memory _rarity, uint _collection) = string_equal(_nftType, "zombies") ? IZombieNFT(_sourceContract).getRarityCollection(source[_i]) : IMonsterNFT(_sourceContract).getRarityCollection(source[_i]);
      if (bytes(_filterRarity).length != 0 && bytes(_filterCollection).length != 0) {
        if (string_equal(_rarity, _filterRarity) && string_equal(StringsUpgradeable.toString(_collection), _filterCollection)) {
          _canAdd = true;
        }
      } else if (bytes(_filterRarity).length != 0) {
        if (string_equal(_rarity, _filterRarity)) {
          _canAdd = true;
        }
      } else if (bytes(_filterCollection).length != 0) {
        if (string_equal(StringsUpgradeable.toString(_collection), _filterCollection)) {
          _canAdd = true;
        }
      }

      if (_canAdd) {
        _itemsSource[_index] = source[_i];
        _index += 1;
      }
    }

    return (_index, _itemsSource);
  }

  function getZombiesMonstersFromMarket(uint _startIndex, uint8 _count, string memory _nftType, string memory _filterRarity, string memory _filterCollection) external view returns (uint, uint[] memory){
    uint[] storage source = string_equal(_nftType, "zombies") ? zombies : monsters;
    uint[] memory _innerList = new uint[](_count);

    uint _innerListLength;
    uint[] memory _itemsSource = new uint[](source.length);
    if (bytes(_filterRarity).length != 0 || bytes(_filterCollection).length != 0) {
      (_innerListLength, _itemsSource) = filterZombieMonster(source, _nftType, _filterRarity, _filterCollection);
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

  function buyNFT(uint _tokenId, string memory _typeNFT) payable public {
    uint[] storage _source;
    address _sourceContract;

    if (string_equal(_typeNFT, "land")) {
      _source = lands;
      _sourceContract = IMain(mainContract).getContractLandNFT();
    } else if (string_equal(_typeNFT, "zombie")) {
      _source = zombies;
      _sourceContract = IMain(mainContract).getContractZombieNFT();
    } else if (string_equal(_typeNFT, "monster")) {
      _source = monsters;
      _sourceContract = IMain(mainContract).getContractMonsterNFT();
    } else {
      revert MarketError({message : "Wrong typeNFT param"});
    }

    address _seller = INFT(_sourceContract).buyToken(_tokenId, msg.value, msg.sender);

    // send tokens (except 0.5% fee)
    uint _restAmount = msg.value - msg.value / 1000 * 5;
    payable(_seller).transfer(_restAmount);

    // remove from market
    (uint _index, bool _exist) = Utils.indexOf(_source, _tokenId);
    if (_exist) {
      _source[_index] = _source[_source.length - 1];
      _source.pop();
    }

    // Add history
    marketHistory[historySaleIndex] = HistoryItem(
      _seller,
      msg.sender,
      _typeNFT,
      msg.value,
      _tokenId,
      block.timestamp
    );
    historySaleIndex += 1;
    if (historySaleIndex >= HISTORY_LIMIT) {
      historySaleIndex = 0;
    }
  }

  function getSaleHistory() public view returns (uint, HistoryItem[] memory) {
    HistoryItem[] memory _history = new HistoryItem[](HISTORY_LIMIT);
    for (uint _i = 0; _i < HISTORY_LIMIT; ++_i) {
      _history[_i] = marketHistory[_i];
    }
    return (historySaleIndex, _history);
  }

}
