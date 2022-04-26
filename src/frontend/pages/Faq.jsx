import React, {useState} from "react";
import {FAQContent} from "../web3/content";
import {
  Col,
  Container,
  InnerPageWrapper,
  Row,
  Wrapper,
} from "../assets/styles/common.style";
import land_sample from "../assets/images/land-sample.png";
import zombie_sample from "../assets/images/zombie-sample.png";
import monster_sample from "../assets/images/monster-sample.png";
import {Header} from "../components/Header";
import {Footer} from "../components/Footer";
import {InnerPageHead} from "../components/InnerPageHead";


const FaqQuestion = ({title, children, index, openedIndex, changeOpened}) => (
    <Row>
      <Col
          className="border-2 border-sky-800 rounded-xl sm:px-10 pl-8 pr-16 py-8 mb-4 text-left bg-main/80 relative w-full"
          onClick={() => changeOpened(index)}
      >
        <h3 className={`uppercase font-semibold sm:text-2xl text-lg ${index === openedIndex ? "cursor-default" : "cursor-pointer"}`}>{title}</h3>
        <div
            className={`leading-7 overflow-hidden transition-all ease-in-out duration-300 ${
                index === openedIndex ? "h-auto mt-5" : "h-0"
            }`}
        >
          {children}
        </div>
        <div
            className={`absolute sm:right-8 right-4 top-6 w-10 h-10 rounded-full text-center middle 
        ${index === openedIndex ? "bg-sky-500 cursor-default opacity-70" : "bg-sky-900 cursor-pointer"}`}
        >
        <span className="inline-block pt-1 text-2xl font-semibold">
          {index === openedIndex ? "-" : "+"}
        </span>
        </div>
      </Col>
    </Row>
);

export const Faq = () => {
  const [openedIndex, setOpenedIndex] = useState(1);

  return (
      <>
        <InnerPageWrapper>
          <Header/>

          <Wrapper>
            <Container className="text-white text-center mt-6">
              <InnerPageHead
                  title={FAQContent.title}
                  description={FAQContent.description}
              />

              <div className="sm:my-12 my-6 sm:w-3/4 w-full mx-auto">
                <FaqQuestion
                    index="0"
                    openedIndex={openedIndex}
                    changeOpened={(i) => setOpenedIndex(i)}
                    title="What are Play-to-Earn Games?"
                >
                  <p>
                    An NFT game combines conventional gaming designs with
                    unconventional game mechanisms to let users have more control
                    over in-game assets like virtual lands, characters, items and
                    much more. This is made possible by launching games on
                    blockchains and anchoring them with digital asset-powered
                    economies. These digital assets are often NFTs so that they
                    are distinguishable and tamper-proof. The adoption of NFT
                    token standards also allows developers to preserve the rarity
                    and uniqueness of some of these in-game items.
                  </p>
                  <p className="mt-3">
                    With this system in place, the players can claim ownership of
                    game assets through 3 main strategies. They can mint new
                    characters, purchase digital items on native or third-party
                    marketplaces, or unlock and earn new items. Whichever way you
                    choose to access these game assets, you have exclusive
                    ownership rights over them. In essence, you can distribute or
                    sell them and pocket all the money made from such trades. This
                    is why this gaming model is called play-to-earn.
                  </p>
                </FaqQuestion>

                <FaqQuestion
                    index="1"
                    openedIndex={openedIndex}
                    changeOpened={(i) => setOpenedIndex(i)}
                    title="How can I Play?"
                >
                  <p>
                    You need{" "}
                    <a href={process.env.WALLET_URL} target="_blank" className="link">
                      {process.env.TOKEN_NAME} Wallet
                    </a>{" "}
                    and some {process.env.TOKEN_NAME} tokens balance to play the game (used for
                    blockchain transaction commissions, storage and in-game
                    purchases).
                  </p>
                  <h3 className="mt-3 font-semibold">Lands.</h3>
                  <p>
                    The logic of the game starts with the Lands - with them you can mint zombies every day (the number of
                    zombies depends on the type of land).
                    You can mint one Small Land for free or buy larger lands to
                    get more zombies each day.
                  </p>
                  <p>
                    Lands give you ability to catch (mint) zombies each 24 hours:
                  </p>
                  <ul>
                    <li>&minus; Small Land: 1 zombie/day.</li>
                    <li>
                      &minus; Medium Land: 4 zombies/day.
                      <span className="text-sky-200 ml-1">
                      More chances to get better Card Rarity (up to +20% than Small Land).
                    </span>
                    </li>
                    <li>
                      &minus; Large Land: 8 zombies/day.
                      <span className="text-sky-300 ml-1">
                      More chances to get better Card Rarity (up to +50% than Small Land).
                    </span>
                    </li>
                  </ul>

                  <h3 className="mt-3 font-semibold">Zombies.</h3>
                  <p>
                    Zombies is your numerous army that will lead to achieve your
                    goals. <br/>
                    Each zombie has it's own characteristics of health,
                    attack, brain and speed that affect its price.
                  </p>
                  <p>We have 4 types of Zombie Card Rarity: Common, Uncommon, Rare and Epic.</p>

                  <p className="mt-3">
                    Main actions that you can perform with zombies:
                  </p>
                  <ul>
                    <li>
                      &minus; Create a collection - exchanges your zombies for a real monster with extra features.
                    </li>
                    <li>&minus; Sell in the market.</li>
                    <li>
                      &minus; Kill to get ZML tokens (used for DAO and staking rewards).
                    </li>
                    <li>&minus; Send to another user.</li>
                    <li>&minus; Participate in Battle Arena as part of Monster team (coming soon).</li>
                  </ul>

                  <h3 className="mt-3 font-semibold">Monsters.</h3>
                  <p>
                    Your zombies can be combined to Collection and exchanged to
                    the Monster - strong, cool and powerful zombie that have
                    additional features:
                  </p>
                  <ul>
                    <li>
                      &minus; Increase ZML token staking rewards (additional
                      percent is based on Monster Card rarity).
                    </li>
                    <li>
                      &minus; Explore your Lands to find new items for your
                      inventory. Be careful, there is few Monster hunters!
                    </li>
                    <li>
                      &minus; Battle with other Monsters to improve your monster
                      skills and rarity (on win).
                    </li>
                  </ul>
                </FaqQuestion>

                <FaqQuestion
                    index="3"
                    openedIndex={openedIndex}
                    changeOpened={(i) => setOpenedIndex(i)}
                    title="Where can I learn more about the game?"
                >
                  <div>
                    <p>
                      First thing’s first, read our{" "}
                      <a href="https://dandelion-dash-25e.notion.site/Whitepaper-f13cc403f031402f9244712c24ee151f"
                         target="_blank"
                         className="link">ZomLand Whitepaper</a>{" "}
                      to get a broad overview of what we are building, and how you can use it.
                    </p>
                    <p>For further information
                      follow our posts on{" "}
                      <a href="https://twitter.com/Zomland_Game" target="_blank" className="link">Twitter</a>,{" "}
                      <a className="link" href="https://t.me/zomland_official" target="_blank">Telegram</a>{" "}
                      and simply stay connected to our{" "}
                      <a href="https://discord.gg/Te3GkcJPjt" target="_blank" className="link">Discord server</a>.</p>
                  </div>
                </FaqQuestion>

                <FaqQuestion
                    index="5"
                    openedIndex={openedIndex}
                    changeOpened={(i) => setOpenedIndex(i)}
                    title="Explain Land Card"
                >
                  <div className="flex flex-row">
                    <div className="w-1/4 text-center">
                      <img src={land_sample} alt=""/>
                      <small className="text-gray-400 inline-block mr-8">Land Card Sample</small>
                    </div>
                    <div className="w-3/4">
                      <div className="ml-8">
                        <p>Front side represent Card Type, market Price and Token ID.</p>
                        <br/>
                        <b>Card Types:</b>
                        <ul>
                          <li>- <b className="text-gray-500">Small</b>: 1 zombie/day. Limited by 59.999 Lands.</li>
                          <li>- <b className="text-blue-500">Medium</b>: 4 zombies/day. Limited by 5.999 Lands.</li>
                          <li>- <b className="text-orange-500">Large</b>: 8 zombies/day. Limited by 1.999 Lands.</li>
                        </ul>
                        <br/>
                        <a href="https://dandelion-dash-25e.notion.site/Lands-600806d8c2bc464f83bb2a205722fb85" className="link" target="_blank">Read more
                          about Lands</a>
                      </div>
                    </div>
                  </div>
                </FaqQuestion>

                <FaqQuestion
                    index="6"
                    openedIndex={openedIndex}
                    changeOpened={(i) => setOpenedIndex(i)}
                    title="Explain Zombie Card"
                >
                  <div className="flex flex-row">
                    <div className="w-1/4 text-center">
                      <img src={zombie_sample} alt=""/>
                      <small className="text-gray-400 inline-block mr-8">Zombie Card Sample</small>
                    </div>
                    <div className="w-3/4">
                      <div className="ml-8">
                        <p>Front side represent Card Rarity, market Price and Token ID.</p>
                        <p>On hover you can see zombie characteristics: Health, Attack, Intellect and Speed.</p>

                        <br/>
                        <div className="flex flex-row">
                          <div className="w-1/2">
                            <b>Card rarity types:</b>
                            <ul>
                              <li>- <span className="text-gray-400">Common</span></li>
                              <li>- <span className="text-blue-400">UnCommon</span></li>
                              <li>- <span className="text-rose-400">Rare</span></li>
                              <li>- <span className="text-orange-400">Epic</span></li>
                            </ul>
                          </div>
                          <div className="w-1/2">
                            <b>Zombie characteristic:</b>
                            <ul>
                              <li>- Health</li>
                              <li>- Attack</li>
                              <li>- Intellect</li>
                              <li>- Speed</li>
                            </ul>
                          </div>
                        </div>
                        <br/>
                        <a href="https://dandelion-dash-25e.notion.site/Zombies-7785dcc7ca5141fe9512038c61bf02d6" className="link" target="_blank">Read more
                          about Zombies</a>
                      </div>
                    </div>
                  </div>
                </FaqQuestion>

                <FaqQuestion
                    index="7"
                    openedIndex={openedIndex}
                    changeOpened={(i) => setOpenedIndex(i)}
                    title="Explain Monster Card"
                >
                  <div className="flex flex-row">
                    <div className="w-1/4 text-center">
                      <img src={monster_sample} alt=""/>
                      <small className="text-gray-400 inline-block mr-8">Monster Card Sample</small>
                    </div>
                    <div className="w-3/4">
                      <div className="ml-8">
                        <p>Front side represent Card Rarity, market Price and Token ID.</p>
                        <p>On hover you can see monster characteristics: Health, Attack, Intellect and Speed.</p>

                        <br/>
                        <div className="flex flex-row">
                          <div className="w-1/2">
                            <b>Card rarity types:</b>
                            <ul>
                              <li>- <span className="text-gray-400">Common</span></li>
                              <li>- <span className="text-blue-400">UnCommon</span></li>
                              <li>- <span className="text-rose-400">Rare</span></li>
                              <li>- <span className="text-orange-400">Epic</span></li>
                            </ul>
                          </div>
                          <div className="w-1/2">
                            <b>Monster characteristic:</b>
                            <ul>
                              <li>- Health</li>
                              <li>- Attack</li>
                              <li>- Intellect</li>
                            </ul>
                          </div>
                        </div>
                        <br/>
                        <a href="https://dandelion-dash-25e.notion.site/Zombies-7785dcc7ca5141fe9512038c61bf02d6" className="link" target="_blank">Read more
                          about Monsters</a>
                      </div>
                    </div>
                  </div>
                </FaqQuestion>

                <FaqQuestion
                    index="8"
                    openedIndex={openedIndex}
                    changeOpened={(i) => setOpenedIndex(i)}
                    title="What are ZML token?"
                >
                  <div>
                    <p>
                      ZomLand is designed to be automated, decentralized and managed by community.
                      DAO token ZML will be used to participate in governance and change the game based on proposals and
                      votes.
                    </p>
                  </div>
                </FaqQuestion>

                <FaqQuestion
                    index="9"
                    openedIndex={openedIndex}
                    changeOpened={(i) => setOpenedIndex(i)}
                    title="How can I get ZML tokens?"
                >
                  <div>
                    <p>We have multiple ways to earn ZML token. You can choose the best way for you or combine them:</p>
                    <ul>
                      <li>- Join our team as ambassador and earn tokens based on your contribution and activity.</li>
                      <li>- Hold the Monsters to get ZML airdrops.</li>
                      <li>- Kill Zombies and get ZML tokend based on Card rarity and zombie characteristics.</li>
                      <li>- Stake your ZML tokens. You can increase your staking rewards using Monster Cards.</li>
                      <li>- Send Monsters to Discover your Lands. Monster can find resources that will be sold to get ZML tokens (coming
                        soon).
                      </li>
                      <li>- Win battle in Battle Arena to increase you Monster ZML price (coming soon).</li>
                    </ul>
                  </div>
                </FaqQuestion>

                <FaqQuestion
                    index="11"
                    openedIndex={openedIndex}
                    changeOpened={(i) => setOpenedIndex(i)}
                    title="What airdrops do you have coming?"
                >
                  <div>
                    <p>News about promo Airdrops and competitions will continually be announced in the #airdrops discord
                      channel.
                      You will need Monsters to participate in airdrops.
                    </p>
                  </div>
                </FaqQuestion>
              </div>
            </Container>
          </Wrapper>

          <Footer/>
        </InnerPageWrapper>
      </>
  );
};
