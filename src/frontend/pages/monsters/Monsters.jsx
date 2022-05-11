import React, { useEffect, useState } from "react";
import { MonsterContent } from "../../web3/content";
import {
  addPendingTransaction,
  convertFromYocto,
  formatId,
  rmFromMarket,
  transformMonster,
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
import { useDispatch, useSelector } from 'react-redux';
import { addForSale, cleanupSaleList } from '../../store/marketSlice';

const PAGE_LIMIT = "10";

export const Monsters = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user.user);
  const sellList = useSelector(state => state.market.sale);

  const [isReady, setIsReady] = useState(false);
  const [userMonsters, setUserMonsters] = useState([]);
  const [userMonstersCount, setUserMonstersCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterRarity, setFilterRarity] = useState("");
  const [killItem, setKillItem] = useState(null);
  const [killPopupVisible, setKillPopupVisible] = useState(false);

  useEffect(() => {
    fetchUserMonsters(currentPage, filterRarity);
  }, [currentUser]);

  useEffect(() => {
    setCurrentPage(1);
    fetchUserMonsters(1, filterRarity);
  }, [filterRarity]);

  async function fetchUserMonsters(currentPage, rarity) {
    const startIndex = (currentPage - 1) * PAGE_LIMIT;
    setIsReady(false);

    const monstersObj = await window.contracts.monster.userMonsters(startIndex, PAGE_LIMIT, rarity || "");
    const monsters = monstersObj[1].filter(monster => monster.nftType).map(monster => transformMonster(monster));
    setUserMonstersCount(parseInt(monstersObj[0]));

    setUserMonsters(monsters);
    setIsReady(true);
  }

  const rarityOptions = () => {
    const result = [];
    const options = ["All Rarities", "Common", "Uncommon", "Rare", "Epic"];
    options.map(option => {
      result.push({
        title: option,
        onClick: () => {
          const optionValue = option === "All Rarities" ? "" : option;
          setFilterRarity(optionValue);
          handleRarityChange(optionValue);
        },
      })
    });

    return result;
  };

  const handleRarityChange = (filterRarity) => {
    setCurrentPage(1);
    fetchUserMonsters(1, filterRarity);
  }

  const onPageChanged = (page) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentPage(page);
    fetchUserMonsters(page, filterRarity);
  };

  const handleTransfer = async (monster, transferAddress) => {
    await window.contracts.monster.transferFrom(
      currentUser.accountId,
      transferAddress,
      monster.tokenId
    ).then(transaction => {
      addPendingTransaction(dispatch, transaction, "Transfer Monster NFT");
      transaction.wait().then(receipt => {
        if (receipt.status === 1) {
          setIsReady(false);
          fetchUserMonsters(currentPage, filterRarity);
        }
      });
    });
  };

  const showKillPopup = (item) => {
    setKillItem(item);
    setKillPopupVisible(true);
  };

  const handleKill = async () => {

  };

  const appendToSellList = (monster) => {
    if (
      !sellList["monsters"].filter((exist) => exist.tokenId === monster.tokenId).length
    ) {
      dispatch(addForSale({
        type: "monsters",
        item: monster
      }));
      dispatch(cleanupSaleList({ type: "lands" }));
      dispatch(cleanupSaleList({ type: "zombies" }));
    }
  };

  return (
    <InnerPageWrapper>
      <Header/>

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
                    {userMonstersCount} NFTs
                  </span>
                </div>

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
                {userMonsters.length > 0 ? (
                  <List>
                    {userMonsters.map((monster, index) => (
                      <Card
                        nft={monster}
                        key={index}
                        sellItems={sellList["monsters"]}
                        setSellItems={() => appendToSellList(monster)}
                        rmFromMarket={async () => {
                          setIsReady(false);
                          // await rmFromMarket(monsterContract, monster);
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
                  total={userMonstersCount}
                  limit={parseInt(PAGE_LIMIT)}
                  selectedPage={currentPage}
                  onPageChanged={onPageChanged}
                />
              </div>
            </>
          ) : (
            <Loader/>
          )}
        </Container>

        <Popup
          title="Kill Monster"
          popupVisible={killPopupVisible}
          setPopupVisible={setKillPopupVisible}
        >
          {killItem && (
            <div className="mt-2">
              <p className="mb-6">
                Monster{" "}
                <span className="text-xl font-semibold">
                  {formatId(killItem)}
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
                <Button title="Kill Monster" onClick={handleKill}/>
              </div>
            </div>
          )}
        </Popup>
      </Wrapper>

      <Footer/>
    </InnerPageWrapper>
  );
};
