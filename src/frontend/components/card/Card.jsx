import React, { useState } from "react";
import { FlipCard, CardInner } from "../../assets/styles/card";
import { FrontCard } from "./FrontCard";
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
      <FlipCard className={`${classMapping[size || "md"]}`}>
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
            />
          </CardInner>
        )}
      </FlipCard>

      <Popup
        title="Transfer NFT"
        popupVisible={transferPopupVisible}
        setPopupVisible={setTransferPopupVisible}
      >
        <div className="mt-2 h-52 px-6 flex flex-row">
          <FlipCard className={`${classMapping["sm"]}`}>
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
