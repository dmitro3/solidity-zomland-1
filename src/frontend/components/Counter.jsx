import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export const Counter = ({ from, to }) => {
  const percentage = (from / to) * 100;

  return (
    <div title={`${from} / ${to} minted`} className="w-7 h-7 font-lg">
      <CircularProgressbar
        value={percentage}
        text={from}
        strokeWidth={12}
        styles={buildStyles({
          textSize: "48px",
          textColor: "orange",
          pathColor: "orange",
          trailColor: "rgb(73 61 110)",
        })}
      />
    </div>
  );
};
