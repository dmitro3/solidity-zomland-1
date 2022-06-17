import React from "react";
import near_logo from "../assets/images/near-logo.png";

export const Price = ({ title, size }) => {
  const sizeMap = {
    base: "h-3.5 w-3.5 font-sm",
    md: "h-10 w-10 font-md",
  };

  return (
    <div
      className={`flex items-center font-semibold text-orange-500 font-${
        size || "base"
      }`}
    >
      {title && (
        <>
          {title}
          <small className="ml-1">{process.env.TOKEN_SYMBOL}</small>
        </>
      )}
    </div>
  );
}
