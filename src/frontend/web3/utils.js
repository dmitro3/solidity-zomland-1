import { ethers } from 'ethers';
import { addTransaction, removeTransaction, updateTransaction } from '../store/transactionSlice';

export const landTypeMap = {
  0: "Micro",
  1: "Small",
  2: "Medium",
  3: "Large",
};

export const rarityMap = {
  0: "Common",
  1: "Uncommon",
  2: "Rare",
  3: "Epic",
};

export const getMedia = (media) => {
  if (media.toLocaleLowerCase().indexOf(".png") === -1) {
    media += ".png";
  }
  return `${process.env.SPACES_URL}/${media}`;
}

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

export const formatLandId = (landType, tokenId, size = "md") => {
  if (size === "sm") {
    return `${landType} #${tokenId}`;
  }
  return `${landType} Land #${tokenId}`;
};

export const statusColorTextMap = (status) => {
  let result = "text-gray-500";
  if (status === "Small" || status === "Uncommon") {
    result = "text-green-500";
  } else if (status === "Medium" || status === "Rare") {
    result = "text-blue-500";
  } else if (status === "Large" || status === "Epic") {
    result = "text-rose-500";
  }
  return result;
};

export const statusColorBorderMap = (status) => {
  let result = "border-gray-500";
  if (status === "Small" || status === "Uncommon") {
    result = "border-green-500";
  } else if (status === "Medium" || status === "Rare") {
    result = "border-blue-500";
  } else if (status === "Large" || status === "Epic") {
    result = "border-rose-500";
  }
  return result;
};

export const transformLand = (land) => {
  return {
    tokenId: parseInt(land.tokenId).toString(),
    landType: landTypeMap[land.landType],
    lastZombieClaim: parseInt(land.lastZombieClaim),
    salePrice: parseInt(land.salePrice) ? convertFromYocto(land.salePrice, 2) : null,
    price: parseInt(land.salePrice) || null,
    media: land.media,
    nftType: land.nftType,
    ownerId: land.ownerId,
    discoverEvents: parseInt(land.discoverEvents),
    countMintedZombies: parseInt(land.countMintedZombies),
  };
};

export const transformZombie = (zombie) => {
  return {
    tokenId: parseInt(zombie.tokenId).toString(),
    cardRarity: rarityMap[zombie.cardRarity],
    killTokens: parseInt(zombie.killTokens),
    salePrice: parseInt(zombie.salePrice) ? convertFromYocto(zombie.salePrice, 2) : null,
    price: parseInt(zombie.salePrice) || null,
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
    salePrice: parseInt(monster.salePrice) ? convertFromYocto(monster.salePrice, 2) : null,
    price: parseInt(monster.salePrice) || null,
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

export const rarityOptions = (setFilterRarity) => {
  const result = [];
  const options = ["All Rarities", "Common", "Uncommon", "Rare", "Epic"];

  options.map(option => {
    result.push({
      title: option,
      onClick: () => {
        const optionValue = option === "All Rarities" ? "" : option;
        setFilterRarity(optionValue);
      },
    })
  });

  return result;
};

export const collectionOptions = (allCollections, setFilterCollection) => {
  const collections = Object.keys(allCollections).map((key) => {
    return {
      title: allCollections[key].title,
      onClick: () => {
        const selectedCollection = allCollections[key].id;
        setFilterCollection(selectedCollection);
      },
    };
  });

  return [
    {
      title: "All Collections",
      onClick: () => {
        setFilterCollection("");
      },
    },
    ...collections,
  ];
};

export const isOwner = (currentUser, nftOwner) => {
  return currentUser.accountId.toLowerCase() === nftOwner.toLowerCase();
}

export const landTypeOptions = (setFilterLandType) => {
  const result = [];
  ["All Types", "Small", "Medium", "Large"].map(option => {
    result.push({
      title: option,
      onClick: () => {
        const optionValue = option === "All Types" ? "" : option;
        setFilterLandType(optionValue);
      },
    })
  });

  return result;
};
