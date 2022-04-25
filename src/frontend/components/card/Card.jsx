import React, { useState } from "react";
import { FlipCard, CardInner, CardBack } from "../../assets/styles/card";
import { FrontCard } from "./FrontCard";
import { BackCard } from "./BackCard";
import { Popup } from "../Popup";
import { Button } from "../basic/Button";

export const Card = ({
  nft,
  noMenu,
  size,
  setSellItems,
  handleTransfer,
  setKillItem,
  rmFromMarket,
  handleBuy,
}) => {
  const [transferPopupVisible, setTransferPopupVisible] = useState(false);
  const [transferAddress, setTransferAddress] = useState("");

  const classMapping = {
    xsm: "x-small",
    sm: "small",
    md: "",
  };

  return (
    <>
      <FlipCard noFlip={true} className={`${classMapping[size || "md"]}`}>
        {nft && (
          <CardInner>
            <FrontCard
              nft={nft}
              size={size}
              noMenu={noMenu}
              setSellItems={setSellItems}
              setTransferPopupVisible={setTransferPopupVisible}
              setKillItem={setKillItem}
              rmFromMarket={rmFromMarket}
              handleBuy={handleBuy}
              // setSellPopupVisible={setSellPopupVisible}
            />
            {/*<BackCard nft={nft} size={size} />*/}

            {/* <CardBack className="relative">
            <img
              className={`absolute ${sm ? "h-40" : "h-80"}`}
              src={getMedia(
                "bafkreifdecdvospry7lmu6e3wzb5pgqj4e7shxgtwqwltj4brwxge7dipm"
              )}
              alt={nft.tokenId ? formatId(nft) : ""}
            />
            <div className="absolute flex flex-col h-full w-full justify-center items-center">
              {nft.salePrice && (
                <>
                  <div className="flex text-4xl items-center font-semibold mb-5 mt-2">
                    <img className="h-8 mr-2" src={near_logo} alt="near logo" />
                    {nft.salePrice}
                  </div>
                </>
              )}

              <div className="font-semibold text-purple-600">
                {nft.cardRarity || nft.landType}
              </div>

              <div className="text-4xl font-semibold text-purple-600">
                {nft.tokenId ? formatId(nft) : ""}
              </div>

              {nft.health && nft.attack && nft.brain && (
                <div className="mt-6">
                  <p>Health: {nft.health}</p>
                  <p>Attack: {nft.attack}</p>
                  <p>Intellect: {nft.brain}</p>
                </div>
              )}

              {sellItems && setSellItems && (
                <div className="mt-5 flex flex-col h-24 justify-between">
                  <Button
                    onClick={() => setTransferPopupVisible(true)}
                    dark
                    title="Transfer"
                  />
                  <Button
                    onClick={() => setSellPopupVisible(true)}
                    icon={<ShoppingCartIcon className="h-5 ml-1" />}
                    title="Sell"
                  />
                </div>
              )}

              {handleBuy && (
                <div className="mt-5">
                  <Button
                    onClick={handleBuy}
                    icon={<ShoppingCartIcon className="h-5 ml-1" />}
                    title="Buy"
                  />
                </div>
              )}
            </div>
          </CardBack> */}
          </CardInner>
        )}
      </FlipCard>

      <Popup
        title="Transfer NFT"
        popupVisible={transferPopupVisible}
        setPopupVisible={setTransferPopupVisible}
      >
        <div className="mt-2 h-52 px-6 flex flex-row">
          <FlipCard noFlip={true} className={`${classMapping["sm"]}`}>
            <FrontCard nft={nft} noMenu size="sm"/>
          </FlipCard>
          <div className="ml-10 text-left">
            <p className="mb-6 mt-6">
              You can transfer this NFT to any {process.env.TOKEN_NAME} account.
            </p>
            <p className="mb-3">
              <input
                type="text"
                className="px-4 py-2 w-full rounded-md bg-transparent border-indigo-500 text-indigo-100 border-2"
                placeholder={`${process.env.TOKEN_NAME} Address`}
                value={transferAddress}
                onChange={(e) => setTransferAddress(e.target.value)}
              />
            </p>
            <Button
              title="Transfer"
              onClick={() => handleTransfer(transferAddress)}
            />
          </div>
        </div>
      </Popup>
    </>
  );
};
