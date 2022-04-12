import { ethers } from 'ethers';

export const landTypeMap = {
  0: "Small",
  1: "Medium",
  2: "Large",
};

export const rarityMap = {
  0: "Common",
  1: "Uncommon",
  2: "Rare",
  3: "Epic",
};

export const getMedia = (media) => `https://zomland.fra1.digitaloceanspaces.com/${media}.png`;

export const convertFromYocto = (amount, digits = 1) => {
  return (+ethers.utils.formatEther(amount.toString())).toFixed(digits);
};

export const convertToYocto = (amount) => {
  return ethers.utils.parseEther(amount.toString());
};

export const formatId = (tokenId) => tokenId;

export const statusColorTextMap = (status) => {
  let result = "text-gray-500";
  if (status === "Medium" || status === "Uncommon") {
    result = "text-blue-500";
  } else if (status === "Large" || status === "Epic") {
    result = "text-orange-500";
  } else if (status === "Rare") {
    result = "text-rose-500";
  }
  return result;
};

export const statusColorBorderMap = (status) => {
  let result = "border-gray-500";
  if (status === "Medium" || status === "Uncommon") {
    result = "border-blue-500";
  } else if (status === "Large" || status === "Epic") {
    result = "border-orange-500";
  } else if (status === "Rare") {
    result = "border-rose-500";
  }
  return result;
};

export const rmFromMarket = async (contract, item) => {
  let contract_method = "";

  switch (item.nftType) {
    case "Land":
      contract_method = "remove_lands_from_market";
      break;
    case "Zombie":
      contract_method = "remove_zombies_from_market";
      break;
    case "Monster":
      contract_method = "remove_monsters_from_market";
      break;
    default:
  }

  await contract[contract_method]({
    token_list: [item.tokenId],
  });
};

export const transformLand = (land) => {
  return {
    tokenId: parseInt(land.tokenId).toString(),
    landType: landTypeMap[land.landType],
    lastZombieClaim: parseInt(land.lastZombieClaim),
    salePrice: parseInt(land.salePrice) || null,
    media: land.media,
    nftType: land.nftType,
    ownerId: land.ownerId,
    discoverEvents: parseInt(land.discoverEvents),
  };
};

export const transformZombie = (zombie) => {
  return {
    tokenId: parseInt(zombie.tokenId).toString(),
    cardRarity: rarityMap[zombie.cardRarity],
    killTokens: parseInt(zombie.killTokens),
    salePrice: parseInt(zombie.salePrice) || null,
    media: zombie.media,
    nftType: zombie.nftType,
    ownerId: zombie.ownerId,
    health: zombie.health,
    attack: zombie.attack,
    brain: zombie.brain,
    speed: zombie.speed,
    mintDate: zombie.mintDate,
    collection: zombie.collection,
  };
};

export const transformCollections = (coll, index) => {
  return {
    id: parseInt(index).toString(),
    title: coll.title,
    image: coll.image,
  };
};
