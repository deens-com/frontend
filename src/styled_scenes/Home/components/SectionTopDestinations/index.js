// NPM
import React from 'react';
import styled from 'styled-components';

import { media } from 'libs/styled';
import { H1, H2 } from 'libs/commonStyles';

// ACTIONS/CONFIG

// STYLES
import { PageWrapper, SectionWrap, SectionHeader } from '../../../../shared_components/layout/Page';

const SectionContent = styled.div`
  display: grid;
  grid-gap: 10px;

  ${media.minSmall} {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
  }

  ${media.minMedium} {
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-gap: 20px;
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

const FlexLink = styled.div`
  position: relative;
  cursor: pointer;
`;

const SydneyLink = styled(FlexLink)`
  ${media.minSmall} {
    grid-column: 1;
    grid-row: 1;
  }
  ${media.minMedium} {
    grid-row: 1 / 3;
  }
`;

const NewYorkLink = styled(FlexLink)`
  ${media.minSmall} {
    grid-column: 1;
    grid-row: 2;
  }
  ${media.minMedium} {
    grid-column: 3;
    grid-row: 1 / 3;
  }
`;

const LondonLink = styled.div`
  cursor: pointer;
  ${media.minSmall} {
    grid-column: 2;
    grid-row: 2;
  }
`;

const SFLink = styled.div`
  cursor: pointer;
  ${media.minSmall} {
    grid-column: 2;
    grid-row: 1;
  }
`;

const Sydney = styled(Row)`
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
  height: 190px;
`;

const London = styled(Row)`
  height: 190px;
`;

const InnerText = styled(H1)`
  margin: auto auto 18px 26px !important;
  color: white;
`;

const sydneyParams = {
  type: 'trip',
  address: 'Sydney, Australia',
  city: 'Sydney',
  state: 'New South Wales',
  countryCode: 'AU',
};

const newYorkParams = {
  type: 'trip',
  address: 'New York, NY, USA',
  city: 'New York',
  state: 'New York',
  countryCode: 'US',
};

const londonParams = {
  type: 'trip',
  address: 'London, UK',
  city: 'London',
  state: 'England',
  countryCode: 'GB',
};

const sanFranciscoParams = {
  type: 'trip',
  address: 'San Francisco, CA, USA',
  city: 'San Francisco',
  state: 'California',
  countryCode: 'US',
};

export default function HomeSectionTopDestinations({ updateSearchParams }) {
  return (
    <PageWrapper>
      <SectionWrap>
        <SectionHeader>
          <H2>Top Destinations</H2>
        </SectionHeader>
        <SectionContent>
          <SydneyLink
            onClick={() => {
              updateSearchParams(sydneyParams);
            }}
          >
            <Sydney
              className="lazyload"
              data-bg="https://please-com.imgix.net/big-sydney.jpg?auto=compress"
            >
              <InnerText>Sydney</InnerText>
            </Sydney>
          </SydneyLink>
          <NewYorkLink
            onClick={() => {
              updateSearchParams(newYorkParams);
            }}
          >
            <NewYork
              className="lazyload"
              data-bg="https://please-com.imgix.net/big-new-york.jpg?auto=compress"
            >
              <InnerText>New York</InnerText>
            </NewYork>
          </NewYorkLink>
          <SFLink
            onClick={() => {
              updateSearchParams(sanFranciscoParams);
            }}
          >
            <SanFrancisco
              className="lazyload"
              data-bg="https://please-com.imgix.net/small-san-francisco.jpg?auto=compress"
            >
              <InnerText>San Francisco</InnerText>
            </SanFrancisco>
          </SFLink>
          <LondonLink
            onClick={() => {
              updateSearchParams(londonParams);
            }}
          >
            <London
              className="lazyload"
              data-bg="https://please-com.imgix.net/small-london.jpg?auto=compress"
            >
              <InnerText>London</InnerText>
            </London>
          </LondonLink>
        </SectionContent>
      </SectionWrap>
    </PageWrapper>
  );
}
