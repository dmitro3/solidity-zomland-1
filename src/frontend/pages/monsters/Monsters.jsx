import React, { useEffect, useState } from "react";
import { MonsterContent } from "../../web3/content";
import {
  convertFromYocto,
  formatId,
  rmFromMarket,
} from "../../web3/utils";
import {
  Container,
  InnerPageWrapper,
  Wrapper,
} from "../../assets/styles/common.style";
import { List } from "../../assets/styles/common.style";
import { ListWrapper } from "../../assets/styles/common.style";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { InnerPageHead } from "../../components/InnerPageHead";
import { Card } from "../../components/card/Card";
import { Loader } from "../../components/basic/Loader";
import Dropdown from "../../components/basic/Dropdown";
import { Pagination } from "../../components/Pagination";
import { Button } from "../../components/basic/Button";
import { Popup } from "../../components/Popup";

const PAGE_LIMIT = "10";

export const Monsters = ({ currentUser, monsterContract, sellList, setSellList }) => {
  const [isReady, setIsReady] = useState(false);
  const [userMonsters, setUserMonsters] = useState([0, []]); // [<count>, [<arrayOfMonsters>]]
  const [currentPage, setCurrentPage] = useState(1);
  const [filterRarity, setFilterRarity] = useState(null);
  const [killItem, setKillItem] = useState(null);
  const [killPopupVisible, setKillPopupVisible] = useState(false);

  async function fetchUserMonsters(currentPage) {
    // let requestParams = {
    //   account_id: currentUser.accountId,
    //   page_num: currentPage.toString(),
    //   page_limit: PAGE_LIMIT,
    // };
    // if (filterRarity) {
    //   requestParams["filter_rarity"] = filterRarity;
    // }
    // let monsters = await contract.user_monsters(requestParams);

    // Convert price from Yocto NEAR
    // monsters[1] = monsters[1].map((mn) => {
    //   if (mn.salePrice) {
    //     mn.salePrice = convertFromYocto(mn.salePrice);
    //   }
    //   return mn;
    // });

    // setUserMonsters(monsters);
    setIsReady(true);
  }

  useEffect(() => {
    fetchUserMonsters(currentPage);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    fetchUserMonsters(1);
  }, [filterRarity]);

  const rarityOptions = () => {
    return [
      {
        title: "All",
        onClick: () => setFilterRarity(null),
      },
      {
        title: "Common",
        onClick: () => setFilterRarity("Common"),
      },
      {
        title: "Uncommon",
        onClick: () => setFilterRarity("Uncommon"),
      },
      {
        title: "Rare",
        onClick: () => setFilterRarity("Rare"),
      },
      {
        title: "Epic",
        onClick: () => setFilterRarity("Epic"),
      },
    ];
  };

  const onPageChanged = (page) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentPage(page);
    fetchUserMonsters(page);
  };

  const handleTransfer = async (monster, transferAddress) => {
    // let gas = convertToTera("60");
    // await contract.transfer_monster(
    //   {
    //     tokenId: monster.tokenId,
    //     recipient_id: transferAddress,
    //   },
    //   gas,
    //   1
    // );
  };

  const showKillPopup = (item) => {
    setKillItem(item);
    setKillPopupVisible(true);
  };

  const handleKill = async () => {
    // let gas = convertToTera("90");
    // await contract.kill_monster(
    //   {
    //     monster_id: killItem.tokenId,
    //   },
    //   gas,
    //   1
    // );
  };

  const appendToSellList = (monster) => {
    if (
      !sellList["zombies"].filter(
        (exist) => exist.tokenId === monster.tokenId
      ).length
    ) {
      sellList["monsters"].push(monster);
      sellList["lands"] = sellList["zombies"] = [];
      setSellList({ ...sellList });
    }
  };

  return (
    <InnerPageWrapper>
      <Header currentUser={currentUser} />

      <Wrapper>
        <Container className="text-white text-center mt-6">
          <InnerPageHead
            title={MonsterContent.title}
            description={MonsterContent.description}
          />

          {isReady ? (
            <>
              <div className="flex justify-between mt-8">
                <div className="basis-1/2 text-lg text-left pt-2 pl-1">
                  Available:
                  <span className="ml-2 font-semibold text-orange-500">
                    {userMonsters[0]} NFTs
                  </span>
                </div>
                {/*<Button*/}
                {/*  title={`Mint ${*/}
                {/*    userClaimCount > 0 ? userClaimCount : ""*/}
                {/*  } Monster${userClaimCount !== 1 ? "s" : ""}`}*/}
                {/*  size="lg"*/}
                {/*  noIcon*/}
                {/*  disabled={userClaimCount === 0}*/}
                {/*  onClick={showMintMonstersBlock}*/}
                {/*/>*/}
                <div className="basis-1/2 z-10 text-right">
                  <div className="inline-block mr-1">
                    <Dropdown
                      title="Rarity"
                      selected={filterRarity}
                      options={rarityOptions()}
                    />
                  </div>
                </div>
              </div>

              <ListWrapper>
                {userMonsters[0] > 0 ? (
                  <List>
                    {userMonsters[1]?.map((monster, index) => (
                      <Card
                        nft={monster}
                        key={index}
                        sellItems={sellList["monsters"]}
                        setSellItems={() => appendToSellList(monster)}
                        rmFromMarket={async () => {
                          setIsReady(false);
                          await rmFromMarket(monsterContract, monster);
                          setIsReady(true);
                        }}
                        handleTransfer={(transferAddress) =>
                          handleTransfer(monster, transferAddress)
                        }
                        setKillItem={() => showKillPopup(monster)}
                      />
                    ))}
                  </List>
                ) : (
                  <div>You don't have {filterRarity} Monsters.</div>
                )}
              </ListWrapper>

              <div className="mb-8">
                <Pagination
                  total={parseInt(userMonsters[0])}
                  limit={parseInt(PAGE_LIMIT)}
                  selectedPage={currentPage}
                  onPageChanged={onPageChanged}
                />
              </div>
            </>
          ) : (
            <Loader />
          )}
        </Container>

        <Popup
          title="Kill Zombie"
          popupVisible={killPopupVisible}
          setPopupVisible={setKillPopupVisible}
        >
          {killItem && (
            <div className="mt-2">
              <p className="mb-6">
                Monster{" "}
                <span className="text-xl font-semibold">
                  #{formatId(killItem.tokenId)}
                </span>{" "}
                will be killed and you will receive{" "}
                <span className="text-xl font-semibold">
                  {convertFromYocto(killItem.kill_tokens)} ZML
                </span>{" "}
                tokens.
              </p>

              <div className="mr-3 inline-block">
                <Button
                  title="Cancel"
                  secondary
                  noIcon
                  onClick={() => setKillPopupVisible(false)}
                />
              </div>
              <div className="inline-block">
                <Button title="Kill Monster" onClick={handleKill} />
              </div>
            </div>
          )}
        </Popup>
      </Wrapper>

      <Footer />
    </InnerPageWrapper>
  );
};
