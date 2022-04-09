import React from "react";
import {
  NavLink,
  ScrollLink,
} from "../../assets/styles/common.style";
import {animateScroll} from "react-scroll";

export const NavLinks = ({currentUser}) => {
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
              <NavLink to="/lands">Lands</NavLink>
              <NavLink to="/zombies">Zombies</NavLink>
              <NavLink to="/collections">Collections</NavLink>
              <NavLink to="/monsters">Monsters</NavLink>
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
