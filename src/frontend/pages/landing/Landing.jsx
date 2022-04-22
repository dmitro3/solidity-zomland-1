import React from "react";
import {useNavigate} from "react-router-dom";
import {
  Col,
  Container,
  InnerPageWrapper,
  Row,
} from "../../assets/styles/common.style";
import play_to_earn from "../../assets/images/play_to_earn.png";
import mint_land from "../../assets/images/mint_land.png";
import mint_zombie from "../../assets/images/mint_zombie.png";
import mint_monster from "../../assets/images/mint_monster.png";
import pie from "../../assets/images/pie.png";
import {Header} from "../../components/Header";
import {Circle} from "../../assets/styles/home.style";
import {ChevronDoubleRightIcon} from "@heroicons/react/solid";
import {Button} from "../../components/basic/Button";
import {HomeContent} from "../../web3/content";
import {HowToPlaySection} from "./HowToPlaySection";
import {RoadmapSection} from "./RoadmapSection";
import {Section} from "./Section";
import {Footer} from "../../components/Footer";
import {SocialLinks} from "../../components/SocialLinks";
import { useSelector } from "react-redux";

const CircleSection = ({number, title, desc}) => (
    <Col className="lg:mx-10 mx-4 text-center items-center leading-normal mb-10 sm:mb-0">
      <Circle>{number}</Circle>
      <h2 className="font-semibold lg:text-2xl text-xl mt-5 mb-3">{title}</h2>
      <p
          dangerouslySetInnerHTML={{
            __html: desc,
          }}
      />
    </Col>
);

export const Landing = () => {
  let navigate = useNavigate();
  const currentUser = useSelector(state => state.user.user);
  const handleClick = () => (currentUser ? navigate("/zombies") : window.web3Login());

  return (
      <InnerPageWrapper>
        <Header/>

        <Container
            id="home"
            className="lg:pt-40 lg:pb-20 sm:pt-28 sm:pb-22 py-8 flex flex-wrap justify-between"
        >
          <div className="sm:w-1/2 px-4 sm:px-0 w-full order-last sm:order-first 2xl:pl-14">
            <h1
                className="zombie-font lg:text-7xl text-5xl leading-tight title-shadow 2xl:mt-16 xl:mt-4"
                id="#how_to_play"
            >
              {HomeContent.play_to_earn.title}
            </h1>
            <h3 className="mt-6 sm:mb-10 mb-6 lg:text-lg leading-normal">
              {HomeContent.play_to_earn.desc}
            </h3>
            {process.env.IS_PROD === "true" ? (
                <Button animated noIcon size="lg" title="Coming soon ..."/>
            ) : (
                <Button
                    animated
                    size="lg"
                    title="Play Game"
                    onClick={handleClick}
                />
            )}
          </div>
          <div className="sm:w-1/2 w-full">
            <img className="w-full lg:-mt-28 max-w-[700px]" src={play_to_earn} alt="zomland"/>
          </div>
        </Container>

        <div id="landing" className="mt-4 sm:mt-0">
          <Container id="how_to_play">
            <Section
                title={HomeContent.how_to_play.title}
                description={HomeContent.how_to_play.desc}
            >
              <Row className="mt-16 justify-around sm:flex-nowrap flex-wrap">
                <CircleSection
                    number="1"
                    title={HomeContent.login_using_near.title}
                    desc={HomeContent.login_using_near.desc}
                />
                <ChevronDoubleRightIcon width="150" className="hidden sm:flex"/>
                <CircleSection
                    number="2"
                    title={HomeContent.mint_or_buy.title}
                    desc={HomeContent.mint_or_buy.desc}
                />
                <ChevronDoubleRightIcon width="150" className="hidden sm:flex"/>
                <CircleSection
                    number="3"
                    title={HomeContent.catch_zombiez.title}
                    desc={HomeContent.catch_zombiez.desc}
                />
              </Row>
            </Section>

            <HowToPlaySection
                title={HomeContent.mint_land.title}
                desc={HomeContent.mint_land.desc}
                img={mint_land}
            />
            <HowToPlaySection
                title={HomeContent.mint_zombie.title}
                desc={HomeContent.mint_zombie.desc}
                img={mint_zombie}
                reverse
            />
            <HowToPlaySection
                title={HomeContent.mint_monster.title}
                desc={HomeContent.mint_monster.desc}
                img={mint_monster}
            />
          </Container>

          <Container id="tokenomic">
            <Section title={HomeContent.tokenomics.title}>
              <Col className="flex items-center">
                <p className="font-semibold text-lg">
                  {HomeContent.tokenomics.description}
                </p>
                <img
                    className="sm:w-3/4 lg:w-3/5 sm:mt-16 mt-8 sm:mb-32 mb-16"
                    src={pie}
                    alt="zomland"
                />
              </Col>
            </Section>
          </Container>

          <Container id="roadmap">
            <Section
                title={HomeContent.roadmap.title}
                description={HomeContent.roadmap.desc}
            >
              <div className="sm:my-20 my-10 container mx-auto w-full h-full">
                <div className="relative wrap overflow-hidden h-full">
                  <div className="left-1/2 border-dashed absolute border-opacity-30 border-blue-200 h-full border hidden sm:block"></div>
                  {HomeContent.roadmap.sections.map((section, index) => (
                      <RoadmapSection
                          key={index}
                          index={index}
                          date={section.date}
                          title={section.title}
                          desc={section.desc}
                          type={section.type}
                      />
                  ))}
                </div>
              </div>
            </Section>
          </Container>
        </div>

        <Container id="contact_us">
          <Section
              title={HomeContent.contact_us.title}
              description={HomeContent.contact_us.desc}
          >
            <div className="sm:my-10 mt-10">
              <SocialLinks size="xl" gmail/>
            </div>
          </Section>
        </Container>

        <Footer/>
      </InnerPageWrapper>
  );
};
