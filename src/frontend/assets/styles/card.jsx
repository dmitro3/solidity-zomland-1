import styled from "styled-components";
import { statusColorBorderMap, statusColorTextMap } from "../../web3/utils";

export const CardInner = styled.div.attrs(() => ({
  className: `relative h-full w-full text-center`,
}))``;

export const InfoSmallWrapper = styled.div.attrs(() => ({
  className:
    `absolute flex drop-shadow-md items-center justify-center rounded-md w-full bottom-0 text-base`
}))`
background: linear-gradient(180deg, rgba(12,6,53,0.30) 0%, rgba(12,6,53,1) 75%);
padding: ${(props) => (props.size === "sm" ? "6px 0" : "10px 0")};
`;

export const InfoWrapper = styled.div.attrs(() => ({
  className:
    "absolute flex drop-shadow-md justify-center rounded-md w-full bottom-0 font-semibold py-3 z-10",
}))`
  bottom: ${(props) => (props.withBtn ? "-180px" : "-132px")};
  background: linear-gradient(180deg, rgba(12,6,53,0.4) 0%, rgba(15,8,65,0.8) 25%, rgba(12,6,53,1) 100%);
  transition: 0.5s;
`;

export const FlipCard = styled.div`
  width: 220px;
  height: 328px;
  position: relative;
  overflow: hidden;

  &.small {
    width: 140px;
    height: 198px;
  }

  &:hover ${InfoWrapper} {
    transition: 0.4s;
    bottom: 0;
  }
`;

export const CardFront = styled.div.attrs((props) => ({
  className: `
    absolute
    w-full
    h-full
    border-4 
    rounded-xl
    overflow-hidden
    ${statusColorBorderMap(props.type)}
  `,
}))`
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
`;

export const Rarity = styled.div.attrs((props) => ({
  className: `
    uppercase
    font-semibold
    ${statusColorTextMap(props.type)}
  `,
}))``;

export const CardBack = styled(CardFront)`
  transform: rotateY(180deg);
`;
