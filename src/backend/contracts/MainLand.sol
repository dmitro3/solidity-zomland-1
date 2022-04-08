// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract MainLand {
    enum LandType {Small, Medium, Large}

    struct Land {
        uint token_id;
        LandType land_type;
        IERC721 nft;
        uint last_zombie_claim;
        uint sale_price;
        string nft_type;
        address owner_id;
        uint discover_events;
    }

//    function land_media_hash(LandType land_type) internal pure returns (string memory){
//        string memory result = "bafkreihvcoraixdyx6jbrlmlfw45psrjlkwemp7ie3wckye7frnyhbdnoi";
//        if (land_type == LandType.Medium) {
//            result = "bafkreiepzrmwcequ5u6b5dx2jdrr2vq5ujehibu4v32zdxrg4jdgts2ozq";
//        } else if (land_type == LandType.Large) {
//            result = "bafkreigezufih7gmv6d6xfbm3ackbvsxxbw5mprlt3hx5kvte7kjkbaxju";
//        }
//        return result;
//    }

    function land_limits(LandType land_type) internal pure returns (uint){
        uint result = 59999;
        if (land_type == LandType.Medium) {
            result = 5999;
        } else if (land_type == LandType.Large) {
            result = 1999;
        }
        return result;
    }

    function land_discover_limits(LandType land_type) internal pure returns (uint){
        uint result = 99;
        if (land_type == LandType.Medium) {
            result = 399;
        } else if (land_type == LandType.Large) {
            result = 799;
        }
        return result;
    }

    function land_zombie_per_day(LandType land_type) internal pure returns (uint){
        uint result = 1;
        if (land_type == LandType.Medium) {
            result = 4;
        } else if (land_type == LandType.Large) {
            result = 8;
        }
        return result;
    }



}