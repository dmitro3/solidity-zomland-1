// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

error ZombiesLimitError(string message, uint limit);
error ZombiesSmallLimitError(string message);

contract ZombieNFT is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    enum CardRarity {
        Common,
        Uncommon,
        Rare,
        Epic
    }

    struct Zombie {
        uint tokenId;
        CardRarity cardRarity;
        string killTokens;
        uint salePrice;
        string media;
        int8 collectionId;
        int8 collectionIndex;
        int8 mintDate;
        int8 health;
        int8 attack;
        int8 brain;
        int8 speed;
        string nftType;
        string ownerId;
    }

    address contractMain;

    mapping(uint => Zombie) Zombies;
    mapping(uint256 => string) public cardRarity;

    constructor(address _contractMain) ERC721("ZomLand", "ZMLZ") {
        contractMain = _contractMain;

        cardRarity[0] = "Common";
        cardRarity[1] = "Uncommon";
        cardRarity[2] = "Rare";
        cardRarity[3] = "Epic";
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

    function randomRarity() public view returns (string memory) {
        uint _index = uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, uint(1))))%4;
        return cardRarity[_index];
    }

    // ---------------- Public methods ---------------

    function safeMint() public payable returns (uint) {
        string _rarity = randomRarity();

        checkLimits(_zombieType);
        string memory _uri = getLandURI(_zombieType);

        uint _tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, _tokenId);
        _setTokenURI(_tokenId, _uri);

        zombies[_tokenId] = Zombie(_tokenId, _zombieType, 0, 0, "zombie", 0);

        return _tokenId;
    }

    function userZombies(uint _startIndex, uint8 _count) public view returns (Zombie[] memory) {
        Zombie[] memory _resultZombies = new Zombie[](_count);
        uint _userBalance = super.balanceOf(msg.sender);

        for (uint _i = _startIndex; _i < _count; _i++) {
            if (_userBalance > _i) {
                uint _zombieId = super.tokenOfOwnerByIndex(msg.sender, _i);
                _resultZombies[_i] = zombies[_zombieId];
            }
        }
        return _resultZombies;
    }

    function tokenURI(uint _tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory){
        return super.tokenURI(_tokenId);
    }

    function supportsInterface(bytes4 _interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(_interfaceId);
    }
}