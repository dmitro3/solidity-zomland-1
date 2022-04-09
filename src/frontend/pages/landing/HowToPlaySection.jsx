import React from "react";
import { Col, Row } from "../../assets/styles/common.style";

export const HowToPlaySection = ({ reverse, title, desc, img }) => (
  <Row className="sm:my-16 my-8">
    {reverse ? (
      <div className="sm:flex w-full items-center justify-between">
        <Col className="sm:w-1/2 w-full text-left px-4">
          <h2 className="text-5xl leading-tight zombie-font title-shadow">
            {title}
          </h2>
          <h3
            className="my-5"
            dangerouslySetInnerHTML={{
              __html: desc,
            }}
          />
        </Col>
        <Col className="sm:w-1/2 w-full items-center">
          <img src={img} alt={title} className="max-h-[340px] sm:ml-12" />
        </Col>
      </div>
    ) : (
      <>
        <div className="sm:flex w-full items-center justify-between">
          <Col className="sm:w-1/2 w-full items-center">
            <img src={img} alt={title} className="max-h-[360px] sm:mr-12" />
          </Col>
          <Col className="sm:w-1/2 w-full text-left px-4">
            <h2 className="text-5xl leading-tight zombie-font title-shadow">
              {title}
            </h2>
            <h3
              className="my-5"
              dangerouslySetInnerHTML={{
                __html: desc,
              }}
            />
          </Col>
        </div>
      </>
    )}
  </Row>
);
