import React from "react";

export const ButtonGroup = ({ items }) => (
  <div
    className="inline-flex rounded-lg border-2 border-orange-600"
    role="group"
  >
    {items.map((item) => (
      <button
        key={item.title}
        type="button"
        onClick={item.onClick}
        className={`py-2 px-6 text-lg font-semibold text-white ${
          item.active ? "bg-orange-600 " : " bg-transparent"
        }   border-orange-600  hover:bg-orange-600/30 hover:text-white`}
      >
        {item.title}
      </button>
    ))}
  </div>
);
