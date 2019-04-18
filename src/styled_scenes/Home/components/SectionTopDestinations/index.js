// NPM
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { media } from 'libs/styled';
import { H1, H2 } from 'libs/commonStyles';
import { secondary } from 'libs/colors';

import sydneyImg from './images/big/sydney.jpg';
import sanFranciscoImg from './images/small/san-francisco.jpg';
import londonImg from './images/small/london.jpg';
import newYorkImg from './images/big/new-york.jpg';

// ACTIONS/CONFIG

// STYLES
import { PageWrapper, SectionWrap, SectionHeader } from '../../../../shared_components/layout/Page';

const SectionContent = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  flex-direction: column;

  ${media.minSmall} {
    max-height: 400px;
  }

  ${media.minMedium} {
    height: 400px;
    flex-direction: row;
  }
`;

const Column = styled.div`
  display: flex;
  flex: 1;
  ${media.minMedium} {
    height: 400px;
    flex-direction: column;
  }
`;

const Row = styled.div`
  height: 190px;
  background-size: cover;
  background-position: center;
  display: flex;
  border-radius: 10px;
  font-size: 36px;
  line-height: 42px;
  font-weight: bold;
  flex: 1;

  ${media.minSmall} {
    margin: 0;
    width: auto;
  }
`;

const FlexLink = styled(Link)`
  flex: 1;
  ${media.minSmall} {
    margin-bottom: 20px;
    height: 190px;
    width: calc(50% - 10px);
  }
`;

const NewYorkLink = styled(FlexLink)`
  ${media.minSmall} {
    margin-bottom: 0;
    order: 2;
  }
`;

const SFLink = styled(Link)`
  margin-bottom: 10px;
  ${media.minSmall} {
    margin-bottom: 20px;
  }
`;

const CenterContainer = styled(Column)`
  flex-direction: column;
  order: 3;
  margin: 0;
  ${media.minSmall} {
    margin: auto 0 auto 20px;
    width: calc(50% - 10px);
  }
  ${media.minMedium} {
    order: 1;
    width: auto;
    margin: 0 20px;
    flex: 1;
  }
`;

const Sydney = styled(Row)`
  background-image: url(${sydneyImg});
  flex: 1;
  margin-bottom: 10px;
  ${media.minSmall} {
    height: 190px;
    margin-bottom: 20px;
  }
  ${media.minMedium} {
    height: 400px;
    margin: 0;
    width: auto;
    flex: 1;
  }
`;

const NewYork = styled(Row)`
  background-image: url(${newYorkImg});
  margin-bottom: 10px;
  ${media.minSmall} {
    height: 190px;
    margin-bottom: 0;
  }
  ${media.minMedium} {
    height: 400px;
    width: auto;
    flex: 1;
  }
`;

const SanFrancisco = styled(Row)`
  background-image: url(${sanFranciscoImg});
  height: 190px;
`;

const London = styled(Row)`
  background-image: url(${londonImg});
  height: 190px;
`;

const InnerText = styled(H1)`
  margin: auto auto 18px 26px !important;
  color: white;
`;

const sydneyParams =
  'type=trip&address=Sydney%20NSW%2C%20Australia&city=Sydney&state=New%20South%20Wales&countryCode=AU&page=1&limit=10';
const newYorkParams =
  'type=trip&address=New%20York%2C%20NY%2C%20USA&city=New%20York&state=New%20York&countryCode=US&page=1&limit=10';
const londonParams =
  'type=trip&address=London%2C%20UK&city=London&state=England&countryCode=GB&page=1&limit=10';
const sanFranciscoParams =
  'type=trip&address=San%20Francisco%2C%20CA%2C%20USA&city=San%20Francisco&state=California&countryCode=US&page=1&limit=10';

export default function HomeSectionTopDestinations() {
  return (
    <PageWrapper>
      <SectionWrap>
        <SectionHeader>
          <H2>Top Destinations</H2>
        </SectionHeader>
        <SectionContent>
          <FlexLink to={`/results?${sydneyParams}`}>
            <Sydney>
              <InnerText>Sydney</InnerText>
            </Sydney>
          </FlexLink>
          <NewYorkLink to={`/results?${newYorkParams}`}>
            <NewYork>
              <InnerText>New York</InnerText>
            </NewYork>
          </NewYorkLink>
          <CenterContainer>
            <SFLink to={`/results?${sanFranciscoParams}`}>
              <SanFrancisco>
                <InnerText>San Francisco</InnerText>
              </SanFrancisco>
            </SFLink>
            <Link to={`/results?${londonParams}`}>
              <London>
                <InnerText>London</InnerText>
              </London>
            </Link>
          </CenterContainer>
        </SectionContent>
      </SectionWrap>
    </PageWrapper>
  );
}
