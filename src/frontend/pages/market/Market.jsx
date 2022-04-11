import React, { useEffect, useState } from "react";
import {
  convertFromYocto,
  convertToTera,
  convertToYocto,
  rmFromMarket,
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

const START = 0;
const LIMIT = 10;

export const Market = ({ currentUser, contract }) => {
  const [isReady, setIsReady] = useState(false);
  const [items, setItems] = useState([]);
  const [active, setActive] = useState("Lands");

  const showMarket = async (name, contract_method) => {
    setIsReady(false);
    let items = await contract_method({
      start: START,
      limit: LIMIT,
    }).catch((err) => console.log(err));

    items = items?.map((item) => {
      item.salePrice = convertFromYocto(item.salePrice);
      return item;
    });

    setItems(items ?? []);
    setIsReady(true);
    setActive(name);
  };

  useEffect(() => {
    showMarket("Lands", contract.get_lands_from_market);
  }, []);

  const handleBuy = async (item) => {
    setIsReady(false);
    let GAS = convertToTera("100");
    let DEPOSIT = convertToYocto(item.salePrice);

    await contract
      .transfer_nft_on_market(
        {
          nftType: item.nftType,
          tokenId: item.tokenId,
        },
        GAS,
        DEPOSIT
      )
      .catch((err) => console.log(err));

    setIsReady(true);
  };

  return (
    <InnerPageWrapper>
      <Header currentUser={currentUser} />

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
                    showMarket("Lands", contract.get_lands_from_market),
                  active: active === "Lands",
                },
                {
                  title: "Zombies",
                  onClick: () =>
                    showMarket("Zombies", contract.get_zombies_from_market),
                  active: active === "Zombies",
                },
                {
                  title: "Monsters",
                  onClick: () =>
                    showMarket("Monsters", contract.get_monsters_from_market),
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
                        <>
                          {currentUser.accountId === item.ownerId ? (
                            <Card
                              nft={item}
                              key={index}
                              contract={contract}
                              currentUser={currentUser}
                              noMenu
                              rmFromMarket={async () => {
                                setIsReady(false);
                                await rmFromMarket(contract, item);
                                setIsReady(true);
                              }}
                            />
                          ) : (
                            <Card
                              nft={item}
                              key={index}
                              contract={contract}
                              currentUser={currentUser}
                              noMenu
                              handleBuy={() => handleBuy(item)}
                            />
                          )}
                        </>
                      ))}
                    </>
                  ) : (
                    <div>No {active} on sale.</div>
                  )}
                </List>
              ) : (
                <Loader />
              )}
            </ListWrapper>
          </div>
        </Container>
      </Wrapper>

      <Footer />
    </InnerPageWrapper>
  );
};
