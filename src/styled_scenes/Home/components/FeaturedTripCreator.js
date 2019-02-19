import React from 'react';
import styled from 'styled-components';
import { H2, H2Subtitle, H3, P, PStrong } from 'libs/commonStyles';
import { secondary, darkText, primary, secondaryContrast } from 'libs/colors';
import featuredTripCreatorImage from 'assets/featured-trip-creator.png';

import ListsHandler from 'shared_components/ListsHandler';
import api from 'libs/apiClient';
import TripCarousel from './TripCarousel';
import { media } from 'libs/styled';
import map from '../images/findATripMap.svg';
import customizeIcon from '../images/customizeTrip.svg';
import earnMoney from '../images/earnMoney.svg';
import Button from 'shared_components/Button';
import { Link } from 'react-router-dom';
import { parseTagsText } from 'libs/Utils';

import { PageWrapper, SectionWrap, SectionContent } from '../../../shared_components/layout/Page';

const featuredTripCreator = 'beabatravel';

const H2Secondary = styled(H2)`
  color: ${secondary};
`;

const SectionHeader = styled.header`
  margin-bottom: 24px;
`;

const TripCreator = styled.section`
  display: flex;
  margin-bottom: 32px;
  flex-direction: column;
  align-items: center;
  ${media.minSmall} {
    flex-direction: row;
    align-items: flex-start;
  }
  > img {
    border-radius: 10px 10px 10px 0;
    width: 160px;
    height: 160px;
  }
`;

const TripCreatorData = styled.div`
  ${media.minSmall} {
    margin-left: 29px;
    margin-top: 0;
  }
  margin-top: 15px;
  margin-left: 0;
  position: relative;
  max-width: 920px;
  > h3 > a {
    color: ${primary};
  }
`;

const TripsBy = styled(PStrong)`
  color: ${primary};
`;

const Please = styled.span`
  color: ${primary};
  font-weight: bold;
`;

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
  color: ${secondaryContrast};
  margin-top: 15px;
  ${media.minSmall} {
    margin-top: 25px;
  }
`;

const Paragraph = styled(P)`
  color: ${darkText};
  margin-bottom: 25px;
  ${media.minSmall} {
    margin-bottom: 0;
  }
`;

const Become = styled(H2Subtitle)`
  color: ${secondaryContrast};
  text-align: center;
  margin-bottom: 40px;
`;

const ButtonWrapper = styled.div`
  text-align: center;
  margin-top: 30px;
  margin-bottom: 42px;
`;

export default class FeaturedTripCreator extends React.Component {
  fetchTrips = params => {
    return api.users.username.trips.get(
      {
        ...params,
        include: ['tags'],
      },
      { username: featuredTripCreator },
    );
  };

  parseResponse = response => {
    const { data } = response;
    // const tags = parseTagsText(data.tags)
    return {
      ...response,
      data: {
        ...data,
        trips: data.trips.map(trip => ({
          ...trip,
          tags: trip.tags.map(tripTag => data.tags.find(tag => tripTag === tag._id)),
        })),
      },
    };
  };

  render() {
    return (
      <React.Fragment>
        <PageWrapper>
          <SectionHeader>
            <H2Secondary>Featured Trip Creator From Our Community</H2Secondary>
          </SectionHeader>
        </PageWrapper>
        <PageWrapper>
          <TripCreator>
            <img
              src={featuredTripCreatorImage}
              alt={`Featured trip creatpor ${featuredTripCreator}`}
            />
            <TripCreatorData>
              <H3>
                <Link to={`/users/${featuredTripCreator}`}>{featuredTripCreator}</Link>
              </H3>
              <P>
                Béatrice was born and raised in Paris, France. She was a lawyer before she decided
                to travel the world with her family. Béatrice has lived in many countries and
                currently resides in Thailand. Her trips have been created from her own travels and
                experiences and have inspired many other travelers on <Please>Please</Please>.
              </P>
              <TripsBy>Trips by {featuredTripCreator}</TripsBy>
            </TripCreatorData>
          </TripCreator>
        </PageWrapper>
        <PageWrapper>
          <SectionWrap>
            <SectionContent>
              <ListsHandler
                apiFunction={this.fetchTrips}
                parseResponseFn={this.parseResponse}
                itemKey="trips"
                showLoader={false}
                render={({ items, isLoading }) => (
                  <TripCarousel isLoading={isLoading} hideAuthor trips={items} />
                )}
              />
            </SectionContent>
          </SectionWrap>
        </PageWrapper>
        <PageWrapper>
          <Become>Become a trip creator like {featuredTripCreator}</Become>
          <Content>
            <Column>
              <img src={map} alt="Find a Trip" />
              <Title>Create a Trip</Title>
              <Paragraph>
                Leverage your knowledge of an area, promote your services, add any service from the
                web
              </Paragraph>
            </Column>
            <Column>
              <img src={customizeIcon} alt="Customize your Trip" />
              <Title>Publish your Trip</Title>
              <Paragraph>Add some notes to help travelers get the best out of your trip</Paragraph>
            </Column>
            <Column>
              <img src={earnMoney} alt="Book your Trip" />
              <Title>Earn Money</Title>
              <Paragraph>
                When your trip is booked, we give you a percentage of what we earned and you also
                get some rewards if the traveler is happy!
              </Paragraph>
            </Column>
          </Content>
          <ButtonWrapper>
            <Button type="link" href="/trips/create" theme="primaryFilled">
              <PStrong>Create a Trip & Start Earning</PStrong>
            </Button>
          </ButtonWrapper>
        </PageWrapper>
      </React.Fragment>
    );
  }
}
