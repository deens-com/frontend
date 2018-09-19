// NPM
import React from 'react';
import styled from 'styled-components';

// ACTIONS/CONFIG

// STYLES
import { media } from 'libs/styled';
import {
  PageWrapper,
  SectionWrap,
} from '../../../../shared_components/layout/Page';

import Button from '../../../../shared_components/Button';

const SectionContent = styled.div`
  display: none;
  ${media.minMedium} {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
  }
`;

const Container = styled.div`
  border-radius: 5px;
  border: 1px solid #ececec;
  flex: 1;
  max-width: 400px;
  min-width: 275px;
  margin: 10px 10px 0;
  text-align: center;
  padding: 35px;
  height: 294px;

  a {
    font-size: 14px;
  }
`;

const Title = styled.div`
  margin-top: 16px;
  color: #3c434b;
  font-size: 24px;
  line-height: 28px;
`;

const Description = styled.div`
  margin-top: 18px;
  color: #787878;
  font-size: 18px;
  line-height: 21px;
  height: 78px;
`;

const ButtonContainer = styled.div`
  margin-bottom: 27px;
`;

export default function HomeSectionCTA() {
  return (
    <PageWrapper>
      <SectionWrap>
        <SectionContent>
          <Container>
            <img src={require(`./icons/suitcase.svg`)} alt="Customize a Trip" />
            <Title>Customize a Trip</Title>
            <Description>Customize a unique itinerary from our curated trips</Description>
            <ButtonContainer>
              <Button
                type="link"
                width="180px"
                align="center"
                theme="textLightGreen"
                round
                size="medium"
                href="/register"
              >
                Sign Up
              </Button>
            </ButtonContainer>
          </Container>
          <Container>
            <img src={require(`./icons/maps-and-flags.svg`)} alt="Create a Trip" />
            <Title>Create a Trip</Title>
            <Description>Create a fully customized trip from scratch</Description>
            <ButtonContainer>
              <Button
                type="link"
                width="180px"
                align="center"
                theme="textLightGreen"
                round
                size="medium"
                href="/register"
              >
                Sign Up
              </Button>
            </ButtonContainer>
          </Container>
          <Container>
            <img src={require(`./icons/bank.svg`)} alt="Earn Money" />
            <Title>Earn Money</Title>
            <Description>Refer a friend, share a trip or add a service</Description>
            <ButtonContainer>
              <Button
                type="link"
                width="180px"
                align="center"
                theme="textLightGreen"
                round
                size="medium"
                href="/register"
              >
                Learn More
              </Button>
            </ButtonContainer>
          </Container>
        </SectionContent>
      </SectionWrap>
    </PageWrapper>
  );
}
