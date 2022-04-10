import React from "react";
import { getMedia, formatId } from "../../near/utils";
import { CardFront, Rarity } from "../../assets/styles/card";
import { Price } from "../Price";
import { CardDropdown } from "./CardDropdown";
import { Button } from "../basic/Button";

export const FrontCard = ({
  nft,
  size,
  noMenu,
  setSellItems,
  setTransferPopupVisible,
  setKillItem,
  rmFromMarket,
  handleBuy,
}) => {
  const type = nft.land_type ?? nft.card_rarity;

  return (
    <CardFront type={type}>
      <img
        className={`absolute max-w-full ${
          size !== "sm" ? "h-80" : "h-[11.9rem] rounded-lg"
        }`}
        src={getMedia(nft.media)}
        alt={nft.tokenId ? nft.tokenId : ""}
      />
      <div className="absolute flex w-full">
        <div className="flex w-full p-2 items-center justify-between">
          <Rarity
            type={type}
            className={`${size !== "sm" ? "text-sm pl-2" : "text-xs pl-1"}`}
          >
            {type}
          </Rarity>

          {nft.salePrice && size !== "sm" && !handleBuy && (
            <Price title={nft.salePrice} />
          )}
        </div>
      </div>
      {nft.tokenId && (
        <div
          className={`absolute flex font-semibold drop-shadow-md justify-center bg-main/60 py-2 rounded-md w-full bottom-0 ${
            size === "sm" ? "text-base pb-1" : "text-xl pb-2"
          }`}
        >
          <>#{formatId(nft.tokenId)}</>
        </div>
      )}
    </CardFront>
  );
};
