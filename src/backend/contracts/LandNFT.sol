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
import "../abstract/modifiers.sol";
import "../abstract/utils.sol";

  error LandsLimitError(string message, uint limit);
  error LandsCallError(string message);
  error LandsSmallLimitError(string message);

contract LandNFTContract is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Burnable, Utils, Modifiers {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIdCounter;

  enum LandType {
    Micro,
    Small,
    Medium,
    Large
  }

  struct Land {
    uint tokenId;
    LandType landType;
    uint lastZombieClaim;
    uint salePrice;
    string media;
    string nftType;
    uint discoverEvents;
    uint countMintedZombies;
    address ownerId;
  }

  struct LandTypeData {
    uint price;
    uint limitCount;
    uint8 zombiesPerDay;
    string media;
  }

  mapping(uint8 => LandType) public landTypeIndex;
  mapping(LandType => uint) public landTypeCount;
  mapping(LandType => LandTypeData) public landTypeData;
  mapping(address => bool) accountsWithMicroLand;
  mapping(uint => Land) lands;

  constructor(address _mainContract) ERC721("ZomLand", "ZMLL") {
    mainContract = _mainContract;

    landTypeIndex[0] = LandType.Micro;
    landTypeIndex[1] = LandType.Small;
    landTypeIndex[2] = LandType.Medium;
    landTypeIndex[3] = LandType.Large;

    landTypeData[LandType.Micro] = LandTypeData({
    price : 0.001 ether,
    limitCount : 49999,
    zombiesPerDay : 1,
    media : "bafkreidurt5hsjdqid2tl6azwbxye5fpizrzfvcxhavjpwg2wr5kdvk7t4"
    });

    landTypeData[LandType.Small] = LandTypeData({
    price : 0.077 ether,
    limitCount : 9999,
    zombiesPerDay : 2,
    media : "bafkreihvcoraixdyx6jbrlmlfw45psrjlkwemp7ie3wckye7frnyhbdnoi"
    });

    landTypeData[LandType.Medium] = LandTypeData({
    price : 0.15 ether,
    limitCount : 5999,
    zombiesPerDay : 4,
    media : "bafkreiepzrmwcequ5u6b5dx2jdrr2vq5ujehibu4v32zdxrg4jdgts2ozq"
    });

    landTypeData[LandType.Large] = LandTypeData({
    price : 0.33 ether,
    limitCount : 1999,
    zombiesPerDay : 8,
    media : "bafkreigezufih7gmv6d6xfbm3ackbvsxxbw5mprlt3hx5kvte7kjkbaxju"
    });
  }

  // ---------------- Internal & Private methods ---------------

  function _baseURI() internal pure override returns (string memory) {
    return "https://ipfs.io/ipfs/";
  }

  function _beforeTokenTransfer(address _from, address _to, uint _tokenId) internal override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(_from, _to, _tokenId);

    if (_from != NULL_ADDRESS) {
      removeLandFromMarket(_tokenId);
      Land storage _land = lands[_tokenId];
      _land.ownerId = _to;
    }
  }

  function _burn(uint _tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(_tokenId);
    removeLandFromMarket(_tokenId);
  }

  function removeLandFromMarket(uint _tokenId) internal {
    address _marketContract = IMain(mainContract).getContractMarket();
    IMarket(_marketContract).removeFromMarketExternal(_tokenId, "land");
  }

  // small=0, medium=5, large=9
  function landTypeByPrice() internal view returns (LandType) {
    if (msg.value == landTypeData[LandType.Micro].price) {
      return LandType.Micro;
    } else if (msg.value == landTypeData[LandType.Small].price) {
      return LandType.Small;
    } else if (msg.value == landTypeData[LandType.Medium].price) {
      return LandType.Medium;
    } else if (msg.value == landTypeData[LandType.Large].price) {
      return LandType.Large;
    }
    revert("Wrong deposit amount");
  }

  function landTypeToString(LandType _landType) internal pure returns (string memory){
    if (_landType == LandType.Micro) {
      return "Micro";
    } else if (_landType == LandType.Small) {
      return "Small";
    } else if (_landType == LandType.Medium) {
      return "Medium";
    }
    return "Large";
  }

  function checkLimits(LandType _landType) internal view {
    uint _maxCount = landTypeData[_landType].limitCount;
    if (_landType == LandType.Micro) {
      // limit one small lend per account
      if (accountsWithMicroLand[msg.sender] == true) {
        revert LandsSmallLimitError({message : "You can mint just one Micro Land"});
      }
    }

    if (landTypeCount[_landType] >= _maxCount) {
      revert LandsLimitError({message : "You can't mint lands of this type, limit reached", limit : _maxCount});
    }
  }

  // ---------------- External Limited methods ---------------

  function landSetMintTimestamp(uint _landId) external onlyZombieContract {
    lands[_landId].lastZombieClaim = block.timestamp;
    lands[_landId].countMintedZombies += 1;
  }

  function setMarketSalePrice(uint _tokenId, uint _price, address ownerId) external onlyMarketContract {
    require(lands[_tokenId].ownerId == ownerId, "You can't change price for this NFT");
    lands[_tokenId].salePrice = _price;
  }

  function buyToken(uint _id, uint _payAmount, address _newOwner) external onlyMarketContract returns (address) {
    Land storage land = lands[_id];
    require(land.salePrice > 0, "Wrong payment amount");
    require(land.salePrice == _payAmount, "Wrong payment amount");
    require(land.ownerId != _newOwner, "Can't sell for the same account");

    address _seller = land.ownerId;
    land.ownerId = _newOwner;
    land.salePrice = 0;

    // Transfer NFT
    _transfer(_seller, _newOwner, _id);

    return _seller;
  }

  // ---------------- Public & External methods ---------------

  function getListById(uint[] memory _listId) public view returns (Land[] memory) {
    Land[] memory result = new Land[](_listId.length);
    for (uint _i = 0; _i < _listId.length; ++_i) {
      result[_i] = lands[_listId[_i]];
    }
    return result;
  }

  function landInfo(uint _id) external view returns (address, string memory, uint) {
    Land storage land = lands[_id];
    return (land.ownerId, landTypeToString(land.landType), land.countMintedZombies);
  }

  function landInfoType(uint _id) external view returns (string memory) {
    return landTypeToString(lands[_id].landType);
  }

  function getAllLands() public view returns (LandTypeData[] memory) {
    LandTypeData[] memory _lands = new LandTypeData[](4);
    for (uint8 i = 0; i < 4; ++i) {
      _lands[i] = landTypeData[landTypeIndex[i]];
    }

    return _lands;
  }

  function getLandMintZombiesCount(uint _landId) external view returns (uint8) {
    uint _oneDaySeconds = 60 * 60 * 24;
    if (block.timestamp - lands[_landId].lastZombieClaim >= _oneDaySeconds) {
      LandType _landType = lands[_landId].landType;
      return landTypeData[_landType].zombiesPerDay;
    }
    return 0;
  }

  function safeMint() public payable returns (uint) {
    LandType _landType = landTypeByPrice();

    checkLimits(_landType);
    string memory _uri = landTypeData[_landType].media;

    uint _tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(msg.sender, _tokenId);
    _setTokenURI(_tokenId, _uri);

    lands[_tokenId] = Land(_tokenId, _landType, 0, 0, landTypeData[_landType].media, "Land", 0, 0, msg.sender);
    landTypeCount[_landType]++;
    if (_landType == LandType.Micro) {
      accountsWithMicroLand[msg.sender] = true;
    }

    return _tokenId;
  }

  function userLands() public view returns (Land[] memory) {
    uint _userLandsCount = super.balanceOf(msg.sender);
    Land[] memory _userLands = new Land[](_userLandsCount);

    for (uint _i = 0; _i < _userLandsCount; ++_i) {
      uint _landId = super.tokenOfOwnerByIndex(msg.sender, _i);
      _userLands[_i] = lands[_landId];
    }
    return _userLands;
  }

  function tokenURI(uint _tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory){
    return super.tokenURI(_tokenId);
  }

  function supportsInterface(bytes4 _interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(_interfaceId);
  }

  function getMarketItems(uint _startIndex, uint8 _count, string memory filterLandType) public view returns (uint, Land[] memory) {
    Land[] memory _userLands = new Land[](_count);
    address _marketContract = IMain(mainContract).getContractMarket();

    (uint total, uint[] memory _saleIdList) = IMarket(_marketContract).getLandsFromMarket(_startIndex, _count, filterLandType);
    for (uint _i = 0; _i < _count; ++_i) {
      if (_i < total) {
        _userLands[_i] = lands[_saleIdList[_i]];
      }
    }
    return (total, _userLands);
  }

}
