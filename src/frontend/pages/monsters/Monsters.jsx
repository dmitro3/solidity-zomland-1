import React, { useEffect, useState } from "react";
import { MonsterContent } from "../../web3/content";
import {
  rarityOptions,
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
import { useDispatch, useSelector } from 'react-redux';
import { addForSale, cleanupSaleList } from '../../store/marketSlice';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { removeFromMarket, transferNFT } from '../../web3/api';
import { addForKill, cleanupKillList } from '../../store/sidebarSlice';
import { TransferPopup } from '../../components/TransferPopup';
import { Api } from '../../db/api';

const PAGE_LIMIT = "20";

export const Monsters = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user.user);
  const sellList = useSelector(state => state.market.sale);
  const killList = useSelector(state => state.sidebar.kill);

  const [isReady, setIsReady] = useState(false);
  const [userMonsters, setUserMonsters] = useState([]);
  const [userMonstersCount, setUserMonstersCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterRarity, setFilterRarity] = useState("");
  const [transferItem, setTransferItem] = useState({});
  const [transferPopupVisible, setTransferPopupVisible] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const page = JSON.parse(searchParams.has("page"))
      ? searchParams.get("page")
      : currentPage;
    const rarity = JSON.parse(searchParams.has("rarity"))
      ? searchParams.get("rarity")
      : filterRarity;

    setCurrentPage(parseInt(page));
    setFilterRarity(rarity);

    fetchUserMonsters(page, filterRarity);
  }, [currentUser]);

  useEffect(() => {
    if (isReady) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setCurrentPage(1);
      fetchUserMonsters(1, filterRarity);
      navigate(buildUrl(1, filterRarity));
    }
  }, [filterRarity]);

  async function fetchUserMonsters(currentPage, rarity) {
    const startIndex = (currentPage - 1) * PAGE_LIMIT;
    const monstersObj = await window.contracts.monster.userMonsters(startIndex, PAGE_LIMIT, rarity || "");
    const monsters = monstersObj[1].filter(monster => monster.nftType).map(monster => transformMonster(monster));
    setUserMonstersCount(parseInt(monstersObj[0]));

    setUserMonsters(monsters);
    setIsReady(true);

    // update leaderboard
    if (!rarity) {
      let api = new Api();
      api.setUserLeaderboardCount(currentUser.accountId, 'monsters', parseInt(monstersObj[0]));
    }
  }

  const onPageChanged = (page) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentPage(page);
    fetchUserMonsters(page, filterRarity);
  };

  const buildUrl = (page, filterRarity) => {
    let url = `/monsters?page=${page}`;
    if (filterRarity) url = `${url}&rarity=${filterRarity}`;
    return url;
  };

  useEffect(() => {
    navigate(buildUrl(currentPage, filterRarity));
  }, [currentPage]);

  const handleTransfer = async (transferAddress) => {
    transferNFT(dispatch, currentUser, transferAddress, transferItem.tokenId, transferItem.nftType).then(() => {
      setIsReady(false);
      fetchUserMonsters(currentPage, filterRarity);
      setTransferPopupVisible(false);
    });
  };

  const rmFromMarket = (tokenId) => {
    removeFromMarket(dispatch, tokenId, "monster").then(() => {
      setIsReady(false);
      fetchUserMonsters(currentPage, filterRarity);
    });
  }

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

  const appendToKillList = async (monster) => {
    if (
      !killList["monsters"].filter((exist) => exist.tokenId === monster.tokenId).length
    ) {
      dispatch(addForKill({
        type: "monsters",
        item: monster
      }));
      dispatch(cleanupKillList({ type: "zombies" }));
    }
  };

  return (
    <InnerPageWrapper>
      <Header />

      <Wrapper>
        <Container className="text-white text-center mt-6">
          <InnerPageHead
            title={MonsterContent.title}
            description={MonsterContent.description}
          />

          {isReady ? (
            <>
              <div className="flex justify-between mt-8 z-30">
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
                      options={rarityOptions(setFilterRarity)}
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
                        setSellItems={() => appendToSellList(monster)}
                        rmFromMarket={async () => {
                          setIsReady(false);
                          await rmFromMarket(monster.tokenId);
                          setIsReady(true);
                        }}
                        setTransferPopupVisible={() => {
                          setTransferItem(monster);
                          setTransferPopupVisible(true);
                        }}
                        setKillItem={() => appendToKillList(monster)}
                      />
                    ))}
                  </List>
                ) : (
                  <div>
                    You don't have {filterRarity} Monsters.
                    {!filterRarity && (
                      <p>To get your first Monster you can complete <Link className="link" to="/collections">Collection</Link>{" "}
                        or buy it in the{" "}
                        <Link className="link" to="/market/monsters">Market</Link>.
                      </p>
                    )}
                  </div>
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
            <Loader />
          )}
        </Container>

        <TransferPopup
          nft={transferItem}
          popupVisible={transferPopupVisible}
          setPopupVisible={setTransferPopupVisible}
          handleTransfer={(transferAddress) => handleTransfer(transferAddress)}
        />

      </Wrapper>

      <Footer />
    </InnerPageWrapper>
  );
};
