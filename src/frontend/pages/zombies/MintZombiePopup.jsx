import React, { useEffect, useRef, useState } from "react";
import { convertFromNanoSeconds, getMedia, formatId } from "../../near/utils";
import { Button } from "../../components/basic/Button";
import { Popup } from "../../components/Popup";

export default function MintZombiePopup({
  mintPopupVisible,
  setMintPopupVisible,
  userLands,
  handleMint,
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
    let hours = Math.floor(((countSec % 31536000) % 86400) / 3600);
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

  const timeDiff = (timeInMs) => {
    const timeNow = new Date().getTime();
    const oneDay = 24 * 60 * 60 * 1000;
    const lastClaimTime = convertFromNanoSeconds(timeInMs);
    const diff = timeNow - lastClaimTime;
    return (oneDay - diff) / 1000;
  };

  return (
    <Popup
      title="Mint Zombies"
      popupVisible={mintPopupVisible}
      setPopupVisible={setMintPopupVisible}
    >
      <div className="mt-2 text-left">
        {userLands.map((land) => (
          <div className="flex sm:gap-4 mb-3" key={land.token_id}>
            <div className="hidden sm:flex">
              <img src={getMedia(land.media)} alt="land" width="40" />
            </div>
            <div className="basis-1/3 sm:pt-4 pt-2 font-semibold">
              {land.land_type} Land #{formatId(land.token_id)}
            </div>
            <div className="basis-1/4 pt-4 hidden sm:flex">
              {availabilityMap[land.land_type]}
            </div>
            <div className="grow text-right">
              {timeDiff(land.last_zombie_claim) < 0 ? (
                <div className="pt-1">
                  <Button
                    title="Mint Zombies"
                    size="sm"
                    secondary
                    onClick={() => handleMint(land.token_id, land.land_type)}
                  />
                </div>
              ) : (
                <div>
                  {timeDiff(land.last_zombie_claim) < 86400 && (
                    <p className="text-red-300 text-center pl-7 text-base pt-2 leading-4 font-[Exo]">
                      <small>Next mint:</small>
                      <br />
                      <small>
                        {secondsToString(timeDiff(land.last_zombie_claim))}
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
