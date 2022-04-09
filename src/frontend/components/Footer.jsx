import React from "react";
import logo from "../assets/images/logo.png";
import { Col, Container, Row } from "../assets/styles/common.style";
import { SocialLinks } from "./SocialLinks";

export const Footer = () => (
  <div className="h-36 bg-main/95 pt-3 sm:mt-20 mt-10">
    <Container>
      <Row className="justify-between pt-4">
        <div className="w-1/4">
          <Row>
            <Col>
              <img src={logo} alt="logo" width="50" className="opacity-70" />
            </Col>
            <Col className="ml-3">
              <span className="zombie-font text-3xl font-normal hover:text-indigo-50 opacity-70">
                ZomLand
              </span>
              <div className="uppercase text-sm pt-0.5">
                <small className="opacity-70 hidden lg:inline">
                  © MADE BY{" "}
                </small>
                <a
                  href="mailto:someteam.eu@gmail.com"
                  target="_blank"
                  className="font-semibold"
                  rel="noreferrer"
                >
                  <small>SomeTeam.eu</small>
                </a>
              </div>
            </Col>
          </Row>
        </div>

        <div className="w-1/2 sm:pl-12 sm:text-left text-right pr-4 sm:pr-0">
          <Row>
            <Col className="w-1/3 hidden lg:block">
              <a
                className="block text-sm font-bold leading-7 uppercase"
                href="/"
              >
                Home
              </a>
              <a
                size="sm"
                className="block text-sm font-bold leading-7 uppercase"
                href="/#how_to_play"
              >
                How to play
              </a>
              <a
                size="sm"
                className="block text-sm font-bold leading-7 uppercase"
                href="/faq"
              >
                FAQ
              </a>
            </Col>

            <Col className="w-1/3 hidden lg:block">
              <a
                size="sm"
                className="block text-sm font-bold leading-7 uppercase"
                href="/#tokenomic"
              >
                Tokenomic
              </a>
              <a
                size="sm"
                className="block text-sm font-bold leading-7 uppercase"
                href="/#roadmap"
              >
                Roadmap
              </a>
              <a
                size="sm"
                className="block text-sm font-bold leading-7 uppercase"
                href="/contact-us"
              >
                Contact US
              </a>
            </Col>

            <Col className="sm:w-1/3 w-full">
              <a
                size="sm"
                className="block text-sm font-bold leading-7 uppercase"
                href="/terms-conditions"
              >
                Terms & Conditions
              </a>
              <a
                size="sm"
                className="block text-sm font-bold leading-7 uppercase"
                href="/privacy-policy"
              >
                Privacy Policy
              </a>
              <a
                className="block text-sm font-bold leading-7 uppercase"
                target="_blank"
                href="https://dandelion-dash-25e.notion.site/Whitepaper-f13cc403f031402f9244712c24ee151f"
                rel="noreferrer"
              >
                Whitepaper
              </a>
            </Col>
          </Row>
        </div>

        <div className="sm:w-1/4 hidden sm:block text-right">
          <SocialLinks size="md" />
        </div>
      </Row>
    </Container>
  </div>
);
