import { Button } from './basic/Button';
import { Popup } from './Popup';
import React, { useState } from 'react';
import { CardLand } from './card-land/CardLand';
import { Card } from './card/Card';

export function TransferPopup({ popupVisible, setPopupVisible, handleTransfer, nft }) {
  const [transferAddress, setTransferAddress] = useState("");

  return (
    <Popup
      title="Transfer NFT"
      popupVisible={popupVisible}
      setPopupVisible={setPopupVisible}
    >
      <div className="mt-2 h-52 px-6 flex flex-row">
        {nft && (
          <div>
            {nft.landType ? (
              <CardLand nft={nft} noMenu size="sm" />
            ) : (
              <Card nft={nft} noMenu size="sm" />
            )}
          </div>
        )}

        <div className="ml-10 text-left">
          <p className="mb-6 mt-6">
            You can transfer this NFT to any {process.env.TOKEN_NAME} account.
          </p>
          <p className="mb-3">
            <input
              type="text"
              className="px-4 py-2 w-full rounded-md bg-transparent border-indigo-500 text-indigo-100 border-2"
              placeholder={`${process.env.TOKEN_NAME} Address`}
              value={transferAddress}
              onChange={(e) => setTransferAddress(e.target.value)}
            />
          </p>
          <Button
            title="Transfer"
            onClick={() => handleTransfer(transferAddress)}
          />
        </div>
      </div>
    </Popup>
  )
}