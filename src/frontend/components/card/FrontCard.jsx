import React from "react";
import { getMedia, formatId } from "../../web3/utils";
import { CardFront, InfoWrapper, Rarity } from "../../assets/styles/card";
import { Price } from "../Price";
import { CardDropdown } from "./CardDropdown";
import { Button } from "../basic/Button";

import attack_icon from "../../assets/images/attack_icon.png";
import health_icon from "../../assets/images/health_icon.png";
import intelect_icon from "../../assets/images/intelect_icon.png";
import { Col, Row } from "../../assets/styles/common.style";

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
  const type = nft.landType ?? nft.cardRarity;

  const CharacteristicRow = ({ icon, title, value }) => (
    <Row>
      <div className="flex h-9 w-9 p-1.5 border-violet-500 rounded-full border-2 text-center justify-center">
        <img alt="icon" className="h-full" src={icon}/>
      </div>
      <div className="mx-3 h-7 w-1 bg-violet-800/80"/>
      <Col className="text-left text-xl">
        <div className="text-violet-500 text-xs uppercase">{title}</div>
        {value}
      </Col>
    </Row>
  );

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
            <Price title={nft.salePrice}/>
          )}

          {nft.tokenId && !noMenu && !nft.salePrice ? (
            <CardDropdown
              setTransferPopupVisible={setTransferPopupVisible}
              setSellItems={setSellItems}
              setKillItem={setKillItem}
              rmFromMarket={rmFromMarket}
            />
          ) : (
            handleBuy && (
              <Rarity type={type} className="text-sm p-1">
                <span>#{formatId(nft.tokenId)}</span>
              </Rarity>
            )
          )}
        </div>
      </div>
      {nft.tokenId && (
        <>
          {size === "sm" || nft.nftType === "Land" ? (
            <div
              className="absolute flex font-semibold drop-shadow-md items-center justify-center bg-main/60 py-2 rounded-md w-full bottom-0 text-base">
              <div>#{formatId(nft.tokenId)}</div>
            </div>
          ) : (
            <InfoWrapper withBtn={handleBuy || nft.salePrice}>
              <Row className="items-center">
                <Col className="gap-1 my-2">
                  <div className="mb-2">#{formatId(nft.tokenId)}</div>
                  <CharacteristicRow
                    icon={attack_icon}
                    title="Attack"
                    value={nft.attack}
                  />
                  <CharacteristicRow
                    icon={health_icon}
                    title="Health"
                    value={nft.health}
                  />
                  <CharacteristicRow
                    icon={intelect_icon}
                    title="Brain"
                    value={nft.brain}
                  />
                  <Row>
                    {handleBuy ? (
                      <Button
                        title={
                          <>
                            <span className="mr-1">Buy for</span>
                            {nft.salePrice} NEAR
                          </>
                        }
                        size="xs"
                        noIcon
                        onClick={handleBuy}
                      />
                    ) : (
                      nft.salePrice && (
                        <Button
                          title="Remove from Market"
                          size="xs"
                          noIcon
                          secondary
                          onClick={rmFromMarket}
                        />
                      )
                    )}
                  </Row>
                </Col>
              </Row>
            </InfoWrapper>
          )}
        </>
      )}
    </CardFront>
  );
};
