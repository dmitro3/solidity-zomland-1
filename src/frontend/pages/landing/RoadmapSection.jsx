import React from "react";
import checkIcon from "../../assets/images/check.png";

export const RoadmapSection = ({ date, title, desc, index, type }) => (
  <div
    className={`sm:mb-10 mb-5 sm:flex justify-between w-full ${
      index % 2 === 0
        ? "right-timeline sm:text-left"
        : "flex-row-reverse left-timeline sm:text-right"
    }`}
  >
    <div className="order-1 sm:w-1/2">&nbsp;</div>
    <div
      className={`z-20 flex items-center relative order-1 ${
        type === "past"
          ? "bg-green-500"
          : type === "soon"
          ? "bg-orange-500"
          : "bg-gray-500"
      } shadow-xl w-6 h-6 rounded-full hidden sm:block`}
    >
      {type === "past" && (<img width="16" src={checkIcon} className="absolute top-1.5 left-1" alt="checked" />)}
    </div>
    <div
      className={`sm:flex order-1 ${
        index % 2 === 0 ? "justify-start" : "justify-end"
      } rounded-lg shadow-xl sm:w-1/2 px-7`}
    >
      <div
        className={`w-full lg:w-2/3 border-2 p-5 rounded-lg ${
          type === "past"
            ? "border-green-500"
            : type === "soon"
            ? "border-orange-500"
            : "border-gray-500"
        }`}
      >
        <div
          className={`mb-3 ${
            type === "past"
              ? "text-green-500"
              : type === "soon"
              ? "text-orange-500"
              : "text-gray-500"
          }`}
        >
          <h3>{date}</h3>
          <h3 className="font-bold text-xl">{title}</h3>
        </div>
        <p
          className={`text-sm leading-snug tracking-wide ${
            type === "past"
              ? "text-green-500"
              : type === "soon"
              ? "text-orange-500"
              : "text-gray-500"
          }`}
        >
          {desc}
        </p>
      </div>
    </div>
  </div>
);
