import React from "react";
import {Menu} from "@headlessui/react";
import {ChevronDownIcon} from "@heroicons/react/solid";

export default function Dropdown({title, options, selected, noBorder, textColor}) {
  const borderStyle = textColor ? "border-purple-500 px-3" : "border-orange-500 px-5";

  return (
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button
            className={`inline-flex border-2 py-2.5 rounded-lg font-semibold uppercase group transition ease-in-out duration-200 
        ${textColor ? textColor : "text-white"}
        ${noBorder ? "border-transparent px-3" : `${borderStyle}`}`}>
          <>{selected ? selected : title}</>
          <ChevronDownIcon className={`-mr-1 ml-2 h-5 w-5 ${textColor ? textColor : "text-white"}`} aria-hidden="true"/>
        </Menu.Button>
        <Menu.Items className="origin-top-right absolute right-0 w-40 rounded-md bg-white shadow-lg bg-orange-600">
          <div className="py-2">
            {options?.map((option, index) => (
                <Menu.Item key={index}>
                  <div
                      className={`text-black hover:bg-purple-800 hover:text-white transition ${
                          selected === option.title && "bg-purple-700"
                      }`}
                  >
                    <button
                        className={`font-semibold text-left px-4 py-2 block w-full ${
                            selected === option.title && "text-white"
                        }`}
                        onClick={option.onClick}
                    >
                      {option.title}
                    </button>
                  </div>
                </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Menu>
  );
}
