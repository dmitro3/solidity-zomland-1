import React from "react";

export const InnerPageHead = ({ title, description }) => (
  <>
    <h1 className="zombie-font font-normal text-6xl title-shadow">{title}</h1>
    <p
      className="w-3/4 xl:w-1/2 mx-auto mb-6 mt-4"
      dangerouslySetInnerHTML={{
        __html: description,
      }}
    />
  </>
);
