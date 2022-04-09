import Big from "big.js";

export const defaultGas = Big(60)
  .times(10 ** 12)
  .toFixed();

export const getMedia = (media) =>
  `https://zomland.fra1.digitaloceanspaces.com/${media}.png`;

export const convertFromYocto = (amount, digits = 1) => {
  return Big(amount)
    .div(10 ** 24)
    .toFixed(digits);
};

export const convertFromNanoSeconds = (timestamp) => {
  return parseInt(Big(timestamp).div(1000000).toFixed());
};

export const convertToYocto = (amount) => {
  return Big(amount)
    .times(10 ** 24)
    .toFixed();
};
export const convertToTera = (amount) => {
  return Big(amount)
    .times(10 ** 12)
    .toFixed();
};

export const formatId = (token_id) => {
  let token = token_id.split("-");
  return token[0].toUpperCase() + token[1];
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

  switch (item.nft_type) {
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
    token_list: [item.token_id],
  });
};
