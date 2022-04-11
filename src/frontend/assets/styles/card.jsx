import styled from "styled-components";
import { statusColorBorderMap, statusColorTextMap } from "../../web3/utils";

export const CardInner = styled.div.attrs(() => ({
  className: `relative h-full w-full text-center`,
}))``;

export const InfoWrapper = styled.div.attrs(() => ({
  className:
    "absolute z-10 font-semibold flex drop-shadow-md justify-center pt-1 bg-main/80 rounded-md w-full bottom-0",
}))`
  bottom: ${(props) => (props.withBtn ? "-202px" : "-156px")};
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
