import React, { useState } from "react";
import { ChevronDoubleRightIcon } from "@heroicons/react/outline";
import { addPendingTransaction, addTransactionError, convertFromYocto, convertToYocto } from "../../web3/utils";
import { Button } from "../basic/Button";
import { SellItem } from "./SellItem";
import { useDispatch, useSelector } from 'react-redux';
import { changePrice, cleanupSaleList, removeFromSale } from '../../store/marketSlice';
import { KillItem } from './KillItem';
import { cleanupKillList, removeFromKill } from '../../store/sidebarSlice';
import { updateUserBalance } from '../../web3/api';
import { Loader } from '../basic/Loader';

export const Sidebar = ({
  isOpen,
  setIsOpen,
}) => {
  const dispatch = useDispatch();
  const sellList = useSelector(state => state.market.sale);
  const killList = useSelector(state => state.sidebar.kill);
  const currentUser = useSelector(state => state.user.user);
  const [isLoading, setIsLoading] = useState(false);

  const cancelItemSell = (tokenId, type) => {
    dispatch(removeFromSale({
      type,
      tokenId
    }));
  };

  const setItemPrice = (nft, price, type) => {
    dispatch(changePrice({
      type,
      price,
      tokenId: nft.tokenId,
    }))
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
        handleSellItems(sellObject, "zombie");
      } else {
        alert("Please, provide sale price for all Zombies");
      }
    } else if (sellList["lands"].length) {
      const [isError, sellObject] = createSaleObject(sellList["lands"]);
      if (!isError) {
        handleSellItems(sellObject, "land");
      } else {
        alert("Please, provide sale price for all Lands");
      }
    } else if (sellList["monsters"].length) {
      const [isError, sellObject] = createSaleObject(sellList["monsters"]);
      if (!isError) {
        handleSellItems(sellObject, "monster");
      } else {
        alert("Please, provide sale price for all Monsters");
      }
    }
  };

  const handleSellItems = async (sellObject, nftType) => {
    setIsLoading(true);
    await window.contracts.market.publishOnMarket(
      Object.keys(sellObject),
      Object.values(sellObject),
      nftType
    ).then(transaction => {
      addPendingTransaction(dispatch, transaction, `Sell ${nftType}s`);
      dispatch(cleanupSaleList({ type: `${nftType}s` }));

      transaction.wait().then(receipt => {
        if (receipt.status === 1) {
          // Todo: Replace it to update component
          document.location.reload();
        }
      });
    });
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

  const killMyItems = () => {
    if (killList["zombies"].length) {
      let idList = killList["zombies"].map(item => item.tokenId);
      handleKillItems(idList, "zombie");
    } else if (killList["monsters"].length) {
      let idList = killList["monsters"].map(item => item.tokenId);
      handleKillItems(idList, "monster");
    }
  };

  const cancelItemKill = (tokenId, type) => {
    dispatch(removeFromKill({
      type,
      tokenId
    }));
  };

  const killBtnText = () => {
    let total = 0;
    if (killList["zombies"].length > 0) {
      killList["zombies"].map(zombie => total += parseFloat(zombie.killTokens))
    } else {
      killList["monsters"].map(zombie => total += parseFloat(zombie.killTokens))
    }
    return `Kill to get ${convertFromYocto(total)} ZML`;
  };

  const handleKillItems = async (killObject, nftType) => {
    setIsLoading(true);
    await window.contracts[nftType].killNftList(killObject).then(transaction => {
      addPendingTransaction(dispatch, transaction, `Kill ${nftType}s to get ZML tokens`);
      dispatch(cleanupKillList({ type: `${nftType}s` }));
      setIsLoading(false);

      transaction.wait().then(async receipt => {
        if (receipt.status === 1) {
          // Update user balance
          await updateUserBalance(dispatch, currentUser.accountId);
        } else {
          alert('Kill error');
        }
      });
    }).catch(err => {
      addTransactionError(dispatch, err.message);
      setIsLoading(false);
    });
  };

  const isSidebarEnabled = () => {
    return isSellEnabled() || isKillEnabled();
  };

  const isSellEnabled = () => sellList["zombies"].length > 0 || sellList["monsters"].length > 0 || sellList["lands"].length > 0;

  const isKillEnabled = () => killList["zombies"].length > 0 || killList["monsters"].length > 0;


  return (
    <>
      {isSidebarEnabled() && (
        <div
          className={`top-0 right-0 fixed w-[300px] sm:w-[350px] h-full px-2 py-6 sm:p-10 ease-in-out duration-300 bg-gray-800 z-50 
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
            <ChevronDoubleRightIcon className="w-5 h-6 font-semibold" />
          </div>

          {isSellEnabled() && (
            <>
              {Object.keys(sellList).map((key) => (
                <section key={key}>
                  {sellList[key].length > 0 && (
                    <div className="mb-10">
                      <h3 className="uppercase text-lg text-center font-semibold mb-4">
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
                {!isLoading ? (
                  <Button title={sellBtnText()} noIcon onClick={sellMyItems} />
                ) : (
                  <Loader />
                )}
              </div>
            </>
          )}

          {isKillEnabled() && (
            <>
              {Object.keys(killList).map((key) => (
                <section key={key}>
                  {killList[key].length > 0 && (
                    <div className="mb-10">
                      <h3 className="uppercase text-xl text-center font-semibold mb-4">
                        Kill {key}
                      </h3>
                      <div
                        className={`overflow-y-auto absolute bottom-32 top-24 right-10 left-10`}
                      >
                        {killList[key].map((item) => (
                          <KillItem
                            key={item.tokenId}
                            item_type={item.cardRarity || item.landType}
                            nft={item}
                            cancelKill={() => cancelItemKill(item.tokenId, key)}
                            id={key}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              ))}

              <div className="absolute bottom-10 text-center left-0 right-0">
                {!isLoading ? (
                  <Button title={killBtnText()} noIcon onClick={killMyItems} />
                ) : (
                  <Loader />
                )}
              </div>

            </>
          )}
        </div>
      )}
    </>
  );
};
