import React, { useEffect, useState } from "react";
import { Popup } from "../../components/Popup";
import { Loader } from '../../components/basic/Loader';
import { Card } from '../../components/card/Card';
import { formatId, formatLandId, transformLand, transformMarketHistory, transformMonster, transformZombie } from '../../web3/utils';
import { CardLand } from '../../components/card-land/CardLand';

export default function MarketHistoryPopup({
  marketHistoryVisible,
  setMarketHistoryVisible,
}) {
  const [zombiesById, setZombiesById] = useState({});
  const [monstersById, setMonstersById] = useState({});
  const [landsById, setLandsById] = useState({});
  const [marketHistory, setMarketHistory] = useState([]);
  const [isReady, setIsReady] = useState(false);

  const loadMarketHistory = async () => {
    const historyObject = await window.contracts.market.getSaleHistory();
    let history = historyObject[1].filter(history => history.nftType).map(history => transformMarketHistory(history));
    const sliceIndex = parseInt(historyObject[0]);
    history = history.slice(sliceIndex).concat(history.slice(0, sliceIndex))

    console.log('sliceIndex', sliceIndex);

    let zombiesList = history.filter(item => item.nftType === "zombie").map(item => item.tokenId);
    let monstersList = history.filter(item => item.nftType === "monster").map(item => item.tokenId);
    let landsList = history.filter(item => item.nftType === "land").map(item => item.tokenId);

    let zombiesPromise = new Promise(async (resolve) => {
      let result = await window.contracts.zombie.getListById(zombiesList);
      resolve(result);
    });
    let monstersPromise = new Promise(async (resolve) => {
      let result = await window.contracts.monster.getListById(monstersList);
      resolve(result);
    });
    let landsPromise = new Promise(async (resolve) => {
      let result = await window.contracts.land.getListById(landsList);
      resolve(result);
    });

    Promise.all([zombiesPromise, monstersPromise, landsPromise]).then(result => {
      let zombies = {};
      result[0].map(zombie => {
        zombies[parseInt(zombie.tokenId)] = transformZombie(zombie);
      });
      setZombiesById(zombies);

      let monsters = {};
      result[1].map(monster => {
        monsters[parseInt(monster.tokenId)] = transformMonster(monster);
      });
      setMonstersById(monsters);

      let lands = {};
      result[2].map(land => {
        lands[parseInt(land.tokenId)] = transformLand(land);
      });
      setLandsById(lands);

      setMarketHistory(history.reverse());
      setIsReady(true);
    });
  }

  const timestampToDate = (timestamp) => {
    const dateTime = new Date(timestamp * 1000);
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
                          item.nftType === "zombie" && (
                            zombiesById[item.tokenId] ? (
                              <div style={{ zoom: "0.4" }}>
                                <Card nft={zombiesById[item.tokenId]} size="sm" noMenu />
                              </div>
                            ) : (
                              <div className="text-sm opacity-70 h-20 pt-4">Zombie Killed</div>
                            )
                          )
                        }
                        {
                          item.nftType === "monster" && (
                            monstersById[item.tokenId] ? (
                              <div style={{ zoom: "0.4" }}>
                                <Card nft={monstersById[item.tokenId]} size="sm" noMenu />
                              </div>
                            ) : (
                              <div className="text-sm opacity-70 h-20 pt-4">Monster Killed</div>
                            )
                          )
                        }
                        {
                          item.nftType === "land" && (
                            landsById[item.tokenId] ? (
                              <div style={{ zoom: "0.4" }}>
                                <CardLand nft={landsById[item.tokenId]} size="sm" noMenu />
                              </div>
                            ) : (
                              <>-</>
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
                        <p className="pt-6 capitalize">
                          {item.nftType === "land" ? formatLandId(landsById[item.tokenId].landType, item.tokenId) : formatId(item)}
                        </p>
                      </div>
                      <div className="w-24">
                        <p className="pt-6">
                          <b>{item.price} {process.env.TOKEN_SYMBOL}</b>
                        </p>
                      </div>
                      <div className="w-1/6">
                        <p className="w-32 pt-6 overflow-hidden text-ellipsis">
                          {item.fromUser}
                        </p>
                      </div>
                      <div className="w-1/6">
                        <p className="w-32 pt-6 overflow-hidden text-ellipsis">
                          {item.toUser}
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
      </div>
    </Popup>
  );
}
