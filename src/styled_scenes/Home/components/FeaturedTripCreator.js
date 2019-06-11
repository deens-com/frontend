import React, { Suspense } from 'react';
import styled from 'styled-components';
import { H2, H3, P, PStrong } from 'libs/commonStyles';
import { primary } from 'libs/colors';

import ListsHandler from 'shared_components/ListsHandler';
import api from 'libs/apiClient';
import TripCarousel from './TripCarousel';
import { sizes, media } from 'libs/styled';
import { Link } from 'react-router-dom';

import { PageWrapper, SectionWrap, SectionContent } from '../../../shared_components/layout/Page';
import LoadingDots from 'shared_components/LoadingDots';
import Media from 'react-media';
import urls from 'libs/urlGenerator';

const featuredTripCreator = 'beabatravel';

const JoinCommunity = React.lazy(() => import('./JoinCommunity'));

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

const Deens = styled.span`
  color: ${primary};
  font-weight: bold;
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
            <H2>Featured Trip Creator From Our Community</H2>
          </SectionHeader>
        </PageWrapper>
        <PageWrapper>
          <TripCreator>
            <img
              className="lazyload"
              data-src={'https://please-com.imgix.net/featured-trip-creator.png?auto=compress'}
              alt={`Featured trip creator ${featuredTripCreator}`}
            />
            <TripCreatorData>
              <H3>
                <Link to={urls.user.view(featuredTripCreator)}>{featuredTripCreator}</Link>
              </H3>
              <P>
                Béatrice was born and raised in Paris, France. She was a lawyer before she decided
                to travel the world with her family. Béatrice has lived in many countries and
                currently resides in Thailand. Her trips have been created from her own travels and
                experiences and have inspired many other travelers on <Deens>Deens</Deens>.
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
        <Suspense fallback={<LoadingDots />}>
          <Media query={`(min-width: ${sizes.large})`}>
            {matches =>
              matches ? <JoinCommunity featuredTripCreator={featuredTripCreator} /> : null
            }
          </Media>
        </Suspense>
      </React.Fragment>
    );
  }
}
