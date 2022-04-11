import React from "react";
import {ChevronDoubleRightIcon} from "@heroicons/react/outline";
import {convertToYocto, defaultGas} from "../../web3/utils";
import {Button} from "../basic/Button";
import {SellItem} from "./SellItem";

export const Sidebar = ({
  currentUser,
  contract,
  sellList,
  setSellList,
  isOpen,
  setIsOpen,
}) => {
  const cancelItemSell = (tokenId, nftType) => {
    sellList[nftType] = sellList[nftType].filter(
        (zombie) => zombie.tokenId !== tokenId
    );
    setSellList({...sellList});
  };

  const setItemPrice = (nft, price, nftType) => {
    sellList[nftType] = sellList[nftType].map((item) => {
      if (item.tokenId === nft.tokenId) {
        item.salePrice = price;
      }
      return item;
    });
    setSellList({...sellList});
  };

  const createSaleObject = (list) => {
    let sellObject = {};
    let isError = false;
    list.forEach((item) => {
      if (item.salePrice > 0) {
        sellObject[item.tokenId] = convertToYocto(item.salePrice);
      } else {
        isError = true;
      }
    });
    return [isError, sellObject];
  };

  const sellMyItems = () => {
    if (sellList["zombies"].length) {
      const [isError, sellObject] = createSaleObject(sellList["zombies"]);
      if (!isError) {
        sellZombieItems(sellObject);
      } else {
        alert("Please, provide sale price for all Zombies");
      }
    } else if (sellList["lands"].length) {
      const [isError, sellObject] = createSaleObject(sellList["lands"]);
      if (!isError) {
        sellLandItems(sellObject);
      } else {
        alert("Please, provide sale price for all Lands");
      }
    } else if (sellList["monsters"].length) {
      const [isError, sellObject] = createSaleObject(sellList["monsters"]);
      if (!isError) {
        sellMonsterItems(sellObject);
      } else {
        alert("Please, provide sale price for all Monsters");
      }
    }
  };

  const sellZombieItems = async (sellObject) => {
    await contract.publish_zombies_on_market(
        {
          token_price_list: sellObject,
          account_id: currentUser.accountId,
        },
        defaultGas,
        1
    );
  };

  const sellLandItems = async (sellObject) => {
    await contract.publish_lands_on_market(
        {
          token_price_list: sellObject,
          account_id: currentUser.accountId,
        },
        defaultGas,
        1
    );
  };

  const sellMonsterItems = async (sellObject) => {
    await contract.publish_monsters_on_market(
        {
          token_price_list: sellObject,
          account_id: currentUser.accountId,
        },
        defaultGas,
        1
    );
  };

  const sellBtnText = () => {
    let result = `Monster`;
    let type = "monsters";

    if (sellList["lands"].length > 0) {
      result = `Land`;
      type = "lands";
    } else if (sellList["zombies"].length > 0) {
      result = `Zombie`;
      type = "zombies";
    }

    if (sellList[type].length > 1) {
      result += `s`;
    }

    return `Place ${result} on Market`;
  };

  const isSidebarEnabled = () => {
    return (
        sellList["zombies"].length > 0 ||
        sellList["lands"].length > 0 ||
        sellList["monsters"].length > 0
    );
  };

  return (
      <>
        {isSidebarEnabled() && (
            <div
                className={`top-0 right-0 fixed w-[350px] h-full p-10 ease-in-out duration-300 bg-gray-800 z-30 
        shadow-3xl border-l-[4px] border-gray-600 ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
              <div
                  className={`bg-gray-800 px-2 w-10 h-14 absolute left-[-40px] bottom-9 cursor-pointer pt-3 shadow-3xl
            border-[4px] border-r-0  hover:text-indigo-100 
            ${
                      isOpen
                          ? "rounded-l-lg border-gray-600"
                          : "rounded-r-lg rotate-180 border-gray-800"
                  }`}
                  onClick={() => setIsOpen(!isOpen)}
              >
                <ChevronDoubleRightIcon className="w-5 h-6 font-semibold"/>
              </div>

              {Object.keys(sellList).map((key) => (
                  <section key={key}>
                    {sellList[key].length > 0 && (
                        <div className="mb-10">
                          <h3 className="uppercase text-xl text-center font-semibold mb-4">
                            Sell {key}
                          </h3>
                          <div
                              className={`overflow-y-auto absolute bottom-32 top-24 right-10 left-10`}
                          >
                            {sellList[key].map((item) => (
                                <SellItem
                                    key={item.tokenId}
                                    item_type={item.cardRarity || item.landType}
                                    nft={item}
                                    cancelSell={() => cancelItemSell(item.tokenId, key)}
                                    setItemPrice={setItemPrice}
                                    id={key}
                                />
                            ))}
                          </div>
                        </div>
                    )}
                  </section>
              ))}

              <div className="absolute bottom-10 text-center left-0 right-0">
                <Button title={sellBtnText()} noIcon onClick={sellMyItems}/>
              </div>
            </div>
        )}
      </>
  );
};
