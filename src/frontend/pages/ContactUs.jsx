import React from "react";
import { Container, InnerPageWrapper, Wrapper } from '../assets/styles/common.style';
import { ContactUsContent } from '../web3/content';
import { Header } from "../components/Header";
import { Footer } from '../components/Footer';
import { InnerPageHead } from '../components/InnerPageHead';

export const ContactUs = () => (
  <>
    <InnerPageWrapper>
      <Header  />
      <Wrapper>
        <Container className="text-white text-center mt-6">
          <InnerPageHead title={ContactUsContent.title} description={ContactUsContent.description} />
          ...
        </Container>
      </Wrapper>
      <Footer />
    </InnerPageWrapper>
  </>
);
