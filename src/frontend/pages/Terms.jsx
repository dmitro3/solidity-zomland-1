import React from "react";
import { TermsContent } from "../near/content";
import {
  Container,
  InnerPageWrapper,
  Wrapper,
} from "../assets/styles/common.style";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { InnerPageHead } from "../components/InnerPageHead";

export const Terms = ({ currentUser }) => (
  <InnerPageWrapper>
    <Header currentUser={currentUser} />

    <Wrapper>
      <Container className="text-white text-center mt-6 mx-auto xl:w-3/4">
        <InnerPageHead title={TermsContent.title} />
        <div
          className="text-left mt-10"
          dangerouslySetInnerHTML={{
            __html: TermsContent.description,
          }}
        />
      </Container>
    </Wrapper>

    <Footer />
  </InnerPageWrapper>
);
