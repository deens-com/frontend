// NPM
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

// COMPONENTS
import Button from "../../../shared_components/Button";
import SliderPerson from "./HeroSlider/SliderPerson";
import hands from "../components/HeroSlider/img/hands.jpg";

// ACTIONS/CONFIG
import { media } from "../../../libs/styled";

// STYLES
import { PageWrapper } from "../../../shared_components/layout/Page";

const Wrap = styled.div`
  color: white;
  margin-bottom: 50px;
  padding-bottom: 100px;
  padding-top: 15px;
  position: relative;
`;

const SubTag = styled.span`
  display: inline-block;
  font-family: "HaydonBrush", Georgia, serif;
  font-size: 22px;
  margin-bottom: 15px;

  ${media.minSmall} {
    font-size: 32px;
  }

  ${media.minMedium} {
    font-size: 44px;
  }
`;

const SubTitle = styled.p`
  font-size: 28px;
  letter-spacing: -2px;
  line-height: 1.2;
  margin-bottom: 25px;
  max-width: 520px;

  ${media.minSmall} {
    font-size: 38px;
  }

  ${media.minMedium} {
    font-size: 48px;
  }
`;

const SubBG = styled.div`
  background-size: cover;
  background: #eee;
  background: url(${hands}) no-repeat;
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: -110px;
  z-index: -1;
`;

// MODULE
export default function SubHero({}) {
  return (
    <Wrap>
      <PageWrapper>
        <SubTag>Share your passion</SubTag>
        <SubTitle>
          Earn up to 500€ <br />by sharing experience with others
        </SubTitle>
        <Button type="link" href="/" round theme="mainFilled">
          Become a host
        </Button>
      </PageWrapper>
      <SliderPerson
        name="Handmade clay dishes"
        location="Bali, Indonesia"
        avatar="#"
      />
      <SubBG rel="image" aria-label="Share your passion in cleying" />
    </Wrap>
  );
}

// Props Validation
SubHero.propTypes = {};
