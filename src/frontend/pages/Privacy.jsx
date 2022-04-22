import React from "react";
import { PrivacyContent } from "../web3/content";
import {
  Container,
  InnerPageWrapper,
  Wrapper,
} from "../assets/styles/common.style";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { InnerPageHead } from "../components/InnerPageHead";

export const Privacy = () => (
  <InnerPageWrapper>
    <Header />

    <Wrapper>
      <Container className="text-white text-center mt-6 mx-auto xl:w-3/4">
        <InnerPageHead title={PrivacyContent.title} />
        <div
          className="text-left mt-10"
          dangerouslySetInnerHTML={{
            __html: PrivacyContent.description,
          }}
        />
      </Container>
    </Wrapper>

    <Footer />
  </InnerPageWrapper>
);
