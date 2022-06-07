import React, { useEffect, useState } from "react";
import { Popup } from "../../components/Popup";
import { Loader } from '../../components/basic/Loader';
import { Card } from '../../components/card/Card';

export default function MarketHistoryPopup({
  marketHistoryVisible,
  setMarketHistoryVisible,
}) {
  const [zombiesById, setZombiesById] = useState({});
  const [monstersById, setMonstersById] = useState({});
  const [marketHistory, setMarketHistory] = useState([]);
  const [isReady, setIsReady] = useState(false);

  const loadMarketHistory = async () => {
    console.log('loadMarketHistory')
    // let history = await window.contract.get_last_market_history();
    // let zombiesList = history.filter(item => item.nft_type === "Zombie").map(item => item.token_id);
    // let monstersList = history.filter(item => item.nft_type === "Monster").map(item => item.token_id);
    //
    // let zombiesPromise = new Promise(async (resolve) => {
    //   let result = await window.contract.get_zombies_by_id({
    //     id_list: zombiesList
    //   });
    //   resolve(result);
    // });
    // let monstersPromise = new Promise(async (resolve) => {
    //   let result = await window.contract.get_monsters_by_id({
    //     id_list: monstersList
    //   });
    //   resolve(result);
    // });
    // Promise.all([zombiesPromise, monstersPromise]).then(result => {
    //   let zombies = {};
    //   result[0].map(zombie => {
    //     zombies[zombie.token_id] = zombie;
    //   });
    //   setZombiesById(zombies);
    //
    //   let monsters = {};
    //   result[1].map(monster => {
    //     monsters[monster.token_id] = monster;
    //   });
    //   setMonstersById(monsters);
    //
    //   setMarketHistory(history.reverse());
    //   setIsReady(true);
    // });
  }

  const timestampToDate = (timestamp) => {
    const seconds = timestamp / 1000;
    const dateTime = new Date(seconds);
    const options = { month: "long", day: "numeric", hour: 'numeric', minute: 'numeric', hourCycle: 'h23' };
    return new Intl.DateTimeFormat('en-US', options).format(dateTime);
  }

  useEffect(() => {
    if (marketHistoryVisible) {
      loadMarketHistory();
    }
  }, [marketHistoryVisible]);

  return (
    <Popup
      title="Market History - Last Trades"
      popupVisible={marketHistoryVisible}
      setPopupVisible={setMarketHistoryVisible}
      width="lg:w-[840px]"
    >
      <div className="mt-2 text-left">
        {
          isReady ?
            (
              <div className="text-sm">
                <div
                  className="flex flex-row justify-between border-b border-sky-200 text-sky-200 opacity-70 font-semibold py-2 mb-1">
                  <div className="w-14 text-center">Card</div>
                  <div className="w-1/6">Date</div>
                  <div className="w-1/6">NFT</div>
                  <div className="w-24">Price</div>
                  <div className="w-1/6">Seller</div>
                  <div className="w-1/6">Buyer</div>
                </div>

                {
                  marketHistory.map(item => (
                    <div key={item.timestamp} className="flex flex-row justify-between py-1">
                      <div className="w-14">
                        {
                          item.nft_type === "Zombie" && (
                            zombiesById[item.token_id] ? (
                              <div style={{ zoom: "0.4" }}>
                                <Card nft={zombiesById[item.token_id]} size="sm" noMenu />
                              </div>
                            ) : (
                              <div className="text-sm opacity-70 h-20 pt-4">Zombie Killed</div>
                            )
                          )
                        }
                        {
                          item.nft_type === "Monster" && (
                            monstersById[item.token_id] ? (
                              <div style={{ zoom: "0.4" }}>
                                <Card nft={monstersById[item.token_id]} size="sm" noMenu />
                              </div>
                            ) : (
                              <div className="text-sm opacity-70 h-20 pt-4">Monster Killed</div>
                            )
                          )
                        }
                      </div>
                      <div className="w-1/6">
                        <p className="pt-6">
                          {timestampToDate(item.timestamp)}
                        </p>
                      </div>
                      <div className="w-1/6">
                        <p className="pt-6">
                          {formatTitle(item.token_id)}
                        </p>
                      </div>
                      <div className="w-24">
                        <p className="pt-6">
                          <b>{convertFromYocto(item.price, 2)} NEAR</b>
                        </p>
                      </div>
                      <div className="w-1/6">
                        <p className="w-32 pt-6 overflow-hidden text-ellipsis">
                          {item.from_user}
                        </p>
                      </div>
                      <div className="w-1/6">
                        <p className="w-32 pt-6 overflow-hidden text-ellipsis">
                          {item.to_user}
                        </p>
                      </div>
                    </div>
                  ))
                }
              </div>
            ) : (
              <Loader />
            )
        }
        {/*{userLands.map((land) => (*/}
        {/*  <div className="flex sm:gap-4 mb-3" key={land.token_id}>*/}
        {/*    <div className="hidden sm:flex">*/}
        {/*      <img src={getMedia(land.media)} alt="land" width="40" />*/}
        {/*    </div>*/}
        {/*    <div className="basis-1/3 sm:pt-4 pt-2 font-semibold">*/}
        {/*      {formatLandId(land.land_type, land.token_id)}*/}
        {/*    </div>*/}
        {/*    <div className="basis-1/4 pt-4 hidden sm:flex">*/}
        {/*      {availabilityMap[land.land_type]}*/}
        {/*    </div>*/}
        {/*    <div className="grow text-right">*/}
        {/*      {timeDiff(land.last_zombie_claim) < 0 ? (*/}
        {/*        <div className="pt-1">*/}
        {/*          <Button*/}
        {/*            title="Mint Zombies"*/}
        {/*            size="sm"*/}
        {/*            secondary*/}
        {/*            onClick={() => handleMint(land.token_id, land.land_type)}*/}
        {/*          />*/}
        {/*        </div>*/}
        {/*      ) : (*/}
        {/*        <div>*/}
        {/*          {timeDiff(land.last_zombie_claim) < 86400 && (*/}
        {/*            <p className="text-red-300 text-center pl-7 text-base pt-2 leading-4 font-[Exo]">*/}
        {/*              <small>Next mint:</small>*/}
        {/*              <br />*/}
        {/*              <small>*/}
        {/*                {secondsToString(timeDiff(land.last_zombie_claim))}*/}
        {/*              </small>*/}
        {/*            </p>*/}
        {/*          )}*/}
        {/*        </div>*/}
        {/*      )}*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*))}*/}
      </div>
    </Popup>
  );
}
