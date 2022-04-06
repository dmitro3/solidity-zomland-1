// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MainLand.sol";

contract Main is MainLand {
    address public owner_id;
    address public contract_ft;
    address public contract_nft_zombie;
    address public contract_nft_land;
    mapping(uint => Land) public lands;

    constructor() {
        owner_id = msg.sender;
    }

    // Mint new Land
    function mint_land_nft() public payable returns (uint){

    }

    function get_lands_by_id(uint[] memory id_list) internal view returns (Land[] memory) {
        Land[] memory result;
        for (uint i = 0; i < id_list.length; i++) {
            result[i] = lands[id_list[i]];
        }
        return result;
    }

}