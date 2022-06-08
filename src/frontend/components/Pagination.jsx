import React from "react";

export const Pagination = ({ total, limit, onPageChanged, selectedPage }) => {
  selectedPage = parseInt(selectedPage);
  const rest = parseInt(total % limit) === 0 ? 0 : 1;
  const pagesCount = parseInt(total / limit) + rest;
  const arr = Array.from(Array(pagesCount).keys());
  const SHOW_SIZE = 2;
  const lastPage = arr.length;
  const pages = arr.slice(
    selectedPage <= 2 ? 0 : selectedPage - 2,
    selectedPage + SHOW_SIZE > arr.length
      ? arr.length
      : selectedPage + SHOW_SIZE - 1
  );

  return (
    <div className="flex mt-8 mb-2 justify-center">
      {selectedPage > SHOW_SIZE && (
        <>
          <div
            className={
              "bg-transparent flex mx-2 rounded-full border-2 border-orange-600 font-semibold justify-center items-center w-12 h-12 text-white cursor-pointer"
            }
            onClick={() => onPageChanged(1)}
          >
            1
          </div>
          <div className="items-center flex font-bold">...</div>
        </>
      )}

      {
        pages.length > 1 &&
        pages.map((page, index) => (
          <div
            key={index}
            className={`${
              parseInt(selectedPage) === page + 1 ? "bg-orange-600" : "bg-transparent"
            } flex mx-2 rounded-full border-2 border-orange-600 font-semibold justify-center items-center w-12 h-12 text-white cursor-pointer`}
            onClick={() => onPageChanged(page + 1)}
          >
            {page + 1}
          </div>
        ))
      }

      {selectedPage < arr.length - SHOW_SIZE + 1 && (
        <>
          <div className="items-center flex font-bold">...</div>
          <div
            className={`${
              selectedPage === lastPage + 1 ? "bg-orange-600" : "bg-transparent"
            } flex mx-2 rounded-full border-2 border-orange-600 font-semibold justify-center items-center w-12 h-12 text-white cursor-pointer`}
            onClick={() => onPageChanged(lastPage)}
          >
            {lastPage}
          </div>
        </>
      )}
    </div>
  );
};
