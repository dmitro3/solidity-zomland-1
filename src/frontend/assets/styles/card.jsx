import styled from "styled-components";
import { statusColorBorderMap, statusColorTextMap } from "../../web3/utils";

export const CardInner = styled.div.attrs(() => ({
  className: `relative h-full w-full text-center`,
}))``;

export const InfoBaseWrapper = styled.div.attrs(() => ({
  className: `absolute flex drop-shadow-md items-center justify-center rounded-md w-full bottom-0 py-3 font-semibold`
}))`
  background: linear-gradient(
    180deg,
    rgba(12, 6, 53, 0.4) 0%,
    rgba(15, 8, 65, 0.8) 25%,
    rgba(12, 6, 53, 1) 100%
  );
`;

export const InfoSmallWrapper = styled(InfoBaseWrapper)`
  transform:  translateY(${(props) => (props.withBtn ? "52px" : "4px")});
  transition: 0.3s 2s;
`;

export const InfoWrapper = styled(InfoBaseWrapper)`
  transform:  translateY(${(props) => (props.withBtn ? "222px" : "172px")});
  transition: 0.3s 2s;
`;

export const FlipCard = styled.div`
  width: 220px;
  height: 328px;
  position: relative;
  overflow: hidden;

  &.small {
    width: 140px;
    height: 196px;
  }

  &:hover ${InfoWrapper} {
    transition: 0.2s 0.2s;
    transform: translateY(0);
  }
  
  &:hover ${InfoSmallWrapper} {
    transition: 0.2s 0.2s;
    transform: translateY(4px);
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
