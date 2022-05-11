import { Fragment } from "react";
import { CurrencyDollarIcon, DotsVerticalIcon } from "@heroicons/react/outline";
import { Menu, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";
import { ArrowRightIcon } from "@heroicons/react/solid";

export const CardDropdown = ({
  setTransferPopupVisible,
  setSellItems,
  setKillItem,
}) => {
  const actions = [
    {
      title: "Transfer",
      fn: setTransferPopupVisible,
      icon: <ArrowRightIcon className="h-5 w-5 mr-2 font-semibold"/>,
    }
  ];

  if (setSellItems) {
    actions.push({
      title: "Sell on Market",
      fn: setSellItems,
      icon: <CurrencyDollarIcon className="h-5 w-5 mr-2 font-semibold"/>,
    });
  }

  if (setKillItem) {
    actions.push({
      title: "Kill to get ZML",
      fn: setKillItem,
      icon: <XIcon className="h-5 w-5 mr-2 font-semibold"/>,
    });
  }

  return (
    <Menu as="div" className="relative inline-block text-left z-20">
      <div>
        <Menu.Button className="cursor-pointer hover:text-orange-600">
          <DotsVerticalIcon className="h-7 w-7 pt-1" aria-hidden="true"/>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className="shadow-lg shadow-main origin-top absolute right-0 mt-1 mr-0.5 w-48 rounded-md bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {actions.map((action, index) => (
              <Menu.Item key={index}>
                <button
                  onClick={() => action.fn(true)}
                  className="text-main flex items-center w-full first:rounded-t-md last:rounded-b-md px-4 py-2 text-lg font-semibold hover:text-orange-600"
                >
                  {action.icon}
                  {action.title}
                </button>
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
