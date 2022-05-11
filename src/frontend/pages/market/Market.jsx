import React, { useEffect, useState } from "react";
import {
  convertFromYocto,
  convertToYocto,
  rmFromMarket, transformLand, transformMonster, transformZombie,
} from "../../web3/utils";
import {
  Container,
  InnerPageWrapper,
  Wrapper,
} from "../../assets/styles/common.style";
import { List } from "../../assets/styles/common.style";
import { ListWrapper } from "../../assets/styles/common.style";
import { MarketContent } from "../../web3/content";
import { InnerPageHead } from "../../components/InnerPageHead";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Loader } from "../../components/basic/Loader";
import { ButtonGroup } from "../../components/ButtonGroup";
import { Card } from "../../components/card/Card";
import { useSelector } from 'react-redux';

const START = 0;
const LIMIT = 20;

export const Market = () => {
  const currentUser = useSelector(state => state.user.user);
  const [isReady, setIsReady] = useState(false);
  const [items, setItems] = useState([]);
  const [itemsCount, setItemsCount] = useState(0);
  const [active, setActive] = useState("Lands");

  const showMarket = async (name) => {
    setIsReady(false);
    let saleResults;
    let saleItems;

    if (name === "Lands") {
      saleResults = await window.contracts.land.getMarketItems(START, LIMIT);
      saleItems = saleResults[1].filter(item => item.nftType).map(item => transformLand(item));
    } else if (name === "Zombies") {
      saleResults = await window.contracts.zombie.getMarketItems(START, LIMIT);
      saleItems = saleResults[1].filter(item => item.nftType).map(item => transformZombie(item));
    } else {
      saleResults = await window.contracts.monster.getMarketItems(START, LIMIT);
      saleItems = saleResults[1].filter(item => item.nftType).map(item => transformMonster(item));
    }

    setItems(saleItems);
    setItemsCount(saleResults[0]);
    setIsReady(true);
    setActive(name);
  };

  useEffect(() => {
    showMarket("Lands");
  }, []);

  const handleBuy = async (item) => {
    setIsReady(false);
    // let GAS = convertToTera("100");
    // let DEPOSIT = convertToYocto(item.salePrice);
    //
    // await contract
    //   .transfer_nft_on_market(
    //     {
    //       nftType: item.nftType,
    //       tokenId: item.tokenId,
    //     },
    //     GAS,
    //     DEPOSIT
    //   )
    //   .catch((err) => console.log(err));

    setIsReady(true);
  };

  const isOwner = (nftOwner) => {
    return currentUser.accountId.toLowerCase() === nftOwner.toLowerCase();
  }

  return (
    <InnerPageWrapper>
      <Header/>

      <Wrapper>
        <Container className="text-white text-center mt-6">
          <InnerPageHead
            title={MarketContent.title}
            description={MarketContent.description}
          />
          <div className="mb-10 w-full">
            <ButtonGroup
              items={[
                {
                  title: "Lands",
                  onClick: () =>
                    showMarket("Lands"),
                  active: active === "Lands",
                },
                {
                  title: "Zombies",
                  onClick: () =>
                    showMarket("Zombies"),
                  active: active === "Zombies",
                },
                {
                  title: "Monsters",
                  onClick: () =>
                    showMarket("Monsters"),
                  active: active === "Monsters",
                },
              ]}
            />

            <ListWrapper>
              {isReady ? (
                <List>
                  {items.length > 0 ? (
                    <>
                      {items.map((item, index) => (
                        <div key={index}>
                          {isOwner(item.ownerId) ? (
                            <Card
                              nft={item}
                              noMenu
                              rmFromMarket={async () => {
                                setIsReady(false);
                                // await rmFromMarket(contract, item);
                                setIsReady(true);
                              }}
                            />
                          ) : (
                            <Card
                              nft={item}
                              currentUser={currentUser}
                              noMenu
                              handleBuy={() => handleBuy(item)}
                            />
                          )}
                        </div>
                      ))}
                    </>
                  ) : (
                    <div>No {active} on sale.</div>
                  )}
                </List>
              ) : (
                <Loader/>
              )}
            </ListWrapper>
          </div>
        </Container>
      </Wrapper>

      <Footer/>
    </InnerPageWrapper>
  );
};
