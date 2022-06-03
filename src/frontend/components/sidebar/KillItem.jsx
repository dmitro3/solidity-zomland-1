import React from "react";
import { XIcon } from "@heroicons/react/outline";
import { convertFromYocto, formatId, getMedia, statusColorBorderMap } from '../../web3/utils';

export const KillItem = ({ item_type, nft, cancelKill, id }) => {
  return (
    <div className="flex flex-row mb-1 pb-1 relative border-b border-dashed border-gray-700 last:border-transparent">
      <img
        className={`w-14 border-2 rounded-md mr-4 ${statusColorBorderMap(
          item_type
        )}`}
        src={getMedia(nft.media)}
        alt={nft.tokenId}
      />
      <div>
        <div className="font-semibold pt-2 mb-1">
          {/*<span className="text-indigo-100 mr-1">{item_type}</span>*/}
          {formatId(nft)}
        </div>
        <div>
          {convertFromYocto(nft.killTokens, 1)} ZML
        </div>
      </div>
      <div className="absolute right-0 top-5">
        <XIcon
          className="h-6 w-6 fill-red-500 hover:fill-red-700 cursor-pointer transition duration-200"
          onClick={cancelKill}
        />
      </div>
    </div>
  );
};
