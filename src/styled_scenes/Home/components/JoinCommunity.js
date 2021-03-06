import React from 'react';
import styled from 'styled-components';
import map from '../images/findATripMap.svg';
import customizeIcon from '../images/customizeTrip.svg';
import earnMoney from '../images/earnMoney.svg';
import Button from 'shared_components/Button';
import { media } from 'libs/styled';
import { PageWrapper } from 'shared_components/layout/Page';
import { H2Subtitle, H3, P, PStrong } from 'libs/commonStyles';
import { textDark } from 'libs/colors';

// i18n
import { Trans } from '@lingui/macro';

const Content = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 25px;
  flex-direction: column;
  text-align: center;
  align-items: center;
  ${media.minSmall} {
    flex-direction: row;
  }
`;

const Column = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 350px;
  > img {
    margin-top: 20px;
    ${media.minSmall} {
      margin-top: 0;
    }
  }
  ${media.minSmall} {
    &:first-child {
      margin-right: 30px;
    }
    &:last-child {
      margin-left: 30px;
    }
  }
`;

const Title = styled(H3)`
  margin-top: 15px;
  ${media.minSmall} {
    margin-top: 25px;
  }
`;

const Paragraph = styled(P)`
  color: ${textDark};
  margin-bottom: 25px;
  ${media.minSmall} {
    margin-bottom: 0;
  }
`;

const Become = styled(H2Subtitle)`
  text-align: center;
  margin-bottom: 40px;
`;

const ButtonWrapper = styled.div`
  text-align: center;
  margin-top: 30px;
  margin-bottom: 42px;
`;

export default ({ featuredTripCreator }) => (
  <PageWrapper>
    <Become>
      <Trans>
        Join our community like {featuredTripCreator} and share your knowledge of your local area
      </Trans>
    </Become>
    <Content>
      <Column>
        <img src={map} alt="Create a Trip" />
        <Title>
          <Trans>Create a Trip</Trans>
        </Title>
        <Paragraph>
          <Trans>
            Leverage your knowledge of an area, promote your services, add any service from the web
          </Trans>
        </Paragraph>
      </Column>
      <Column>
        <img src={customizeIcon} alt="Publish your Trip" />
        <Title>
          <Trans>Publish your Trip</Trans>
        </Title>
        <Paragraph>
          <Trans>Add some notes to help travelers get the best out of your trip</Trans>
        </Paragraph>
      </Column>
      <Column>
        <img src={earnMoney} alt="Earn Money" />
        <Title>
          <Trans>Earn Money</Trans>
        </Title>
        <Paragraph>
          <Trans>
            When your trip is booked, we give you a percentage of what we earned and you also get
            some rewards if the traveler is happy!
          </Trans>
        </Paragraph>
      </Column>
    </Content>
    <ButtonWrapper>
      <Button
        type="link"
        href={{
          pathname: '/new/trip',
          state: {
            modal: true,
          },
        }}
        theme="primaryFilled"
      >
        <PStrong>
          <Trans>Create a Trip & Start Earning</Trans>
        </PStrong>
      </Button>
    </ButtonWrapper>
  </PageWrapper>
);
