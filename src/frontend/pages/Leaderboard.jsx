import React, { useEffect, useState } from "react";
import {
  Col,
  Container,
  InnerPageWrapper,
  Row,
  Wrapper,
} from "../assets/styles/common.style";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { InnerPageHead } from "../components/InnerPageHead";
import { Loader } from "../components/basic/Loader";
import { Api } from '../db/api';
import { useSelector } from 'react-redux';
import { LeaderboardContent } from '../web3/content';
import { getMedia, shortAddress } from '../web3/utils';

export const Leaderboard = () => {
  const currentUser = useSelector(state => state.user.user);
  const [leaderList, setLeaderList] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    mintedZombies: 0,
    killedZombies: 0,
    mintedMonsters: 0,
    killedMonsters: 0,
  });
  const [isReady, setIsReady] = useState(true);

  const zombieStatPromise = new Promise(async (resolve) => {
    await window.contracts.zombie.leaderboardStats().then(stat => {
      resolve(stat);
    });
  });
  const monsterStatPromise = new Promise(async (resolve) => {
    await window.contracts.monster.leaderboardStats().then(stat => {
      resolve(stat);
    });
  });


  async function fetchLeaderboard() {
    setIsReady(false);

    let api = new Api();
    setLeaderList(await api.topLeaderboard(20));
    let userStat = await api.getStats();

    Promise.all([zombieStatPromise, monsterStatPromise]).then(result => {
      const zombieStats = result[0];
      const monsterStats = result[1];

      setStats({
        totalUsers: userStat.totalUsers,
        mintedZombies: parseInt(zombieStats[0]),
        killedZombies: parseInt(zombieStats[1]),
        mintedMonsters: parseInt(monsterStats[0]),
        killedMonsters: parseInt(monsterStats[1]),
      });
      setIsReady(true);
    })

  }

  useEffect(() => fetchLeaderboard(), []);

  const WinnerCard = ({ title, image, account, color }) => (
    <Col className={`rounded-xl p-2 mx-1 mb-2 xl:py-4 sm:mb-0 shadow-md ${color} items-center`}>
      <img
        className="rounded shadow-md object-cover block hidden sm:block xl:w-[220px] w-[180px]"
        src={getMedia(image)}
        alt="zombie"
      />
      <div className="zombie-font text-3xl my-3"> {title}</div>
      <div className={`px-2 py-0.5 rounded font-bold text-main mb-1 xl:w-64 w-48 text-center overflow-hidden text-ellipsis`}>
        {shortAddress(account.name)}
      </div>
      <div className="text-sm mb-1 xl:flex text-center mb-2">
        <span className="block xl:inline">Zombies: <b>{account.zombies}</b></span>
        <span className="text-black/20 mx-2 hidden xl:inline">|</span>
        <span className="block xl:inline">Monsters: <b>{account.monsters}</b></span>
      </div>
    </Col>
  );

  return (
    <InnerPageWrapper>
      <Header currentUser={currentUser} />

      <Wrapper>
        <Container className="flex flex-col text-white mt-6 items-center">
          <InnerPageHead title={LeaderboardContent.title} />
          {isReady ? (
            <>
              <div className="lg:flex lg:flex-row sm:px-20 text-center text-white/50 font-bold mb-2">
                <div className="mx-3 inline-block">
                  Total Players: {stats.totalUsers}
                </div>
                <div className="mx-3 inline-block">
                  Minted Zombies: {stats.mintedZombies}
                </div>
                <div className="mx-3 inline-block">
                  Killed Zombies: {stats.killedZombies}
                </div>
                <div className="mx-3 inline-block">
                  Minted Monsters: {stats.mintedMonsters}
                </div>
                <div className="mx-3 inline-block">
                  Killed Monsters: {stats.killedMonsters}
                </div>
              </div>

              <div className="justify-between sm:flex sm:flex-row items-center xl:w-2/3 text-main mt-10">
                {leaderList[0] && (
                  <WinnerCard
                    title="First place"
                    image="bafybeifq6clpc672vcln7l5iv4355ze6ludm7opcpldbgkwa7sfu5inysm/1"
                    account={leaderList[0]}
                    color="bg-yellow-500"
                  />
                )}
                {leaderList[1] && (
                  <WinnerCard
                    title="Second place"
                    image="bafybeid3p33trzeklhvblet72wmt2rfnfvgii6ezbvhdix4hc7p2uwuotu/1"
                    account={leaderList[1]}
                    color="bg-gray-300"
                  />
                )}
                {leaderList[2] && (
                  <WinnerCard
                    title="Third place"
                    image="bafkreigdcymxku7b6o4pcyfqqzf5dieviewhwndrknbggvhk6vokavfxwe/5"
                    account={leaderList[2]}
                    color="bg-amber-700"
                  />
                )}
              </div>
              {leaderList[3] && (
                <div className="p-5 mt-10 bg-main lg:w-2/3 w-full">
                  <Row className="border-b-2 pb-5 text-orange-600 font-bold border-gray-600/30 border-dashed">
                    <Col className="w-10">#</Col>
                    <Col className="flex-1">Account</Col>
                    <Col className="w-28">Zombies</Col>
                    <Col className="w-28">Monsters</Col>
                  </Row>

                  <Col>
                    {leaderList
                      .slice(3, 20)
                      .map((account, i) => (
                        <Row
                          key={i + 4}
                          className="py-3 border-b-2 border-gray-700/30 border-dashed"
                        >
                          <div className="w-10">{i + 4}</div>
                          <div className="flex-1 w-20 truncate text-ellipsis mr-5">
                            {account.name}
                          </div>
                          <div className="w-28">{account.zombies}</div>
                          <div className="w-28">{account.monsters}</div>
                        </Row>
                      ))}
                  </Col>
                </div>
              )}
            </>
          ) : (
            <Loader />
          )}
        </Container>
      </Wrapper>

      <Footer />
    </InnerPageWrapper>
  );
};
