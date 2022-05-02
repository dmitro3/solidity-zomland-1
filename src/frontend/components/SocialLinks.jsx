import React from "react";
import twitterIcon from "../assets/images/twitter.png";
import telegramIcon from "../assets/images/telegram.png";
import discordIcon from "../assets/images/discord.png";
import gmailIcon from "../assets/images/gmail.png";

export const SocialLinks = ({ size, gmail }) => {
  size = size ?? "sm";
  const sizeMap = {
    sm: "w-7",
    md: "w-9",
    xl: "w-14",
  };
  const gapMap = {
    sm: "gap-3",
    md: "gap-3",
    xl: "gap-6",
  };
  const hoverClass = "opacity-80 hover:opacity-100 transition";

  return (
    <div className={`flex flex-row justify-end ${gapMap[size]}`}>
      <a
        href="https://twitter.com/Zomland_Game"
        className={hoverClass}
        target="_blank"
        rel="noreferrer"
      >
        <img src={twitterIcon} alt="twitter" className={sizeMap[size]} />
      </a>
      <a
        href="https://discord.gg/Te3GkcJPjt"
        target="_blank"
        className={hoverClass}
        rel="noreferrer"
      >
        <img src={discordIcon} alt="discord" className={sizeMap[size]} />
      </a>
      <a
        href="https://t.me/zomland_official"
        target="_blank"
        className={hoverClass}
        rel="noreferrer"
      >
        <img src={telegramIcon} alt="telegram" className={sizeMap[size]} />
      </a>
      {gmail && (
        <a className={hoverClass} href="mailto:atomic.lab.web@gmail.com">
          <img alt="gmail" src={gmailIcon} className={sizeMap[size]} />
        </a>
      )}
    </div>
  );
};
