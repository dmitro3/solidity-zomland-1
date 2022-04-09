import React from "react";
import { Col } from "../../assets/styles/common.style";

export const Section = ({ title, description, children }) => (
  <Col className="items-center text-center">
    <h1 className="zombie-font lg:text-6xl sm:text-5xl text-4xl leading-tight title-shadow">{title}</h1>
    <h3
      className="sm:mt-10 mt-4 sm:text-lg leading-normal sm:w-3/5 w-10/12"
      dangerouslySetInnerHTML={{
        __html: description,
      }}
    />
    {children}
  </Col>
);
