import React, {useEffect, useState} from "react";
import {
  NavLink,
  ScrollLink,
} from "../../assets/styles/common.style";
import {animateScroll} from "react-scroll";
import {useLocation, useNavigate} from "react-router-dom";
import Dropdown from "../basic/Dropdown";

export const NavLinks = ({currentUser}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [myNFTs, setMyNFTs] = useState(false);

  useEffect(() => {
    if (["/lands", "/zombies", "/monsters"].indexOf(location.pathname) !== -1) {
      setMyNFTs(true);
    } else {
      setMyNFTs(false);
    }
  }, [location]);

  const toggleHome = () => {
    animateScroll.scrollToTop();
  };

  const scrollProps = {
    activeClass: "border-solid border-2 border-purple-500 text-purple-500",
    smooth: true,
    duration: 500,
    spy: true,
    exact: "true",
    offset: -100,
  };

  return (
      <>
        {currentUser.accountId ? (
            <>
              <Dropdown
                  title="My NFTs"
                  noBorder={!myNFTs}
                  textColor={`${myNFTs ? "text-purple-500" : ""}`}
                  options={[
                    {
                      onClick: () => navigate("/lands"),
                      title: "Lands",
                    },
                    {
                      onClick: () => navigate("/zombies"),
                      title: "Zombies",
                    },
                    {
                      onClick: () => navigate("/monsters"),
                      title: "Monsters",
                    },
                  ]}
              />
              <NavLink to="/collections">Collections</NavLink>
              <NavLink to="/market">Market</NavLink>
              <NavLink to="/token">Staking</NavLink>
              <NavLink to="/faq">FAQ</NavLink>
            </>
        ) : (
            <>
              <ScrollLink to="/" onClick={toggleHome}>
                Home
              </ScrollLink>
              <ScrollLink to="how_to_play" {...scrollProps}>
                How to play
              </ScrollLink>
              <ScrollLink to="tokenomic" {...scrollProps}>
                Tokenomic
              </ScrollLink>
              <ScrollLink to="roadmap" {...scrollProps}>
                Roadmap
              </ScrollLink>
              <ScrollLink to="contact_us" {...scrollProps}>
                Contact Us
              </ScrollLink>
            </>
        )}
      </>
  );
};
