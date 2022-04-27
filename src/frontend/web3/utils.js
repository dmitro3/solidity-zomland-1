import { ethers } from 'ethers';
import { addTransaction, removeTransaction, updateTransaction } from '../store/transactionSlice';

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
  if (!amount) {
    amount = 0;
  }
  return (+ethers.utils.formatEther(amount.toString())).toFixed(digits);
};

export const convertToYocto = (amount) => {
  return ethers.utils.parseEther(amount.toString());
};

export const formatId = (nft) => {
  return `${nft.nftType} #${nft.tokenId}`;
};

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
    health: parseInt(zombie.health),
    attack: parseInt(zombie.attack),
    brain: parseInt(zombie.brain),
    speed: parseInt(zombie.speed),
    mintDate: parseInt(zombie.mintDate),
    collection: parseInt(zombie.collection),
  };
};

export const transformMonster = (monster) => {
  return {
    tokenId: parseInt(monster.tokenId).toString(),
    cardRarity: rarityMap[monster.cardRarity],
    killTokens: parseInt(monster.killTokens),
    salePrice: parseInt(monster.salePrice) || null,
    media: monster.media,
    nftType: monster.nftType,
    ownerId: monster.ownerId,
    health: parseInt(monster.health),
    attack: parseInt(monster.attack),
    brain: parseInt(monster.brain),
    mintDate: parseInt(monster.mintDate),
    collection: parseInt(monster.collection),
  };
};

export const transformCollections = (coll, index) => {
  return {
    id: parseInt(index).toString(),
    title: coll.title,
    image: coll.image,
  };
};

export const addPendingTransaction = (dispatch, transaction, message) => {
  const txId = new Date().toISOString();
  dispatch(addTransaction({
    id: txId,
    hash: transaction.hash,
    message,
    status: "pending"
  }));

  transaction.wait().then((receipt) => {
    if (receipt.status === 1) {
      dispatch(updateTransaction({
        id: txId,
        status: "success",
      }));
    } else {
      dispatch(updateTransaction({
        id: txId,
        status: "error",
      }));
    }

    setTimeout(() => {
      dispatch(removeTransaction({
        id: txId,
      }));
    }, 5000);
  });
}

export const addTransactionError = (dispatch, message) => {
  const txId = new Date().toISOString();
  dispatch(addTransaction({
    id: txId,
    message,
    status: "error"
  }));

  setTimeout(() => {
    dispatch(removeTransaction({
      id: txId,
    }));
  }, 5000);
}