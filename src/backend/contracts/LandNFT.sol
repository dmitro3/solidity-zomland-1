// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

    error LandsLimitError(string message, uint limit);
    error LandsSmallLimitError(string message);

contract LandNFT is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    enum LandType {
        Small,
        Medium,
        Large
    }

    struct Land {
        uint tokenId;
        LandType landType;
        uint lastZombieClaim;
        uint salePrice;
        string nftType;
        uint discoverEvents;
    }

    address contractMain;
    string[] landsMedia;
    mapping(LandType => uint) public landTypeCount;
    mapping(address => bool) accountsWithSmallLand;
    mapping(uint => Land) lands;

    //    modifier onlyMainContract() {
    //        require(contractMain == _msgSender(), "Caller is not main contract");
    //        _;
    //    }

    constructor(address _contractMain) ERC721("ZomLand", "ZMLL") {
        contractMain = _contractMain;

        landsMedia.push("bafkreihvcoraixdyx6jbrlmlfw45psrjlkwemp7ie3wckye7frnyhbdnoi");
        landsMedia.push("bafkreiepzrmwcequ5u6b5dx2jdrr2vq5ujehibu4v32zdxrg4jdgts2ozq");
        landsMedia.push("bafkreigezufih7gmv6d6xfbm3ackbvsxxbw5mprlt3hx5kvte7kjkbaxju");
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

    // small=0.01, medium=5, large=9
    function landTypeByPrice() internal view returns (LandType){
        if (msg.value == 0.01 ether) {
            return LandType.Small;
        } else if (msg.value == 5 ether) {
            return LandType.Medium;
        } else if (msg.value == 9 ether) {
            return LandType.Large;
        }
        revert("Wrong deposit amount");
    }

    function getLandURI(LandType _landType) internal view returns (string memory){
        if (_landType == LandType.Small) {
            return landsMedia[0];
        } else if (_landType == LandType.Medium) {
            return landsMedia[1];
        } else if (_landType == LandType.Large) {
            return landsMedia[2];
        }
        revert("Wrong land type");
    }

    function landZombiePerDay(LandType _landType) internal pure returns (uint){
        if (_landType == LandType.Small) {
            return 1;
        } else if (_landType == LandType.Medium) {
            return 4;
        } else if (_landType == LandType.Large) {
            return 8;
        }
        revert("Wrong land type");
    }

    function checkLimits(LandType _landType) internal view {
        uint _maxCount;
        if (_landType == LandType.Small) {
            // limit one small lend per account
            if (accountsWithSmallLand[msg.sender] == true) {
                revert LandsSmallLimitError({message : "You can mint just one Small Land"});
            }
            _maxCount = 59999;
        } else if (_landType == LandType.Medium) {
            _maxCount = 5999;
        } else if (_landType == LandType.Large) {
            _maxCount = 1999;
        } else {
            revert("Wrong land type");
        }

        if (landTypeCount[_landType] >= _maxCount) {
            revert LandsLimitError({message : "You can't mint lands of this type, limit reached", limit : _maxCount});
        }
    }

    // ---------------- Public methods ---------------

    function getAllLandsMedia() public view returns (string[] memory){
        return (landsMedia);
    }

    function safeMint() public payable returns (uint) {
        LandType _landType = landTypeByPrice();

        checkLimits(_landType);
        string memory _uri = getLandURI(_landType);

        uint _tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, _tokenId);
        _setTokenURI(_tokenId, _uri);

        landTypeCount[_landType]++;
        accountsWithSmallLand[msg.sender] = true;
        lands[_tokenId] = Land(_tokenId, _landType, 0, 0, "land", 0);

        return _tokenId;
    }

    function userLandByIndex(uint startIndex, uint8 count) public view returns (Land[] memory) {
        Land[] memory _resultLands = new Land[](count);
        uint userBalance = super.balanceOf(msg.sender);

        for (uint i = startIndex; i < count; i++) {
            if (userBalance > i) {
                uint landId = super.tokenOfOwnerByIndex(msg.sender, i);
                _resultLands[i] = lands[landId];
            }
        }
        return _resultLands;
    }

    function tokenURI(uint _tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory){
        return super.tokenURI(_tokenId);
    }

    function supportsInterface(bytes4 _interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(_interfaceId);
    }
}