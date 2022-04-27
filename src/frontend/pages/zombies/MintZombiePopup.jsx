import React, { useEffect, useRef, useState } from "react";
import { getMedia, formatId } from "../../web3/utils";
import { Button } from "../../components/basic/Button";
import { Popup } from "../../components/Popup";

export default function MintZombiePopup({
  mintPopupVisible,
  setMintPopupVisible,
  userLands,
  handleMint,
  mintInProgressList
}) {
  const funRef = useRef(null);
  const [currentDate, setCurrentDate] = useState(Date.now());
  const availabilityMap = {
    Small: "1 zombie / day",
    Medium: "4 zombies / day",
    Large: "8 zombies / day",
  };

  useEffect(() => {
    funRef.current = setInterval(() => {
      setCurrentDate(Date.now());
    }, 1000);
    return () => {
      clearInterval(funRef.current);
    };
  }, []);

  useEffect(() => {
    // used for update each second
  }, [currentDate]);

  const secondsToString = (countSec) => {
    const hours = Math.floor(((countSec % 31536000) % 86400) / 3600);
    let minutes = Math.floor((((countSec % 31536000) % 86400) % 3600) / 60);
    let seconds = Math.floor((((countSec % 31536000) % 86400) % 3600) % 60);
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    if (seconds < 10) {
      seconds = `0${seconds}`;
    }
    return hours + " hours " + minutes + " min " + seconds + " sec.";
  };

  const timeDiff = (lastClaimTime) => {
    const timeNow = parseInt(new Date().getTime() / 1000);
    const oneDay = 24 * 60 * 60;
    const diff = timeNow - lastClaimTime;
    return oneDay - diff;
  };

  return (
    <Popup
      title="Mint Zombies"
      popupVisible={mintPopupVisible}
      setPopupVisible={setMintPopupVisible}
    >
      <div className="mt-2 text-left">
        {userLands.map((land) => (
          <div className="flex sm:gap-4 mb-3" key={land.tokenId}>
            <div className="hidden sm:flex">
              <img src={getMedia(land.media)} alt="land" width="40"/>
            </div>
            <div className="basis-1/3 sm:pt-4 pt-2 font-semibold">
              {land.landType} Land {formatId(land)}
            </div>
            <div className="basis-1/4 pt-4 hidden sm:flex">
              {availabilityMap[land.landType]}
            </div>
            <div className="grow text-right">
              {timeDiff(land.lastZombieClaim) < 0 ? (
                <div className="pt-1">
                  <Button
                    title="Mint Zombies"
                    size="sm"
                    secondary
                    disabled={mintInProgressList.indexOf(land.tokenId) !== -1}
                    onClick={() => {
                      handleMint(land.tokenId);
                      mintInProgressList.push(land.tokenId);
                    }}
                  />
                </div>
              ) : (
                <div>
                  {timeDiff(land.lastZombieClaim) < 86400 && (
                    <p className="text-red-300 text-center pl-7 text-base pt-2 leading-4 font-[Exo]">
                      <small>Next mint:</small>
                      <br/>
                      <small>
                        {secondsToString(timeDiff(land.lastZombieClaim))}
                      </small>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Popup>
  );
}
