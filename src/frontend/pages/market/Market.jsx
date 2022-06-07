import React, { useEffect, useState } from "react";
import {
  landTypeOptions,
  rarityOptions,
  transformCollections,
  transformLand,
  transformMonster,
  transformZombie,
} from "../../web3/utils";
import {
  Container,
  InnerPageWrapper,
  Wrapper,
  ListWrapper,
  List
} from "../../assets/styles/common.style";
import history from "../../assets/images/history.png";
import { MarketContent } from "../../web3/content";
import { InnerPageHead } from "../../components/InnerPageHead";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Loader } from "../../components/basic/Loader";
import { ButtonGroup } from "../../components/ButtonGroup";
import { Card } from "../../components/card/Card";
import { useDispatch, useSelector } from 'react-redux';
import { CardLand } from '../../components/card-land/CardLand';
import { removeLandFromMarket } from '../../web3/api';
import { useNavigate, useParams } from 'react-router-dom';
import { Pagination } from '../../components/Pagination';
import Dropdown from '../../components/basic/Dropdown';

import MarketHistoryPopup from './MarketHistoryPopup';

export const Market = () => {
  const { section } = useParams();
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user.user);


  const [isReady, setIsReady] = useState(false);
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterRarity, setFilterRarity] = useState(null);
  const [filterCollection, setFilterCollection] = useState(null);
  const [filterLandType, setFilterLandType] = useState(null);
  const [itemsCount, setItemsCount] = useState(0);
  const [allCollections, setAllCollections] = useState([]);
  const [marketHistoryVisible, setMarketHistoryVisible] = useState(false);

  const navigate = useNavigate();
  const PAGE_LIMIT = 20;

  const showMarket = async (currentSection, rarity, collection, landType, page = 1) => {
    setIsReady(false);

    let saleItems = [];
    let saleItemsCount = 0;
    const callContract = currentSection.slice(0, -1);
    const start_index = (page - 1) * PAGE_LIMIT;

    if (currentSection === "lands") {
      let lands = await window.contracts[callContract].getMarketItems(
        start_index,
        PAGE_LIMIT,
        landType || "",
      );
      saleItems = lands[1].filter(ln => ln.landType).map(land => transformLand(land));
      saleItemsCount = lands[0];
    } else if (currentSection === "zombies") {
      let zombies = await window.contracts[callContract].getMarketItems(
        start_index,
        PAGE_LIMIT,
        rarity || "",
        parseInt(collection) || 0,
      );
      saleItems = zombies[1].filter(zm => zm.nftType).map(zombie => transformZombie(zombie));
      saleItemsCount = zombies[0];
    } else {

    }

    // const saleResults = await window.contracts[getCurrentContract()].getMarketItems(
    //   start_index,
    //   PAGE_LIMIT,
    //   rarity || "",
    //   collection || ""
    // );
    // console.log(saleResults);
    //
    // let saleItems;
    // if (name === "Lands") {
    //   saleItems = saleResults[1].filter(item => item.nftType).map(item => transformLand(item));
    // } else if (name === "Zombies") {
    //   saleItems = saleResults[1].filter(item => item.nftType).map(item => transformZombie(item));
    // } else {
    //   saleItems = saleResults[1].filter(item => item.nftType).map(item => transformMonster(item));
    // }
    // console.log('saleItems', saleItems);

    setItems(saleItems);
    setItemsCount(parseInt(saleItemsCount));
    navigate(buildUrl(currentSection, rarity, collection, landType, page));
    setIsReady(true);
  };

  const getCurrentSection = () => {
    return section || "zombies";
  };

  useEffect(() => {
    if (isReady) {
      setCurrentPage(1);
      showMarket(getCurrentSection(), filterRarity, filterCollection, filterLandType, 1);
      navigate(buildUrl(getCurrentSection(), filterRarity, filterCollection, filterLandType, 1));
    }
  }, [filterRarity, filterCollection, filterLandType]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const page = JSON.parse(searchParams.has("page"))
      ? searchParams.get("page")
      : currentPage;
    const rarity = JSON.parse(searchParams.has("rarity"))
      ? searchParams.get("rarity")
      : filterRarity;
    const collection = JSON.parse(searchParams.has("collection"))
      ? searchParams.get("collection")
      : filterCollection;
    const landType = JSON.parse(searchParams.has("land_type"))
      ? searchParams.get("land_type")
      : filterRarity;

    setCurrentPage(page);
    setFilterRarity(rarity);
    setFilterCollection(collection);
    setFilterLandType(landType);

    fetchCollections();
    showMarket(getCurrentSection(), rarity, collection, landType, page);
  }, []);

  async function fetchCollections() {
    const collectionsObj = await window.contracts.collection.getAllCollections();
    const collections = collectionsObj[1].map((collection, index) => transformCollections(collection, index));
    setAllCollections(collections);
  }

  const collectionOptions = () => {
    const collections = Object.keys(allCollections).map((key) => {
      return {
        title: allCollections[key].title,
        onClick: () => setFilterCollection(key),
      };
    });
    return [
      {
        title: "All",
        onClick: () => setFilterCollection(null),
      },
      ...collections,
    ];
  };

  const buildUrl = (section, rarity, collection, landType, page = 1) => {
    let url = `/market/${section}?page=${page}`;
    if (section === "lands") {
      if (landType) url = `${url}&land_type=${landType}`;
    } else {
      if (rarity) url = `${url}&rarity=${rarity}`;
      if (collection) url = `${url}&collection=${collection}`;
    }
    return url;
  };

  const onPageChanged = (page) => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    setCurrentPage(page);
    if (isReady) {
      showMarket(getCurrentSection(), filterRarity, filterCollection, filterLandType, page);
    }
  };

  const resetFilters = () => {
    setCurrentPage(1);
    setFilterRarity(null);
    setFilterCollection(null);
    setFilterLandType(null);
  };


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

  const rmLandFromMarket = (tokenId) => {
    removeLandFromMarket(dispatch, tokenId).then(() => {
      showMarket(getCurrentSection(), null, null, filterLandType, currentPage);
    });
  }


  const isOwner = (nftOwner) => {
    return currentUser.accountId.toLowerCase() === nftOwner.toLowerCase();
  }

  return (
    <InnerPageWrapper>
      <Header />

      <Wrapper>
        <Container className="text-white text-center mt-6">
          <InnerPageHead
            title={MarketContent.title}
            description={MarketContent.description}
          />

          <div className="mb-10 w-full">
            <div className="md:flex justify-center relative z-20">

              <div className="flex justify-center align-middle items-center lg:w-1/3">
                <div className="flex align-middle items-center">
                  <div
                    className="flex px-3 justify-around items-center border-2 border-orange-500 rounded-lg
                      pt-0.5 h-12 w-32 cursor-pointer text-center hover:text-orange-400 transition"
                    onClick={() => setMarketHistoryVisible(true)}>
                    <img
                      src={history}
                      alt="Market History"
                      title="Market History"
                      className="h-7 mb-1"
                    />
                    <span className="inline-block font-semibold">History</span>
                  </div>

                  <div className="pt-1 ml-6">
                    <span>Total:</span>
                    <span className="ml-2 font-semibold text-orange-500">
                        {itemsCount} NFTs
                      </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center align-middle lg:w-1/3 my-5">
                <ButtonGroup
                  items={[
                    {
                      title: "Zombies",
                      onClick: () => {
                        showMarket("zombies");
                        resetFilters();
                      },
                      active: section === "zombies",
                    },
                    {
                      title: "Lands",
                      onClick: () => showMarket("lands"),
                      active: section === "lands",
                    },
                    {
                      title: "Monsters",
                      onClick: () => {
                        showMarket("monsters");
                        resetFilters();
                      },
                      active: section === "monsters",
                    },
                  ]}
                />
              </div>

              <div className="flex justify-end align-middle lg:w-1/3 my-5">
                <div className="flex z-10 justify-center md:text-right">
                  {
                    section === "lands" ? (
                      <div className="inline-block mx-3">
                        <Dropdown
                          title="Land Type"
                          selected={filterLandType}
                          options={landTypeOptions(setFilterLandType)}
                        />
                      </div>
                    ) : (
                      <>
                        <div className="inline-block mx-3">
                          <Dropdown
                            title="Rarity"
                            selected={filterRarity}
                            options={rarityOptions(setFilterRarity)}
                          />
                        </div>

                        <div className="inline-block">
                          <Dropdown
                            title="Collection"
                            selected={
                              filterCollection
                                ? allCollections[filterCollection]?.title
                                : null
                            }
                            options={collectionOptions()}
                          />
                        </div>
                      </>
                    )
                  }
                </div>
              </div>
            </div>

            <ListWrapper>
              {isReady ? (
                <>
                  <List>
                    {items.length > 0 ? (
                      <>
                        {section === "lands" ? (
                          <>
                            {items.map((item, index) => (
                              <div key={index}>
                                {isOwner(item.ownerId) ? (
                                  <CardLand
                                    nft={item}
                                    rmFromMarket={async () => {
                                      setIsReady(false);
                                      await rmLandFromMarket(item.tokenId);
                                      setIsReady(true);
                                    }}
                                  />
                                ) : (
                                  <CardLand
                                    nft={item}
                                    handleBuy={() => handleBuy(item)}
                                  />
                                )}
                              </div>
                            ))}
                          </>
                        ) : (
                          <>
                            {items.map((item, index) => (
                              <div key={index}>
                                {isOwner(item.ownerId) ? (
                                  <Card
                                    nft={item}
                                    rmFromMarket={async () => {
                                      setIsReady(false);
                                      // await rmFromMarket(contract, item);
                                      setIsReady(true);
                                    }}
                                  />
                                ) : (
                                  <Card
                                    nft={item}
                                    handleBuy={() => handleBuy(item)}
                                  />
                                )}
                              </div>
                            ))}
                          </>
                        )}
                      </>
                    ) : (
                      <div>No {section} on sale.</div>
                    )}
                  </List>

                  {(filterRarity || filterCollection || filterLandType) && (
                    <div className="mt-10">
                      <a
                        className="link cursor-pointer"
                        onClick={() => resetFilters()}
                      >
                        Reset Filters
                      </a>
                    </div>
                  )}

                  <Pagination
                    total={parseInt(itemsCount)}
                    limit={PAGE_LIMIT}
                    selectedPage={parseInt(currentPage)}
                    onPageChanged={onPageChanged}
                  />
                </>

              ) : (
                <Loader />
              )}
            </ListWrapper>
          </div>
        </Container>

        <MarketHistoryPopup
          marketHistoryVisible={marketHistoryVisible}
          setMarketHistoryVisible={setMarketHistoryVisible}
        />

      </Wrapper>

      <Footer />
    </InnerPageWrapper>
  );
};
