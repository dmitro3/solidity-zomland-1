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

    mapping(LandType => uint) public landTypeCount;
    mapping(address => bool) accountsWithSmallLand;
    mapping(uint => LandType) landType;

    address contractMain;
    enum LandType {
        Small,
        Medium,
        Large
    }

    modifier onlyMainContract() {
        require(contractMain == _msgSender(), "Caller is not main contract");
        _;
    }

    constructor(address _contractMain) ERC721("ZomLand", "ZMLL") {
        contractMain = _contractMain;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://";
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

    function getLandURI(LandType _landType) internal pure returns (string memory){
        string memory _result;
        if (_landType == LandType.Small) {
            _result = "bafkreihvcoraixdyx6jbrlmlfw45psrjlkwemp7ie3wckye7frnyhbdnoi";
        } else if (_landType == LandType.Medium) {
            _result = "bafkreiepzrmwcequ5u6b5dx2jdrr2vq5ujehibu4v32zdxrg4jdgts2ozq";
        } else if (_landType == LandType.Large) {
            _result = "bafkreigezufih7gmv6d6xfbm3ackbvsxxbw5mprlt3hx5kvte7kjkbaxju";
        } else {
            revert("Wrong land type");
        }
        return _result;
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
        landType[_tokenId] = _landType;

        return _tokenId;
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address _from, address _to, uint _tokenId) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(_from, _to, _tokenId);
    }

    function _burn(uint _tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(_tokenId);
    }

    function tokenURI(uint _tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory){
        return super.tokenURI(_tokenId);
    }

    function supportsInterface(bytes4 _interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(_interfaceId);
    }
}